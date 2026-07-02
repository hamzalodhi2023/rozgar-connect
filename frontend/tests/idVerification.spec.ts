import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto("/");

    // Login
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('hamzalodhi2023@gmail.com');
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456789');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Go to Worker Profile
    await page.getByRole('button', { name: 'H Hamza Khan Lodhi' }).click();
    await page.getByRole('link', { name: 'Worker Dashboard' }).click();
    await page.getByRole('link', { name: 'Worker Profile' }).click();

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Upload Front ID
    await page
        .locator('label:has-text("Change Front") input[type="file"]')
        .setInputFiles('tests/assets/idcard.jpg');

    // Upload Back ID
    await page
        .locator('label:has-text("Change Back") input[type="file"]')
        .setInputFiles('tests/assets/idcard.jpg');

    // Submit
    await page.getByRole('button', { name: 'Update Profile' }).click();
});