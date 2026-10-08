import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

// Regression guard for the deliberately removed GitHub repository strip.
//
// The approved simplified Home no longer mounts the GitHubLive repository strip.
// This suite asserts the feature stays removed in the browser: no stripped-down
// section, no external api.github.com request on load, and no unsafe repository
// or upstream-API prose. The component source is retained on disk untouched but
// is not imported by Home, so the old cache/live/malformed-payload behaviour is
// intentionally NOT re-tested against a feature that is no longer rendered.

const REPO_ROOT = process.cwd();
const GITHUB_COMPONENT = path.join(
  REPO_ROOT,
  "portfolio",
  "app",
  "components",
  "GitHubLive.tsx",
);
const HOME_PAGE = path.join(REPO_ROOT, "portfolio", "app", "page.tsx");

const EXTERNAL_GITHUB_PREFIXES = [
  "https://api.github.com/",
  "https://raw.githubusercontent.com/",
];

test("Home no longer renders the GitHub repository strip", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("section#github")).toHaveCount(0);

  // No strip heading or repository count label survived the removal.
  await expect(
    page.getByText("Cached repository snapshot", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(/Showing \d+ repositories/)).toHaveCount(0);
  await expect(page.getByText("PUBLIC REPOS", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Open GitHub for all", { exact: false })).toHaveCount(0);
});

test("loading Home performs no external GitHub API request", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (EXTERNAL_GITHUB_PREFIXES.some((prefix) => url.startsWith(prefix))) {
      external.push(`${request.method()} ${url}`);
    }
  });

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  // Give any deferred client effect time to fire before asserting absence.
  await page.waitForTimeout(1000);
  expect(external, `unexpected external GitHub requests:\n${external.join("\n")}`).toEqual(
    [],
  );
});

test("Home exposes no repository-strip prose or upstream API diagnostics", async ({
  page,
}) => {
  await page.goto("/");

  const body = await page.locator("body").innerText();
  const lower = body.toLowerCase();

  expect(body).not.toMatch(/Cached repository snapshot/i);
  expect(body).not.toMatch(/PUBLIC REPOS/i);
  expect(body).not.toMatch(/Showing \d+ repositories/i);
  expect(body).not.toMatch(/api\.github\.com/i);
  expect(body).not.toMatch(/rate.?limit/i);
  expect(body).not.toMatch(/\bnot found\b/i);

  // No credential or upstream-diagnostic prose ever reaches the rendered DOM.
  // ("stack" is deliberately not asserted: Home legitimately labels its tech
  // stack section, so the word is not evidence of a leaked stack trace.)
  expect(lower).not.toContain("ghp_");
  expect(lower).not.toContain("bearer");
  expect(lower).not.toContain("token");
  expect(lower).not.toContain("rate limit");
});

test("the removed GitHubLive component source is retained and no longer mounted by Home", async () => {
  expect(fs.existsSync(GITHUB_COMPONENT)).toBe(true);

  const component = fs.readFileSync(GITHUB_COMPONENT, "utf-8");
  expect(component).toContain("api.github.com");
  expect(component).toContain("fallbackRepos");

  const home = fs.readFileSync(HOME_PAGE, "utf-8");
  expect(home).not.toContain("GitHubLive");
  expect(home).not.toContain('id="github"');
});
