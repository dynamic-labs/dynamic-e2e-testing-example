import { base as test } from '../../fixtures/baseFixture';
import { HomePage } from '../../page-objects/homePage';

test('authenticate with phantom', async ({
  connectWalletPage,
  phantom,
  page,
}) => {
  await phantom.createWallet();
  await phantom.page.pause()

  const homepage = new HomePage(page);
  await homepage.continueWithWalletBtn.click();
  await phantom.connectWallet();
  await connectWalletPage.optionallyPassKycForm();
  await phantom.confirmWalletType(homepage.activeWalletInfo);
});
