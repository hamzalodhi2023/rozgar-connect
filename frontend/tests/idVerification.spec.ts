import { test, expect } from '@playwright/test';
import path from 'path';

test('Worker ID Verification Upload', async ({ page }) => {
    // 1. Register a new user to make the test self-contained
    await page.goto("/register");
    const uniqueEmail = `worker${Date.now()}@example.com`;
    
    await page.getByPlaceholder('John Doe').fill('Test Worker');
    await page.getByPlaceholder('john@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('••••••••').fill('Password123!');
    
    // Select Worker Role
    await page.locator('label').filter({ hasText: 'Worker' }).click();
    
    // Click Sign Up
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Wait for automatic redirect to worker-setup page
    await page.waitForURL('**/worker-setup');
    await expect(page.getByRole('button', { name: /Complete Setup|Update Profile/i })).toBeVisible({ timeout: 15000 });
    
    // 2. Fill out required fields for the new worker profile
    await page.getByRole('button', { name: 'Plumbing' }).click();
    await page.locator('input[name="city"]').fill('Islamabad');
    await page.locator('input[name="area"]').fill('Blue Area');
    await page.locator('input[name="phone"]').fill('+923001234567');
    await page.locator('input[name="whatsapp"]').fill('+923001234567');
    await page.locator('textarea[name="description"]').fill('I am a highly experienced professional with 10 years of experience.');
    
    // 3. Upload ID Front & Back
    const idFrontPath = 'tests/fixtures/id-front.jpg';
    const idBackPath = 'tests/fixtures/id-back.jpg';
    
    const fileInputs = page.locator('input[type="file"]');
    // fileInputs.nth(0) is the profile photo, nth(1) is ID front, nth(2) is ID back
    await fileInputs.nth(1).setInputFiles(idFrontPath);
    await fileInputs.nth(2).setInputFiles(idBackPath);
    
    // 4. Click submit
    await page.getByRole('button', { name: /Complete Setup|Update Profile/i }).click();
    
    // Wait for success toast
    await expect(page.getByText(/success/i).first()).toBeVisible({ timeout: 10000 });
});
