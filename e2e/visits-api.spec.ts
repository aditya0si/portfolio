import { expect, test } from "@playwright/test";

// Safe-contract tests for the visits API route.
//
// The e2e server is bootstrapped by playwright.config.ts with the child
// environment variables UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// explicitly empty (set on the runner command). This proves the route fails
// closed: it must never reach a real Upstash/Redis provider, never fall back to
// an in-memory counter or a local credential, and never leak a token, upstream
// error, header or stack in its body.
//
// No provisioned provider is required: an unprovisioned deployment is the exact
// failure mode under test.
//
// IMPORTANT canonical-origin caveat (honest framework limitation, NOT a solved
// integration): under a native Next 16 production server, `request.url` is
// canonicalized to the server's configured hostname. Even when the transport
// connects over 127.0.0.1, `request.url` is `http://localhost:3000`, so the
// exact same-origin check legitimately rejects an `http://127.0.0.1:3000`
// Origin with a 403. That is recorded explicitly below rather than papered
// over. It means these localhost tests do NOT prove a live deployment works;
// the deployment's canonical URL must be configured separately. The route must
// NOT weaken this check by trusting Host or X-Forwarded-Host.

// The origin the Next production server canonicalizes `request.url` to.
const CANONICAL_ORIGIN = "http://localhost:3000";
// A real transport address that is NOT the canonical origin.
const TRANSPORT_127_ORIGIN = "http://127.0.0.1:3000";

function assertSafeUnavailable(raw: string) {
  expect(JSON.parse(raw)).toEqual({ error: "Visits unavailable" });
  expect(raw.toLowerCase()).not.toContain("token");
  expect(raw.toLowerCase()).not.toContain("bearer");
  expect(raw.toLowerCase()).not.toContain("stack");
  expect(raw.toLowerCase()).not.toContain("upstash");
}

function assertForbidden(raw: string) {
  const parsed = JSON.parse(raw);
  expect(parsed).toEqual({ error: "Forbidden" });
  expect(Object.keys(parsed)).toEqual(["error"]);
  expect(raw.toLowerCase()).not.toContain("debug");
  expect(raw.toLowerCase()).not.toContain("token");
  expect(raw.toLowerCase()).not.toContain("stack");
}

test("GET /api/visits without config fails closed with a safe no-store 503", async ({ request }) => {
  const response = await request.get("/api/visits");

  expect(response.status()).toBe(503);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(response.headers()["set-cookie"]).toBeUndefined();

  assertSafeUnavailable(await response.text());
});

test("POST /api/visits with the canonical Origin without config is a safe no-store 503", async ({
  request,
}) => {
  // Use the actual absolute request URL whose origin matches the canonical
  // `request.url` origin the Next server reports; do not fabricate an origin.
  const response = await request.post(`${CANONICAL_ORIGIN}/api/visits`, {
    headers: { Origin: CANONICAL_ORIGIN },
  });

  expect(response.status()).toBe(503);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(response.headers()["set-cookie"]).toBeUndefined();

  assertSafeUnavailable(await response.text());
});

test("POST /api/visits over real transport 127.0.0.1 with Origin 127.0.0.1 is a safe no-store 403", async ({
  request,
}) => {
  // Documents Next's canonicalization: the 127 transport request is still
  // compared against the canonical `http://localhost:3000` origin, so the
  // exact same-origin check correctly forbids it. Assert the exact safe body.
  const response = await request.post(`${TRANSPORT_127_ORIGIN}/api/visits`, {
    headers: { Origin: TRANSPORT_127_ORIGIN },
  });

  expect(response.status()).toBe(403);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(response.headers()["set-cookie"]).toBeUndefined();

  assertForbidden(await response.text());
});

test("POST /api/visits with a foreign Origin is forbidden before any service", async ({ request }) => {
  const response = await request.post("/api/visits", {
    headers: { Origin: "https://evil.example" },
  });

  expect(response.status()).toBe(403);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(response.headers()["set-cookie"]).toBeUndefined();

  assertForbidden(await response.text());
});

test("POST /api/visits without an Origin is forbidden before any service", async ({ request }) => {
  const response = await request.post("/api/visits");

  expect(response.status()).toBe(403);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(response.headers()["set-cookie"]).toBeUndefined();

  assertForbidden(await response.text());
});
