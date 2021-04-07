import Store from 'states/redux/Store';
import NotifyActionType from '../actionTypes/NotifyActionType';

const checkNotify = () =>
  Store.dispatch({
    type: NotifyActionType.CHECK_NOTIFY
  });

const getListNotify = (page = 1, onSuccess = () => {}, refresh = false) =>
  Store.dispatch({
    type: NotifyActionType.GET_LIST_NOTIFY,
    page,
    refresh,
    onSuccess
  });

const updateReadNotify = (notifyId) =>
  Store.dispatch({
    type: NotifyActionType.UPDATE_READ_NOTIFY,
    notifyId
  });

export default {
  checkNotify,
  getListNotify,
  updateReadNotify
};
