import { PlaywrightTestConfig } from '@playwright/test';
import { timeouts } from './helpers/timeouts';
import ENV from './config/env';

const config: PlaywrightTestConfig = {
  globalTimeout: timeouts.globalTestsTimeout,
  timeout: timeouts.testTimeout,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['junit', { outputFile: 'test-results/results.xml' }]],
  testDir: './tests',
  globalSetup: './setup/globalSetup.ts',
  outputDir: './test-results',
  workers: 3,
  fullyParallel: true,
  use: {
    baseURL: ENV.BASE_URL,
    browserName: 'chromium',
    viewport: { width: 1300, height: 800 },
    headless: false,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: timeouts.mediumTimeout,
    navigationTimeout: timeouts.mediumTimeout,
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  expect: {
    timeout: timeouts.mediumTimeout,
    toMatchSnapshot: {
      maxDiffPixels: 30,
    },
  },
  snapshotDir: 'testData/snapshots',
};

export default config;
