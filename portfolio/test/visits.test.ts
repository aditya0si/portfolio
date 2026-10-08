import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";

// Test-local module resolution hook (same technique as featured-projects.test.ts
// and contributions.test.ts). The application must import extensionless
// specifiers, but Node's ESM resolver needs an extension. This hook retries a
// failed relative resolution with the supported extensions so the REAL
// `lib/visits.ts` module is loaded (and natively type-stripped) rather than a
// re-implementation or a regex over the source.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        for (const ext of [".ts", ".tsx", ".js", "/index.ts"]) {
          try {
            return nextResolve(specifier + ext, context);
          } catch {
            // Not resolvable with this extension; try the next candidate.
          }
        }
      }
      throw error;
    }
  },
});

// Independent literals: the test asserts the request the implementation builds
// against these exact values, so a copy-paste drift in the module is caught.
const TOTAL_KEY = "portfolio:visits:v1:total";
const SEEN_PREFIX = "portfolio:visits:v1:seen:";
const TTL_SECONDS = "86400";
const SCRIPT = [
  "local added = redis.call('SET', KEYS[1], '1', 'NX', 'EX', 86400)",
  "if added then return redis.call('INCR', KEYS[2]) end",
  "return tonumber(redis.call('GET', KEYS[2]) or '0')",
].join("\n");

const CONFIG = { url: "https://visits.example.upstash.io", token: "tok_secret_123" };
const LOCAL_CONFIG = { url: "http://localhost:8080", token: "tok_secret_123" };
const VISITOR = "3f1c9a2e-7b4d-4e6a-9c0f-2d8b5a1e6f42";
const OTHER_VISITOR = "9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d";

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

type Call = { url: string; init: RequestInit };

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function fixedFetcher(payload: unknown, status = 200) {
  const calls: Call[] = [];
  const fetcher = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return jsonResponse(payload, status);
  };
  return { fetcher, calls };
}

// Stateful in-test mock of the Redis REST semantics: one SET NX + INCR for a
// new seen key, and a GET of the total. This models atomicity for the test
// only; it is not proof the production script is atomic.
function statefulRedis(options: { total?: number | null } = {}) {
  let total = options.total ?? null;
  const seen = new Set<string>();
  const calls: Call[] = [];

  const fetcher = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const command = JSON.parse(init.body as string) as unknown[];
    const op = command[0];

    if (op === "EVAL") {
      const seenKey = command[3] as string;
      if (seen.has(seenKey)) {
        return jsonResponse({ result: total === null ? "0" : String(total) });
      }
      seen.add(seenKey);
      total = (total ?? 0) + 1;
      return jsonResponse({ result: total });
    }

    if (op === "GET") {
      return jsonResponse({ result: total === null ? null : String(total) });
    }

    return jsonResponse({ error: "unsupported command" });
  };

  return { fetcher, calls, seen, total: () => total };
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed += 1;
    console.log(`  ok ${passed + failed} ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  x  ${passed + failed} ${name}`);
    console.error(error);
  }
}

console.log("------------------------------------------------------------");
console.log("RUNNING VISITS STORE TESTS");
console.log("------------------------------------------------------------");

const { readVisits, registerVisit } = await import("../lib/visits");

// --- Register: stateful counting behaviour ---------------------------------

await test("first visit for a visitor increments the total to 1", async () => {
  const { fetcher, total } = statefulRedis();
  const result = await registerVisit(CONFIG, VISITOR, fetcher as never);
  assert.equal(result, 1);
  assert.equal(total(), 1);
});

await test("repeat visit within the same window does not increment", async () => {
  const { fetcher, total } = statefulRedis();
  assert.equal(await registerVisit(CONFIG, VISITOR, fetcher as never), 1);
  assert.equal(await registerVisit(CONFIG, VISITOR, fetcher as never), 1);
  assert.equal(total(), 1);
});

await test("a different visitor increments the total to 2", async () => {
  const { fetcher, total } = statefulRedis();
  assert.equal(await registerVisit(CONFIG, VISITOR, fetcher as never), 1);
  assert.equal(await registerVisit(CONFIG, OTHER_VISITOR, fetcher as never), 2);
  assert.equal(total(), 2);
});

await test("concurrent registrations of the same visitor all return 1", async () => {
  const { fetcher, total } = statefulRedis();
  const results = await Promise.all(
    Array.from({ length: 5 }, () => registerVisit(CONFIG, VISITOR, fetcher as never))
  );
  assert.deepEqual(results, [1, 1, 1, 1, 1]);
  assert.equal(total(), 1);
});

// --- Register request shape ------------------------------------------------

await test("register sends exactly one EVAL command with atomic script and keys", async () => {
  const { fetcher, calls } = statefulRedis();
  await registerVisit(CONFIG, VISITOR, fetcher as never);

  assert.equal(calls.length, 1, "register must issue exactly one REST command");
  const { url, init } = calls[0];
  assert.equal(url, CONFIG.url);
  assert.equal(init.method, "POST");
  assert.equal(init.cache, "no-store");

  const headers = init.headers as Record<string, string>;
  assert.equal(headers.Authorization, `Bearer ${CONFIG.token}`);
  assert.equal(headers["Content-Type"], "application/json");
  assert.ok(init.signal instanceof AbortSignal, "a timeout AbortSignal must be attached");

  const body = JSON.parse(init.body as string) as unknown[];
  assert.deepEqual(body, ["EVAL", SCRIPT, "2", `${SEEN_PREFIX}${sha256(VISITOR)}`, TOTAL_KEY]);
  assert.equal(body.length, 5, "EVAL must carry the script, key count and two keys");
});

await test("register hashes the visitor id and never sends the raw id", async () => {
  const { fetcher, calls } = statefulRedis();
  await registerVisit(CONFIG, VISITOR, fetcher as never);
  const raw = calls[0].init.body as string;
  assert.ok(!raw.includes(VISITOR), "the raw visitor id must not be sent");
  assert.ok(raw.includes(sha256(VISITOR)), "the sha256 of the visitor id must be used");
});

await test("register script uses SET NX EX with a 24h expiry and INCR/GET fallback", () => {
  assert.match(SCRIPT, /SET[^\n]*'NX'[^\n]*'EX'[^\n]*86400/);
  assert.match(SCRIPT, /INCR/);
  assert.match(SCRIPT, /GET/);
  assert.match(SCRIPT, new RegExp(TTL_SECONDS));
});

// --- Read request shape ----------------------------------------------------

await test("read sends one GET of the total key and never increments", async () => {
  const { fetcher, calls } = fixedFetcher({ result: "5" });
  const result = await readVisits(CONFIG, fetcher as never);

  assert.equal(result, 5);
  assert.equal(calls.length, 1, "read must issue exactly one REST command");
  const { url, init } = calls[0];
  assert.equal(url, CONFIG.url);
  assert.equal(init.method, "POST");
  assert.equal(init.cache, "no-store");
  assert.ok(init.signal instanceof AbortSignal, "a timeout AbortSignal must be attached");

  const headers = init.headers as Record<string, string>;
  assert.equal(headers.Authorization, `Bearer ${CONFIG.token}`);
  assert.equal(headers["Content-Type"], "application/json");

  const body = JSON.parse(init.body as string) as unknown[];
  assert.deepEqual(body, ["GET", TOTAL_KEY]);
  assert.ok(!JSON.stringify(body).includes("INCR"), "read must never increment");
});

// --- Read/parse results ----------------------------------------------------

await test("read returns 0 when Redis reports a null total", async () => {
  const { fetcher } = fixedFetcher({ result: null });
  assert.equal(await readVisits(CONFIG, fetcher as never), 0);
});

await test("read accepts a decimal numeric Redis string", async () => {
  const { fetcher } = fixedFetcher({ result: "42" });
  assert.equal(await readVisits(CONFIG, fetcher as never), 42);
});

await test("read accepts a nonnegative integer number", async () => {
  const { fetcher } = fixedFetcher({ result: 7 });
  assert.equal(await readVisits(CONFIG, fetcher as never), 7);
});

await test("register rejects a null result instead of treating it as 0", async () => {
  const { fetcher } = fixedFetcher({ result: null });
  await assert.rejects(() => registerVisit(CONFIG, VISITOR, fetcher as never), /count|result/i);
});

for (const [label, value] of [
  ["boolean", true],
  ["fraction", 1.5],
  ["negative number", -1],
  ["unsafe number", Number.MAX_SAFE_INTEGER + 1],
  ["fraction string", "1.5"],
  ["exponent string", "1e3"],
  ["leading whitespace", " 7"],
  ["trailing whitespace", "7 "],
  ["signed positive", "+7"],
  ["signed negative", "-1"],
  ["negative zero", "-0"],
  ["noncanonical leading zero", "007"],
  ["oversized numeric string", "99999999999999999999"],
  ["non-numeric string", "seven"],
  ["object", { value: 1 }],
] as const) {
  await test(`read rejects a ${label} result`, async () => {
    const { fetcher } = fixedFetcher({ result: value });
    await assert.rejects(() => readVisits(CONFIG, fetcher as never), /count|result/i);
  });
}

// --- Provider / transport failures -----------------------------------------

await test("rejects a provider error object and never leaks the token", async () => {
  const { fetcher } = fixedFetcher({ error: "ERR max requests exceeded" });
  await assert.rejects(
    () => readVisits(CONFIG, fetcher as never),
    (error: Error) => {
      assert.match(error.message, /error/i);
      assert.ok(!error.message.includes(CONFIG.token), "the token must not be exposed");
      return true;
    }
  );
});

await test("rejects a response missing the result field", async () => {
  const { fetcher } = fixedFetcher({ ok: true });
  await assert.rejects(() => readVisits(CONFIG, fetcher as never), /result/i);
});

await test("rejects a non-object response", async () => {
  const { fetcher } = fixedFetcher(["nope"]);
  await assert.rejects(() => readVisits(CONFIG, fetcher as never), /result|object/i);
});

await test("rejects malformed JSON", async () => {
  const fetcher = async () =>
    new Response("{ not json", { status: 200, headers: { "Content-Type": "application/json" } });
  await assert.rejects(() => readVisits(CONFIG, fetcher as never));
});

await test("rejects a non-2xx status", async () => {
  const { fetcher } = fixedFetcher({ error: "boom" }, 502);
  await assert.rejects(() => readVisits(CONFIG, fetcher as never), /status/i);
});

await test("propagates a network failure", async () => {
  const fetcher = async () => {
    throw new TypeError("fetch failed");
  };
  await assert.rejects(() => readVisits(CONFIG, fetcher as never), /fetch failed/);
});

await test("propagates a timeout abort", async () => {
  const fetcher = async () => {
    throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
  };
  await assert.rejects(() => readVisits(CONFIG, fetcher as never), /timeout/i);
});

// --- Config validation (must reject before any fetch) ----------------------

const badConfigs: Array<[string, unknown]> = [
  ["undefined config", undefined],
  ["null config", null],
  ["blank url", { url: "", token: CONFIG.token }],
  ["whitespace url", { url: "   ", token: CONFIG.token }],
  ["blank token", { url: CONFIG.url, token: "" }],
  ["whitespace token", { url: CONFIG.url, token: "   " }],
  ["non-URL string", { url: "not a url", token: CONFIG.token }],
  ["plain http remote host", { url: "http://cache.example.com", token: CONFIG.token }],
  ["non-http protocol", { url: "ftp://cache.example.com", token: CONFIG.token }],
];

for (const [label, config] of badConfigs) {
  await test(`rejects a ${label} before fetching`, async () => {
    const calls: Call[] = [];
    const fetcher = async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return jsonResponse({ result: 1 });
    };
    await assert.rejects(() => readVisits(config as never, fetcher as never));
    await assert.rejects(() => registerVisit(config as never, VISITOR, fetcher as never));
    assert.equal(calls.length, 0, "fetch must not be called for invalid config");
  });
}

await test("allows a localhost http URL through the injected fetcher", async () => {
  const { fetcher } = statefulRedis();
  assert.equal(await registerVisit(LOCAL_CONFIG, VISITOR, fetcher as never), 1);
});

await test("rejects a blank visitor id before fetching", async () => {
  const { fetcher, calls } = statefulRedis();
  await assert.rejects(() => registerVisit(CONFIG, "   ", fetcher as never), /visitor/i);
  assert.equal(calls.length, 0);
});

console.log("------------------------------------------------------------");
console.log(`Visits: ${passed} passed, ${failed} failed.`);
console.log("------------------------------------------------------------");

if (failed > 0) {
  process.exitCode = 1;
}
