import Funcs from 'common/helpers/Funcs';
import EncryptFileService from './EncryptFileService';
import RNFetchBlob from 'rn-fetch-blob';
import DatabaseConst from 'consts/DatabaseConst';
import DropAlert from 'common/components/base/DropAlert';
import Lang from 'assets/Lang';

const MAX_FILE_PER_DOWNLOAD = 10;
let downloadList = [];

const isDownloading = ({ videoLink, videoId }) => {
  const obj = downloadList.find((item) => item.videoLink === videoLink || item.videoId === videoId);
  return !!obj;
};

async function downloadTs(videoLinkTs, videoDir, index, callback) {
  const tsLink = videoLinkTs + `/index${index}.ts`;
  const tsPath = DatabaseConst.VIDEO_PATH + `${videoDir}/index${index}.ts`;
  // Funcs.log('DownloadTs', index, tsLink, tsPath);
  try {
    await RNFetchBlob.config({ path: tsPath }).fetch('GET', tsLink);
    callback(true);
  } catch (err) {
    Funcs.log('###', err);
    callback(false);
  }
}

export async function download({ data, onStart, onProgress, onFinish, onError }) {
  try {
    // Check tồn tại forder videos
    const isFolderExist = await RNFetchBlob.fs.exists(DatabaseConst.VIDEO_PATH);
    if (!isFolderExist) RNFetchBlob.fs.mkdir(DatabaseConst.VIDEO_PATH);

    // Download video file m3u8
    Funcs.log('Download', data);
    let { videoLink, videoLinkTs, videoDir, videoId } = data;
    videoLink = encodeURI(videoLink);
    videoLinkTs = encodeURI(videoLinkTs);
    downloadList.push(data);
    const videoFolder = DatabaseConst.VIDEO_PATH + `${videoDir}/`;
    const m3u8Path = `${videoFolder}video.m3u8`;
    Funcs.log('Download path', m3u8Path);
    const res = await RNFetchBlob.config({ path: m3u8Path }).fetch('GET', videoLink);
    onStart();

    // Download enc key
    const encKeyUrl = 'https://dungmori.com/enc.key';
    const encKeyPath = DatabaseConst.VIDEO_PATH + `${videoDir}/enc.key`;
    RNFetchBlob.config({ path: encKeyPath }).fetch('GET', encKeyUrl);

    // Read file m3u8
    let m3u8Data = await RNFetchBlob.fs.readFile(res.path(), 'utf8');
    m3u8Data = m3u8Data.replace(encKeyUrl, 'enc.key');
    RNFetchBlob.fs.writeFile(m3u8Path, m3u8Data, 'utf8');

    // Download
    let isFinish = false;
    let index = MAX_FILE_PER_DOWNLOAD - 1;
    const maxTsFile = m3u8Data.match(/.ts/g).length;
    const downloadTsCallback = async (isOk) => {
      // Cancel download
      if (isFinish) return;
      if (!isDownloading({ videoLink, videoId })) {
        Funcs.log('Cancel download', videoLink, videoId);
        return;
      }

      // Error
      if (!isOk) {
        onError();
        stop({ videoLink, videoId });
        DropAlert.warn('', Lang.download.video_download_fail);
        return;
      }

      // Continue download
      if (index < maxTsFile - 1) {
        onProgress(index, maxTsFile);
        index++;
        downloadTs(videoLinkTs, videoDir, index, downloadTsCallback);
        return;
      }

      // Finish
      isFinish = true;
      downloadList = downloadList.filter((item) => item.videoLink !== videoLink && item.videoId !== videoId);
      await EncryptFileService.encryptVideo(videoFolder);
      onFinish();
      Funcs.log('Download Finish');
    };
    for (let i = 0; i < MAX_FILE_PER_DOWNLOAD; i += 1) {
      downloadTs(videoLinkTs, videoDir, i, downloadTsCallback);
    }
  } catch (error) {
    Funcs.log('ERROR', error);
  }
}

const stop = ({ videoLink, videoId } = {}) => {
  Funcs.log('Stop download ', { videoLink, videoId });
  downloadList = downloadList.filter((item) => item.videoLink !== videoLink && item.videoId !== videoId);
};

export default {
  download,
  stop
};
