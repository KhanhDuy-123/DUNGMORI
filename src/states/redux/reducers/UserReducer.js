import { FETCHING_USER, FETCHING_USER_SUCCESS, FETCHING_USER_FAIL, UPDATING_USER_SUCCESS } from 'states/redux/actions';

const initialState = {
  user: {}
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_USER:
      return {
        ...state
      };
    case FETCHING_USER_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    case FETCHING_USER_FAIL:
      return {
        ...state
      };
    case UPDATING_USER_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};
