import { BrowserContext, Locator, Page } from '@playwright/test';
import { Base } from '../../base';
import { timeouts } from '../../../helpers/timeouts';
import { getExtensionBaseUrl } from '../../../helpers/extensions';
import { WALLET_NAME } from '../../../config/typesAndConstants';

export class PhantomPage extends Base {
  readonly importWalletButton: Locator;
  readonly createNewWalletButton: Locator;
  readonly recoveryPhraseInputs: Locator;
  readonly createPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly agreeToCreatePasswordTermsButton: Locator;
  readonly continueButton: Locator;
  readonly accountMultiselect: Locator;
  readonly onboardingCompleteText: Locator;
  readonly followTwitterButton: Locator;
  readonly confirmPhraseSaveCheckbox: Locator;
  readonly primaryButton: Locator;
  readonly secondaryButton: Locator;
  readonly settingsSidebarOpenButton: Locator;
  readonly settingsMenuButton: Locator;
  readonly defaultAppWalletSettingsButton: Locator;
  readonly metamaskAsDefaultWalletButton: Locator;
  readonly phantomAsDefaultWalletButton: Locator;
  readonly viewAccountsButton: Locator;
  readonly preferencesButton: Locator;
  readonly ethereumChain: Locator;
  readonly addAccountBtn: Locator;
  readonly createNewAccountBtn: Locator;
  readonly connectedApps: Locator;
  readonly trustedAppsRow: Locator;
  readonly disconnectBtn: Locator;
  readonly backBtn: Locator;
  readonly createManualSeedPhrase: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.importWalletButton = page.getByRole('button', {
      name: 'I already have a wallet',
    });
    this.createNewWalletButton = page.getByRole('button', {
      name: 'Create a new wallet',
    });
    this.recoveryPhraseInputs = page.locator(
      '//input[contains(@data-testid, "secret-recovery-phrase-word-input")]',
    );
    this.createPasswordInput = page.getByTestId(
      'onboarding-form-password-input',
    );
    this.confirmPasswordInput = page.getByTestId(
      'onboarding-form-confirm-password-input',
    );
    this.confirmPasswordInput = page.getByTestId(
      'onboarding-form-confirm-password-input',
    );
    this.agreeToCreatePasswordTermsButton = page.getByTestId(
      'onboarding-form-terms-of-service-checkbox',
    );
    this.continueButton = page.getByTestId('onboarding-form-submit-button');
    this.accountMultiselect = page.getByTestId('account-multiselect');
    this.onboardingCompleteText = page.getByText('all done!');
    this.followTwitterButton = page.getByTestId('onboarding-twitter-button');
    this.confirmPhraseSaveCheckbox = page.getByTestId(
      'onboarding-form-saved-secret-recovery-phrase-checkbox',
    );
    this.primaryButton = page.getByTestId('primary-button');
    this.secondaryButton = page.getByTestId('secondary-button');
    this.settingsSidebarOpenButton = page.getByTestId(
      'settings-menu-open-button',
    );
    this.settingsMenuButton = page.getByTestId('sidebar_menu-button-settings');
    this.defaultAppWalletSettingsButton = page.getByTestId(
      'settings-item-metamask-override',
    );
    this.metamaskAsDefaultWalletButton = page.getByTestId(
      'metamask-override--USE_METAMASK',
    );
    this.phantomAsDefaultWalletButton = page.getByTestId(
      'metamask-override--USE_PHANTOM',
    );
    this.viewAccountsButton = page.getByTestId(
      'onboarding-form-submit-button-multichain',
    );
    this.preferencesButton = page.getByTestId('settings-item-preferences');
    this.ethereumChain = page.getByTestId('fungible-token-row-ETH');
    this.addAccountBtn = page.getByTestId('sidebar_menu-button-add_account');
    this.createNewAccountBtn = page.getByTestId(
      'add-account-create-new-wallet-button',
    );
    this.connectedApps = page.getByTestId('settings-item-trusted-apps');
    this.trustedAppsRow = page.getByTestId('trusted_apps_row-button');
    this.disconnectBtn = page.getByTestId('trusted-apps-revoke-button');
    this.backBtn = page.getByTestId('header--back');
    this.createManualSeedPhrase = page.getByTestId('create-manual-seed-phrase');
  }

  async makeSurePhantomLoaded() {
    await this.createNewWalletButton
      .waitFor({ timeout: timeouts.shortTimeout })
      .catch(async () => {
        await this.reloadPage(this.page);
        await this.page.waitForTimeout(timeouts.tinyTimeout);
      });
  }

  async createPassword(password: string) {
    await this.createPasswordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.agreeToCreatePasswordTermsButton.click();
  }

  async gotoHomePage() {
    const phantomURL = await getExtensionBaseUrl(this.page.url());
    await this.page.goto(`${phantomURL}/popup.html`);
  }

  async login(recoveryPhrase: string, password: string) {
    await this.makeSurePhantomLoaded();
    await this.importWalletButton.click();
    await this.typeRecoveryPhrase(this.recoveryPhraseInputs, recoveryPhrase);
    await this.continueButton.click();
    await this.viewAccountsButton.waitFor();
    await this.continueButton.click();
    await this.createPassword(password);
    await this.continueButton.click();
    await this.onboardingCompleteText.waitFor();
    await this.gotoHomePage();
  }

  async createNewWallet(password: string) {
    await this.makeSurePhantomLoaded();
    await this.createNewWalletButton.click();
    await this.createManualSeedPhrase.click();
    await this.createPassword(password);
    await this.continueButton.click();
    await this.confirmPhraseSaveCheckbox.click();
    await this.continueButton.click();
    await this.onboardingCompleteText.waitFor();
    await this.gotoHomePage();
  }

  async connectAccount() {
    const phantomSignPage = new PhantomPage(
      await this.openNewPageByClick(this.context!, this.primaryButton),
      this.context!,
    );
    await phantomSignPage.primaryButton.click();
  }

  async selectDefaultWallet(wallet: string) {
    await this.settingsSidebarOpenButton.click();
    await this.settingsMenuButton.click();
    await this.preferencesButton.click();
    await this.defaultAppWalletSettingsButton.click();

    switch (wallet) {
      case WALLET_NAME.METAMASK:
        await this.metamaskAsDefaultWalletButton.click();
        break;
      case WALLET_NAME.PHANTOM:
        await this.phantomAsDefaultWalletButton.click();
        break;
    }

    await this.page.reload();
  }

  async selectEthereumChain() {
    await this.ethereumChain.click();
    await this.backBtn.click();
  }

  async addAccount() {
    await this.settingsSidebarOpenButton.click();
    await this.addAccountBtn.click();
    await this.createNewAccountBtn.click();
    await this.primaryButton.click();
  }

  async switchToAccount(accountName: string) {
    await this.settingsSidebarOpenButton.click();
    await this.page
      .locator(
        `//div[@data-testid="tooltip_interactive-wrapper"][.//*[contains(text(),"${accountName}")]]`,
      )
      .click();
  }

  async disconnectAccount() {
    await this.settingsSidebarOpenButton.click();
    await this.settingsMenuButton.click();
    await this.connectedApps.click();
    await this.trustedAppsRow.click();
    await this.disconnectBtn.click();
    await this.disconnectBtn.waitFor({ state: 'hidden' });
    await this.page.waitForTimeout(1000);
  }
}
