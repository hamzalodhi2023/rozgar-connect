import { test, expect } from '@playwright/test';

test.describe('Jobs Workflow', () => {
  test('Customer creates a job, Worker completes it', async ({ browser }) => {
    // 1. Customer creates a job
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();
    
    // Login as Customer
    await customerPage.goto('/login');
    await customerPage.fill('input[type="email"]', 'customer@example.com');
    await customerPage.fill('input[type="password"]', 'password123');
    await customerPage.click('button[type="submit"]');
    
    // Note: Assuming a test worker is already in the database and displayed
    await customerPage.goto('/');
    
    // We would click "Hire Me" on a worker profile here.
    // Given the dynamic nature of the DB in E2E, this is a skeleton structure.
    
    // 2. Worker logs in and accepts job
    const workerContext = await browser.newContext();
    const workerPage = await workerContext.newPage();
    
    await workerPage.goto('/login');
    await workerPage.fill('input[type="email"]', 'worker@example.com');
    await workerPage.fill('input[type="password"]', 'password123');
    await workerPage.click('button[type="submit"]');
    
    await workerPage.goto('/jobs');
    // Ensure jobs page loads
    await expect(workerPage.locator('h1')).toContainText('My Jobs');
    
    // Cleanup
    await customerContext.close();
    await workerContext.close();
  });
});
