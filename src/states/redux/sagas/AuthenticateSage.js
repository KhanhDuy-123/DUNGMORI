import Lang from 'assets/Lang';
import DropAlert from 'common/components/base/DropAlert';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import StorageService from 'common/services/StorageService';
import NavigationService from 'common/services/NavigationService';
import OneSignalService from 'common/services/OneSignalService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import { put, takeLatest } from 'redux-saga/effects';
import { FETCHING_USER_SUCCESS, LOGGING_IN, LOGGING_IN_FAIL, LOGIN_SOCIAL, LOGIN_SOCIAL_FAIL, SIGN_UP } from 'states/redux/actions';
import Utils from 'utils/Utils';

export function* watchAuthenticateSocial() {
  yield takeLatest(LOGGING_IN, onLogin);
  yield takeLatest(SIGN_UP, onSignUp);
  yield takeLatest(LOGIN_SOCIAL, onLoginSocial);
}

function* onLoginSocial(data) {
  try {
    let dataUser = {
      provider: data.payload.provider,
      socialId: data.payload.id,
      email: data.payload.email ? data.payload.email : null,
      name: data.payload.name,
      avatar: data.payload.avatar,
      socialToken: data.payload.token
    };
    LoadingModal.show();
    const res = yield Fetch.post(Const.API.USER.LOGIN_SOCIAL, dataUser);
    setTimeout(() => {
      LoadingModal.hide();
    }, 300);

    if (res.status === Fetch.Status.SUCCESS) {
      yield put({
        type: FETCHING_USER_SUCCESS,
        payload: res.data
      });
      Utils.user = res.data;
      Utils.token = res.data.token;
      StorageService.save(Const.DATA.KEY_USER, res.data);
      StorageService.save(Const.DATA.KEY_USER_TOKEN, res.data.token);
      DropAlert.success('', Lang.login.text_alert_login_success, 400);
      NavigationService.reset(ScreenNames.HomeScreen);
      OneSignalService.updateDeviceId();
    } else {
      DropAlert.error('', Lang.login.text_alert_login_not_success);
    }
  } catch (error) {
    Funcs.log(error, 'login social');
    yield put({
      type: LOGIN_SOCIAL_FAIL,
      payload: error
    });
    DropAlert.error('', Lang.login.text_alert_login_not_success);
  }
}

function* onLogin({ account, onSuccess }) {
  LoadingModal.show();
  const res = yield Fetch.post(Const.API.USER.LOGIN, { account });
  setTimeout(() => {
    LoadingModal.hide();
  }, 200);
  if (res.status == Fetch.Status.SUCCESS) {
    Utils.user = res.data;
    Utils.token = res.data.token;
    StorageService.save(Const.DATA.KEY_USER, res.data);
    StorageService.save(Const.DATA.KEY_USER_TOKEN, res.data.token);
    DropAlert.success('', Lang.login.text_alert_login_success, 400);
    NavigationService.reset(ScreenNames.HomeScreen);
    OneSignalService.updateDeviceId();
    yield put({
      type: FETCHING_USER_SUCCESS,
      payload: res.data
    });
    onSuccess();
  } else if (res.status == Fetch.Status.NOT_FOUND) {
    yield put({
      type: LOGGING_IN_FAIL
    });
    DropAlert.error('', Lang.login.text_alert_account_or_password_fail);
  } else if (res.status === Fetch.Status.NETWORK_ERROR) {
    DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
  }
}

function* onSignUp(data) {
  try {
    const { username, email, phone, password, firebaseToken, code } = data.payload;
    let phoneNunber = phone;
    if (phone.startsWith('+84')) phoneNunber = phone.replace('+84', '0');
    let objectSignUp = {
      name: username,
      email,
      phone: phoneNunber,
      password,
      firebaseToken,
      code: code ? code : ''
    };
    LoadingModal.show();
    const res = yield Fetch.post(Const.API.USER.REGISTER, objectSignUp);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      yield put({
        type: FETCHING_USER_SUCCESS,
        payload: res.data
      });
      Utils.user = res.data;
      Utils.token = res.data.token;
      StorageService.save(Const.DATA.KEY_USER, res.data);
      StorageService.save(Const.DATA.KEY_USER_TOKEN, res.data.token);
      DropAlert.success('', Lang.login.text_alert_register_success);
      NavigationService.reset(ScreenNames.HomeScreen);
      OneSignalService.updateDeviceId();
    } else if (res.status === Fetch.Status.ALREADY_EXIST) {
      setTimeout(() => {
        DropAlert.warn('', res.data.error);
      }, 300);
    } else if (res.status === Fetch.Status.NETWORK_ERROR) {
      DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
    } else {
      setTimeout(() => {
        DropAlert.warn('', res.data.error);
      }, 300);
    }
  } catch (error) {
    yield put({
      type: LOGGING_IN_FAIL,
      payload: error
    });
    DropAlert.error('', Lang.login.text_alert_register_fail);
  }
}
