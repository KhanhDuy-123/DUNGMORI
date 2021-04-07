import { VIDEO_QUALITY } from '../actions/ActionTypes';

const initialState = { quality: '720p' };

export const qualityVideoReducer = (state = initialState, action) => {
  if (action.type == VIDEO_QUALITY) {
    return { ...state, quality: action.payload };
  }
  return state;
};
