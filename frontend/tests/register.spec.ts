import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://192.168.20.148:5173/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('John Deo');
    await page.getByRole('textbox', { name: 'John Doe' }).press('Tab');
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('john@gmail.co');
    await page.getByRole('textbox', { name: 'john@example.com' }).press('Tab');
    await page.getByRole('textbox', { name: 'john@example.com' }).click();
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('john@gmail.com');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456789');
    await page.getByRole('button', { name: 'Sign Up' }).click();
});