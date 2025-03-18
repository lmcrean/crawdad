import { test, expect } from '@playwright/test'

// This file serves as the entry point for all development environment tests
test.describe('Development Environment Setup', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to development environment
    await page.goto('http://localhost:3001') 
    await expect(page).toHaveTitle(/Vite \+ React/)
  })

  test('all test buttons should be present in dev environment', async ({ page }) => {
    await expect(page.getByTestId('api-message-button')).toBeVisible();
    await expect(page.getByTestId('api-health-button')).toBeVisible();
    await expect(page.getByText('Generate JWT')).toBeVisible();
    await expect(page.getByText('Test User Lifecycle')).toBeVisible();
  })
})
