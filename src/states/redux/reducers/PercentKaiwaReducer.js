import { PERCENT_KAIWA } from '../actions/ActionTypes';

const initState = { percent: 0 };

export const percentKaiwaReducer = (state = initState, action) => {
  if (action.type === PERCENT_KAIWA) {
    return { ...state, percent: action.payload };
  }
  return state;
};
