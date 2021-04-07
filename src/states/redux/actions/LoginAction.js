import { LOGGING_IN } from './ActionTypes';

export function onLogin(account, onSuccess = () => {}) {
  return {
    type: LOGGING_IN,
    account,
    onSuccess
  };
}
