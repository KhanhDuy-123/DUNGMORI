import { LOGGING_IN, LOGGING_IN_FAILED, LOGGING_IN_SUCCESS, LOGIN_SOCIAL_FAIL, SIGN_UP, SIGN_UP_FAIL, SIGN_UP_SUCCESS } from 'states/redux/actions';

const initialState = {};

export const authenticateReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGGING_IN:
      return {
        ...state
      };
    case LOGGING_IN_SUCCESS:
      return {
        ...state
      };
    case LOGGING_IN_FAILED:
      return {
        ...state
      };
    case LOGIN_SOCIAL_FAIL:
      return {
        ...state
      };
    case SIGN_UP:
      return {
        ...state
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state
      };
    case SIGN_UP_FAIL:
      return {
        ...state
      };

    default:
      return state;
  }
};
