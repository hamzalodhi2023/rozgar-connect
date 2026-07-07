import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page correctly and show main sections', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Rozgar/i);

    // Check features/selling points
    await expect(page.getByText('Local & Instant')).toBeVisible();
    await expect(page.getByText('Direct Communication')).toBeVisible();
    await expect(page.getByText('Reviews & Ratings')).toBeVisible();

    // Check headings for sections
    await expect(page.getByRole('heading', { name: /Top Rated Local Professionals/i })).toBeVisible();
  });

  test('should navigate to search page when clicking see all', async ({ page }) => {
    await page.goto('/');
    
    // Click 'See All' near Top Rated Local Professionals
    const seeAllLink = page.getByRole('link', { name: /See All/i });
    await expect(seeAllLink).toBeVisible();
    await seeAllLink.click();

    // Verify URL changes to /search
    await expect(page).toHaveURL(/.*\/search/);
  });
});
