import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import LangActionCreator from 'states/redux/actionCreators/LangActionCreator';
import HomeActionType from 'states/redux/actionTypes/HomeActionType';
import Utils from 'utils/Utils';
import { getNewBlogs } from './BlogSaga';
import { getListCourse } from './CourseSaga';
import { getListHomeLesson } from './LessonSaga';
import { checkNotify } from './NotifySaga';
import { getListTeacher } from './TeacherSaga';
import { LIST_SERVER, SERVER_VIDEO_SELECTED } from '../actions/ActionTypes';

export function* watchHome() {
  yield takeLatest(HomeActionType.GET_HOME_DATA, getHomeData);
}

function* getHomeData({ onSuccess = () => {} }) {
  yield all([getListHomeLesson(), getListCourse(), getListAdvertiment()]);
  yield all([getMyIP(), getNewBlogs()]);
  yield onSuccess();
  yield checkNotify();
  yield getSetting();
  yield getListTeacher();
  yield put({ type: HomeActionType.GET_HOME_DATA_SUCCESS });
  yield getListServer();
}

function* getListAdvertiment() {
  try {
    const endow = yield call(Fetch.get, Const.API.HOME.GET_ADVERTISEMENT, null, true);
    if (endow.status == Fetch.Status.SUCCESS) {
      yield put({
        type: HomeActionType.GET_ADVERTISEMENT_SUCCESS,
        advertiment: endow.data
      });
    }
  } catch (error) {
    Funcs.log(error);
    yield put({
      type: HomeActionType.GET_ADVERTISEMENT_FAILED,
      advertiment: []
    });
  }
}

function* getSetting() {
  try {
    const res = yield call(Fetch.get, Const.API.HOME.GET_SETTING);
    if (res.status == Fetch.Status.SUCCESS) {
      const setting = res.data;
      if (setting.android_change_log) setting.android_change_log = JSON.parse(setting.android_change_log);
      if (setting.ios_change_log) setting.ios_change_log = JSON.parse(setting.ios_change_log);
      yield put({
        type: HomeActionType.GET_SETTING_SUCCESS,
        setting
      });
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* getMyIP() {
  const userLocation = yield call(Fetch.get, Const.API.SETTING.MY_IP, {}, false, null, true);
  if (userLocation.status === Fetch.Status.SUCCESS) {
    Utils.location = userLocation.data.cc;
    yield put({
      type: HomeActionType.GET_MY_IP_SUCCESS,
      data: userLocation.data
    });

    // Check language setting
    const lang = yield StorageService.get(Const.DATA.CHANGE_LANG);
    if (!lang) {
      // Change language to en
      let isLocalSensitive = Utils.location.toLowerCase() !== 'vn' && Utils.location.toLowerCase() !== 'jp';
      if (isLocalSensitive) {
        yield put({
          type: Const.LANGUAGE.EN
        });
        LangActionCreator.changeLanguage(Const.LANGUAGE.EN);
      }
    }
  }
}

function* getListServer() {
  try {
    let server = yield select((state) => state.changeServerReducer);
    let res = yield Fetch.get(Const.API.SETTING.GET_VIDEO_SERVER);
    let servers = [];
    if (res.status === Fetch.Status.SUCCESS) {
      const data = {
        name: server.name ? server.name : res.data[0].name,
        url: server.url ? server.url : res.data[0].url,
        id: server.id ? server.id : res.data[0].id
      };
      servers = res.data;
      // this.videoUrl = data.url;
      // this.videoQuality = this.props.quality;
      yield put({
        type: LIST_SERVER,
        payload: servers
      });
      yield put({
        type: SERVER_VIDEO_SELECTED,
        payload: data
      });
    }
  } catch (error) {}
}
