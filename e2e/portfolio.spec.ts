import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const productRoutes = [
  "/projects/stockflow",
  "/projects/schemegpt",
  "/projects/sentinel",
  "/projects/mcp-from-scratch",
  "/projects/tenant-api-platform",
  "/projects/event-stream-platform",
];

// Mirror of portfolio/lib/featured-frontends.ts (the Home presentation
// manifest). The browser suite pins the rendered DOM against these exact
// values: three genuine public frontends, in order, each backed by a real
// locally captured screenshot and an honest backend limitation. The empty
// DevAtlas deployment is deliberately absent rather than padded with fake data.
const FEATURED = [
  {
    slug: "schemegpt",
    name: "SchemeGPT",
    url: "https://schemegpt-web.vercel.app",
    sourceUrl: "https://github.com/aditya0si/schemeGPT",
    screenshotFile: "schemegpt-homepage.png",
    technologies: ["Next.js", "React", "TypeScript", "Python", "PostgreSQL"],
    limitation: "Live answering API is explicitly offline; retrieval cannot be called here.",
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

// Deterministic BROWSER-ONLY fixtures for this non-provider suite.
//
// The homepage mounts two same-origin integration clients (contributions and
// visits) plus the external GitHub repository strip. Against the real e2e
// server those clients fail closed: /api/contributions returns 503 and
// /api/visits returns 403 under Next's canonical-origin check. That is correct
// product behaviour, but Chromium then logs network resource errors that would
// trip the strict `collectRuntimeErrors` assertions below.
//
// To keep this suite deterministic WITHOUT weakening it, each client request is
// fulfilled with HTTP 200 carrying a structurally INVALID payload, e.g.
// `{ "error": "Contributions unavailable" }`. This is a degraded-state
// INVALID-PAYLOAD fixture, NOT a missing-configuration fixture: the body is
// intentionally unusable so the client validators resolve to the same
// "unavailable" state. HTTP 200 is used only so Chromium does not emit the
// expected 503/403 console resource errors — no console message is suppressed
// globally, no assertion is relaxed and no success count is fabricated.
//
// The REAL unconfigured 503/403 contract remains covered, unmocked, in the
// request-context API specs (e2e/contributions-api.spec.ts and
// e2e/visits-api.spec.ts); these browser fixtures never leak into that context.
const GITHUB_API_GLOB = "https://api.github.com/**";
const CONTRIBUTIONS_GLOB = "**/api/contributions";
const VISITS_GLOB = "**/api/visits";

test.beforeEach(async ({ page }) => {
  // External GitHub provider: fixed empty cached snapshot, no live network.
  await page.route(GITHUB_API_GLOB, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
  );
  // Invalid-payload fixtures (see the note above): HTTP 200 unusable bodies.
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

function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test("homepage renders, navigates via shared HUD, and sends security headers", async ({ page }) => {
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

  // Approved shared nav is exactly Home / About / Contact with real routes.
  await expect(page.getByRole("link", { name: "WORK", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "EXPERIENCE", exact: true })).toHaveCount(0);

  const homeLink = page.getByRole("link", { name: "Home", exact: true });
  await expect(homeLink).toBeVisible();
  await homeLink.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#products")).toBeVisible();

  const aboutLink = page.getByRole("link", { name: "About", exact: true });
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();
  await expect(page).toHaveURL(/\/about$/);

  const contactLink = page.getByRole("link", { name: "Contact", exact: true });
  await expect(contactLink).toBeVisible();
  await contactLink.click();
  await expect(page).toHaveURL(/\/contact$/);

  // /contact reuses the identical contact info rendered at the bottom of Home.
  const contactSection = page.locator("#contact");
  await expect(contactSection).toBeVisible();
  await expect(contactSection.getByRole("link", { name: "Email me" })).toBeVisible();
  await expect(contactSection.getByRole("link", { name: /LinkedIn/ })).toBeVisible();
  await expect(contactSection.getByRole("link", { name: /GitHub/ })).toBeVisible();
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

test("featured frontends render in approved order with real screenshots and live anchors", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");

  const productsSection = page.locator("#products");
  await expect(productsSection).toBeVisible();

  // Exactly the three genuine public frontends, in curated order.
  const cards = productsSection.locator("[data-frontend-card]");
  await expect(cards).toHaveCount(FEATURED.length);
  const order = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-frontend-card")),
  );
  expect(order).toEqual(FEATURED.map((item) => item.slug));

  for (const item of FEATURED) {
    const card = productsSection.locator(`[data-frontend-card="${item.slug}"]`);
    await expect(card).toBeVisible();
    await expect(
      card.getByRole("heading", { level: 3, name: item.name, exact: true }),
    ).toBeVisible();

    // A real, locally captured homepage screenshot that the browser actually
    // decoded (naturalWidth > 0), never a placeholder or synthesised frame.
    const screenshot = card.getByRole("img", {
      name: `${item.name} homepage`,
      exact: true,
    });
    await screenshot.scrollIntoViewIfNeeded();
    await expect(screenshot).toBeVisible();
    const src = await screenshot.evaluate((element) =>
      (element as HTMLImageElement).currentSrc || (element as HTMLImageElement).src,
    );
    expect(src).toContain(item.screenshotFile);
    await expect
      .poll(() =>
        screenshot.evaluate((element) => (element as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);

    // Live deployment anchor matches the manifest exactly and is safely new-tab.
    const live = card.getByRole("link", {
      name: `Open ${item.name} live site in a new tab`,
      exact: true,
    });
    await expect(live).toHaveAttribute("href", item.url);
    await expect(live).toHaveAttribute("target", "_blank");
    await expect(live).toHaveAttribute("rel", "noopener noreferrer");

    // Accessible source anchor points at the verified repository and is new-tab.
    const source = card.getByRole("link", { name: "Source code", exact: true });
    await expect(source).toBeVisible();
    await expect(source).toHaveAttribute("href", item.sourceUrl);
    await expect(source).toHaveAttribute("target", "_blank");
    await expect(source).toHaveAttribute("rel", "noopener noreferrer");
  }

  expect(errors).toEqual([]);
});

test("featured frontends state honest backend limitations and drop the old backend cards", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");

  const productsSection = page.locator("#products");

  for (const item of FEATURED) {
    const card = productsSection.locator(`[data-frontend-card="${item.slug}"]`);

    // Each card restates the exact manifest technologies via local logos.
    const techList = card.getByRole("list", {
      name: `${item.name} technologies`,
    });
    await expect(techList.locator("li")).toHaveCount(item.technologies.length);
    for (const tech of item.technologies) {
      await expect(techList.getByText(tech, { exact: true })).toHaveCount(1);
    }

    // The honest, explicit backend limitation is rendered on the card.
    await expect(card).toContainText(item.limitation);
  }

  // Empty DevAtlas (real frontend, no data) is excluded — nothing fabricated.
  await expect(page.getByText("DevAtlas", { exact: true })).toHaveCount(0);

  // Concise Home carries no role filters, product cards, status badges or the
  // verbose verification disclosures that belonged to the old backend catalog.
  await expect(page.locator("[data-role-filter]")).toHaveCount(0);
  await expect(page.locator("[data-product-card]")).toHaveCount(0);
  await expect(page.locator("[data-product-status]")).toHaveCount(0);
  await expect(page.getByText("Verification details", { exact: false })).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("shared Primary nav is exactly Home / About / Contact and /about is intentionally empty", async ({ page }) => {
  await page.goto("/");

  const primary = page.getByRole("navigation", { name: "Primary" });
  await expect(primary).toBeVisible();

  const labels = await primary
    .getByRole("link")
    .evaluateAll((elements) => elements.map((element) => element.textContent?.trim()));
  expect(labels).toEqual(["Home", "About", "Contact"]);

  const hrefs = await primary
    .getByRole("link")
    .evaluateAll((elements) => elements.map((element) => element.getAttribute("href")));
  expect(hrefs).toEqual(["/", "/about", "/contact"]);

  // /about is deliberately contentless: it renders no heading and no visible
  // body copy, only the persistent HUD and skip link around <main>.
  const response = await page.goto("/about");
  expect(response?.status()).toBe(200);
  await expect(page.locator("#main h1")).toHaveCount(0);
  await expect(page.locator("#main")).toHaveText("");
});

test("Home and /contact render identical shared contact info", async ({ page }) => {
  await page.goto("/");
  const homeContact = page.locator("#contact");
  await expect(homeContact).toBeVisible();
  const homeText = (await homeContact.innerText()).trim();

  await page.goto("/contact");
  const contactPage = page.locator("#contact");
  await expect(contactPage).toBeVisible();
  const contactText = (await contactPage.innerText()).trim();

  // Both routes render the same shared ContactInfo component, so the content
  // must match exactly. /contact owns the single page h1; Home's is the hero h2.
  expect(contactText).toBe(homeText);
  await expect(page.locator("#contact h1")).toHaveCount(1);
  await expect(contactPage.getByRole("link", { name: "Email me" })).toBeVisible();
  await expect(contactPage.getByRole("link", { name: /LinkedIn/ })).toBeVisible();
  await expect(contactPage.getByRole("link", { name: /GitHub/ })).toBeVisible();
});

test("mcp-from-scratch dossier preserves the 29-test evidence", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  const response = await page.goto("/projects/mcp-from-scratch");
  expect(response?.status()).toBe(200);

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).toMatch(/29\s*pytest/i);
  expect(bodyText).toMatch(/29 TESTS PASSED/i);

  expect(errors).toEqual([]);
});

test("conceptual systems R&D block is absent from the concise homepage", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");

  // The approved concise Home no longer surfaces the conceptual systems block.
  // The component source is retained in the library but is not rendered here.
  await expect(page.locator("#systems")).toHaveCount(0);
  await expect(page.getByText("Aether-Gateway")).toHaveCount(0);

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
