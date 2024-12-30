import { env } from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/** https://playwright.dev/docs/test-configuration */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: env.CI ? 1 : 0,
  workers: env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: 'list',
  outputDir: './e2e/test-results',
  snapshotPathTemplate: '{testDir}/screenshots/{testFilePath}/{testName}/{arg}.png',
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !env.CI,
  },
})
