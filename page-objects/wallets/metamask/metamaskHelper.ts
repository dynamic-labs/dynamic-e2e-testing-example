import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { Base } from '../../base';
import { MetamaskPage } from './metamask';
import ENV from '../../../config/env';
import { getExtensionPageInstance } from '../../../helpers/extensions';
import {
  Wallet,
  connectWalletOptions,
  WALLET_NAME,
  EXTENSION_PATHS,
} from '../../../config/typesAndConstants';
import { LOCATORS } from '../../../helpers/locators';

export class Metamask extends Base implements Wallet {
  readonly connectWalletButton: Locator;
  readonly walletIcon = 'wallet-icon-metamask';

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.connectWalletButton = page
      .getByTestId(LOCATORS.WALLET_LIST_ITEM)
      .getByTestId(this.walletIcon);
  }

  async importWallet(
    recoveryPhrase: string = ENV.METAMASK_RECOVERY,
  ): Promise<MetamaskPage> {
    const metamaskPage = await this.getMetamaskPage(EXTENSION_PATHS.HOME);
    await metamaskPage.importWallet(recoveryPhrase, ENV.WALLET_PASSWORD);

    return metamaskPage;
  }

  async createWallet(): Promise<MetamaskPage> {
    const metamaskPage = await this.getMetamaskPage(EXTENSION_PATHS.HOME);
    await metamaskPage.createNewWallet(ENV.WALLET_PASSWORD);
    return metamaskPage;
  }

  async connectWallet(options: connectWalletOptions = {}) {
    const {
      metamaskAccount,
      willSignRequest = true,
      isNewWallet = true,
      isConnectOnly = false,
    } = options;
    if (isNewWallet) {
      await this.page.bringToFront();
      await this.connectWalletButton.click();
      if (metamaskAccount) {
        const metamaskPage = await this.getMetamaskPage(EXTENSION_PATHS.HOME);
        await metamaskPage.changeAccounts(metamaskAccount, {
          willSignRequest,
          isConnectOnly,
        });
      } else {
        await this.connectAccount();
      }
    }
    if (willSignRequest && !isConnectOnly) {
      await this.signRequest();
    }
  }

  async confirmWalletType(wallet: Locator) {
    await expect(wallet.getByTestId(this.walletIcon)).toBeVisible();
  }

  async signRequest() {
    await this.page.waitForTimeout(2000);
    const metamaskPage = await this.getMetamaskPage(
      EXTENSION_PATHS.NOTIFICATION,
    );
    await metamaskPage.signButton.click();
  }

  async connectAccount(): Promise<MetamaskPage> {
    await this.page.waitForTimeout(2000);
    const metamaskPage = await this.getMetamaskPage(
      EXTENSION_PATHS.NOTIFICATION,
    );
    await metamaskPage.connectAccount();
    return metamaskPage;
  }

  async getByText(text: string): Promise<Locator> {
    await this.page.waitForTimeout(2000);
    const metamaskPage = await this.getMetamaskPage(
      EXTENSION_PATHS.NOTIFICATION,
    );
    return metamaskPage.page.getByText(text);
  }

  async switchNetwork() {
    await this.page.waitForTimeout(2000);
    const metamaskPage = await this.getMetamaskPage(
      EXTENSION_PATHS.NOTIFICATION,
    );
    await metamaskPage.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    await metamaskPage.switchNetwork();
  }

  cancelRequest(): void {
    throw new Error('Method not implemented.');
  }

  async enableTestNetworks(): Promise<void> {
    const metamaskPage = await this.getMetamaskPage(EXTENSION_PATHS.HOME);
    await metamaskPage.enableTestNetworks();
  }

  async switchNetworkInExtension(networkFullName = 'Linea Mainnet') {
    const metamaskPage = await this.getMetamaskPage(EXTENSION_PATHS.HOME);
    await metamaskPage.switchNetworkInExtension(networkFullName);
  }

  async getPublicAddress() {
    const metamaskPage = await this.getMetamaskPage(EXTENSION_PATHS.HOME);
    return await metamaskPage.getPublicAddress();
  }

  async unlockWalletInPopup() {
    await this.page.waitForTimeout(2000);
    const metamaskPage = await this.getMetamaskPage(
      EXTENSION_PATHS.NOTIFICATION,
    );
    return await metamaskPage.unlock(ENV.WALLET_PASSWORD);
  }

  async getMetamaskPage(path: string): Promise<MetamaskPage> {
    return (await getExtensionPageInstance(
      this.context!,
      WALLET_NAME.METAMASK,
      path,
    )) as MetamaskPage;
  }
}
