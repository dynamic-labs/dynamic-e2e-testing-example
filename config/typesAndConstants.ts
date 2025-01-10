import { Locator } from '@playwright/test';
import { MagicEdenPage } from '../page-objects/wallets/magicEden/magicEden';
import { MetamaskPage } from '../page-objects/wallets/metamask/metamask';
import { PhantomPage } from '../page-objects/wallets/phantom/phantom';

export type ExtensionPage = MetamaskPage | PhantomPage | MagicEdenPage;

export type connectWalletOptions = {
  willSignRequest?: boolean;
  chain?: string;
  metamaskAccount?: Locator;
  isNewWallet?: boolean;
  isConnectOnly?: boolean;
  isFirstConnect?: boolean;
};

export interface Wallet {
  createWallet(): Promise<ExtensionPage>;
  importWallet(): Promise<ExtensionPage>;
  connectWallet(): void;
  signRequest(): void;
  cancelRequest(): void;
  switchNetwork(): void;
  confirmWalletType(wallet: Locator): void;
}

export type signMessage = {
  signMessageEthers?: boolean;
};

export enum WALLET_NAME {
  METAMASK = 'metamask',
  PHANTOM = 'phantom',
  MAGIC_EDEN = 'magiceden',
}

export const WALLET_PAGES = {
  [WALLET_NAME.METAMASK]: MetamaskPage,
  [WALLET_NAME.PHANTOM]: PhantomPage,
  [WALLET_NAME.MAGIC_EDEN]: MagicEdenPage,
} as const;

export const EXTENSION_PATHS = {
  ONBOARDING: 'onboarding',
  REQUEST: 'request.html',
  HOME: 'home',
  NOTIFICATION: 'notification',
};

export const CHAINS = {
  SOLANA: 'solana',
  EVM: 'ethereum',
};
