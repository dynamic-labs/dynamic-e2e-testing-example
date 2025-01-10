import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { Base } from '../../base';
import { PhantomPage } from './phantom';
import ENV from '../../../config/env';
import { getExtensionPageInstance } from '../../../helpers/extensions';
import {
  WALLET_NAME,
  Wallet,
  connectWalletOptions,
  EXTENSION_PATHS,
  CHAINS,
} from '../../../config/typesAndConstants';
import { LOCATORS } from '../../../helpers/locators';

export class Phantom extends Base implements Wallet {
  readonly connectWalletButton: Locator;
  readonly connectEvmWalletButton: Locator;
  readonly connectBtnSolanaChain: Locator;
  readonly connectBtnEvmChain: Locator;
  readonly locatorChain: Locator;
  readonly phantomEvm = 'phantomevm';

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.connectWalletButton = page
      .getByTestId(LOCATORS.WALLET_LIST_ITEM)
      .getByTestId(`wallet-icon-${WALLET_NAME.PHANTOM}`);

    this.connectEvmWalletButton = page
      .getByTestId(LOCATORS.WALLET_LIST_ITEM)
      .getByTestId(`wallet-icon-${this.phantomEvm}`);
    this.locatorChain = page.locator(LOCATORS.CHAIN_CARD);
    this.connectBtnSolanaChain = this.locatorChain.getByTestId(
      `iconic-${CHAINS.SOLANA}`,
    );
    this.connectBtnEvmChain = this.locatorChain.getByTestId(
      `iconic-${CHAINS.EVM}`,
    );
  }

  async importWallet(): Promise<PhantomPage> {
    const phantomPage = await this.getPhantomPage(EXTENSION_PATHS.ONBOARDING);
    await phantomPage.login(ENV.PHANTOM_RECOVERY, ENV.WALLET_PASSWORD);
    return phantomPage;
  }

  async createWallet(): Promise<PhantomPage> {
    const phantomPage = await this.getPhantomPage(EXTENSION_PATHS.ONBOARDING);
    await phantomPage.createNewWallet(ENV.WALLET_PASSWORD);
    return phantomPage;
  }

  async connectWallet(options: connectWalletOptions = {}) {
    const {
      isNewWallet = true,
      isFirstConnect = false,
      chain = CHAINS.SOLANA,
      isConnectOnly = false,
    } = options;
    await this.page.bringToFront();
    await this.connectWalletButton.click();

    const phantomPage = new PhantomPage(
      await this.openNewPageByClick(
        this.context!,
        this.locatorChain.getByTestId(`iconic-${chain}`),
      ),
      this.context!,
    );

    if (isNewWallet && !isConnectOnly) {
      await phantomPage.connectAccount();
    } else {
      await phantomPage.primaryButton.click();

      if (isFirstConnect && !isConnectOnly) {
        await this.signRequest();
      }
    }
  }

  async signRequest() {
    await this.context!.waitForEvent('page');
    const phantomPage = await this.getPhantomPage(EXTENSION_PATHS.NOTIFICATION);
    await phantomPage.primaryButton.click();
  }

  async cancelRequest() {
    await this.page.waitForTimeout(2000);
    const phantomPage = await this.getPhantomPage(EXTENSION_PATHS.NOTIFICATION);
    await phantomPage.secondaryButton.click();
  }

  async confirmWalletType(wallet: Locator) {
    await expect(wallet.getByTestId('wallet-icon-phantom')).toBeVisible();
  }

  switchNetwork(): void {
    throw new Error('Method not implemented.');
  }

  private async getPhantomPage(path: string): Promise<PhantomPage> {
    return (await getExtensionPageInstance(
      this.context!,
      WALLET_NAME.PHANTOM,
      path,
    )) as PhantomPage;
  }
}
