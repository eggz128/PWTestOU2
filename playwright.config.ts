import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  expect: {timeout: 6000}, //Sets expect timeout default to 6s (normally 5s)
  timeout: !!process.env.CI ? 60_000 : 30_000, //If on CI (an env var CI is exists and is set to something/anything) - tests have 60s else 30s (usual default).
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0, //If - then short version
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://www.edgewordstraining.co.uk/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //launchOptions: {slowMo: 500},
    trace: 'on',
    //headless: true,
    actionTimeout: 8000,
    //headless: false,
    video: 'on',
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome']},
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
        viewport: {width: 1920, height: 1080}
       },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] , actionTimeout: 10000},
      default: false,
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Galaxy S5'] },
      default: false,
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPad (gen 11) landscape'] },
      default: false,
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      default: false,
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      default: false,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
