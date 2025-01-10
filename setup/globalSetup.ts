import * as fs from 'fs';
import { downloadFile } from '../helpers/api/downloadFile';
import { TextEncoder, TextDecoder } from 'text-encoding';
import unzip from 'unzip-crx-3';
import { downloadAndInstallExtensionMetamask } from './exensionsHelpers';
import { WALLET_NAME } from '../config/typesAndConstants';
require('dotenv').config();

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const extensionsFolder = './extensions';
const extensions = {
  phantom: 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
  magiceden: 'mkpegjkblkkefacfnmkajcjmabijhclg',
};

async function globalSetup() {
  try {
    if (!fs.existsSync(extensionsFolder)) {
      fs.mkdirSync(extensionsFolder);
    }
  } catch (err) {
    console.error(err);
  }

  for (const [name, id] of Object.entries(extensions)) {
    const extensionExists = fs.existsSync(`./extensions/${name}`);

    if (!extensionExists) {
      const url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=101&acceptformat=crx2,crx3&x=id%3D${id}%26uc`;
      const targetFile = `${extensionsFolder}/${name}.crx`;
      await downloadFile(url, targetFile);
      console.log(`Downloaded ${name} extension to ./extensions`);
      await unzip(targetFile);
    }
  }
  if (!fs.existsSync(`${extensionsFolder}/${WALLET_NAME.METAMASK}`)) {
    await downloadAndInstallExtensionMetamask();
  }
}

export default globalSetup;
