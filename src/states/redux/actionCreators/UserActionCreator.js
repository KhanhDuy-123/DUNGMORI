import Store from 'states/redux/Store';
import UserActionType from 'states/redux/actionTypes/UserActionType';

const verifySession = (callback) =>
  Store.dispatch({
    type: UserActionType.VERIFY_SESSION,
    callback
  });

const verifySessionFailed = ({ title, message }) =>
  Store.dispatch({
    type: UserActionType.VERIFY_SESSION_FAILED,
    title,
    message
  });

const settingReadNotify = (lastId) =>
  Store.dispatch({
    type: UserActionType.UPDATE_USER_SETTING,
    lastId
  });

const updateDevice = (deviceId) =>
  Store.dispatch({
    type: UserActionType.UPDATE_DEVICE,
    deviceId
  });

export default {
  verifySession,
  verifySessionFailed,
  settingReadNotify,
  updateDevice
};
