import VideoDownloadActionType from 'states/redux/actionTypes/VideoDownloadActionType';
import Store from 'states/redux/Store';
const onVideodownloadProgress = (lessonDownloading) => {
  Store.dispatch({
    type: VideoDownloadActionType.VIDEO_DOWNLOAD_PROGRESS_SUCCESS,
    lessonDownloading
  });
};

const stopDownload = (stopDownloadVideo) => {
  Store.dispatch({
    type: VideoDownloadActionType.STOP_VIDEO_DOWNLOAD,
    stopDownloadVideo
  });
};

export default { onVideodownloadProgress, stopDownload };
