import {
  expect,
  test,
  type Locator,
  type Page,
  type Route,
} from "@playwright/test";

// TDD specification for the client-side contributions calendar.
//
// These tests exercise the homepage the component will be mounted on (mounting
// itself is a later task). The API is mocked with same-origin normalized
// payloads that carry the exact GraphQL-origin shape the route validates. The
// existing GitHub repository fetch is mocked in this suite so the live
// rate-limited provider is never contacted and never crashes the page.

const PROFILE_URL = "https://github.com/aditya0si";
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

type RawPayload = {
  total: number;
  weeks: { contributionDays: RawDay[] }[];
  updatedAt: string;
};

// Two GraphQL-origin weeks. The first week is missing its leading days
// (weekdays 0-2) so the calendar must pad the top of that column.
function twoWeekPayload(): RawPayload {
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

function zeroPayload(): RawPayload {
  return { total: 0, weeks: [], updatedAt: UPDATED_AT };
}

// 52 full weeks starting on a Sunday, matching a real trailing-year calendar.
function fiftyTwoWeekPayload(): RawPayload {
  const start = Date.UTC(2024, 0, 7); // 2024-01-07 is a Sunday
  const weeks: RawPayload["weeks"] = [];
  let total = 0;
  for (let week = 0; week < 52; week += 1) {
    const contributionDays: RawDay[] = [];
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const index = week * 7 + weekday;
      const date = new Date(start + index * 86_400_000).toISOString().slice(0, 10);
      const contributionCount = index % 4;
      total += contributionCount;
      contributionDays.push({
        date,
        weekday,
        contributionCount,
        contributionLevel: contributionCount === 0 ? "NONE" : "FIRST_QUARTILE",
      });
    }
    weeks.push({ contributionDays });
  }
  return { total, weeks, updatedAt: UPDATED_AT };
}

async function mockGitHubRepositories(page: Page) {
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
  );
}

function mockContributions(
  page: Page,
  handler: (route: Route) => Promise<void> | void,
) {
  return page.route("**/api/contributions", handler);
}

function fulfillJson(route: Route, status: number, payload: unknown) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

function calendar(page: Page) {
  return page.locator("[data-contributions-calendar]");
}

test("homepage renders the GitHub contributions heading", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) => fulfillJson(route, 200, twoWeekPayload()));
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "GitHub contributions" }),
  ).toBeVisible();
});

test("validated success shows total, updated time, weekday grid with missing leading days, and accessible daily list", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await mockGitHubRepositories(page);
  await mockContributions(page, (route) => fulfillJson(route, 200, twoWeekPayload()));
  await page.goto("/");

  const panel = calendar(page);
  await expect(panel).toBeVisible();

  await expect(
    panel.getByText("18 contributions in the last year", { exact: true }),
  ).toBeVisible();

  await expect(panel.locator("time")).toHaveAttribute("datetime", UPDATED_AT);

  // Two week columns, each a full seven weekday rows: 11 days + 3 leading gaps.
  await expect(panel.locator('[data-contribution-cell="day"]')).toHaveCount(11);
  await expect(panel.locator('[data-contribution-cell="empty"]')).toHaveCount(3);

  const focusable = await panel
    .locator("[data-contribution-cell]")
    .evaluateAll((cells) =>
      cells.filter((cell) => (cell as HTMLElement).tabIndex >= 0).length,
    );
  expect(focusable).toBe(0);

  const firstDay = panel.locator('[data-contribution-cell="day"]').first();
  await expect(firstDay).toHaveAttribute("title", "1 contributions on 2025-01-01");

  const details = panel.locator("details");
  await details.locator("summary").click();
  await expect(
    details.getByText("1 contributions on 2025-01-01", { exact: true }),
  ).toBeVisible();
  await expect(
    details.getByText("4 contributions on 2025-01-05", { exact: true }),
  ).toBeVisible();

  await expect(panel.getByText("Less", { exact: true })).toBeVisible();
  await expect(panel.getByText("More", { exact: true })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("validated all-zero success shows the no-data message instead of zero", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) => fulfillJson(route, 200, zeroPayload()));
  await page.goto("/");

  const panel = calendar(page);
  await expect(panel).toBeVisible();
  await expect(
    panel.getByText("No contributions in this period", { exact: true }),
  ).toBeVisible();
  await expect(panel.getByText(/contributions in the last year/)).toHaveCount(0);
});

test("unavailable response shows Contributions unavailable and the profile link", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) =>
    fulfillJson(route, 503, { error: "Contributions unavailable" }),
  );
  await page.goto("/");

  const panel = calendar(page);
  await expect(
    panel.getByText("Contributions unavailable", { exact: true }),
  ).toBeVisible();

  const link = panel.getByRole("link", { name: /github\.com\/aditya0si/i });
  await expect(link).toHaveAttribute("href", PROFILE_URL);
  await expect(panel.getByText(/contributions in the last year/)).toHaveCount(0);
});

test("structurally invalid payload is treated as unavailable", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) =>
    fulfillJson(route, 200, {
      total: -1,
      weeks: [
        {
          contributionDays: [
            { date: "2024-02-30", weekday: 9, contributionCount: -2, contributionLevel: "BOGUS" },
          ],
        },
      ],
      updatedAt: "not-a-timestamp",
    }),
  );
  await page.goto("/");

  await expect(
    calendar(page).getByText("Contributions unavailable", { exact: true }),
  ).toBeVisible();
});

test("malformed JSON is treated as unavailable", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{not json" }),
  );
  await page.goto("/");

  await expect(
    calendar(page).getByText("Contributions unavailable", { exact: true }),
  ).toBeVisible();
});

test("a request hanging past the timeout is aborted and treated as unavailable", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, () => new Promise<void>(() => {}));
  await page.goto("/");

  await expect(
    calendar(page).getByText("Contributions unavailable", { exact: true }),
  ).toBeVisible({ timeout: 10_000 });
});

test("the initial loading state exposes the profile link as a no-JS fallback", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, () => new Promise<void>(() => {}));
  await page.goto("/");

  await expect(
    calendar(page).getByRole("link", { name: /github\.com\/aditya0si/i }),
  ).toBeVisible();
});

test("mobile renders a 52-week calendar without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) => fulfillJson(route, 200, fiftyTwoWeekPayload()));
  await page.goto("/");

  const panel = calendar(page);
  await expect(panel).toBeVisible();
  // The section is visible while still loading; wait for the fetched grid.
  await expect(
    panel.locator('[data-contribution-cell="day"]').first(),
  ).toBeVisible();

  const cells = await panel.locator("[data-contribution-cell]").count();
  expect(cells % 7).toBe(0);
  expect(cells).toBeGreaterThanOrEqual(52 * 7);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

async function computedFontSize(locator: Locator): Promise<number> {
  return locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
}

// Containment regression: the 52-week grid must keep its measured geometry
// (seven 10px rows, 10px columns, 3px gaps) while living inside a genuine
// horizontal scroll wrapper, so the page itself never overflows.
test("mobile 52-week grid keeps 10px geometry contained in a real scroll wrapper", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) => fulfillJson(route, 200, fiftyTwoWeekPayload()));
  await page.goto("/");

  const panel = calendar(page);
  await expect(panel).toBeVisible();

  const scroll = panel.locator(".contrib-scroll");
  const grid = panel.locator(".contrib-grid");
  await expect(grid).toBeVisible();

  const geometry = await grid.evaluate((el) => {
    const style = getComputedStyle(el);
    const cells = Array.from(el.querySelectorAll<HTMLElement>(".contrib-cell"));
    const first = cells[0].getBoundingClientRect();
    const nextWeek = cells[7].getBoundingClientRect();
    return {
      rows: style.gridTemplateRows.trim().split(/\s+/).map(parseFloat),
      cellWidth: first.width,
      cellHeight: first.height,
      columnGap: parseFloat(style.columnGap),
      columnPitch: nextWeek.left - first.left,
    };
  });

  expect(geometry.rows).toHaveLength(7);
  for (const row of geometry.rows) {
    expect(row).toBeCloseTo(10, 1);
  }
  expect(geometry.cellWidth).toBeCloseTo(10, 1);
  expect(geometry.cellHeight).toBeCloseTo(10, 1);
  expect(geometry.columnGap).toBeCloseTo(3, 1);
  expect(geometry.columnPitch).toBeCloseTo(13, 1);

  const containment = await scroll.evaluate((el) => ({
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));
  expect(containment.scrollWidth).toBeGreaterThan(containment.clientWidth);

  const scrollLeft = await scroll.evaluate((el) => {
    el.scrollLeft = 50;
    return el.scrollLeft;
  });
  expect(scrollLeft).toBeGreaterThan(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

// Accessibility regression: every prose element in the calendar meets the
// approved 14px minimum and the disclosure target meets the 44px minimum.
test("ready calendar keeps 14px prose and a 44px daily-disclosure target", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) => fulfillJson(route, 200, twoWeekPayload()));
  await page.goto("/");

  const panel = calendar(page);
  const summaryText = panel.getByText("18 contributions in the last year", { exact: true });
  await expect(summaryText).toBeVisible();

  expect(await computedFontSize(summaryText)).toBeGreaterThanOrEqual(14);
  expect(await computedFontSize(panel.locator("time"))).toBeGreaterThanOrEqual(14);
  expect(await computedFontSize(panel.locator(".contrib-legend"))).toBeGreaterThanOrEqual(14);

  const disclosure = panel.locator("details summary");
  await expect(disclosure).toBeVisible();
  expect(await computedFontSize(disclosure)).toBeGreaterThanOrEqual(14);
  const disclosureBox = await disclosure.boundingBox();
  expect(disclosureBox?.height ?? 0).toBeGreaterThanOrEqual(44);

  await disclosure.click();
  const dailyItem = panel.locator("details ul li").first();
  await expect(dailyItem).toBeVisible();
  expect(await computedFontSize(dailyItem)).toBeGreaterThanOrEqual(14);
});

test("loading and unavailable calendar states keep 14px prose and a 44px profile target", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, () => new Promise<void>(() => {}));
  await page.goto("/");

  const panel = calendar(page);
  const loading = panel.getByText("Loading contributions…", { exact: true });
  await expect(loading).toBeVisible();
  expect(await computedFontSize(loading)).toBeGreaterThanOrEqual(14);

  const link = panel.getByRole("link", { name: /github\.com\/aditya0si/i });
  await expect(link).toBeVisible();
  expect(await computedFontSize(link)).toBeGreaterThanOrEqual(14);
  const linkBox = await link.boundingBox();
  expect(linkBox?.height ?? 0).toBeGreaterThanOrEqual(44);

  await page.unroute("**/api/contributions");
  await mockContributions(page, (route) =>
    fulfillJson(route, 503, { error: "Contributions unavailable" }),
  );
  await page.reload();

  const unavailable = calendar(page).getByText("Contributions unavailable", { exact: true });
  await expect(unavailable).toBeVisible();
  expect(await computedFontSize(unavailable)).toBeGreaterThanOrEqual(14);
});

// Anchor regression: the existing page sections stay intact and the new
// contributions section sits immediately after products.
test("homepage keeps all section anchors with contributions immediately after products", async ({ page }) => {
  await mockGitHubRepositories(page);
  await mockContributions(page, (route) => fulfillJson(route, 200, twoWeekPayload()));
  await page.goto("/");

  const expected = [
    "products",
    "contributions",
    "systems",
    "stack",
    "concepts",
    "github",
    "education",
    "contact",
  ];

  for (const id of expected) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }

  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll("section[id]")).map((section) => section.id),
  );
  const anchors = ids.filter((id) => expected.includes(id));
  expect(anchors).toEqual(expected);
});
