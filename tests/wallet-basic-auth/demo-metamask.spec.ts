import { base as test } from '../../fixtures/baseFixture';
import { HomePage } from '../../page-objects/homePage';

test(`authenticate with metamask`, async ({
  connectWalletPage,
  metamask,
  page,
}) => {
  await metamask.createWallet();
  const homepage = new HomePage(page);
  await homepage.continueWithWalletBtn.click();
  await metamask.connectWallet();
  await connectWalletPage.optionallyPassKycForm();
  await metamask.confirmWalletType(homepage.activeWalletInfo);
});
