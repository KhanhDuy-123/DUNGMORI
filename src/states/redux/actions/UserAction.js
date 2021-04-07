import { FETCHING_USER, UPDATING_USER_SUCCESS, USER_LOGOUT } from './ActionTypes';

export function fetchingUser() {
  return {
    type: FETCHING_USER
  };
}

export function onUpdateUser(user) {
  return {
    type: UPDATING_USER_SUCCESS,
    payload: user
  };
}

export function userLogout() {
  return {
    type: USER_LOGOUT
  };
}
