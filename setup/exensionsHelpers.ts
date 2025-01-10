import { downloadFile } from '../helpers/api/downloadFile';
import ENV from '../config/env';
import unzip from 'unzip-crx-3';
import { WALLET_NAME } from '../config/typesAndConstants';

export const downloadAndInstallExtension = async (
  extensionName: string,
  downloadLink: string,
) => {
  const name = extensionName.toLowerCase();
  const extensionsFolder = './extensions';
  const pathToDownloadExtension = `${extensionsFolder}/${name}.zip`;

  try {
    // Download extension
    await downloadFile(downloadLink, pathToDownloadExtension);

    // Unzip extension
    await unzip(pathToDownloadExtension);

    // Log success message
    console.log(`Downloaded ${name} extension to ${extensionsFolder}`);
  } catch (error) {
    // Handle errors
    console.error(`Error downloading or installing ${name} extension:`, error);
  }
};

export const downloadAndInstallExtensionMetamask = async () => {
  await downloadAndInstallExtension(
    WALLET_NAME.METAMASK,
    ENV.METAMASK_LINK_V11_13_1,
  );
};
