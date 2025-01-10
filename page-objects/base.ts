import { BrowserContext, Locator, Page } from '@playwright/test';
import { timeouts } from '../helpers/timeouts';

export class Base {
  readonly page: Page;
  readonly context?: BrowserContext;
  readonly isMobile: boolean;

  constructor(page: Page, context?: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async reloadPage(page: Page) {
    await page.reload({ waitUntil: 'load' });
  }

  async openNewPageByClick(context: BrowserContext, locator: Locator) {
    await locator.click();
    return this.waitForPage(context);
  }

  async waitForPage(context: BrowserContext) {
    return await context.waitForEvent('page');
  }

  async typeRecoveryPhrase(
    recoveryPhraseInputs: Locator,
    recoveryPhrase: string,
  ) {
    const phraseWords = recoveryPhrase.split(' ');

    for (let i = 0; i < phraseWords.length; i++) {
      await recoveryPhraseInputs.nth(i).fill(phraseWords[i]);
    }
  }

  async waitForPopUp(
    context: BrowserContext,
    timeout = timeouts.timeoutForSignWindow,
  ) {
    try {
      return await context.waitForEvent('page', {
        timeout,
      });
    } catch {}
  }
}
