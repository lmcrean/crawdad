import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  timeout: 120000,
  expect: {
    timeout: 30000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 60000,
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  testIgnore: ['**/*.test.{js,jsx,ts,tsx}'],
  testMatch: ['**/*.spec.{js,jsx,ts,tsx}'],
  projects: [
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    }
  ],
  webServer: [
    {
      command: 'cd ../api-isolated && python manage.py runserver 8000',
      url: 'http://localhost:8000/api/test/',
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:3001',
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    }
  ]
}); 