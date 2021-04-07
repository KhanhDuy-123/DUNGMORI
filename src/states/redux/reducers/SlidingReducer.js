import { IS_SLIDING_COMPLETE, IS_SLIDING } from '../actions/ActionTypes';

const initialState = { isSliding: false };

export const slidingReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_SLIDING:
      return { ...state, isSliding: true };
    case IS_SLIDING_COMPLETE:
      return { ...state, isSliding: false };
    default:
      return state;
  }
};
