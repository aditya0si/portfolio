// Pure, injectable GET/POST handler for the visits API.
//
// This module deliberately has no dependency on the Next.js runtime: it only
// uses the platform-native `Request`/`Response`, so the exact same logic can be
// unit-tested under plain Node with an injected store, UUID source and config
// loader. The thin `app/api/visits/route.ts` wrapper supplies the real
// `readVisits`/`registerVisit` store, `crypto.randomUUID` and the server-only
// environment config.
//
// Contract:
//   GET   -> read-only count; no cookie, no writes.
//   POST  -> the request's Origin must EXACTLY equal the request URL's origin
//            (checked before config, store or UUID); on success registers the
//            visitor, sets the portfolio_visit cookie and returns { count }.
//
// There is no caller control over keys or counts, no in-memory counter, and no
// forwarded-origin trust. Missing config, a failing store or a store that
// returns an unsafe count all surface as a safe no-store 503 whose body only
// ever contains a fixed message (never a token, stack, provider error or a
// fabricated 0).

export const VISIT_COOKIE_NAME = "portfolio_visit";
export const VISIT_COOKIE_MAX_AGE_SECONDS = 31536000;

// RFC 4122 UUID shape, case-insensitive hex 8-4-4-4-12. Values are matched
// as-is and never normalized (the exact cookie string is reused).
const UUID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const UNAVAILABLE = { error: "Visits unavailable" } as const;
const FORBIDDEN = { error: "Forbidden" } as const;
const NO_STORE = { "Cache-Control": "no-store" } as const;

export interface VisitsStoreConfig {
  url: string;
  token: string;
}

export interface VisitHandlerConfig {
  url?: string;
  token?: string;
}

export interface VisitHandlerDeps {
  // Read the server-only store config. Called once per request; may throw or
  // return blanks when unprovisioned.
  getConfig(): VisitHandlerConfig;
  // Read the persisted total. Must not mutate.
  read(config: VisitsStoreConfig): Promise<number>;
  // Register one visit for the given visitor id and return the new total.
  register(config: VisitsStoreConfig, visitorId: string): Promise<number>;
  // Mint a fresh opaque visitor id.
  newUUID(): string;
}

export interface VisitHandler {
  GET(): Promise<Response>;
  POST(request: Request): Promise<Response>;
}

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

function isSafeCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function unavailable(): Response {
  return Response.json(UNAVAILABLE, { status: 503, headers: NO_STORE });
}

function forbidden(): Response {
  return Response.json(FORBIDDEN, { status: 403, headers: NO_STORE });
}

// Decode a cookie value, treating a malformed percent-encoding as invalid
// rather than throwing.
function decodeCookieValue(raw: string): string | null {
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

function readVisitCookie(header: string | null): string | null {
  if (typeof header !== "string" || header.length === 0) {
    return null;
  }
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const name = part.slice(0, separator).trim();
    if (name !== VISIT_COOKIE_NAME) {
      continue;
    }
    return decodeCookieValue(part.slice(separator + 1).trim());
  }
  return null;
}

function buildSetCookie(value: string, secure: boolean): string {
  let cookie =
    `${VISIT_COOKIE_NAME}=${value}` +
    "; Path=/" +
    `; Max-Age=${VISIT_COOKIE_MAX_AGE_SECONDS}` +
    "; HttpOnly" +
    "; SameSite=Lax";
  if (secure) {
    cookie += "; Secure";
  }
  return cookie;
}

export function createVisitHandler(deps: VisitHandlerDeps): VisitHandler {
  function resolveConfig(): VisitsStoreConfig | null {
    let config: VisitHandlerConfig;
    try {
      config = deps.getConfig();
    } catch {
      return null;
    }
    if (
      !config ||
      isBlank(config.url) ||
      isBlank(config.token)
    ) {
      return null;
    }
    return { url: config.url as string, token: config.token as string };
  }

  async function GET(): Promise<Response> {
    const config = resolveConfig();
    if (config === null) {
      return unavailable();
    }

    let count: unknown;
    try {
      count = await deps.read(config);
    } catch {
      return unavailable();
    }
    if (!isSafeCount(count)) {
      return unavailable();
    }
    return Response.json({ count }, { status: 200, headers: NO_STORE });
  }

  async function POST(request: Request): Promise<Response> {
    // 1. Same-origin gate FIRST, before config, store or UUID. The expected
    //    origin comes from the request URL only; forwarded headers are never
    //    trusted.
    let requestOrigin: string;
    let secure: boolean;
    try {
      const url = new URL(request.url);
      requestOrigin = url.origin;
      secure = url.protocol === "https:";
    } catch {
      return forbidden();
    }

    const origin = request.headers.get("origin");
    if (origin === null || origin !== requestOrigin) {
      return forbidden();
    }

    // 2. Config.
    const config = resolveConfig();
    if (config === null) {
      return unavailable();
    }

    // 3. Reuse only an RFC UUID-shaped cookie; anything else is replaced.
    const existing = readVisitCookie(request.headers.get("cookie"));
    const visitorId =
      existing !== null && UUID_PATTERN.test(existing) ? existing : deps.newUUID();

    // 4. Register, then set the cookie ONLY on success.
    let count: unknown;
    try {
      count = await deps.register(config, visitorId);
    } catch {
      return unavailable();
    }
    if (!isSafeCount(count)) {
      return unavailable();
    }

    const headers = new Headers(NO_STORE);
    headers.append("Set-Cookie", buildSetCookie(visitorId, secure));
    return Response.json({ count }, { status: 200, headers });
  }

  return { GET, POST };
}
