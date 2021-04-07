import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import UrlConst from 'consts/UrlConst';
import { call, takeLatest, put } from 'redux-saga/effects';
import TestingActionType from '../actionTypes/TestingActionType';
import Utils from 'utils/Utils';

export function* watchTesting() {
  yield takeLatest(TestingActionType.GET_TESTING_CURRENT_TIME, getTestingCurrentTime);
  yield takeLatest(TestingActionType.GET_TESTING_ROOM, getTestingRoom);
}

export function* getTestingRoom({ onFinish }) {
  try {
    let currentTime = 0;

    //Get thoi gian hien tai tren server
    let currentServerTime = yield call(Fetch.get, UrlConst.API_JP_TEST + Const.API.TRY_DO_TEST.GET_CURRENT_TIME_SERVER, null, null, null, true);
    if (currentServerTime.status == Fetch.Status.SUCCESS) {
      currentTime = currentServerTime.data;
    }

    // Thông tin phòng thi
    let testingInfoData = Utils.listTestingRoom;
    let respone = yield call(Fetch.get, UrlConst.API_JP_TEST + Const.API.TRY_DO_TEST.GET_EXAM_INFO, null, null, null, true);
    if (respone.status == Fetch.Status.SUCCESS) {
      const { thisExam } = respone.data;
      testingInfoData = testingInfoData.map((item) => {
        const itemFind = thisExam.find((e) => item.course === e.course);
        if (itemFind && itemFind.course === item.course) {
          item = { ...item, ...itemFind };
          item.test = true;
          item.currentTime = currentTime;

          // Test state
          if (item.course === 'N5') {
            // console.log('##########item.time_start', item.time_start);
            // item.time_start = '2020-11-05T09:56:00.000Z';
            // item.time_end = '2020-11-05T01:49:44.000Z';
          }
          // if (item.course === 'N4') {
          //   item.time_start = '2020-11-01T01:49:44.000Z';
          //   item.time_end = '2020-11-26T01:49:44.000Z';
          // }
        }
        return item;
      });
    }
    yield put({ type: TestingActionType.GET_TESTING_ROOM_SUCCESS, testingInfoData, currentTime });
    if (onFinish) onFinish();
  } catch (error) {
    Funcs.log(error);
  }
}

export function* getTestingCurrentTime() {
  try {
    let currentTime = 0;
    let currentServerTime = yield call(Fetch.get, UrlConst.API_JP_TEST + Const.API.TRY_DO_TEST.GET_CURRENT_TIME_SERVER, null, null, null, true);
    if (currentServerTime.status == Fetch.Status.SUCCESS) {
      currentTime = currentServerTime.data;
    }
    yield put({ type: TestingActionType.GET_TESTING_CURRENT_TIME_SUCCESS, currentTime });
  } catch (error) {
    Funcs.log(error);
  }
}
