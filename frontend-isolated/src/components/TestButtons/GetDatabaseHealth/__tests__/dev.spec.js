import { test, expect } from '@playwright/test'

test.describe('GetDatabaseHealth Development Tests', () => {
  test('should have frontend and API connection working', async ({ page }) => {
    // Test the frontend is running
    await page.goto('http://localhost:3001')
    await expect(page).toHaveTitle(/Vite \+ React/)

    // Test the API is accessible through the proxy
    const apiResponse = await page.request.get('http://localhost:3001/api/test/')
    expect(apiResponse.ok()).toBeTruthy()
    const data = await apiResponse.json()
    expect(data).toHaveProperty('message')
    expect(data.message).toBe('API is working!')
  })

  test('should display initial state correctly', async ({ page }) => {
    await page.goto('http://localhost:3001')
    const button = await page.getByTestId('api-health-button')
    await expect(button).toBeVisible()
    await expect(button).toHaveText('Check API Health')
    await expect(page.getByTestId('api-health-status')).not.toBeVisible()
    await expect(page.getByTestId('error-message')).not.toBeVisible()
  })

  test('should display healthy status after successful Amazon RDS connection', async ({ page }) => {
    await page.goto('http://localhost:3001')
    // Mock the API response before clicking
    await page.route('**/api/health/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'healthy',
          message: 'API is connected to PostgreSQL RDS',
          database_connected: true
        })
      })
    })

    const button = await page.getByTestId('api-health-button')
    await button.click()

    // Wait for the status to appear with a longer timeout
    await expect(page.getByTestId('api-health-status')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Status: healthy')).toBeVisible()
    await expect(page.getByText('Database Connected: Yes')).toBeVisible()
    await expect(page.getByText('API is connected to PostgreSQL RDS')).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:3001')
    // Force the API to fail by returning a 500 error
    await page.route('**/api/health/', route => 
      route.fulfill({ 
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    )
    
    const button = await page.getByTestId('api-health-button')
    await button.click()

    await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 10000 })
  })

  test('should show degraded status when API reports issues', async ({ page }) => {
    await page.goto('http://localhost:3001')
    // Mock a degraded response
    await page.route('**/api/health/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'unhealthy',
          database_connected: false,
          message: 'Error connecting to PostgreSQL RDS'
        })
      })
    })

    const button = await page.getByTestId('api-health-button')
    await button.click()

    await expect(page.getByTestId('api-health-status')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Status: unhealthy')).toBeVisible()
    await expect(page.getByText('Error connecting to PostgreSQL RDS')).toBeVisible()
  })

  test('should disable button during API call', async ({ page }) => {
    await page.goto('http://localhost:3001')
    // Mock a delayed API response
    await page.route('**/api/health/', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Add delay
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'healthy',
          database_connected: true,
          message: 'API is connected to PostgreSQL RDS'
        })
      })
    })

    const button = await page.getByTestId('api-health-button')
    await button.click()
    
    // Button should be disabled while request is in flight
    await expect(button).toBeDisabled()
    
    // Wait for request to complete
    await expect(page.getByTestId('api-health-status')).toBeVisible({ timeout: 10000 })
    
    // Button should be enabled again
    await expect(button).toBeEnabled()
  })
}) 