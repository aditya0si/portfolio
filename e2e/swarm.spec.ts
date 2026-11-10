import { expect, test } from "@playwright/test";

type SwarmWindow = Window & {
  SwarmCursors?: {
    isRunning: () => boolean;
    stop: (reveal: boolean) => void;
  };
};

const running = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as SwarmWindow).SwarmCursors?.isRunning() ?? false);

test("homepage starts the swarm on every visit and restores the live page", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (let visit = 0; visit < 2; visit += 1) {
    await page.goto("/");
    await expect.poll(() => running(page), { timeout: 15_000 }).toBe(true);
    await page.evaluate(() => (window as SwarmWindow).SwarmCursors?.stop(true));
    await expect.poll(() => running(page)).toBe(false);
    await expect(page.getByRole("heading", { name: /Aditya Singh/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rebuild this page" })).toBeVisible();
  }

  expect(errors).toEqual([]);
});

test("explicit opt-out and reduced motion keep the live page available", async ({ page }) => {
  await page.goto("/?swarm=0");
  await page.waitForTimeout(900);
  expect(await running(page)).toBe(false);
  await expect(page.getByRole("button", { name: "Rebuild this page" })).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(900);
  expect(await running(page)).toBe(false);
  await expect(page.getByRole("heading", { name: /Aditya Singh/i })).toBeVisible();
});
