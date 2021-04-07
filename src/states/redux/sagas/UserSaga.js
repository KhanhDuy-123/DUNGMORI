import Lang from 'assets/Lang';
import DropAlert from 'common/components/base/DropAlert';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import StorageService from 'common/services/StorageService';
import FacebookService from 'common/services/FacebookService';
import GoogleService from 'common/services/GoogleService';
import NavigationService from 'common/services/NavigationService';
import OneSignalService from 'common/services/OneSignalService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import { Platform } from 'react-native';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import HomeActionType from 'states/redux/actionTypes/HomeActionType';
import UserActionType from 'states/redux/actionTypes/UserActionType';
import { FETCHING_USER, FETCHING_USER_FAIL, FETCHING_USER_SUCCESS } from 'states/redux/actions';
import Utils from 'utils/Utils';
import { UPDATE_TOTAL_NOTIFY } from '../actions/ActionTypes';

export function* watchUser() {
  yield takeLatest(FETCHING_USER, fetchingUser);
  yield takeLatest(UserActionType.VERIFY_SESSION, verifySession);
  yield takeLatest(UserActionType.VERIFY_SESSION_FAILED, verifySessionFailed);
  yield takeLatest(UserActionType.UPDATE_USER_SETTING, onReadedNotify);
  yield takeLatest(UserActionType.UPDATE_DEVICE, updateDeviceInfo);
}

function* fetchingUser() {
  try {
    LoadingModal.show();
    const infoUser = yield Fetch.get(Const.API.USER.GET_MY_INFO, null, true);
    LoadingModal.hide();
    if (infoUser.status === Fetch.Status.SUCCESS) {
      yield put({
        type: FETCHING_USER_SUCCESS,
        payload: infoUser.data
      });
      Utils.user = infoUser.data;
      StorageService.save(Const.DATA.INFO_USER, infoUser.data);
    } else if (infoUser.status === Fetch.Status.NETWORK_ERROR) {
      DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
    } else {
      yield put({
        type: FETCHING_USER_FAIL,
        payload: infoUser.error
      });
    }
  } catch (error) {
    yield put({
      type: FETCHING_USER_FAIL,
      payload: error
    });
  }
}

function* verifySession({ callback }) {
  LoadingModal.show();
  const session = yield call(Fetch.post, Const.API.USER.VERIFY_MY_SESSION, null, true);
  LoadingModal.hide();
  if (session.status !== Fetch.Status.SUCCESS) {
    yield put({
      type: UserActionType.VERIFY_SESSION_FAILED
    });
  } else {
    callback();
    yield put({
      type: UserActionType.VERIFY_SESSION_SUCCESS
    });
  }
}

function* verifySessionFailed({ title, message }) {
  DropAlert.error(title, message);
  StorageService.remove(Const.DATA.KEY_USER);
  StorageService.remove(Const.DATA.KEY_USER_TOKEN);
  FacebookService.logout();
  GoogleService.logout();
  OneSignalService.removeDeviceId();
  NavigationService.reset(ScreenNames.ParentAuthenticateScreen);
}

function* onReadedNotify({ lastId }) {
  try {
    let response = yield call(Fetch.post, Const.API.USER.USER_SETTING, { lastNotifyId: lastId }, true);
    if (response.status == Fetch.Status.SUCCESS) {
      yield put({
        type: UPDATE_TOTAL_NOTIFY,
        totalNotify: 0
      });
      OneSignalService.countNotify = 0;
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* updateDeviceInfo({ deviceId }) {
  try {
    yield take(HomeActionType.GET_HOME_DATA_SUCCESS);
    let response = yield call(Fetch.post, Const.API.USER.UPDATE_DEVICE, { deviceId, platform: Platform.OS }, true);
    if (response.status == Fetch.Status.SUCCESS) {
      yield put({ type: UserActionType.UPDATE_DEVICE_SUCCESS });
    }
  } catch (error) {
    Funcs.log(error);
  }
}
