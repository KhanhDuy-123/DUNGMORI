import VideoNoteActionType from 'states/redux/actionTypes/VideoNoteActionType';
import Store from 'states/redux/Store';

const updateVideoTextNote = (dataNote) => {
  Store.dispatch({
    type: VideoNoteActionType.ADD_VIDEO_NOTE,
    dataNote
  });
};

export default { updateVideoTextNote };
