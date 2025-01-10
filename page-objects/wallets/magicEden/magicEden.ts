import { BrowserContext, Locator, Page } from '@playwright/test';
import { Base } from '../../base';
import ENV from '../../../config/env';

export class MagicEdenPage extends Base {
  readonly createWalletButton: Locator;
  readonly passwordInputLocator: Locator;
  readonly continueBtnPassword: Locator;
  readonly confirmPasswordInputLocator: Locator;
  readonly continueBtn: Locator;
  readonly continueWMagicEdenBtn: Locator;
  readonly accountInfoTextInModal: Locator;
  readonly approveBtn: Locator;
  readonly learnMoreText: Locator;
  readonly wantsToSignText: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.createWalletButton = page.getByText('Create New Wallet');
    this.continueBtnPassword = page.getByTestId('confirm-password');
    this.passwordInputLocator = page.getByPlaceholder(
      'Enter a unique password',
    );
    this.confirmPasswordInputLocator = page.getByPlaceholder(
      'Enter the password again',
    );

    this.continueBtn = page.getByText('Continue');
    this.continueWMagicEdenBtn = page.getByText('Continue with Magic Eden');
    this.approveBtn = page.getByTestId('approve-button');
    this.accountInfoTextInModal = page.getByText('Account', { exact: true });
    this.learnMoreText = page.getByText('Learn More');
    this.wantsToSignText = page.getByText('wants you to sign');
  }

  async createNewWallet() {
    await this.createWalletButton.click();
    await this.passwordInputLocator.fill(ENV.WALLET_PASSWORD);
    await this.continueBtnPassword.click();
    await this.page.waitForTimeout(500);
    await this.confirmPasswordInputLocator.fill(ENV.WALLET_PASSWORD);
    await this.continueBtnPassword.click();
  }

  async clickApproveBtn(buttonName: string) {
    const locator = this.approveBtn.getByText(buttonName);
    await this.page.bringToFront();
    await this.accountInfoTextInModal.waitFor();

    if (buttonName === 'Sign') {
      await this.wantsToSignText.waitFor({ timeout: 3000 });
    } else {
      await this.learnMoreText.waitFor({ timeout: 3000 });
    }

    await locator.waitFor();
    await this.page.waitForTimeout(1000);
    await locator.click();
  }
}
