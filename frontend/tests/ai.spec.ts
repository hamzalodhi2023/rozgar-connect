import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://192.168.20.148:5173/');
    await page.getByRole('button', { name: 'Chat with Rozgar AI' }).click();
    await page.getByRole('textbox', { name: 'Ask Rozgar AI...' }).click();
    await page.getByRole('textbox', { name: 'Ask Rozgar AI...' }).fill('How to register?');
    await page.getByRole('button', { name: 'Send message' }).click();
});