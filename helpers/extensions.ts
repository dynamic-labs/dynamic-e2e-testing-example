import { BrowserContext } from '@playwright/test';
import {
  ExtensionPage,
  WALLET_NAME,
  WALLET_PAGES,
} from '../config/typesAndConstants';

export const getExtensionPageInstance = async (
  context: BrowserContext,
  walletName: WALLET_NAME,
  path: string,
): Promise<ExtensionPage> => {
  const pages = await Promise.all(
    context.pages().map(async (page) => {
      const title = await page.title();
      const url = page.url();
      return { page, title, url };
    }),
  );

  const page = pages.find((page) => {
    return (
      page.title.toLowerCase().includes(getNormalizedWalletNameForTitle(walletName)) &&
      page.url.includes(path)
    );
  })?.page;

  const PageConstructor = WALLET_PAGES[walletName];
  return new PageConstructor(page!, context);
};

export const getExtensionBaseUrl = async (url: string) => {
  return url.substring(0, 51);
};

export const getNormalizedWalletNameForTitle = (
  walletName: WALLET_NAME,
): string => {
  return walletName === WALLET_NAME.MAGIC_EDEN ? 'magic eden' : walletName;
};
