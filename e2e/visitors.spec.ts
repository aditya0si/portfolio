import { expect, test, type Page, type Route } from "@playwright/test";

// TDD specification for the truthful visit counter in the shared footer.
//
// The counter is a client component that makes exactly ONE same-origin POST to
// /api/visits on mount, aborts after six seconds, and never retries. It renders
// the raw count returned by the server (never a fabricated/local number) and
// makes no unique-visitor, Nth-visitor or badge claims. The live GitHub
// repository fetch and the contributions endpoint are mocked in this suite so
// the real rate-limited providers are never contacted.

const GITHUB_API_GLOB = "https://api.github.com/**";
const VISITS_GLOB = "**/api/visits";
const CAPTION =
  "Repeat visits from the same browser count at most once every 24 hours.";
const REQUEST_TIMEOUT_MS = 6000;

async function mockGitHubRepositories(page: Page) {
  await page.route(GITHUB_API_GLOB, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
  );
}

async function mockContributionsUnavailable(page: Page) {
  await page.route("**/api/contributions", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Contributions unavailable" }),
    }),
  );
}

function fulfillVisits(route: Route, status: number, body: string) {
  return route.fulfill({ status, contentType: "application/json", body });
}

function validCount(route: Route, count: unknown) {
  return fulfillVisits(route, 200, JSON.stringify({ count }));
}

function visitorCounter(page: Page) {
  return page.locator("[data-visitor-counter]");
}

test.beforeEach(async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributionsUnavailable(page);
});

test("renders a 1,234 visit count from a valid 200 response with the exact caption", async ({
  page,
}) => {
  await page.route(VISITS_GLOB, (route) => validCount(route, 1234));
  await page.goto("/");

  const counter = visitorCounter(page);
  await expect(counter.getByText("1,234 visits", { exact: true })).toBeVisible();
  await expect(page.getByText(CAPTION, { exact: true })).toBeVisible();
  await expect(counter.getByText("Visits unavailable", { exact: true })).toHaveCount(0);
});

test("renders zero as a valid count rather than an unavailable state", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) => validCount(route, 0));
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("0 visits", { exact: true }),
  ).toBeVisible();
  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toHaveCount(0);
});

test("a 503 response renders Visits unavailable", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) =>
    fulfillVisits(route, 503, JSON.stringify({ error: "Visits unavailable" })),
  );
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible();
  await expect(visitorCounter(page).getByText(/visits$/)).toHaveCount(0);
});

test("a negative count is rejected as unavailable", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) => validCount(route, -1));
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible();
});

test("a fractional count is rejected as unavailable", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) => validCount(route, 12.5));
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible();
});

test("an unsafe-integer count is rejected as unavailable", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) =>
    validCount(route, Number.MAX_SAFE_INTEGER + 2),
  );
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible();
});

test("a string count is rejected as unavailable", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) => validCount(route, "1234"));
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible();
});

test("malformed JSON is rejected as unavailable", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) =>
    fulfillVisits(route, 200, "{not json"),
  );
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible();
});

test("a network failure is treated as unavailable", async ({ page }) => {
  await page.route(VISITS_GLOB, (route) => route.abort());
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible();
});

test("a request hanging past the six second timeout is aborted and unavailable", async ({
  page,
}) => {
  await page.route(VISITS_GLOB, () => new Promise<void>(() => {}));
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits unavailable", { exact: true }),
  ).toBeVisible({ timeout: REQUEST_TIMEOUT_MS + 4000 });
});

test("the initial state exposes the loading label", async ({ page }) => {
  await page.route(VISITS_GLOB, () => new Promise<void>(() => {}));
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("Visits: loading", { exact: true }),
  ).toBeVisible();
});

test("issues exactly one same-origin POST to /api/visits", async ({ page }) => {
  const methods: string[] = [];
  await page.route(VISITS_GLOB, (route) => {
    methods.push(route.request().method());
    return validCount(route, 1234);
  });
  await page.goto("/");

  await expect(
    visitorCounter(page).getByText("1,234 visits", { exact: true }),
  ).toBeVisible();
  expect(methods).toHaveLength(1);
  expect(methods[0]).toBe("POST");
});

test("the shared footer counter renders on the project dossier page", async ({
  page,
}) => {
  await page.route(VISITS_GLOB, (route) => validCount(route, 1234));
  await page.goto("/projects/mcp-from-scratch");

  await expect(
    visitorCounter(page).getByText("1,234 visits", { exact: true }),
  ).toBeVisible();
});

test("makes no unique-visitor, Nth-visitor or badge-animation claims", async ({
  page,
}) => {
  await page.route(VISITS_GLOB, (route) => validCount(route, 1234));
  await page.goto("/");

  const counter = visitorCounter(page);
  await expect(counter.getByText("1,234 visits", { exact: true })).toBeVisible();

  const text = (await counter.innerText()).toLowerCase();
  expect(text).not.toContain("unique");
  expect(text).not.toMatch(/\d+(st|nd|rd|th)\s+visit/);

  const classes = (await counter.getAttribute("class")) ?? "";
  expect(classes).not.toContain("animate");
});
