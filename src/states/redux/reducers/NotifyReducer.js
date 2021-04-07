import NotifyActionType from '../actionTypes/NotifyActionType';

const initalState = { listNotify: [] };

export const notifyReducer = (state = initalState, action) => {
  switch (action.type) {
    case NotifyActionType.GET_LIST_NOTIFY_SUCCESS:
      return { ...state, listNotify: action.listNotify };
    default:
      return state;
  }
};
