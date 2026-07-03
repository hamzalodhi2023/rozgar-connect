import { test, expect } from '@playwright/test';
import { writeFileSync } from 'fs';

test('test', async ({ page }) => {
    await page.goto("/");

    await page.getByRole('link', { name: 'Sign In' }).click();

    await page.getByRole('textbox', { name: 'john@example.com' }).fill('hamzalodhi2023');
    await page.getByRole('textbox', { name: 'john@example.com' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('hamzalodhi2023@');
    await page.getByRole('textbox', { name: 'john@example.com' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('hamzalodhi2023@gmail.com');

    await page.getByRole('textbox', { name: '••••••••' }).fill('123456789');

    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for page/API
    await page.waitForLoadState('networkidle');

    // Print current URL in GitHub Actions logs
    console.log("Current URL:", page.url());

    // Save HTML
    writeFileSync(
        'test-results/after-login.html',
        await page.content()
    );

    // Save screenshot
    await page.screenshot({
        path: 'test-results/after-login.png',
        fullPage: true,
    });

    // Continue test
    await page.getByRole('button', { name: 'Become a Worker' }).click();

    await page.getByRole('link', { name: 'Worker Profile' }).click();

    await page.getByText('Change Front').click();
    await page.getByLabel('Change Front').setInputFiles('tests/assets/idcard.jpg');

    await page.getByText('Change Back').click();
    await page.getByLabel('Change Back').setInputFiles('tests/assets/idcard.jpg');

    await page.getByRole('button', { name: 'Update Profile' }).click();
});