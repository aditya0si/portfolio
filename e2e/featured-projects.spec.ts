import { expect, test, type Locator, type Page } from "@playwright/test";

// Migrated acceptance suite for the simplified Home featured frontends.
//
// The approved Home surfaces exactly three genuine public frontends as local
// screenshot cards (`data-frontend-card`), each with a live deployment anchor and
// a verified source-code anchor. The old backend catalog is gone: no role
// filters, no product cards, no case-study links, no verification `<details>`.
//
// Fixture honesty: the two same-origin integration clients (contributions and
// visits) are fulfilled with HTTP 200 carrying structurally INVALID bodies so
// the deterministic "unavailable" state renders and Chromium does not emit the
// expected 503/403 network console errors. These are degraded-state fixtures,
// never success claims, and never mask a missing feature. The real unconfigured
// API contract is asserted unmocked in the request-context API specs.

const FEATURED = [
  {
    slug: "schemegpt",
    name: "SchemeGPT",
    url: "https://schemegpt-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/schemeGPT",
    screenshotFile: "schemegpt-homepage.png",
    technologies: ["Next.js", "React", "TypeScript", "Python", "PostgreSQL"],
    limitation:
      "Live answering API is explicitly offline; retrieval cannot be called here.",
  },
  {
    slug: "samjho",
    name: "samjho",
    url: "https://samjho-adityasinghprojects.vercel.app",
    sourceUrl: "https://github.com/aditya0si/samjho",
    screenshotFile: "samjho-homepage.png",
    technologies: ["Next.js", "React", "TypeScript", "Python"],
    limitation:
      "Questions and quizzes require the undeployed API; syllabus and animations work.",
  },
  {
    slug: "coverai",
    name: "CoverAI",
    url: "https://cover-ai-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/CoverAI",
    screenshotFile: "coverai-homepage.png",
    technologies: ["Next.js", "React", "TypeScript", "Python"],
    limitation: "Backend not verified; this is the frontend interface only.",
  },
] as const;

const ORDER = FEATURED.map((item) => item.slug);

const WIDTHS = [375, 768, 1280, 1920] as const;
const THEMES = ["light", "dark"] as const;

const CONTRIBUTIONS_GLOB = "**/api/contributions";
const VISITS_GLOB = "**/api/visits";

test.beforeEach(async ({ page }) => {
  await page.route(CONTRIBUTIONS_GLOB, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ error: "Contributions unavailable" }),
    }),
  );
  await page.route(VISITS_GLOB, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ error: "Visits unavailable" }),
    }),
  );
});

function cards(page: Page) {
  return page.locator("#products [data-frontend-card]");
}

async function switchToDark(page: Page) {
  const button = page.getByRole("button", { name: "Switch to theme B (dark)" });
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "b");
}

async function enterTheme(page: Page, theme: "light" | "dark") {
  if (theme === "dark") await switchToDark(page);
}

// Same containment regression used across the suite: the technology list wraps,
// every chip stays inside the card, and the card never scrolls internally.
async function assertWrappedChips(card: Locator) {
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

test("homepage surfaces exactly three featured frontends in curated order with real screenshots and live/source links", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("#products");
  await expect(section).toBeVisible();

  await expect(cards(page)).toHaveCount(FEATURED.length);
  const order = await cards(page).evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-frontend-card")),
  );
  expect(order).toEqual([...ORDER]);

  for (const item of FEATURED) {
    const card = section.locator(`[data-frontend-card="${item.slug}"]`);
    await expect(card).toBeVisible();
    await expect(
      card.getByRole("heading", { level: 3, name: item.name, exact: true }),
    ).toBeVisible();

    // A genuine locally captured screenshot that the browser actually decoded.
    const screenshot = card.getByRole("img", {
      name: `${item.name} homepage`,
      exact: true,
    });
    await screenshot.scrollIntoViewIfNeeded();
    await expect(screenshot).toBeVisible();
    const src = await screenshot.evaluate(
      (element) =>
        (element as HTMLImageElement).currentSrc ||
        (element as HTMLImageElement).src,
    );
    expect(src).toContain(item.screenshotFile);
    await expect
      .poll(() =>
        screenshot.evaluate(
          (element) => (element as HTMLImageElement).naturalWidth,
        ),
      )
      .toBeGreaterThan(0);

    // Live deployment anchor matches the manifest exactly and opens safely.
    const live = card.getByRole("link", {
      name: `Open ${item.name} live site in a new tab`,
      exact: true,
    });
    await expect(live).toHaveAttribute("href", item.url);
    await expect(live).toHaveAttribute("target", "_blank");
    await expect(live).toHaveAttribute("rel", "noopener noreferrer");

    // Verified source repository anchor, safely new-tab.
    const source = card.getByRole("link", { name: "Source code", exact: true });
    await expect(source).toHaveAttribute("href", item.sourceUrl);
    await expect(source).toHaveAttribute("target", "_blank");
    await expect(source).toHaveAttribute("rel", "noopener noreferrer");

    // Honest backend limitation is rendered on every card.
    await expect(card).toContainText(item.limitation);
  }
});

test("products section shows the approved heading and drops the removed backend catalog UI", async ({
  page,
}) => {
  await page.goto("/");

  const products = page.locator("#products");
  await expect(
    products.getByRole("heading", {
      level: 2,
      name: "Featured projects",
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.locator("[data-product-card]")).toHaveCount(0);
  await expect(page.locator("[data-role-filter]")).toHaveCount(0);
  await expect(page.locator("[data-product-status]")).toHaveCount(0);
  await expect(page.getByText("Verification details", { exact: false })).toHaveCount(0);
  await expect(products.getByRole("link", { name: /case study/i })).toHaveCount(0);
  await expect(products.locator("details")).toHaveCount(0);

  // The empty DevAtlas deployment is excluded — nothing fabricated.
  await expect(page.getByText("DevAtlas", { exact: true })).toHaveCount(0);
});

test("every card restates its exact technologies and every project link is a 44px target", async ({
  page,
}) => {
  await page.goto("/");

  for (const item of FEATURED) {
    const card = page.locator(`#products [data-frontend-card="${item.slug}"]`);

    const techList = card.getByRole("list", {
      name: `${item.name} technologies`,
    });
    await expect(techList.locator("li")).toHaveCount(item.technologies.length);
    for (const tech of item.technologies) {
      await expect(techList.getByText(tech, { exact: true })).toHaveCount(1);
    }

    const links = card.locator("a.project-link:visible");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i += 1) {
      const box = await links.nth(i).boundingBox();
      expect(box, `project link ${i} has a bounding box`).not.toBeNull();
      expect(box!.height, `project link ${i} min-height`).toBeGreaterThanOrEqual(44);
    }
  }
});

for (const width of WIDTHS) {
  for (const theme of THEMES) {
    test(`${theme} @ ${width}px: three frontend cards in order with wrapped chips, live/source links and no overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await enterTheme(page, theme);

      await expect(cards(page)).toHaveCount(FEATURED.length);
      const order = await cards(page).evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("data-frontend-card")),
      );
      expect(order).toEqual([...ORDER]);

      for (const item of FEATURED) {
        const card = page.locator(`#products [data-frontend-card="${item.slug}"]`);
        await expect(card).toBeVisible();
        await expect(
          card.getByRole("link", { name: "Source code", exact: true }),
        ).toHaveAttribute("href", item.sourceUrl);
        await expect(
          card.getByRole("link", { name: /live site/i }),
        ).toHaveAttribute("href", item.url);
        await assertWrappedChips(card);
      }

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      await page.locator("#products").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `.hermes/briefs/screenshots/final-simple-${theme}-${width}-products.png`,
        fullPage: true,
      });
    });
  }
}
