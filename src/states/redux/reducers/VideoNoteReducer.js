import VideoNoteActionType from 'states/redux/actionTypes/VideoNoteActionType';

const initialState = {
  dataNote: {}
};

export const videoNoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case VideoNoteActionType.ADD_VIDEO_NOTE:
      return {
        ...state,
        dataNote: action.dataNote
      };
    default:
      return state;
  }
};
