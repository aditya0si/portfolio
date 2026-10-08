// Atomic persistent visits counter backed by a Redis-compatible REST store.
//
// A visit is counted at most once per browser per 24h window: registration
// hashes the visitor's opaque cookie id and records a short-lived "seen" key
// before incrementing the running total. The read path only ever GETs the
// total and never mutates it. Both paths issue a single JSON REST command to
// the configured endpoint using native fetch with bearer auth, JSON content
// type, a 5s abort timeout, and `cache: "no-store"`.
//
// Nothing here is a people-analytics identity: only a sha256 of the id is
// persisted, the raw id is never sent or logged, and the token is never placed
// in error messages. This module is intended for a server-only future route;
// it holds no in-memory fallback counter, so a provider failure is surfaced
// rather than silently guessed.
//
// `config` carries the REST endpoint and bearer token. It is validated up
// front (non-blank, HTTPS except localhost) so a missing or malformed config
// fails before any network call.

import { createHash } from "node:crypto";

export const VISITS_TOTAL_KEY = "portfolio:visits:v1:total";
export const VISITS_SEEN_PREFIX = "portfolio:visits:v1:seen:";
export const VISITS_SEEN_TTL_SECONDS = 86400;
export const VISITS_TIMEOUT_MS = 5000;

// Exact atomic registration script. KEYS[1] is the per-visitor seen key and
// KEYS[2] is the total. The first registration sets the seen key with a 24h
// expiry and increments the total; every later one within the window returns
// the current total without incrementing.
export const REGISTER_VISIT_SCRIPT = [
  "local added = redis.call('SET', KEYS[1], '1', 'NX', 'EX', 86400)",
  "if added then return redis.call('INCR', KEYS[2]) end",
  "return tonumber(redis.call('GET', KEYS[2]) or '0')",
].join("\n");

export interface VisitsConfig {
  url: string;
  token: string;
}

export type VisitsFetcher = (input: string, init: RequestInit) => Promise<Response>;

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLocalhost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

// Validate the config before anything touches the network. The token is only
// checked for presence and is never echoed back in a thrown message.
function resolveConfig(config: VisitsConfig): { url: string; token: string } {
  if (!isRecord(config)) {
    fail("A visits store config is required");
  }
  const { url, token } = config;
  if (typeof url !== "string" || url.trim().length === 0) {
    fail("A non-blank visits store URL is required");
  }
  if (typeof token !== "string" || token.trim().length === 0) {
    fail("A non-blank visits store token is required");
  }

  const trimmedUrl = url.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmedUrl);
  } catch {
    fail("The visits store URL must be a valid absolute URL");
  }

  // Production must be HTTPS. Plain HTTP is tolerated only for localhost so
  // tests can point an injected fetcher at a local server without contacting a
  // real provider.
  const allowedHttp = parsed.protocol === "http:" && isLocalhost(parsed.hostname);
  if (parsed.protocol !== "https:" && !allowedHttp) {
    fail("The visits store URL must use HTTPS");
  }

  return { url: trimmedUrl, token };
}

// Accept either an integer number or a canonical decimal string. Booleans,
// fractions, exponents, signed values, whitespace, leading zeros, non-numeric
// strings and unsafe magnitudes are all rejected as noncanonical.
function toNonNegativeSafeInteger(value: unknown): number {
  if (typeof value === "number") {
    if (Number.isSafeInteger(value) && value >= 0) {
      return value;
    }
    fail("Visits store returned an invalid count");
  }
  if (typeof value === "string") {
    if (!/^(0|[1-9][0-9]*)$/.test(value)) {
      fail("Visits store returned an invalid count");
    }
    const parsed = Number(value);
    if (Number.isSafeInteger(parsed) && parsed >= 0) {
      return parsed;
    }
    fail("Visits store returned an invalid count");
  }
  return fail("Visits store returned an invalid count");
}

// `allowNull` distinguishes the read path (a missing total legitimately means
// zero visits) from the register path (a missing increment result is a fault).
function parseResult(payload: unknown, allowNull: boolean): number {
  if (!isRecord(payload)) {
    fail("Visits store response was not an object");
  }
  if ("error" in payload) {
    fail("Visits store returned an error");
  }
  if (!("result" in payload)) {
    fail("Visits store response is missing a result");
  }
  const { result } = payload;
  if (result === null) {
    if (allowNull) {
      return 0;
    }
    fail("Visits store did not return a count");
  }
  return toNonNegativeSafeInteger(result);
}

async function sendCommand(
  config: VisitsConfig,
  command: unknown[],
  fetcher: VisitsFetcher
): Promise<unknown> {
  const { url, token } = resolveConfig(config);

  const response = await fetcher(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(VISITS_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    fail(`Visits store request failed with status ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    return fail("Visits store returned malformed JSON");
  }
}

function hashVisitorId(visitorId: string): string {
  return createHash("sha256").update(visitorId, "utf8").digest("hex");
}

// Read the persisted total. A null total means no visits yet and resolves to 0;
// the total is never incremented here.
export async function readVisits(
  config: VisitsConfig,
  fetcher: VisitsFetcher = fetch
): Promise<number> {
  const payload = await sendCommand(config, ["GET", VISITS_TOTAL_KEY], fetcher);
  return parseResult(payload, true);
}

// Register a visit for one visitor. The id is hashed (raw id never sent) and
// used as the short-lived seen key; the atomic script returns the total after
// counting the visitor at most once per 24h window.
export async function registerVisit(
  config: VisitsConfig,
  visitorId: string,
  fetcher: VisitsFetcher = fetch
): Promise<number> {
  if (typeof visitorId !== "string" || visitorId.trim().length === 0) {
    fail("A non-blank visitor id is required");
  }

  const seenKey = `${VISITS_SEEN_PREFIX}${hashVisitorId(visitorId)}`;
  const payload = await sendCommand(
    config,
    ["EVAL", REGISTER_VISIT_SCRIPT, "2", seenKey, VISITS_TOTAL_KEY],
    fetcher
  );
  return parseResult(payload, false);
}
