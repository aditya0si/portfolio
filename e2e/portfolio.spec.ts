import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const productRoutes = [
  "/projects/schemegpt",
  "/projects/sentinel",
  "/projects/mcp-from-scratch",
  "/projects/tenant-api-platform",
  "/projects/event-stream-platform",
];

function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test("homepage renders, navigates via PRODUCTS HUD, and sends security headers", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: /aditya singh/i, level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();

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

  // First-class nav renamed to PRODUCTS, WORK and EXPERIENCE removed
  await expect(page.getByRole("link", { name: "WORK", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "EXPERIENCE", exact: true })).toHaveCount(0);

  const productsLink = page.getByRole("link", { name: "PRODUCTS", exact: true });
  await expect(productsLink).toBeVisible();
  await productsLink.click();
  await expect(page.locator("#products")).toBeInViewport();

  const systemsLink = page.getByRole("link", { name: /SYSTEMS/i, exact: false });
  await expect(systemsLink).toBeVisible();
  await systemsLink.click();
  await expect(page.locator("#systems")).toBeInViewport();

  await page.getByRole("link", { name: "CONTACT", exact: true }).click();
  await expect(page.locator("#contact")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("stale and unsupported claims are completely absent from homepage", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");

  const bodyText = await page.locator("body").innerText();

  // Unsupported biography / experience
  expect(bodyText).not.toMatch(/\bIBM\b/);
  expect(bodyText).not.toMatch(/\bHCL\b/);
  expect(bodyText).not.toMatch(/two AI internships/i);

  // Unqualified hype
  expect(bodyText).not.toMatch(/survive production/i);
  expect(bodyText).not.toMatch(/PRODUCTION RAG/i);

  // Stale versions & numbers
  expect(bodyText).not.toMatch(/Next\.js 15/i);
  expect(bodyText).not.toMatch(/<180ms/);
  expect(bodyText).not.toMatch(/\b60\+\b/);
  expect(bodyText).not.toMatch(/100%/);
  expect(bodyText).not.toMatch(/SIH 2026/);
  expect(bodyText).not.toMatch(/Smart India Hackathon 2026/);

  expect(errors).toEqual([]);
});

test("role filter pills deterministically filter the 5 provisional product candidates with keyboard support", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");

  // Ensure products section is present
  const productsSection = page.locator("#products");
  await expect(productsSection).toBeVisible();

  // Check filter pills exist
  const filterPills = page.locator("[data-role-filter]");
  await expect(filterPills).toHaveCount(4);

  const pillAll = page.locator('[data-role-filter="ALL"]');
  const pillAi = page.locator('[data-role-filter="AI ENGINEER"]');
  const pillFd = page.locator('[data-role-filter="FORWARD DEPLOYED"]');
  const pillBackend = page.locator('[data-role-filter="BACKEND/SYSTEMS"]');

  await expect(pillAll).toBeVisible();
  await expect(pillAi).toBeVisible();
  await expect(pillFd).toBeVisible();
  await expect(pillBackend).toBeVisible();

  // All 5 products present initially under ALL
  const productCards = productsSection.locator("[data-product-card]");
  await expect(productCards).toHaveCount(5);

  // Filter: AI ENGINEER
  await pillAi.click();
  await expect(page.locator('[data-product-card="schemegpt"]')).toBeVisible();
  await expect(page.locator('[data-product-card="sentinel"]')).toBeVisible();
  await expect(page.locator('[data-product-card="mcp-from-scratch"]')).toBeVisible();
  await expect(page.locator('[data-product-card="event-stream-platform"]')).toBeHidden();

  // Filter: BACKEND/SYSTEMS
  await pillBackend.click();
  await expect(page.locator('[data-product-card="tenant-api-platform"]')).toBeVisible();
  await expect(page.locator('[data-product-card="event-stream-platform"]')).toBeVisible();
  await expect(page.locator('[data-product-card="sentinel"]')).toBeVisible();

  // Filter: FORWARD DEPLOYED
  await pillFd.click();
  await expect(page.locator('[data-product-card="schemegpt"]')).toBeVisible();
  await expect(page.locator('[data-product-card="tenant-api-platform"]')).toBeVisible();
  await expect(page.locator('[data-product-card="event-stream-platform"]')).toBeHidden();

  // Keyboard navigation on filter pills
  await pillAll.focus();
  await expect(pillAll).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(pillAi).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.locator('[data-product-card="event-stream-platform"]')).toBeHidden();

  // Reset to ALL
  await pillAll.click();
  await expect(productCards).toHaveCount(5);

  expect(errors).toEqual([]);
});

test("provisional products display candidate/provisional status and verified execution facts", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");

  const productsSection = page.locator("#products");

  // Every product card must show candidate/provisional status
  const statuses = productsSection.locator("[data-product-status]");
  const count = await statuses.count();
  expect(count).toBe(5);
  for (let i = 0; i < count; i++) {
    const text = await statuses.nth(i).innerText();
    expect(text.toLowerCase()).toMatch(/candidate|provisional/);
  }

  // Verified facts surfaced in DOM
  const sectionText = await productsSection.innerText();
  expect(sectionText).toMatch(/62\s*(passed|pytest)/i);
  expect(sectionText).toMatch(/29\s*(passed|pytest)/i);
  expect(sectionText).toMatch(/full Go suite passed[\s\S]{0,180}PostgreSQL and Redis/i);
  expect(sectionText).toMatch(/86-test Go suite[\s\S]{0,100}Compose smoke test passed/i);

  expect(errors).toEqual([]);
});

test("conceptual systems section renders 5 concepts labeled FUTURE / UNBUILT with ConceptValue formula", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");

  const systemsSection = page.locator("#systems");
  await expect(systemsSection).toBeVisible();

  const conceptCards = systemsSection.locator("[data-concept-card]");
  await expect(conceptCards).toHaveCount(5);

  // Check required concepts from INITIAL-AUDIT
  await expect(systemsSection.getByText("Aether-Gateway")).toBeVisible();
  await expect(systemsSection.getByText("Chronos-Drift")).toBeVisible();
  await expect(systemsSection.getByText("KVCache-Router")).toBeVisible();
  await expect(systemsSection.getByText("Chaos-Agent")).toBeVisible();
  await expect(systemsSection.getByText("Raft-KV-Mesh")).toBeVisible();

  // All must be labeled FUTURE / UNBUILT
  const badges = systemsSection.locator("[data-unbuilt-badge]");
  expect(await badges.count()).toBe(5);
  for (let i = 0; i < 5; i++) {
    expect(await badges.nth(i).innerText()).toMatch(/FUTURE\s*\/\s*UNBUILT/);
  }

  // ConceptValue calculations surfaced
  expect(await systemsSection.innerText()).toMatch(/ConceptValue|106\.67|128\.00/);

  expect(errors).toEqual([]);
});

for (const route of productRoutes) {
  test(`${route} renders without browser errors and links back to ALL PRODUCTS`, async ({ page }) => {
    const errors = collectRuntimeErrors(page);
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /all products/i })).toBeVisible();
    await expect(page.getByText("NEXT DOSSIER")).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.toLowerCase()).toMatch(/candidate|provisional/);

    expect(errors).toEqual([]);
  });
}

test("homepage has no serious axe accessibility violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("mobile layout has no horizontal overflow and exposes keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = collectRuntimeErrors(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Toggle menu" })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const element = document.activeElement;
    return !!element && element !== document.body && element.matches(":focus-visible");
  });
  expect(focused).toBe(true);
  expect(errors).toEqual([]);
});
