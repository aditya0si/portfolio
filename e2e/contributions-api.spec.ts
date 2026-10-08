import { expect, test } from "@playwright/test";

// Safe-contract test for the contributions API route.
//
// The e2e server is bootstrapped by playwright.config.ts with the child
// environment variable GITHUB_TOKEN explicitly empty (set on the runner
// command). This proves the route fails closed: it must never fall back to a
// host credential, never reach the upstream provider, and never leak a secret,
// upstream error, header or stack in its body.
test("GET /api/contributions without a token fails closed with a safe no-store 503", async ({ request }) => {
  const response = await request.get("/api/contributions");

  expect(response.status()).toBe(503);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(response.headers()["content-type"]).toContain("application/json");

  const raw = await response.text();
  expect(JSON.parse(raw)).toEqual({ error: "Contributions unavailable" });

  // No secret, stack trace or upstream diagnostic is ever serialized.
  expect(raw).not.toContain("ghp_");
  expect(raw).not.toContain("Bearer");
  expect(raw.toLowerCase()).not.toContain("token");
  expect(raw.toLowerCase()).not.toContain("stack");
});
