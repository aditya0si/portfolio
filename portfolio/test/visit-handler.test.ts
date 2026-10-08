import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Test-local module resolution hook (same technique as featured-projects.test.ts,
// contributions.test.ts and visits.test.ts). The application imports extensionless
// specifiers, but Node's ESM resolver needs an extension. This hook retries a
// failed relative resolution with the supported extensions so the REAL
// `lib/visit-handler.ts` module is loaded (and natively type-stripped) rather
// than a re-implementation or a regex over the source.
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

// Independent literals: the tests assert the behaviour of the real handler
// against these exact values so a copy-paste drift in the module is caught.
const CONFIG = { url: "https://visits.example.upstash.io", token: "tok_secret_123" };
const ORIGIN = "https://portfolio.example";
const VISITS_URL = `${ORIGIN}/api/visits`;
const EXISTING_UUID = "3f1c9a2e-7b4d-4e6a-9c0f-2d8b5a1e6f42";
const EXISTING_UUID_UPPER = "3F1C9A2E-7B4D-4E6A-9C0F-2D8B5A1E6F42";
const NEW_UUID = "00000000-1111-2222-3333-444444444444";

type StoreConfig = { url: string; token: string };
type RegisterCall = { config: StoreConfig; visitorId: string };

function postRequest(url = VISITS_URL, headers: Record<string, string> = {}): Request {
  return new Request(url, { method: "POST", headers });
}

// The forbidden contract is exact: a no-store 403 whose JSON body is only
// `{ error: "Forbidden" }` with no cookie and no diagnostic/debug fields.
async function assertForbidden(response: Response) {
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("set-cookie"), null);
  const body = (await response.json()) as Record<string, unknown>;
  assert.deepEqual(body, { error: "Forbidden" });
  assert.deepEqual(Object.keys(body), ["error"], "no debug/extra fields are permitted");
}

function makeHandler(overrides: {
  getConfig?: () => { url?: string; token?: string };
  read?: (config: StoreConfig) => number | Promise<number>;
  register?: (config: StoreConfig, visitorId: string) => number | Promise<number>;
  newUUID?: () => string;
} = {}) {
  const calls = {
    getConfig: 0,
    read: [] as StoreConfig[],
    register: [] as RegisterCall[],
    newUUID: 0,
  };

  const getConfig = overrides.getConfig ?? (() => ({ ...CONFIG }));
  const read = overrides.read ?? (() => 1);
  const register = overrides.register ?? (() => 1);
  const newUUID = overrides.newUUID ?? (() => NEW_UUID);

  const handler = createVisitHandler({
    getConfig: () => {
      calls.getConfig += 1;
      return getConfig();
    },
    read: async (config: StoreConfig) => {
      calls.read.push(config);
      return read(config);
    },
    register: async (config: StoreConfig, visitorId: string) => {
      calls.register.push({ config, visitorId });
      return register(config, visitorId);
    },
    newUUID: () => {
      calls.newUUID += 1;
      return newUUID();
    },
  });

  return { handler, calls };
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
console.log("RUNNING VISIT HANDLER TESTS");
console.log("------------------------------------------------------------");

const { createVisitHandler, VISIT_COOKIE_NAME } = await import("../lib/visit-handler");

// --- GET: read-only --------------------------------------------------------

await test("GET reads the store once and returns the count with no cookie", async () => {
  const { handler, calls } = makeHandler({ read: () => 5 });
  const response = await handler.GET();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("content-type")?.includes("application/json"), true);
  assert.equal(response.headers.get("set-cookie"), null);
  assert.deepEqual(await response.json(), { count: 5 });

  assert.deepEqual(calls.read, [CONFIG]);
  assert.equal(calls.register.length, 0, "GET must never register");
  assert.equal(calls.newUUID, 0, "GET must never mint a visitor id");
});

await test("GET does not require an Origin and returns 0 for an empty store", async () => {
  const { handler } = makeHandler({ read: () => 0 });
  const response = await handler.GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { count: 0 });
});

await test("GET returns a safe no-store 503 when the store fails, never leaking the token", async () => {
  const { handler } = makeHandler({
    read: () => {
      throw new Error(`upstream said ${CONFIG.token}`);
    },
  });
  const response = await handler.GET();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("set-cookie"), null);
  assert.deepEqual(await response.json(), { error: "Visits unavailable" });
});

// --- POST: same-origin gate before any service -----------------------------

for (const [label, headers] of [
  ["missing", {}],
  ["foreign", { Origin: "https://evil.example" }],
  ["null", { Origin: "null" }],
  ["scheme mismatch", { Origin: "http://portfolio.example" }],
  ["host suffix", { Origin: "https://portfolio.example.evil" }],
  ["forwarded-only", { "X-Forwarded-Host": "portfolio.example", "X-Forwarded-Proto": "https" }],
] as const) {
  await test(`POST with a ${label} Origin is forbidden before config, store or UUID`, async () => {
    const { handler, calls } = makeHandler();
    const response = await handler.POST(postRequest(VISITS_URL, { ...headers }));

    await assertForbidden(response);

    assert.equal(calls.getConfig, 0, "config must not be read for a forbidden origin");
    assert.equal(calls.read.length, 0);
    assert.equal(calls.register.length, 0);
    assert.equal(calls.newUUID, 0, "no visitor id may be minted for a forbidden origin");
  });
}

// --- POST: cookie reuse / replacement --------------------------------------

await test("POST with the request's own Origin registers a new visitor and sets the cookie", async () => {
  const { handler, calls } = makeHandler({ register: () => 3 });
  const response = await handler.POST(postRequest(VISITS_URL, { Origin: ORIGIN }));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { count: 3 });
  assert.equal(calls.read.length, 0);
  assert.deepEqual(calls.register, [{ config: CONFIG, visitorId: NEW_UUID }]);

  const cookie = response.headers.get("set-cookie");
  assert.ok(cookie, "a cookie must be set after a successful register");
  assert.ok(cookie!.includes(`${VISIT_COOKIE_NAME}=${NEW_UUID}`));
  assert.ok(cookie!.includes("HttpOnly"));
  assert.ok(cookie!.includes("SameSite=Lax"));
  assert.ok(cookie!.includes("Path=/"));
  assert.ok(cookie!.includes("Max-Age=31536000"));
});

await test("POST reuses an RFC UUID cookie exactly, without normalization", async () => {
  const { handler, calls } = makeHandler({ register: () => 9 });
  const response = await handler.POST(
    postRequest(VISITS_URL, { Origin: ORIGIN, Cookie: `${VISIT_COOKIE_NAME}=${EXISTING_UUID}` })
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls.register, [{ config: CONFIG, visitorId: EXISTING_UUID }]);
  assert.equal(calls.newUUID, 0, "an existing valid cookie must not be replaced");
  assert.ok(response.headers.get("set-cookie")!.includes(`${VISIT_COOKIE_NAME}=${EXISTING_UUID}`));
});

await test("POST accepts a case-insensitive UUID shape and preserves its casing", async () => {
  const { handler, calls } = makeHandler();
  await handler.POST(
    postRequest(VISITS_URL, {
      Origin: ORIGIN,
      Cookie: `${VISIT_COOKIE_NAME}=${EXISTING_UUID_UPPER}`,
    })
  );
  assert.equal(calls.register[0].visitorId, EXISTING_UUID_UPPER);
  assert.equal(calls.newUUID, 0);
});

for (const [label, cookieValue] of [
  ["malformed", "not-a-uuid"],
  ["too short", "3f1c9a2e-7b4d-4e6a-9c0f-2d8b5a1e6f4"],
  ["non-hex", "3f1c9a2e-7b4d-4e6a-9c0f-2d8b5a1e6f4z"],
  ["percent-encoded garbage", "%"],
  ["empty", ""],
] as const) {
  await test(`POST replaces a ${label} cookie with a fresh UUID after registering`, async () => {
    const { handler, calls } = makeHandler();
    const response = await handler.POST(
      postRequest(VISITS_URL, { Origin: ORIGIN, Cookie: `${VISIT_COOKIE_NAME}=${cookieValue}` })
    );
    assert.equal(response.status, 200);
    assert.equal(calls.newUUID, 1);
    assert.equal(calls.register[0].visitorId, NEW_UUID);
    assert.ok(response.headers.get("set-cookie")!.includes(`${VISIT_COOKIE_NAME}=${NEW_UUID}`));
  });
}

await test("POST ignores other cookies and only reads portfolio_visit", async () => {
  const { handler, calls } = makeHandler();
  await handler.POST(
    postRequest(VISITS_URL, {
      Origin: ORIGIN,
      Cookie: `other=${EXISTING_UUID}; ${VISIT_COOKIE_NAME}=${EXISTING_UUID}`,
    })
  );
  assert.equal(calls.register[0].visitorId, EXISTING_UUID);
  assert.equal(calls.newUUID, 0);
});

// --- POST: cookie security attributes --------------------------------------

await test("POST sets Secure only when the request URL is HTTPS", async () => {
  const secure = makeHandler();
  const httpsResponse = await secure.handler.POST(
    new Request("https://portfolio.example/api/visits", {
      method: "POST",
      headers: { Origin: "https://portfolio.example" },
    })
  );
  const httpsCookie = httpsResponse.headers.get("set-cookie");
  assert.ok(httpsCookie!.includes("Secure"), "HTTPS must set Secure");
  assert.ok(httpsCookie!.includes("HttpOnly"));
  assert.ok(httpsCookie!.includes("SameSite=Lax"));
  assert.ok(httpsCookie!.includes("Path=/"));
  assert.ok(httpsCookie!.includes("Max-Age=31536000"));

  const insecure = makeHandler();
  const httpResponse = await insecure.handler.POST(
    new Request("http://portfolio.example/api/visits", {
      method: "POST",
      headers: { Origin: "http://portfolio.example" },
    })
  );
  const httpCookie = httpResponse.headers.get("set-cookie");
  assert.ok(!httpCookie!.includes("Secure"), "HTTP must not set Secure");
});

// --- POST: failure handling (no cookie, no count) --------------------------

await test("POST returns a safe no-store 503 and no cookie when the store fails", async () => {
  const { handler } = makeHandler({
    register: () => {
      throw new Error(`boom ${CONFIG.token}`);
    },
  });
  const response = await handler.POST(postRequest(VISITS_URL, { Origin: ORIGIN }));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("set-cookie"), null);
  const raw = JSON.stringify(await response.json());
  assert.equal(raw, JSON.stringify({ error: "Visits unavailable" }));
  assert.ok(!raw.includes(CONFIG.token), "the token must never be exposed");
  assert.ok(!raw.includes("boom"), "the upstream error must never be exposed");
});

// --- Config: missing/blank yields 503 before any store or UUID -------------

await test("missing or blank config yields a safe 503 with no store call and no UUID", async () => {
  const configs: Array<{ url?: string; token?: string }> = [
    {},
    { url: "", token: CONFIG.token },
    { url: CONFIG.url, token: "" },
    { url: "   ", token: "   " },
  ];

  for (const config of configs) {
    const { handler, calls } = makeHandler({ getConfig: () => config });

    const getResponse = await handler.GET();
    assert.equal(getResponse.status, 503);
    assert.deepEqual(await getResponse.json(), { error: "Visits unavailable" });

    const postResponse = await handler.POST(postRequest(VISITS_URL, { Origin: ORIGIN }));
    assert.equal(postResponse.status, 503);
    assert.equal(postResponse.headers.get("set-cookie"), null);

    assert.equal(calls.read.length, 0);
    assert.equal(calls.register.length, 0);
    assert.equal(calls.newUUID, 0);
  }
});

await test("a throwing config loader yields a safe 503", async () => {
  const { handler } = makeHandler({
    getConfig: () => {
      throw new Error("no env");
    },
  });
  assert.equal((await handler.GET()).status, 503);
  assert.equal((await handler.POST(postRequest(VISITS_URL, { Origin: ORIGIN }))).status, 503);
});

// --- Safe count validation -------------------------------------------------

for (const [label, value] of [
  ["negative", -1],
  ["fraction", 1.5],
  ["NaN", Number.NaN],
  ["Infinity", Number.POSITIVE_INFINITY],
  ["unsafe", Number.MAX_SAFE_INTEGER + 1],
  ["numeric string", "5"],
  ["null", null],
  ["undefined", undefined],
  ["boolean", true],
] as const) {
  await test(`GET turns a ${label} store count into a safe 503, never the bad value`, async () => {
    const { handler } = makeHandler({ read: () => value as number });
    const response = await handler.GET();
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "Visits unavailable" });
  });
}

await test("POST turns an unsafe register count into a safe 503 with no cookie", async () => {
  const { handler } = makeHandler({ register: () => -7 });
  const response = await handler.POST(postRequest(VISITS_URL, { Origin: ORIGIN }));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("set-cookie"), null);
  assert.deepEqual(await response.json(), { error: "Visits unavailable" });
});

// --- No caller control over keys/counts ------------------------------------

await test("POST ignores caller-supplied count/key query or body data", async () => {
  const { handler, calls } = makeHandler({ register: () => 2 });
  const response = await handler.POST(
    new Request(`${VISITS_URL}?count=999&key=evil`, {
      method: "POST",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({ count: 999, key: "evil" }),
    })
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { count: 2 });
  assert.equal(calls.register.length, 1);
  assert.equal(calls.register[0].visitorId, NEW_UUID);
});

console.log("------------------------------------------------------------");
console.log(`Visit handler: ${passed} passed, ${failed} failed.`);
console.log("------------------------------------------------------------");

if (failed > 0) {
  process.exitCode = 1;
}
