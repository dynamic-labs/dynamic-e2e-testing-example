import { base } from './baseFixture';
import { chromium } from '@playwright/test';

export const magicEdenFixture = base.extend({
  context: async ({}, use) => {
    const pathToMetamask = require('path').join(
      __dirname,
      '..',
      'extensions/metamask',
    );
    const pathToMagicEden = require('path').join(
      __dirname,
      '..',
      'extensions/magiceden',
    );

    const userDataDir = '';

    const browserContext = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToMetamask},${pathToMagicEden}`,
        `--load-extension=${pathToMetamask},${pathToMagicEden}`,
      ],
    });

    await Promise.all([browserContext.waitForEvent('page')]);

    await use(browserContext);
    await browserContext.close();
  },

  page: async ({ context, baseURL }, use) => {
    const homePage = await context.newPage();

    await homePage.goto(baseURL!);

    await use(homePage);
  },
});
