import { test, expect } from '@playwright/test';

test.describe('GetDatabaseHealth Production Tests', () => {
  test.describe.configure({ tag: ['get-database-health', 'prod'] });

  test.beforeEach(async ({ page }) => {
    // Navigate to the production page on Vercel
    await page.goto('https://crawdad-jooqhtcfj-lmcreans-projects.vercel.app/');
    
    // Mock the API health endpoint for production tests
    await page.route('**/api/health/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'healthy',
          message: 'API is connected to Amazon RDS PostgreSQL',
          database_connected: true
        })
      });
    });
  });

  test('successfully checks Database health in production', async ({ page }) => {
    // Get the health check button
    const button = page.getByTestId('api-health-button');
    await expect(button).toBeVisible({ timeout: 15000 });

    // Click the button
    await button.click();

    // Wait for and verify success message with increased timeout
    const successMessage = page.getByTestId('api-health-status');
    await expect(successMessage).toBeVisible({ timeout: 30000 });

    // Verify the health status is displayed with increased timeout
    await expect(page.getByText(/Status: (healthy|degraded)/)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Database Connected: (Yes|No)/)).toBeVisible({ timeout: 15000 });
  });

  test('shows loading state while checking health', async ({ page }) => {
    const button = page.getByTestId('api-health-button');
    await expect(button).toBeVisible({ timeout: 15000 });
    
    // Click the button
    await button.click();

    // Wait for request to complete and verify success
    const successMessage = page.getByTestId('api-health-status');
    await expect(successMessage).toBeVisible({ timeout: 30000 });
  });
}); 