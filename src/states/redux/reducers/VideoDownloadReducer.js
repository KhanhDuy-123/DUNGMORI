import VideoDownloadActionType from 'states/redux/actionTypes/VideoDownloadActionType';

const initialState = {
  lessonDownloading: []
};

export const videoDownloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case VideoDownloadActionType.VIDEO_DOWNLOAD_PROGRESS_SUCCESS:
      return {
        ...state,
        lessonDownloading: action.lessonDownloading
      };
    case VideoDownloadActionType.STOP_VIDEO_DOWNLOAD:
      return {
        ...state,
        stopDownloadVideo: action.stopDownloadVideo
      };
    default:
      return state;
  }
};
