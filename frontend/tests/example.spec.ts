import { test, expect } from "@playwright/test";

test("Home Page Loads Successfully", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Rozgar/i);
});