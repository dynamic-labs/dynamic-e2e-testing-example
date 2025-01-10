import { Page, Locator } from '@playwright/test';
import { Base } from './base';

export class HomePage extends Base {
  readonly activeWalletInfo: Locator;
  readonly continueWithWalletBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.continueWithWalletBtn = page.getByRole('button', {
      name: 'Continue with a wallet',
    });
    this.activeWalletInfo = page.getByTestId('active-wallet-information');
  }
}
