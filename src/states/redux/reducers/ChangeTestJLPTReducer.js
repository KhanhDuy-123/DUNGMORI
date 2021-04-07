import { CHANGE_TEST_JLPT } from '../actions/ActionTypes';

const initialState = { testJLPT: false };

export const changeTestJLPTReducer = (state = initialState, action) => {
  if (action.type == CHANGE_TEST_JLPT) return { ...state, testJLPT: true };
  return state;
};
