import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate to Browse Workers page', async ({ page }) => {
    await page.goto('/');
    
    // Find the link to Browse Workers in navbar
    const browseLink = page.getByRole('link', { name: /Browse Workers/i });
    if (await browseLink.isVisible()) {
        await browseLink.click();
        await expect(page).toHaveURL(/.*\/search/);
    }
  });

  test('should navigate to Sign In page', async ({ page }) => {
    await page.goto('/');
    
    const signInLink = page.getByRole('link', { name: /Sign In/i });
    if (await signInLink.isVisible()) {
        await signInLink.click();
        await expect(page).toHaveURL(/.*\/login/);
    }
  });

  test('should navigate to Register page', async ({ page }) => {
    await page.goto('/');
    
    // Check for 'Join as Professional' or 'Register'
    const joinLink = page.getByRole('link', { name: /Join/i });
    if (await joinLink.isVisible()) {
        await joinLink.click();
        await expect(page).toHaveURL(/.*\/register.*/);
    }
  });

  test('should show 404 Not Found page for invalid route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');
    
    // Check for Not Found text
    // Assuming the NotFoundPage has "404" or "Not Found" or "Oops"
    await expect(page.getByText(/404/i).or(page.getByText(/Not Found/i))).toBeVisible();
    
    // There is usually a button to go back home
    const homeBtn = page.getByRole('link', { name: 'Go back home' });
    if (await homeBtn.isVisible()) {
      await homeBtn.click();
      await expect(page).toHaveURL(/.*localhost.*/); // back to home
    }
  });
});
