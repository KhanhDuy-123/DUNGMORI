import { SERVER_VIDEO_SELECTED, LIST_SERVER } from '../actions/ActionTypes';

const initialState = { name: '', url: '', id: null, server: [] };

export const changeServerReducer = (state = initialState, action) => {
  if (action.type == SERVER_VIDEO_SELECTED) {
    return { ...state, server: action.payload };
  }
  if (action.type == LIST_SERVER) {
    return { ...state, listServer: action.payload };
  }
  return state;
};
