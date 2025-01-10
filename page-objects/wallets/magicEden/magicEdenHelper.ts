import { Base } from '../../base';
import {
  WALLET_NAME,
  Wallet,
  connectWalletOptions,
  CHAINS,
  EXTENSION_PATHS,
} from '../../../config/typesAndConstants';
import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { LOCATORS } from '../../../helpers/locators';
import { getExtensionPageInstance } from '../../../helpers/extensions';
import { MagicEdenPage } from './magicEden';

export class MagicEden extends Base implements Wallet {
  readonly magiceden = 'magiceden';
  readonly connectWalletButton: Locator;
  readonly locatorChain: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.connectWalletButton = page
      .getByTestId(LOCATORS.WALLET_LIST_ITEM)
      .getByTestId(`wallet-icon-${this.magiceden}`);
    this.locatorChain = page.locator(LOCATORS.CHAIN_CARD);
  }

  async createWallet(): Promise<MagicEdenPage> {
    await this.page.waitForTimeout(2000);
    const magicEdenPage = await this.getMagicEdenPage(
      EXTENSION_PATHS.ONBOARDING,
    );
    await magicEdenPage.createNewWallet();
    return magicEdenPage;
  }

  async connectWallet(options: connectWalletOptions = {}) {
    const {
      willSignRequest = true,
      chain = CHAINS.SOLANA,
      isConnectOnly = false,
    } = options;
    await this.page.bringToFront();
    await this.connectWalletButton.click();
    await this.locatorChain.getByTestId(`iconic-${chain}`).click();
    if (chain == CHAINS.EVM) await this.continueWithMagicEden();
    let magicEdenPage = await this.getMagicEdenPage(EXTENSION_PATHS.REQUEST);
    await magicEdenPage.clickApproveBtn('Connect');

    if (!willSignRequest || isConnectOnly) return;

    await this.waitForPopUp(this.context!);
    await this.signRequest();
  }

  async signRequest() {
    await this.page.waitForTimeout(1000);
    let magicEdenPage = await this.getMagicEdenPage(EXTENSION_PATHS.REQUEST);
    await magicEdenPage.clickApproveBtn('Sign');
    await this.page.bringToFront();
  }

  async continueWithMagicEden() {
    let magicEdenPage = await this.getMagicEdenPage(EXTENSION_PATHS.REQUEST);
    await magicEdenPage.continueWMagicEdenBtn.click();
    await this.page.bringToFront();
  }

  async confirmWalletType(wallet: Locator) {
    await expect(wallet).toBeVisible();
  }

  cancelRequest(): void {
    throw new Error('Method not implemented.');
  }
  switchNetwork(): void {
    throw new Error('Method not implemented.');
  }
  importWallet(): Promise<MagicEdenPage> {
    throw new Error('Method not implemented.');
  }

  private async getMagicEdenPage(path: string): Promise<MagicEdenPage> {
    await this.page.waitForTimeout(2000);
    return (await getExtensionPageInstance(
      this.context!,
      WALLET_NAME.MAGIC_EDEN,
      path,
    )) as MagicEdenPage;
  }
}
