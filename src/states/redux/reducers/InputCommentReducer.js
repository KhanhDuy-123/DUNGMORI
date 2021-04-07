import { HIDE_INPUT_COMMENT, SHOW_INPUT_COMMENT } from '../actions/ActionTypes';

const initialState = { showInput: true };

export const inputCommentReducer = (state = initialState, action) => {
  if (action.type == HIDE_INPUT_COMMENT) {
    return { ...state, showInput: false };
  }
  if (action.type == SHOW_INPUT_COMMENT) {
    return { ...state, showInput: true };
  }
  return state;
};
