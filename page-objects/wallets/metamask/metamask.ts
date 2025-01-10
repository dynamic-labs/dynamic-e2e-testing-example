import { BrowserContext, Locator, Page } from '@playwright/test';
import { Base } from '../../base';
import { timeouts } from '../../../helpers/timeouts';
import { connectWalletOptions } from '../../../config/typesAndConstants';

export class MetamaskPage extends Base {
  readonly importWalletButton: Locator;
  readonly createNewWalletButton: Locator;
  readonly onboardingTermsCheckbox: Locator;
  readonly agreeToTermsButton: Locator;
  readonly recoveryPhraseInputXpath: string;
  readonly recoveryPhraseInputs: Locator;
  readonly confirmRecoveryPhraseButton: Locator;
  readonly createPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly agreeToCreatePasswordTermsButton: Locator;
  readonly createPasswordButton: Locator;
  readonly createPasswordForNewWalletButton: Locator;
  readonly secureWalletLaterButton: Locator;
  readonly confirmSecureLaterCheckbox: Locator;
  readonly skipSecurityButton: Locator;
  readonly completeOnboardingButton: Locator;
  readonly pinExtensionsNextButton: Locator;
  readonly pinExtensionDoneButton: Locator;
  readonly selectAllAccountsCheckbox: Locator;
  readonly popupNextButton: Locator;
  readonly connectWalletButton: Locator;
  readonly signButton: Locator;
  readonly cancelConnectWalletButton: Locator;
  readonly popoverCloseButton: Locator;
  readonly accountMenuButton: Locator;
  readonly openAccountMenuButton: Locator;
  readonly openAccountCreatePageButton: Locator;
  readonly createAccountButton: Locator;
  readonly firstAccount: Locator;
  readonly secondAccount: Locator;
  readonly thirdAccount: Locator;
  readonly activityTab: Locator;
  readonly signatureRequestActivity: Locator;
  readonly accountAddress: Locator;
  readonly lockButton: Locator;
  readonly unlockPasswordInput: Locator;
  readonly unlockButton: Locator;
  readonly accountOptionsMenuButton: Locator;
  readonly connectedSitesOptionButton: Locator;
  readonly disconnectFromSiteButton: Locator;
  readonly confirmDisconnectButton: Locator;
  readonly approveButton: Locator;
  readonly switchNetworkButton: Locator;
  readonly newAccountCreateForm: Locator;
  readonly importAccountForm: Locator;
  readonly importAccountConfirmBtn: Locator;
  readonly importAccountBtn: Locator;
  readonly accountLocator: string;
  readonly extensionNetworkController: Locator;
  readonly extensionAccountOptionsMenuButton: Locator;
  readonly extensionGotItButton: Locator;
  readonly allowSiteText: Locator;

  constructor(page: Page, context?: BrowserContext) {
    super(page, context);
    this.importWalletButton = page.getByTestId('onboarding-import-wallet');
    this.createNewWalletButton = page.getByTestId('onboarding-create-wallet');
    this.onboardingTermsCheckbox = page.getByTestId(
      'onboarding-terms-checkbox',
    );
    this.agreeToTermsButton = page.getByTestId('metametrics-i-agree');
    this.recoveryPhraseInputXpath = '//input[@type="password"]';
    this.recoveryPhraseInputs = page.locator(this.recoveryPhraseInputXpath);
    this.confirmRecoveryPhraseButton = page.getByTestId('import-srp-confirm');
    this.createPasswordInput = page.getByTestId('create-password-new');
    this.confirmPasswordInput = page.getByTestId('create-password-confirm');
    this.agreeToCreatePasswordTermsButton = page.getByTestId(
      'create-password-terms',
    );
    this.createPasswordButton = page.getByTestId('create-password-import');
    this.createPasswordForNewWalletButton = page.getByTestId(
      'create-password-wallet',
    );
    this.secureWalletLaterButton = page.getByTestId('secure-wallet-later');
    this.confirmSecureLaterCheckbox = page.getByTestId(
      'skip-srp-backup-popover-checkbox',
    );
    this.skipSecurityButton = page.getByTestId('skip-srp-backup');
    this.completeOnboardingButton = page.getByTestId(
      'onboarding-complete-done',
    );
    this.pinExtensionsNextButton = page.getByTestId('pin-extension-next');
    this.pinExtensionDoneButton = page.getByTestId('pin-extension-done');
    this.selectAllAccountsCheckbox = page.locator(
      '//input[contains(@class, "choose-account-list__header-check-box")]',
    );
    this.popupNextButton = page.getByRole('button', { name: 'Next' });
    this.connectWalletButton = page
      .getByTestId('page-container-footer-next')
      .getByText('Connect');
    this.signButton = page
      .getByTestId('page-container-footer-next')
      .getByText('Sign');
    this.cancelConnectWalletButton = page.getByTestId(
      'page-container-footer-cancel',
    );
    this.popoverCloseButton = page.getByTestId('popover-close');
    this.accountMenuButton = page.getByTestId('account-menu-icon');
    this.openAccountMenuButton = page.getByTestId(
      'multichain-account-menu-popover-action-button',
    );
    this.openAccountCreatePageButton = page.getByTestId(
      'multichain-account-menu-popover-add-account',
    );
    this.importAccountConfirmBtn = page.getByTestId(
      'import-account-confirm-button',
    );
    this.importAccountBtn = page.getByRole('button', {
      name: 'Import account',
    });
    this.importAccountForm = page.locator('#private-key-box');
    this.createAccountButton = page.getByRole('button', { name: 'Create' });
    this.accountLocator = '.multichain-account-list-item';
    this.firstAccount = page.locator(this.accountLocator).first();
    this.secondAccount = page.locator(this.accountLocator).nth(1);
    this.thirdAccount = page.locator(this.accountLocator).nth(2);
    this.activityTab = page.getByTestId('home__activity-tab');
    this.signatureRequestActivity = page.getByText('Signature request');
    this.accountAddress = page.getByTestId('address-copy-button-text');
    this.lockButton = page.getByTestId('global-menu-lock');
    this.unlockPasswordInput = page.getByTestId('unlock-password');
    this.unlockButton = page.getByTestId('unlock-submit');
    this.accountOptionsMenuButton = page.getByTestId(
      'account-options-menu-button',
    );
    this.connectedSitesOptionButton = page.getByTestId(
      'global-menu-connected-sites',
    );
    this.disconnectFromSiteButton = page.locator(
      '//a[contains(@class, "connected-sites-list__content-row-link-button")]',
    );
    this.confirmDisconnectButton = page.getByRole('button', {
      name: 'Disconnect',
    });
    this.approveButton = page.getByRole('button', { name: 'Approve' });
    this.switchNetworkButton = page.getByRole('button', {
      name: 'Switch network',
    });
    this.newAccountCreateForm = page.locator('.mm-input');

    this.extensionNetworkController = page.getByTestId('network-display');
    this.extensionAccountOptionsMenuButton = page.getByTestId(
      'account-options-menu-button',
    );

    this.extensionGotItButton = page.getByRole('button', {
      name: 'Got it',
    });
    this.allowSiteText = page.getByText('Allow this site');
  }

  async getPublicAddress(): Promise<string> {
    await this.page.waitForTimeout(1000);
    const publicAddress = (await this.accountAddress.textContent()) || '';

    return publicAddress.slice(0, 4) + '...' + publicAddress.slice(-4);
  }

  async makeSureMetamaskLoaded() {
    await this.importWalletButton
      .waitFor({ timeout: timeouts.shortTimeout })
      .catch(async () => {
        await this.reloadPage(this.page);
        await this.page.waitForTimeout(timeouts.tinyTimeout);
      });
    await this.onboardingTermsCheckbox.waitFor();
  }

  async createPassword(password: string) {
    await this.createPasswordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.agreeToCreatePasswordTermsButton.click();
  }

  async completeOnboarding() {
    await this.completeOnboardingButton.click();
    await this.pinExtensionsNextButton.click();
    await this.pinExtensionDoneButton.click();
  }

  async importWallet(recoveryPhrase: string, password: string) {
    await this.makeSureMetamaskLoaded();
    await this.onboardingTermsCheckbox.click();
    await this.importWalletButton.click();
    await this.agreeToTermsButton.click();
    await this.typeRecoveryPhrase(this.recoveryPhraseInputs, recoveryPhrase);
    await this.confirmRecoveryPhraseButton.click();
    await this.createPassword(password);
    await this.createPasswordButton.click();
    await this.completeOnboarding();
    await this.popoverCloseButton.click();
  }

  async enableTestNetworks() {
    await this.extensionAccountOptionsMenuButton.click();
    // Go to settings
    await this.page
      .getByRole('button', {
        name: 'Settings',
      })
      .click();
    // Go to advanced tab
    await this.page.getByRole('button', { name: 'Advanced' }).click();

    // Enable test networks
    await this.page
      .getByTestId('advanced-setting-show-testnet-conversion')
      .last()
      .locator('label')
      .click();

    // Close settings page
    await this.page
      .locator('.settings-page__header__title-container > button')
      .last()
      .click();
  }

  async createNewWallet(password: string) {
    await this.makeSureMetamaskLoaded();
    await this.onboardingTermsCheckbox.click();
    await this.createNewWalletButton.click();
    await this.agreeToTermsButton.click();
    await this.createPassword(password);
    await this.createPasswordForNewWalletButton.click();
    await this.secureWalletLaterButton.click();
    await this.confirmSecureLaterCheckbox.click();
    await this.skipSecurityButton.click();
    await this.completeOnboarding();
    await this.popoverCloseButton.click();
  }

  async createAccount() {
    await this.accountMenuButton.click();
    await this.openAccountMenuButton.click();
    await this.openAccountCreatePageButton.click();
    //get suggested account name from the placeholder and fill it in the form
    const accountName = await this.newAccountCreateForm.getAttribute(
      'Placeholder',
    );
    await this.newAccountCreateForm.fill(accountName);
    await this.createAccountButton.click();
  }

  async importAccount(importAccount: string) {
    await this.accountMenuButton.click();
    await this.openAccountMenuButton.click();
    await this.importAccountBtn.click();
    await this.importAccountForm.fill(importAccount);
    await this.importAccountConfirmBtn.click();
  }

  async switchAccount(account: Locator) {
    await this.accountMenuButton.click();
    await account.click();
  }

  async changeAccounts(account: Locator, options: connectWalletOptions = {}) {
    const { willSignRequest = true, isConnectOnly = false } = options;
    await this.switchAccount(account);
    if (!this.isMobile) {
      await this.activityTab.click();
      await this.signatureRequestActivity.click();
      if (willSignRequest && !isConnectOnly) {
        await this.signButton.click();
      } else {
        await this.cancelConnectWalletButton.click();
      }
    }
  }

  async connectAccount() {
    await this.popupNextButton.waitFor();

    if (await this.selectAllAccountsCheckbox.isVisible()) {
      await this.selectAllAccountsCheckbox.click();
    }
    await this.handleGotItButton();
    await this.popupNextButton.click();
    await this.connectWalletButton.click();
    await this.connectWalletButton.waitFor({ state: 'hidden' });
  }

  async lock() {
    await this.accountOptionsMenuButton.click();
    await this.lockButton.click();
  }

  async unlock(password: string) {
    await this.unlockPasswordInput.fill(password);
    await this.unlockButton.click();
  }

  async disconnectFromSite(account: Locator) {
    await this.switchAccount(account);
    await this.accountOptionsMenuButton.click();
    await this.connectedSitesOptionButton.click();
    await this.disconnectFromSiteButton.click();
    await this.confirmDisconnectButton.click();
  }

  async switchNetwork() {
    await this.allowSiteText.waitFor();
    await this.handleGotItButton();
    if (await this.approveButton.isVisible()) {
      await this.approveButton.click();
    }
    if (await this.popoverCloseButton.isVisible()) {
      await this.popoverCloseButton.click();
    }
    await this.switchNetworkButton.dblclick();
  }

  async switchNetworkInExtension(networkFullName = 'Linea Mainnet') {
    await this.page.bringToFront();
    await this.handleGotItButton();
    await this.extensionNetworkController.click();
    await this.page.getByText(networkFullName).click();
    await this.handleGotItButton();

    // wait for network connection
    await this.extensionNetworkController
      .getByText(networkFullName)
      .waitFor({ timeout: timeouts.shortTimeout });
  }

  async confirmNetworkChange() {
    await this.handleGotItButton();
    await this.switchNetworkButton.click();
  }

  async handleGotItButton() {
    try {
      await this.extensionGotItButton.waitFor({ timeout: 2500 });
    } catch {}
    if (await this.extensionGotItButton.isVisible()) {
      await this.extensionGotItButton.click();
    }
  }
}
