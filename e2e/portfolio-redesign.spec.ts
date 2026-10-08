import {
  expect,
  test,
  type Locator,
  type Page,
  type Route,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.setTimeout(90000);

// Independent browser acceptance suite for the simplified portfolio.
//
// Scope and fixture honesty (read before changing any fixture):
//
//  * The Home page no longer mounts a GitHub repository strip, so this suite
//    makes NO external request to api.github.com at all. The removed feature is
//    covered by e2e/github-repos.spec.ts.
//  * The SAME-ORIGIN contributions / visits endpoints are fulfilled with
//    HTTP 200 carrying a structurally INVALID payload, e.g.
//    `{ "error": "Contributions unavailable" }`. This is a degraded-state
//    INVALID-PAYLOAD fixture: the client validators reject the body and render
//    the unavailable state. It is deliberately NOT a missing-config fixture and
//    must never be described as one. HTTP 200 is used (instead of the real
//    503/403) purely so Chromium does not emit network console noise.
//  * The REAL missing-config behaviour is asserted separately against the
//    request context, with no browser fixtures involved.
//  * Every fixture count here is test-only and is not a product claim.

const WIDTHS = [375, 768, 1280, 1920] as const;
const THEMES = ["light", "dark"] as const;

const FEATURED = [
  {
    slug: "schemegpt",
    name: "SchemeGPT",
    url: "https://schemegpt-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/schemeGPT",
  },
  {
    slug: "samjho",
    name: "samjho",
    url: "https://samjho-adityasinghprojects.vercel.app",
    sourceUrl: "https://github.com/aditya0si/samjho",
  },
  {
    slug: "coverai",
    name: "CoverAI",
    url: "https://cover-ai-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/CoverAI",
  },
] as const;

const FEATURED_ORDER = FEATURED.map((item) => item.slug);

// The approved simplified Home composition: hero (no id) then these four
// sections in this exact order. The removed systems/concepts/github/education
// blocks must never reappear.
const SECTION_ORDER = ["contributions", "stack", "products", "contact"] as const;
const REMOVED_SECTIONS = ["systems", "concepts", "github", "education"] as const;

const DOSSIER_SLUGS = [
  "stockflow",
  "schemegpt",
  "sentinel",
  "mcp-from-scratch",
  "tenant-api-platform",
  "event-stream-platform",
] as const;

const TOOL_COUNT = 23;

const CONTRIBUTIONS_GLOB = "**/api/contributions";
const VISITS_GLOB = "**/api/visits";

const UPDATED_AT = "2025-01-12T00:00:00.000Z";

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type RawDay = {
  date: string;
  weekday: number;
  contributionCount: number;
  contributionLevel: ContributionLevel;
};

type RawCalendar = {
  total: number;
  weeks: { contributionDays: RawDay[] }[];
  updatedAt: string;
};

// Deterministic two-week calendar (18 contributions). Test fixture only.
function twoWeekCalendar(): RawCalendar {
  return {
    total: 18,
    weeks: [
      {
        contributionDays: [
          { date: "2025-01-01", weekday: 3, contributionCount: 1, contributionLevel: "FIRST_QUARTILE" },
          { date: "2025-01-02", weekday: 4, contributionCount: 0, contributionLevel: "NONE" },
          { date: "2025-01-03", weekday: 5, contributionCount: 3, contributionLevel: "SECOND_QUARTILE" },
          { date: "2025-01-04", weekday: 6, contributionCount: 2, contributionLevel: "FIRST_QUARTILE" },
        ],
      },
      {
        contributionDays: [
          { date: "2025-01-05", weekday: 0, contributionCount: 4, contributionLevel: "THIRD_QUARTILE" },
          { date: "2025-01-06", weekday: 1, contributionCount: 0, contributionLevel: "NONE" },
          { date: "2025-01-07", weekday: 2, contributionCount: 1, contributionLevel: "FIRST_QUARTILE" },
          { date: "2025-01-08", weekday: 3, contributionCount: 5, contributionLevel: "FOURTH_QUARTILE" },
          { date: "2025-01-09", weekday: 4, contributionCount: 1, contributionLevel: "FIRST_QUARTILE" },
          { date: "2025-01-10", weekday: 5, contributionCount: 1, contributionLevel: "FIRST_QUARTILE" },
          { date: "2025-01-11", weekday: 6, contributionCount: 0, contributionLevel: "NONE" },
        ],
      },
    ],
    updatedAt: UPDATED_AT,
  };
}

function fulfillJson(route: Route, status: number, payload: unknown) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

// Degraded-state INVALID-PAYLOAD fixture (NOT missing config): HTTP 200 with a
// body that carries no usable data, so the client renders "unavailable".
async function mockInvalidPayloadDeployed(page: Page) {
  await page.route(CONTRIBUTIONS_GLOB, (route) =>
    fulfillJson(route, 200, { error: "Contributions unavailable" }),
  );
  await page.route(VISITS_GLOB, (route) =>
    fulfillJson(route, 200, { error: "Visits unavailable" }),
  );
}

// Full success rendering: deterministic two-week calendar + fixed visit count.
async function mockSuccessIntegrations(page: Page) {
  await page.route(CONTRIBUTIONS_GLOB, (route) =>
    fulfillJson(route, 200, twoWeekCalendar()),
  );
  await page.route(VISITS_GLOB, (route) =>
    fulfillJson(route, 200, { count: 1234 }),
  );
}

function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

function productCards(page: Page) {
  return page.locator("#products [data-frontend-card]");
}

async function cardOrder(page: Page): Promise<(string | null)[]> {
  return productCards(page).evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-frontend-card")),
  );
}

async function switchToDark(page: Page) {
  const button = page.getByRole("button", { name: "Switch to theme B (dark)" });
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "b");
  await expect(
    page.getByRole("button", { name: "Switch to theme A (light)" }),
  ).toBeVisible();
}

async function enterTheme(page: Page, theme: "light" | "dark") {
  if (theme === "dark") await switchToDark(page);
}

async function assertTechWrapping(card: Locator) {
  const list = card.locator("ul").first();
  await expect(list).toBeVisible();
  expect(await list.evaluate((el) => getComputedStyle(el).flexWrap)).toBe("wrap");

  const box = await card.boundingBox();
  expect(box, "product card has a bounding box").not.toBeNull();

  const chips = await list.locator("li").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }),
  );
  expect(chips.length).toBeGreaterThan(0);
  for (const chip of chips) {
    expect(chip.left).toBeGreaterThanOrEqual(box!.x - 1);
    expect(chip.right).toBeLessThanOrEqual(box!.x + box!.width + 1);
  }

  const internalOverflow = await card.evaluate(
    (el) => el.scrollWidth - el.clientWidth,
  );
  expect(internalOverflow).toBeLessThanOrEqual(1);
}

async function assertNoPageOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `page horizontal overflow (${label})`).toBeLessThanOrEqual(1);
}

async function assertFooterContained(page: Page, label: string) {
  const footer = page.locator("footer");
  await expect(footer).toBeVisible();
  const overflow = await footer.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow, `footer internal overflow (${label})`).toBeLessThanOrEqual(1);
}

async function tabThrough(page: Page, maxTabs: number) {
  const seen: { label: string; href: string | null; focusVisible: boolean }[] = [];
  for (let i = 0; i < maxTabs; i += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      return {
        label: (el.getAttribute("aria-label") || el.textContent || "")
          .trim()
          .slice(0, 80),
        href: el.getAttribute("href"),
        focusVisible: el.matches(":focus-visible"),
      };
    });
    if (info) seen.push(info);
  }
  return seen;
}

// Trigger every scroll-reveal so a full-page screenshot is not blank below the
// fold. IntersectionObserver only adds `.revealed` once an element is visible.
async function revealAll(page: Page) {
  const reveals = page.locator(".reveal");
  const count = await reveals.count();
  for (let i = 0; i < count; i += 1) {
    await reveals.nth(i).scrollIntoViewIfNeeded();
    await expect(reveals.nth(i)).toHaveClass(/revealed/);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

// ---------------------------------------------------------------------------
// Theme via the real HUD control (no invented selector).
// ---------------------------------------------------------------------------

test("HUD theme button switches to theme B (dark), updates data-theme and saves as-theme", async ({
  page,
}) => {
  await mockSuccessIntegrations(page);
  await page.goto("/");

  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "b");
  expect(await page.evaluate(() => localStorage.getItem("as-theme"))).toBeNull();

  await switchToDark(page);

  expect(await page.evaluate(() => localStorage.getItem("as-theme"))).toBe("b");
  await expect(
    page.locator("header").getByText("THEME[B]", { exact: false }),
  ).toBeVisible();

  // Persistence across a reload comes from the pre-paint storage restore.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "b");
  await expect(
    page.getByRole("button", { name: "Switch to theme A (light)" }),
  ).toBeVisible();

  // Switching back removes the attribute and saves "a".
  await page.getByRole("button", { name: "Switch to theme A (light)" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "b");
  expect(await page.evaluate(() => localStorage.getItem("as-theme"))).toBe("a");
});

// ---------------------------------------------------------------------------
// Section composition: hero + the four approved sections, in order, and none of
// the removed blocks.
// ---------------------------------------------------------------------------

test("the simplified Home composes the approved sections in order and drops the removed blocks", async ({
  page,
}) => {
  await mockSuccessIntegrations(page);
  await page.goto("/");

  for (const id of SECTION_ORDER) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }

  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.id,
    ),
  );
  expect(ids).toEqual([...SECTION_ORDER]);

  for (const id of REMOVED_SECTIONS) {
    await expect(page.locator(`section#${id}`)).toHaveCount(0);
  }
  await expect(page.locator("#capabilities")).toHaveCount(0);
  await expect(page.locator("#evidence")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Desktop + mobile acceptance across the required widths and both themes.
// ---------------------------------------------------------------------------

for (const width of WIDTHS) {
  for (const theme of THEMES) {
    test(`${theme} @ ${width}px: three frontends in order, 23 tools, wrapped chips, no overflow, genuine states`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors = collectRuntimeErrors(page);
      await mockSuccessIntegrations(page);
      await page.goto("/");
      await enterTheme(page, theme);

      // Three cards, exact curated order, exact live + source links.
      await expect(productCards(page)).toHaveCount(FEATURED.length);
      expect(await cardOrder(page)).toEqual([...FEATURED_ORDER]);

      for (const item of FEATURED) {
        const card = page.locator(`#products [data-frontend-card="${item.slug}"]`);
        await expect(card).toBeVisible();
        await expect(
          card.getByRole("link", { name: "Source code", exact: true }),
        ).toHaveAttribute("href", item.sourceUrl);
        await expect(
          card.getByRole("link", { name: /live site/i }),
        ).toHaveAttribute("href", item.url);
        await expect(card).not.toContainText("DevAtlas");
        await assertTechWrapping(card);
      }

      // The compact stack strip renders all 23 local marks as 44px targets.
      const tools = page.locator("#stack ul > li");
      await expect(tools).toHaveCount(TOOL_COUNT);
      const firstToolBox = await page.locator("#stack ul > li a").first().boundingBox();
      expect(firstToolBox?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect(firstToolBox?.width ?? 0).toBeGreaterThanOrEqual(44);

      await assertNoPageOverflow(page, `${theme} @ ${width}`);
      await assertFooterContained(page, `${theme} @ ${width}`);

      // Genuine integration states render with the success fixtures.
      await expect(
        page.getByText("18 contributions in the last year", { exact: true }),
      ).toBeVisible();
      await expect(page.getByText("1,234 visits", { exact: true })).toBeVisible();

      await revealAll(page);
      await page.screenshot({
        path: `.hermes/briefs/screenshots/final-simple-${theme}-${width}-home.png`,
        fullPage: true,
      });

      expect(errors).toEqual([]);
    });
  }
}

// ---------------------------------------------------------------------------
// Keyboard: real Tab traversal with focus-visible (never element.focus()).
// ---------------------------------------------------------------------------

for (const width of [375, 1280] as const) {
  test(`keyboard @ ${width}px: real Tab traversal moves focus-visible and reaches HUD, source and live links`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockSuccessIntegrations(page);
    await page.goto("/");

    const sequence = await tabThrough(page, 120);

    expect(sequence.length).toBeGreaterThan(5);
    for (const step of sequence) {
      expect(step.focusVisible, `focus-visible for "${step.label}"`).toBe(true);
    }

    const reachedTheme = sequence.some((step) => /Switch to theme [AB]/i.test(step.label));
    expect(reachedTheme, "HUD theme button reached via Tab").toBe(true);

    const reachedSource = sequence.some((step) => step.label === "Source code");
    expect(reachedSource, "a Source code link reached via Tab").toBe(true);

    const reachedLive = sequence.some((step) => /live site/i.test(step.label));
    expect(reachedLive, "a live site link reached via Tab").toBe(true);
  });
}

// ---------------------------------------------------------------------------
// Accessibility: no serious/critical axe violations in both themes, with the
// invalid-payload (unavailable) integration states rendered.
// ---------------------------------------------------------------------------

for (const theme of THEMES) {
  test(`axe ${theme} theme: no serious/critical violations with unavailable integration states`, async ({
    page,
  }) => {
    await mockInvalidPayloadDeployed(page);
    await page.goto("/");
    await enterTheme(page, theme);

    await expect(
      page.getByText("Contributions unavailable", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Visits unavailable", { exact: true })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const serious = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}

// ---------------------------------------------------------------------------
// Security headers on the real production server.
// ---------------------------------------------------------------------------

test("Homepage sends the hardened security headers", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
  expect(headers["cross-origin-embedder-policy"]).toBe("credentialless");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["cross-origin-resource-policy"]).toBe("same-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Native no-JS context: server-rendered content, 23 tools, six dossiers and
// their audited evidence, and the initial integration text + profile link.
// ---------------------------------------------------------------------------

test("no-JS context: server-rendered Home with three cards and 23 tools, six dossier routes 200 with evidence", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(productCards(page)).toHaveCount(FEATURED.length);
  expect(await cardOrder(page)).toEqual([...FEATURED_ORDER]);
  await expect(page.locator("#stack ul > li")).toHaveCount(TOOL_COUNT);

  // Initial integration states are present in the server HTML (no hydration).
  await expect(page.getByText(/Loading contributions/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /github\.com\/aditya0si/i }),
  ).toBeVisible();
  await expect(page.getByText("Visits: loading", { exact: true })).toBeVisible();

  for (const slug of DOSSIER_SLUGS) {
    const dossier = await page.goto(`/projects/${slug}`);
    expect(dossier?.status(), `dossier /projects/${slug}`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("[EVIDENCE ID]")).toBeVisible();
    await expect(page.getByText("NEXT DOSSIER")).toBeVisible();
    expect(
      await page.locator('a[href^="https://github.com/aditya0si/"]').count(),
    ).toBeGreaterThan(0);
  }

  await context.close();
});

// ---------------------------------------------------------------------------
// REAL missing-config API tests (request context, no browser fixtures).
//
// The server is launched with GITHUB_TOKEN and the Upstash credentials empty for
// this suite, so these hit the genuine fail-closed path.
// ---------------------------------------------------------------------------

test("GET /api/contributions without config fails closed 503", async ({ request }) => {
  const response = await request.get("/api/contributions");
  expect(response.status()).toBe(503);
  expect(JSON.parse(await response.text())).toEqual({
    error: "Contributions unavailable",
  });
});

test("GET /api/visits without config fails closed 503", async ({ request }) => {
  const response = await request.get("/api/visits");
  expect(response.status()).toBe(503);
  expect(JSON.parse(await response.text())).toEqual({
    error: "Visits unavailable",
  });
});
