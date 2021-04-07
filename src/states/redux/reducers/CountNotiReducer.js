import { UPDATE_TOTAL_NOTIFY, UPDATE_TOTAL_CONVERSATION } from '../actions/ActionTypes';

const initState = {
  totalNotify: 0,
  totalConversation: 0
};

export const countNotifyReducers = (state = initState, action) => {
  if (action.type == UPDATE_TOTAL_NOTIFY) {
    return {
      ...state,
      totalNotify: action.totalNotify
    };
  }
  if (action.type == UPDATE_TOTAL_CONVERSATION) {
    return {
      ...state,
      totalConversation: action.totalConversation
    };
  }
  return state;
};
