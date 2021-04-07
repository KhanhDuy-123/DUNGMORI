import HomeActionType from '../actionTypes/HomeActionType';

const initialState = { advertiment: [] };

export const advertimentReducer = (state = initialState, action) => {
  if (action.type == HomeActionType.GET_ADVERTISEMENT_SUCCESS) {
    return {
      ...state,
      advertiment: action.advertiment
    };
  } else if (action.type == HomeActionType.GET_ADVERTISEMENT_FAILED) {
    return {
      advertiment: []
    };
  }
  return state;
};
