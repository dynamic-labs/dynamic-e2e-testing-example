import { Locator, Page } from '@playwright/test';
import { Base } from './base';

export class ConnectWalletPage extends Base {
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async optionallyPassKycForm() {
    try {
      await this.continueButton.click({ timeout: 3000 });
    } catch {}
  }
}
