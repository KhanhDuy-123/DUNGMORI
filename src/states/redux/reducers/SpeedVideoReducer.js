import { SPEED_VIDEO } from '../actions/ActionTypes';

const initialState = { speed: 1.0 };

export const speedVideoReducer = (state = initialState, action) => {
  if (action.type == SPEED_VIDEO) {
    return { ...state, speed: action.payload };
  }
  return state;
};
