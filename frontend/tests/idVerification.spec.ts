import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('/');
    // await page.goto('http://192.168.20.148:5173/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'john@example.com' }).click();
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('hamzalodhi2023@gmail.com');
    await page.getByRole('textbox', { name: 'john@example.com' }).press('Tab');
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456789');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: 'Become a Worker' }).click();
    await page.getByRole('link', { name: 'Worker Profile' }).click();
    await page.getByText('Change Front').click();
    await page.getByLabel('Change Front').setInputFiles('tests/assets/idcard.jpg');
    await page.getByText('Change Back').click();
    await page.getByLabel('Change Back').setInputFiles('tests/assets/idcard.jpg');
    await page.getByRole('button', { name: 'Update Profile' }).click();
});