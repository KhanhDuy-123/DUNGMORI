import { SAVE_SPEND_TIME } from '../actions/ActionTypes';

const initialState = { time: 0 };

export const saveSpendTimeReducer = (state = initialState, action) => {
  if (action.type == SAVE_SPEND_TIME) {
    return { ...state, time: action.payload };
  }
  return state;
};
