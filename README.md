# Dynamic e2e testing

At Dynamic, we place a strong emphasis on maintaining rigorous testing standards, including comprehensive unit tests and end-to-end (E2E) testing.

The purpose of this library is to share our best practices for E2E testing with the broader community, enabling you to apply these strategies effectively to your own projects.

The library supports testing Metamask, Phantom, Magic Eden EVM and Solana. In the sections below we will use Metamask as an example testing wallet, but the same principles apply to other wallets and extensions. You'll find examples for each wallet as you browse through the project itself.

## Installation and run

`npm install`

Install the VS Code extension for Playwright. We recommend using VS Code
`npx playwright install --with-deps chromium`

In order to run the tests on different environments add BASE_URL to your .env file e.g. `BASE_URL=http://localhost:4201`

There are few ways to run/debug the tests:

1. Via VS Code "Testing" For more info please refer to https://playwright.dev/docs/getting-started-vscode
2. `npm run test` For more info please refer to https://playwright.dev/docs/running-tests
3. `npm run test:demo` Runs tests on demo site

## Structure

```

|- config # Configuration files, global variables, types, etc.
|- extensions # Chrome extensions folder that is being created before test run
|- fixtures # Test fixtures
|- helpers # Helper methods, locators, utils
|- page-object # Pages and components of dynamic and other sites like socials (e.g. google, github) and wallets (e.g. metamask, phantom)
|- setup # Global setup
|- test-results # Artifacts
|- tests
|- playwright.config.ts # File for playwright framework configurations (e.g. testDir, base url, browser viewport)

```

## Fixtures

Playwright Test is based on the concept of test fixtures. Test fixtures are used to establish the environment for each test, giving the test everything it needs and nothing else. Test fixtures are isolated between tests. With fixtures, you can group tests based on their meaning, instead of their common setup.
For more info please refer to https://playwright.dev/docs/test-fixtures

Example

```
import { base } from './baseFixture';
import { chromium } from '@playwright/test';

export const metamaskBase = base.extend({
  context: async ({}, use) => {
    const pathToMetamask = require('path').join(
      __dirname,
      '..',
      'extensions/metamask',
    );

    const userDataDir = '';

    const browserContext = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToMetamask}`,
        `--load-extension=${pathToMetamask}`,
      ],
    });

    await Promise.all([browserContext.waitForEvent('page')]);

    await use(browserContext);
    await browserContext.close();
  },
});
```

## Wallet Extensions

Extensions are downloaded in `setup/globalSetup.ts` as crx files, unzipped and stored in `extensions` folder.
If the `extensions` folder is not empty, new extensions will not be downloaded. So to download the latest extensions you should clean this folder

### Adding an extension

1. Get the namespace of the extension from google chrome store

2. Add namespace to `extensions` object in `setup/globalSetup.ts`

```

const extensions = {
metemask: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
...
}

```

3. Create extension path in `context` fixture in `fixtures/baseFixtures.ts`

```

const pathToMetamask = require('path').join(
\_\_dirname,
'..',
'extensions/metamask',
);

```

4. Add path to `browserContext` in `context` fixture

```

const browserContext = await chromium.launchPersistentContext(userDataDir, {
headless: false,
args: [
`--disable-extensions-except=${pathToMetamask}`,
`--load-extension=${pathToMetamask}`,
],
});

```

## Wallet's E2E objects

The wallets objects that used to wrap the different interactions with the wallets are stored in `page-objects/wallets`. Every wallet is a folder with the following structure

```

|- wallets
|- metamask
|---metamask.ts
|-- metamaskHelper.ts
```

The core file `metamask.ts` contains locators and methods that directly interact with the extension’s UI elements, performing tasks such as filling in passwords and clicking buttons.
The helper class `metamaskHelper.ts` manages higher-level wallet interactions by utilizing `metamask.ts`, providing key methods for wallet creation, connection, transaction signing, and more.

### How to add a new wallet

1. Create wallet folder in `page-objects/wallets` with two files: core file and helper file

```
|- page-objects
  |- wallets
    |- metamask
      |- metamask.ts
      |- metamaskHelper.ts
```

2. Write logic in the core file (see metamask.ts file for the reference)

```
class MetamaskPage extends Base {
  constructor() {
    ...
  }
  async makeSureMetamaskLoaded {
    ...
  }
  ...
}
```

3. Add the wallet extension page to the
   `ExtensionPage` type in `config/typesAndConstants.ts`

```
import { MetamaskPage } from '../page-objects/wallets/metamask/metamask';
...
export type ExtensionPage = MetamaskPage | {Other extension pages};
```

4. Update the `WALLET_NAME` enum with the new values in `config/typesAndConstants.ts`

```
export enum WALLET_NAME {
  METAMASK = 'metamask',
  ...
}
```

5. Map the wallet constant to the wallet page instance in `getExtensionPageInstance` method in `helpers/extensions.ts`

```
import { MetamaskPage } from '../page-objects/wallets/metamask/metamask';
...
export const getExtensionPageInstance = async (context, walletName, path) => {
  ...
const WALLET_PAGES = {
  [WALLET_NAME.METAMASK]: MetamaskPage,
} as const;
  ...
}
```

6. Add logic in the helper file (see metamaskHelper.ts file for the reference). If needed add extension paths
   to `EXTENSION_PATHS` object in `config/typesAndConstants.ts`

7. Create wallet fixture in `fixtures/baseFixture.ts` We define the base fixture type that will be extended across tests. In this type, we specify the wallets that will be used in the tests. Other wallets can be added as needed

```
   import { Metamask } from '../page-objects/wallets/metamask/metamaskHelper';
   ...
   type BaseFixture = {
     metamask: Metamask;
     ...
   };
```

This fixture sets up a Metamask instance that can be used across multiple tests. It creates a new Metamask instance with the current page and browser context

```
...
export const base = test.extend<BaseFixture>({
  ...
  metamask: async ({ page, context }, use) => {
    await use(new Metamask(page, context));
  },
  ...
})
```

8. Now you can use wallets fixture in spec files

```
import { base as test } from '../../fixtures/baseFixture';
import { HomePage } from '../../page-objects/homePage';

test(`authenticate with metamask`, async ({
  connectWalletPage,
  metamask,
  page,
}) => {
  await metamask.createWallet();
  const homepage = new HomePage(page);
  await homepage.continueWithWalletBtn.click();
  await metamask.connectWallet();
  await connectWalletPage.optionallyPassKycForm();
  await metamask.confirmWalletType(homepage.activeWalletInfo);
});
```
