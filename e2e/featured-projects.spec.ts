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
