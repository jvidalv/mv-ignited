import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright configuration for E2E testing MV-Ignited extension
 * Tests run with the extension loaded in a real browser on mediavida.com
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run
  timeout: 30000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
  ],

  use: {
    // Base URL for navigation (mediavida.com)
    baseURL: 'https://www.mediavida.com',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium-extension',
      use: {
        ...devices['Desktop Chrome'],
        // Extension will be loaded via launchPersistentContext in tests
      },
    },
  ],

  // Run your local dev server before starting the tests
  // Build the extension before running tests
  webServer: {
    command: 'pnpm build',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
