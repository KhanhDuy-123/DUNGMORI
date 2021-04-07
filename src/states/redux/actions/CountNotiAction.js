import { UPDATE_TOTAL_NOTIFY, UPDATE_TOTAL_CONVERSATION } from './ActionTypes';

export function onCountNotify(num) {
  return {
    type: UPDATE_TOTAL_NOTIFY,
    totalNotify: num
  };
}

export function onCountConversation(num) {
  return {
    type: UPDATE_TOTAL_CONVERSATION,
    totalConversation: num
  };
}
