import { expect, test, type Page } from "@playwright/test";

// TDD specification for truthful repository counts on the homepage GitHub strip.
//
// The live GitHub provider is always mocked so the real, rate-limited API is
// never contacted. The same-origin contributions endpoint is mocked to the
// credential-missing unavailable shape so no external GraphQL call is made.

const GITHUB_API_GLOB = "https://api.github.com/**";
const REPO_PREFIX = "https://github.com/aditya0si/";

type MockRepo = {
  name: string;
  fork: boolean;
  description: string | null;
  language: string | null;
  pushed_at: string;
  html_url: string;
};

function mockRepo(name: string, overrides: Partial<MockRepo> = {}): MockRepo {
  return {
    name,
    fork: false,
    description: `${name} tooling utilities`,
    language: "TypeScript",
    pushed_at: "2026-01-01T00:00:00Z",
    html_url: `${REPO_PREFIX}${name}`,
    ...overrides,
  };
}

const FEATURED_NAMES = [
  "schemeGPT",
  "stockflow",
  "Sentinel",
  "tenant-api-platform",
  "event-stream-platform",
] as const;

// Ten own, non-fork, non-featured repositories so a slice of eight has to
// drop two. mcp-from-scratch is an unfeatured AI repo that must be able to
// appear once exclusion comes from featuredProjects rather than all flagships.
const OWN_UNFEATURED = [
  "mcp-from-scratch",
  "delta-utils",
  "quantum-scripts",
  "orbit-notes",
  "trailhead",
  "nimbus-cache",
  "beacon-cli",
  "forge-utils",
  "atlas-data",
  "signal-relay",
] as const;

function livePayload(): MockRepo[] {
  return [
    ...FEATURED_NAMES.map((name) => mockRepo(name)),
    ...OWN_UNFEATURED.map((name) =>
      mockRepo(name, {
        description:
          name === "mcp-from-scratch"
            ? "Raw JSON-RPC MCP server with stdio transport"
            : `${name} helper library`,
        pushed_at:
          name === "mcp-from-scratch"
            ? "2026-12-31T00:00:00Z"
            : "2026-06-01T00:00:00Z",
      }),
    ),
    mockRepo("forked-widget", { fork: true }),
    mockRepo("portfolio"),
  ];
}

function githubSection(page: Page) {
  return page.locator("section#github");
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

async function assertSafeRepoLinks(page: Page) {
  const anchors = githubSection(page).locator("ul > li a");
  const count = await anchors.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const anchor = anchors.nth(i);
    const href = await anchor.getAttribute("href");
    expect(href, `repo link ${i} href`).toMatch(
      /^https:\/\/github\.com\/aditya0si\//,
    );
    await expect(anchor, `repo link ${i} target`).toHaveAttribute(
      "target",
      "_blank",
    );
    const rel = (await anchor.getAttribute("rel")) ?? "";
    expect(rel, `repo link ${i} rel`).toContain("noopener");
    expect(rel, `repo link ${i} rel`).toContain("noreferrer");
  }
}

test("repository upstream outage keeps the cached snapshot and never claims a public repo count", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await mockContributionsUnavailable(page);
  await page.route(GITHUB_API_GLOB, (route) => route.abort());
  await page.goto("/");

  const section = githubSection(page);
  await expect(
    section.getByText("Cached repository snapshot", { exact: true }),
  ).toBeVisible();
  await expect(section.getByText(/PUBLIC REPOS/i)).toHaveCount(0);
  await expect(section.getByText(/\b38\b/)).toHaveCount(0);
  await assertSafeRepoLinks(page);
  expect(errors).toEqual([]);
});

test("successful fetch shows a live count that matches the rendered list, includes unfeatured MCP, and drops the public repo claim", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await mockContributionsUnavailable(page);
  await page.route(GITHUB_API_GLOB, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(livePayload()),
    }),
  );
  await page.goto("/");

  const section = githubSection(page);
  const label = section.getByText(/Showing \d+ repositories/);
  await expect(label).toBeVisible();
  await expect(section.getByText(/Open GitHub for all/)).toBeVisible();
  await expect(section.getByText(/PUBLIC REPOS/i)).toHaveCount(0);

  const items = section.locator("ul > li");
  const rendered = await items.count();
  const shown = Number((await label.innerText()).match(/(\d+)/)?.[1]);
  expect(shown).toBe(rendered);
  expect(rendered).toBe(8);

  await expect(
    section.getByText("mcp-from-scratch", { exact: true }),
  ).toBeVisible();
  for (const name of FEATURED_NAMES) {
    await expect(section.getByText(name, { exact: true })).toHaveCount(0);
  }
  await expect(section.getByText("forked-widget", { exact: true })).toHaveCount(0);
  await expect(section.getByText("portfolio", { exact: true })).toHaveCount(0);
  await assertSafeRepoLinks(page);
  expect(errors).toEqual([]);
});

test("repository links stay safe in both the cached and live states", async ({
  page,
}) => {
  await mockContributionsUnavailable(page);
  await page.route(GITHUB_API_GLOB, (route) => route.abort());
  await page.goto("/");

  await expect(
    githubSection(page).getByText("Cached repository snapshot", { exact: true }),
  ).toBeVisible();
  await assertSafeRepoLinks(page);

  await page.unroute(GITHUB_API_GLOB);
  await page.route(GITHUB_API_GLOB, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(livePayload()),
    }),
  );
  await page.reload();

  await expect(
    githubSection(page).getByText(/Showing \d+ repositories/),
  ).toBeVisible();
  await assertSafeRepoLinks(page);
});

test("a malformed non-array repository response keeps the cached snapshot without errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await mockContributionsUnavailable(page);
  await page.route(GITHUB_API_GLOB, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Not Found" }),
    }),
  );
  await page.goto("/");

  const section = githubSection(page);
  await expect(
    section.getByText("Cached repository snapshot", { exact: true }),
  ).toBeVisible();
  await expect(section.getByText(/PUBLIC REPOS/i)).toHaveCount(0);
  expect(errors).toEqual([]);
});
