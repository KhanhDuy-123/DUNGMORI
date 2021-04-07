import { NativeModules } from 'react-native';
import fs from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Funcs from 'common/helpers/Funcs';
import Md5 from 'common/helpers/Md5';
import String from 'common/helpers/Strings';

const Aes = NativeModules.Aes;

const debug = true;
const salts = [];
let privateKey = '';
const iv = 'a303aadd5e5a09cfb89a69ed9b28dd6c';
let saltString = [
  '7d2b71e9e0d423dac8070ac42b2c67be',
  '24882896fb2678cf789e2e1961d52cdb',
  'bf254771a8d7670c97b9fa90fced2668',
  'afe82fb312623795f62b75056a2ef2b8',
  'a4da61093f9f012f24a342c70e47fd33'
];
saltString = saltString.map((item) => Md5(item));
saltString = saltString.join('');
updateSalts();

const specialChar = [`+`, `-`, `*`, '', ''];
const specialReplaceChar = ['0xp1L2u3S', '0xxa13hu3A4l', '0x70e47fd', '0xe1Q2u3A4l', '0xa4da6109', '0x3dac8070a'];

async function tests() {}
tests();

async function getPrivateKey() {
  if (!privateKey) privateKey = await Aes.pbkdf2(saltString.substr(5, 25), saltString, 5000, 256);
  return privateKey;
}

async function encryptText(text) {
  try {
    const key = await getPrivateKey();
    return await Aes.encrypt(text, key, iv);
  } catch (err) {
    console.log('ERROR', err);
  }
  return null;
}

async function decryptText(text) {
  try {
    const key = await getPrivateKey();
    return await Aes.decrypt(text, key, iv);
  } catch (err) {
    console.log('ERROR', err, text);
  }
  return null;
}

function updateSalts() {
  const maxString = 10;
  while (salts.length < Math.floor(saltString.length / maxString)) {
    const salt = saltString.substr(salts.length * maxString, maxString);
    if (salt) salts.push(salt);
  }
}

const trimCryptText = (text) => {
  return text
    .replace(/\+/g, 'p1L2u3S')
    .replace(/\//g, 's1L2a3S4h')
    .replace(/\=/g, 'e1Q2u3A4l');
};

const unTrimCryptText = (text) => {
  return text
    .replace(/p1L2u3S/g, '+')
    .replace(/s1L2a3S4h/g, '/')
    .replace(/e1Q2u3A4l/g, '=')
    .replace('.ts', '');
};

const encryptFile = async (file) => {
  try {
    let data = await fs.readFile(file, 'ascii');
    // console.log('#################<<', data);
    for (let i = 0; i < specialChar.length; i += 1) {
      data = String.replaceAll(data, `\\${specialChar[i]}`, specialReplaceChar[i]);
    }
    // console.log('#################<<', data);
    await fs.writeFile(file, data, 'ascii');
    if (debug) Funcs.log('Encrypt success', file);
  } catch (err) {
    Funcs.log(err);
  }
};

const decryptFile = async (file) => {
  try {
    let data = await fs.readFile(file, 'ascii');
    // console.log('#################>>', data);
    for (let i = 0; i < specialChar.length; i += 1) {
      data = String.replaceAll(data, specialReplaceChar[i], specialChar[i]);
    }
    // console.log('#################>>', data);
    await fs.writeFile(file, data, 'ascii');
    if (debug) Funcs.log('Decrypt success', file);
  } catch (err) {
    Funcs.log(err);
  }
};

const encryptVideo = async (path, onProgress) => {
  try {
    // Encrypt video
    let files = await fs.readdir(path);
    files = files.filter((item) => item.indexOf('.ts') >= 0);
    files = files.sort((e1, e2) => e1.replace(/\D/g, '') - e2.replace(/\D/g, ''));

    // Encrypt enc file
    // await encryptFile(`${path}enc.key`);
    // await encryptFile(`${path}index0.ts`);

    // Rename enc file
    let encFileName = await encryptText('enc.key');
    encFileName = trimCryptText(encFileName);
    await RNFetchBlob.fs.mv(`${path}enc.key`, `${path}${encFileName}.ts`);

    // Rename
    for (let i = 0; i < files.length; i += 1) {
      let fileName = await encryptText(files[i]);
      fileName = trimCryptText(fileName);
      await RNFetchBlob.fs.mv(`${path}${files[i]}`, `${path}${fileName}.ts`);
    }
  } catch (err) {
    console.log('ERROR', err);
  }
};

const decryptVideo = async (path, onProgress) => {
  try {
    // Create tmp m3u8
    Funcs.log('Decrypt video', path);
    let { encryptFileList, fileList } = await getListFileDecryptSorted(path);
    if (encryptFileList.length < 1 || fileList.length < 1) return false;
    let data = await RNFetchBlob.fs.readFile(`${path}video.m3u8`);
    for (let i = 0; i < fileList.length; i += 1) {
      // Funcs.log('Replace ', fileList[i], '=>', encryptFileList[i]);
      data = String.replaceAll(data, fileList[i], `${encryptFileList[i]}`);
    }

    // Update enc path
    let encFileName = await encryptText('enc.key');
    encFileName = trimCryptText(encFileName) + '.ts';
    encryptFileList = encryptFileList.filter((item) => item !== encFileName);

    // Save
    await RNFetchBlob.fs.writeFile(`${path}/tmp.m3u8`, data, 'utf8');

    // Decrypt video
    // await decryptFile(`${path}enc.key`);
    // await decryptFile(`${path}${encryptFileList[0]}`);
    return true;
  } catch (err) {
    console.log('ERROR', err);
  }
  return false;
};

const getListFileDecryptSorted = async (path) => {
  let files = await fs.readdir(path);
  files = files.filter((item) => item.indexOf('e1Q2u3A4l') >= 0);
  let fileList = [];
  for (let i = 0; i < files.length; i += 1) {
    let fileName = unTrimCryptText(files[i]);
    fileName = await decryptText(fileName);
    if (fileName) fileList.push({ fileName, index: i });
  }
  fileList = fileList.sort((e1, e2) => e1.fileName.replace(/\D/g, '') - e2.fileName.replace(/\D/g, ''));
  const encryptFileList = fileList.map((item) => files[item.index]);
  fileList = fileList.map((item) => item.fileName);
  return { encryptFileList, fileList };
};

const reEncryptVideo = async (path) => {
  try {
    let { encryptFileList } = await getListFileDecryptSorted(path);
    await RNFetchBlob.fs.unlink(`${path}tmp.m3u8`);
    // await encryptFile(`${path}enc.key`);

    // Remove enc file in list
    let encFileName = await encryptText('enc.key');
    encFileName = trimCryptText(encFileName) + '.ts';
    encryptFileList = encryptFileList.filter((item) => item !== encFileName);

    // Decrypt
    // await encryptFile(`${path}${encryptFileList[0]}`);
  } catch (err) {
    console.log('ERROR', err);
  }
};

const addSalt = (salt) => {
  if (saltString.indexOf(salt) >= 0) return;
  saltString += salt;
  updateSalts();
};

export default {
  addSalt,
  decryptVideo,
  encryptVideo,
  encryptFile,
  decryptFile,
  reEncryptVideo
};
