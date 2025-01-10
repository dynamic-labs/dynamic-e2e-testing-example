import { magicEdenFixture as test } from '../../fixtures/magicEdenFixture';
import { CHAINS } from '../../config/typesAndConstants';
import { HomePage } from '../../page-objects/homePage';

test.describe('authenticate with magic eden wallet', () => {
  const testCases = [
    {
      chain: CHAINS.EVM,
    },
    {
      chain: CHAINS.SOLANA,
    },
  ];

  testCases.forEach((testCase) => {
    test(`authenticate with ${testCase.chain}`, async ({
      connectWalletPage,
      magicEden,
      page,
    }) => {
      await magicEden.createWallet();
      const homepage = new HomePage(page);
      await homepage.continueWithWalletBtn.click();
      await magicEden.connectWallet({ chain: testCase.chain });
      await connectWalletPage.optionallyPassKycForm();
      await magicEden.confirmWalletType(homepage.activeWalletInfo);
    });
  });
});
