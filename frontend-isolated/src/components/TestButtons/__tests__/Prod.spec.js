import { test, expect } from '@playwright/test';

// This file serves as the entry point for all production environment tests
test.describe('Production Environment Setup', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production environment
    await page.goto('https://antelope-frontend-isolate-ea7038a582fe.herokuapp.com/');
    await expect(page).toHaveTitle(/Vite \+ React/);
  });

  test('all test buttons should be present in production environment', async ({ page }) => {
    await expect(page.getByTestId('api-message-button')).toBeVisible();
    await expect(page.getByTestId('api-health-button')).toBeVisible();
    await expect(page.getByText('Generate JWT')).toBeVisible();
    await expect(page.getByText('Test User Lifecycle')).toBeVisible();
  });
});
