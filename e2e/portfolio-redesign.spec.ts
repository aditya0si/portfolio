import {
  expect,
  test,
  type Locator,
  type Page,
  type Route,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.setTimeout(90000);

// Independent browser acceptance suite for the redesigned portfolio.
//
// Scope and fixture honesty (read before changing any fixture):
//
//  * The live GitHub repository call is the ONLY external upstream request that
//    this suite mocks for the browser. It is fulfilled with HTTP 200 `[]`, which
//    is the deterministic "cached snapshot" path (no repos, no live count).
//  * The SAME-ORIGIN contributions / visits endpoints are fulfilled with
//    HTTP 200 carrying a structurally INVALID payload, e.g.
//    `{ "error": "Contributions unavailable" }`. This is a degraded-state
//    INVALID-PAYLOAD fixture: the client validators reject the body and render
//    the unavailable state. It is deliberately NOT a missing-config fixture and
//    must never be described as one. HTTP 200 is used (instead of the real 503)
//    purely so Chromium does not emit network "503" console noise.
//  * The REAL missing-config 503 behaviour (empty GITHUB_TOKEN /
//    UPSTASH_REDIS_REST_* ) is asserted separately against the request context,
//    with no browser fixtures involved. Browser fixtures never leak into the
//    request context.
//  * Every fixture count here is test-only and is not a product claim.
//
// Success calendar fixtures are deterministic two-week payloads (no production
// data).

const WIDTHS = [375, 768, 1280, 1920] as const;
const THEMES = ["light", "dark"] as const;

const FEATURED_ORDER = [
  "schemegpt",
  "stockflow",
  "sentinel",
  "tenant-api-platform",
  "event-stream-platform",
] as const;

const FEATURED_SOURCE = {
  schemegpt: "https://github.com/aditya0si/schemeGPT",
  stockflow: "https://github.com/aditya0si/stockflow",
  sentinel: "https://github.com/aditya0si/Sentinel",
  "tenant-api-platform": "https://github.com/aditya0si/tenant-api-platform",
  "event-stream-platform": "https://github.com/aditya0si/event-stream-platform",
} as const;

const DOSSIER_SLUGS = [
  "stockflow",
  "schemegpt",
  "sentinel",
  "mcp-from-scratch",
  "tenant-api-platform",
  "event-stream-platform",
] as const;

const SECTION_ORDER = [
  "products",
  "contributions",
  "systems",
  "stack",
  "concepts",
  "github",
  "education",
  "contact",
] as const;

const GITHUB_API_GLOB = "https://api.github.com/**";
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

// Deterministic two-week calendar (18 contributions). The first week omits its
// leading days (weekdays 0-2) so the rendered grid must pad the top column.
// This is a test fixture, never production data.
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

// Only the external repository provider is mocked, with an empty cached array.
async function mockUpstreamRepositories(page: Page) {
  await page.route(GITHUB_API_GLOB, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
  );
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
  await page.route(VISITS_GLOB, (route) => fulfillJson(route, 200, { count: 1234 }));
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
  return page.locator("#products [data-product-card]");
}

async function cardOrder(page: Page): Promise<(string | null)[]> {
  return productCards(page).evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-product-card")),
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

async function assertTechWrapping(card: Locator) {
  const list = card.locator("ul").first();
  await expect(list).toBeVisible();
  expect(await list.evaluate((el) => getComputedStyle(el).flexWrap)).toBe("wrap");

  const box = await card.boundingBox();
  expect(box, "product card has a bounding box").not.toBeNull();

  const chips = await list.locator("li").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: Math.round(rect.top) };
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

  const rows = new Set(chips.map((chip) => chip.top)).size;
  return { rows, count: chips.length };
}

async function assertNoPageOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
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
        label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 80),
        href: el.getAttribute("href"),
        focusVisible: el.matches(":focus-visible"),
      };
    });
    if (info) seen.push(info);
  }
  return seen;
}

// ---------------------------------------------------------------------------
// Theme via the real HUD control (no invented selector).
// ---------------------------------------------------------------------------

test("HUD theme button switches to theme B (dark), updates data-theme and saves as-theme", async ({
  page,
}) => {
  await mockUpstreamRepositories(page);
  await mockSuccessIntegrations(page);
  await page.goto("/");

  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "b");
  expect(await page.evaluate(() => localStorage.getItem("as-theme"))).toBeNull();

  await switchToDark(page);

  expect(await page.evaluate(() => localStorage.getItem("as-theme"))).toBe("b");
  await expect(page.locator("header").getByText("THEME[B]", { exact: false })).toBeVisible();

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
// Desktop + mobile acceptance across the required widths and both themes.
// ---------------------------------------------------------------------------

for (const width of WIDTHS) {
  for (const theme of THEMES) {
    test(`${theme} @ ${width}px: five products in order, source + case study, no live demo, wrapping, no overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors = collectRuntimeErrors(page);
      await mockUpstreamRepositories(page);
      await mockSuccessIntegrations(page);
      await page.goto("/");

      if (theme === "dark") {
        await switchToDark(page);
      }

      // Five cards, exact curated order.
      await expect(productCards(page)).toHaveCount(5);
      expect(await cardOrder(page)).toEqual([...FEATURED_ORDER]);

      for (const slug of FEATURED_ORDER) {
        const card = page.locator(`#products [data-product-card="${slug}"]`);
        await expect(card).toBeVisible();

        const source = card.getByRole("link", { name: /source/i });
        await expect(source).toBeVisible();
        await expect(source).toHaveAttribute("href", FEATURED_SOURCE[slug]);

        const caseStudy = card.getByRole("link", { name: /case study/i });
        await expect(caseStudy).toBeVisible();
        await expect(caseStudy).toHaveAttribute("href", `/projects/${slug}`);

        await expect(card.getByRole("link", { name: /live demo/i })).toHaveCount(0);
        await expect(
          card.getByText("Live demo not linked", { exact: true }),
        ).toBeVisible();

        const { rows } = await assertTechWrapping(card);
        if (width === 375 && slug === "stockflow") {
          // The 7-chip StockFlow stack cannot fit one row on the narrowest sheet.
          expect(rows, "StockFlow chips wrap onto multiple rows at 375px").toBeGreaterThanOrEqual(2);
        }
      }

      await assertNoPageOverflow(page, `${theme} @ ${width}`);
      await assertFooterContained(page, `${theme} @ ${width}`);

      // Targeted screenshot after scroll-into-view (not a blank full-page shot).
      //
      // The IntersectionObserver only adds `.revealed` once an element is
      // actually visible, and the products section is taller than the viewport,
      // so scrolling the section as a whole can leave its header offscreen.
      // Scroll EACH reveal element into view and assert the real visible class.
      const productReveals = page.locator("#products .reveal");
      const productRevealCount = await productReveals.count();
      expect(productRevealCount).toBeGreaterThan(0);
      for (let i = 0; i < productRevealCount; i += 1) {
        const preDiag = await productReveals
          .nth(i)
          .evaluate((el) => ({
            cls: el.className,
            connected: el.isConnected,
            top: Math.round(el.getBoundingClientRect().top),
            bottom: Math.round(el.getBoundingClientRect().bottom),
            winH: window.innerHeight,
            scrollY: Math.round(window.scrollY),
          }));
        console.log("PRE-DIAG", i, JSON.stringify(preDiag));
        await productReveals.nth(i).scrollIntoViewIfNeeded();
        const postDiag = await productReveals
          .nth(i)
          .evaluate((el) => ({
            cls: el.className,
            connected: el.isConnected,
            top: Math.round(el.getBoundingClientRect().top),
            bottom: Math.round(el.getBoundingClientRect().bottom),
            winH: window.innerHeight,
            scrollY: Math.round(window.scrollY),
          }));
        console.log("POST-DIAG", i, JSON.stringify(postDiag));
        await page.waitForTimeout(500);
        const waitDiag = await productReveals.nth(i).evaluate((el) => ({
          cls: el.className,
          connected: el.isConnected,
        }));
        console.log("WAIT-DIAG", i, JSON.stringify(waitDiag));
        await expect(productReveals.nth(i)).toHaveClass(/revealed/);
      }
      await page
        .locator("#products")
        .screenshot({ path: `.hermes/briefs/screenshots/acceptance-${theme}-${width}-products.png` });

      await expect(page.getByText("18 contributions in the last year", { exact: true })).toBeVisible();
      // Same targeted handling for any reveal elements inside contributions.
      const contributionReveals = page.locator("#contributions .reveal");
      const contributionRevealCount = await contributionReveals.count();
      for (let i = 0; i < contributionRevealCount; i += 1) {
        await contributionReveals.nth(i).scrollIntoViewIfNeeded();
        await expect(contributionReveals.nth(i)).toHaveClass(/revealed/);
      }
      await page.locator("#contributions").scrollIntoViewIfNeeded();
      await page
        .locator("#contributions")
        .screenshot({ path: `.hermes/briefs/screenshots/acceptance-${theme}-${width}-contributions.png` });

      await expect(page.getByText("1,234 visits", { exact: true })).toBeVisible();
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page
        .locator("footer")
        .screenshot({ path: `.hermes/briefs/screenshots/acceptance-${theme}-${width}-footer.png` });

      // Fixtures are all 200 here, so the page must be console-clean.
      expect(errors).toEqual([]);
    });
  }
}

// ---------------------------------------------------------------------------
// Keyboard: real Tab traversal with focus-visible (never element.focus()).
// ---------------------------------------------------------------------------

for (const width of [375, 1280] as const) {
  test(`keyboard @ ${width}px: real Tab traversal moves focus-visible and reaches HUD + product links`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockUpstreamRepositories(page);
    await mockSuccessIntegrations(page);
    await page.goto("/");

    const sequence = await tabThrough(page, 80);

    expect(sequence.length).toBeGreaterThan(5);
    for (const step of sequence) {
      expect(step.focusVisible, `focus-visible for "${step.label}"`).toBe(true);
    }

    const reachedTheme = sequence.some((step) => /Switch to theme [AB]/i.test(step.label));
    expect(reachedTheme, "HUD theme button reached via Tab").toBe(true);

    const reachedProduct = sequence.some((step) => (step.href ?? "").startsWith("/projects/"));
    expect(reachedProduct, "a product case-study link reached via Tab").toBe(true);
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
    await mockUpstreamRepositories(page);
    await mockInvalidPayloadDeployed(page);
    await page.goto("/");

    if (theme === "dark") {
      await switchToDark(page);
    }

    await expect(page.getByText("Contributions unavailable", { exact: true })).toBeVisible();
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
// Section anchors preserved, contributions immediately after products.
// ---------------------------------------------------------------------------

test("all section anchors are preserved with contributions immediately after products", async ({
  page,
}) => {
  await mockUpstreamRepositories(page);
  await mockSuccessIntegrations(page);
  await page.goto("/");

  for (const id of SECTION_ORDER) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }

  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll("section[id]")).map((section) => section.id),
  );
  expect(ids.filter((id) => (SECTION_ORDER as readonly string[]).includes(id))).toEqual([
    ...SECTION_ORDER,
  ]);
});

// ---------------------------------------------------------------------------
// Native no-JS context: server-rendered cards, six dossiers, initial state.
// ---------------------------------------------------------------------------

test("no-JS context: server-rendered homepage, six dossier routes 200, initial integration text + profile link", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(productCards(page)).toHaveCount(5);
  expect(await cardOrder(page)).toEqual([...FEATURED_ORDER]);

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
  }

  await context.close();
});

// ---------------------------------------------------------------------------
// REAL missing-config API tests (request context, no browser fixtures).
//
// The server is launched with GITHUB_TOKEN='' and UPSTASH_REDIS_REST_URL='' /
// UPSTASH_REDIS_REST_TOKEN='' for this suite, so these hit the genuine
// fail-closed path. This is the missing-config case; it is distinct from the
// invalid-payload browser fixtures above.
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
  expect(JSON.parse(await response.text())).toEqual({ error: "Visits unavailable" });
});
