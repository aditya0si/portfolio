import { expect, test } from "@playwright/test";

const stockflowStack = [
  "Go",
  "PostgreSQL",
  "React",
  "TypeScript",
  "Docker",
  "Docker Compose",
  "Playwright",
];

const selectedHomepageOrder = [
  "schemegpt",
  "stockflow",
  "sentinel",
  "tenant-api-platform",
  "event-stream-platform",
] as const;

test("homepage surfaces exactly five selected projects in curated order", async ({ page }) => {
  await page.goto("/");

  const products = page.locator("#products");
  const cards = products.locator("[data-product-card]");

  await expect(cards).toHaveCount(selectedHomepageOrder.length);

  const order = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-product-card")),
  );
  expect(order).toEqual([...selectedHomepageOrder]);

  for (const slug of selectedHomepageOrder) {
    const card = products.locator(`[data-product-card="${slug}"]`);
    await expect(card).toBeVisible();
    await expect(card.getByRole("link", { name: /source/i })).toBeVisible();
    await expect(card.locator("details summary")).toContainText("Verification details");
  }
});

test("products section shows the exact heading and evidence note", async ({ page }) => {
  await page.goto("/");

  const products = page.locator("#products");

  await expect(
    products.getByRole("heading", { level: 2, name: "Selected projects", exact: true }),
  ).toBeVisible();

  await expect(
    products.getByText(
      "Five projects across AI products, reliability, and backend systems. Source and verification details are linked on every card.",
      { exact: true },
    ),
  ).toBeVisible();
});

test("StockFlow compact card exposes source, case study, full stack, and provenance", async ({ page }) => {
  await page.goto("/");

  const card = page.locator('[data-product-card="stockflow"]');
  await expect(card).toBeVisible();

  const heading = card.getByRole("heading", { level: 3, name: "StockFlow" });
  await expect(heading).toBeVisible();

  const headingSize = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const statusSize = await card
    .locator("[data-product-status]")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const summarySize = await card
    .getByText("Reserve inventory safely across concurrent buyers, retries, and fulfilment workflows.", { exact: true })
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const liveNoteSize = await card
    .getByText("Live demo not linked", { exact: true })
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

  expect.soft(headingSize).toBe(24);
  expect.soft(statusSize).toBeGreaterThanOrEqual(14);
  expect.soft(summarySize).toBeGreaterThanOrEqual(14);
  expect.soft(liveNoteSize).toBeGreaterThanOrEqual(14);

  const source = card.getByRole("link", { name: /source/i });
  await expect(source).toHaveAttribute("href", "https://github.com/aditya0si/stockflow");

  const caseStudy = card.getByRole("link", { name: /case study/i });
  await expect(caseStudy).toHaveAttribute("href", "/projects/stockflow");

  await expect(card.getByRole("link", { name: /live demo/i })).toHaveCount(0);

  const stack = card.getByRole("list", { name: "StockFlow tech stack" });
  await expect(stack.locator("li")).toHaveCount(stockflowStack.length);
  for (const tech of stockflowStack) {
    await expect(stack.getByText(tech, { exact: true })).toHaveCount(1);
  }

  const details = card.locator("details");
  await expect(details.locator("summary")).toContainText("Verification details");
  await details.locator("summary").click();
  await expect(details).toHaveAttribute("open", "");

  const provenance = details.getByRole("link", { name: /EV-SF-RESERVATION/ });
  await expect(provenance).toBeVisible();
  await expect(provenance).toHaveAttribute("href", /^https:\/\/github\.com\/aditya0si\/stockflow/);
});

const responsiveWidths = [375, 1280] as const;

async function gridColumnCount(page: import("@playwright/test").Page) {
  return page.locator("#products .project-grid").evaluate((element) =>
    getComputedStyle(element)
      .gridTemplateColumns.split(/\s+/)
      .filter((track) => track.length > 0).length,
  );
}

for (const width of responsiveWidths) {
  const expectedColumns = width < 768 ? 1 : 2;

  test(`products blueprint grid resolves to ${expectedColumns} column(s) at ${width}px with all five cards and no overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const grid = page.locator("#products .project-grid");
    await expect(grid).toBeVisible();
    expect(await gridColumnCount(page)).toBe(expectedColumns);

    const cards = page.locator("#products [data-product-card]");
    await expect(cards).toHaveCount(5);
    for (const slug of selectedHomepageOrder) {
      await expect(page.locator(`#products [data-product-card="${slug}"]`)).toBeVisible();
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`card links and summaries are keyboard-reachable 44px targets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const targets = page.locator("#products .project-card .project-link:visible");
    const count = await targets.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const target = targets.nth(i);
      const box = await target.boundingBox();
      expect(box, `project target ${i} has a bounding box`).not.toBeNull();
      expect(box!.height, `project target ${i} min-height`).toBeGreaterThanOrEqual(44);

      const reachable = await target.evaluate((element) => {
        (element as HTMLElement).focus();
        return (element as HTMLElement).tabIndex >= 0 && document.activeElement === element;
      });
      expect(reachable, `project target ${i} keyboard reachable`).toBe(true);
    }
  });
}

test("role filter pills are 44px interactive targets", async ({ page }) => {
  await page.goto("/");

  const pills = page.locator("[data-role-filter]");
  await expect(pills).toHaveCount(4);

  for (let i = 0; i < 4; i++) {
    const box = await pills.nth(i).boundingBox();
    expect(box, `role pill ${i} has a bounding box`).not.toBeNull();
    expect(box!.height, `role pill ${i} min-height`).toBeGreaterThanOrEqual(44);
  }
});

test("capture task4 responsive screenshots for light and dark themes", async ({ page }) => {
  for (const width of responsiveWidths) {
    for (const theme of ["light", "dark"] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(
        (value) => localStorage.setItem("as-theme", value),
        theme === "dark" ? "b" : "a",
      );
      await page.reload();
      await expect(page.locator("#products")).toBeVisible();
      await page.screenshot({
        path: `.hermes/briefs/screenshots/task4-${theme}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
