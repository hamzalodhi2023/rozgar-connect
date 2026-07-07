import { test, expect } from '@playwright/test';
import path from 'path';

test('Worker ID Verification Upload', async ({ page }) => {
    await page.goto("/");
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('hamzalodhi2023@gmail.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456789');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Navigate via UI to avoid state reset
    await page.getByTestId('user-dropdown-btn').click();
    await page.getByRole('link', { name: 'Worker Dashboard' }).click();
    
    await page.waitForURL('**/worker-dashboard');
    
    // Click Edit Profile on the dashboard
    await page.getByRole('link', { name: 'Edit Profile' }).click();
    
    await page.waitForURL('**/worker-setup');
    await expect(page.getByRole('button', { name: /Update Profile|Complete Setup/i })).toBeVisible({ timeout: 15000 });
    
    // Upload ID Front
    const idFrontPath = 'tests/fixtures/id-front.jpg';
    const idBackPath = 'tests/fixtures/id-back.jpg';
    
    const fileInputs = page.locator('input[type="file"]');
    await fileInputs.nth(1).setInputFiles(idFrontPath);
    await fileInputs.nth(2).setInputFiles(idBackPath);
    
    // Click submit
    await page.getByRole('button', { name: /Update Profile|Complete Setup/i }).click();
    
    // Wait for success toast
    await expect(page.getByText(/success/i).first()).toBeVisible({ timeout: 10000 });
});
