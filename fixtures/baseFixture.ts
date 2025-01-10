import { test, chromium } from '@playwright/test';
import { ConnectWalletPage } from '../page-objects/connectWalletPage';
import { MagicEden } from '../page-objects/wallets/magicEden/magicEdenHelper';
import { Metamask } from '../page-objects/wallets/metamask/metamaskHelper';
import { Phantom } from '../page-objects/wallets/phantom/phantomHelper';

type BaseFixture = {
  connectWalletPage: ConnectWalletPage;
  metamask: Metamask;
  phantom: Phantom;
  magicEden: MagicEden;
};

export const base = test.extend<BaseFixture>({
  context: async ({}, use) => {
    const pathToMetamask = require('path').join(
      __dirname,
      '..',
      'extensions/metamask',
    );

    const pathToPhantom = require('path').join(
      __dirname,
      '..',
      'extensions/phantom',
    );

    const userDataDir = '';

    const browserContext = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToMetamask},${pathToPhantom},`,
        `--load-extension=${pathToMetamask}, ${pathToPhantom},`,
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

  metamask: async ({ page, context }, use) => {
    await use(new Metamask(page, context));
  },

  phantom: async ({ page, context }, use) => {
    await use(new Phantom(page, context));
  },

  magicEden: async ({ page, context }, use) => {
    await use(new MagicEden(page, context));
  },

  connectWalletPage: async ({ page }, use) => {
    await use(new ConnectWalletPage(page));
  },
});
