import { SIGN_UP } from './ActionTypes';

export function onSignUp(data) {
  return {
    type: SIGN_UP,
    payload: data
  };
}
