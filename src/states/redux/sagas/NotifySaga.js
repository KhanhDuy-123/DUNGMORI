import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import Utils from 'utils/Utils';
import NotifyActionType from '../actionTypes/NotifyActionType';
import { UPDATE_TOTAL_CONVERSATION, UPDATE_TOTAL_NOTIFY } from '../actions/ActionTypes';

export function* watchNotify() {
  yield takeLatest(NotifyActionType.GET_LIST_NOTIFY, getListNotify);
  yield takeLatest(NotifyActionType.CHECK_NOTIFY, checkNotify);
  yield takeLatest(NotifyActionType.UPDATE_READ_NOTIFY, updateReadedNotify);
}

export function* checkNotify() {
  if (!Utils.token) return;
  try {
    let notify = yield call(Fetch.get, Const.API.PROFILE.GET_TOTAL_NOTIFY, null, true);
    if (notify.status == Fetch.Status.SUCCESS) {
      yield put({
        type: UPDATE_TOTAL_NOTIFY,
        totalNotify: notify.data.notification
      });
      yield put({
        type: UPDATE_TOTAL_CONVERSATION,
        totalConversation: notify.data.conversation
      });
    }
  } catch (error) {
    Funcs.log(error);
  }
}

export function* getListNotify({ page, refresh, onSuccess }) {
  try {
    //Lấy state từ reducer
    let dataList = [];
    if (!refresh) {
      dataList = yield select((state) => state.notifyReducer.listNotify);
    }
    let listNotify = yield call(Fetch.get, Const.API.PROFILE.GET_LIST_NOTIFY, { page }, true);
    if (listNotify.status == Fetch.Status.SUCCESS) {
      dataList = dataList.concat(listNotify.data.notifications);
      yield onSuccess(dataList);
      yield put({
        type: NotifyActionType.GET_LIST_NOTIFY_SUCCESS,
        listNotify: dataList
      });
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* updateReadedNotify({ notifyId }) {
  try {
    let dataList = yield select((state) => state.notifyReducer.listNotify);
    let updateNotify = yield call(Fetch.post, Const.API.PROFILE.UPDATE_STATUS_NOTIFY, { id: notifyId }, true);
    if (updateNotify.status == Fetch.Status.SUCCESS) {
      for (let i = 0; i < dataList.length; i++) {
        let item = { ...dataList[i] };
        if (item.id == notifyId) item.readed = 1;
        dataList[i] = item;
      }
      yield put({
        type: NotifyActionType.GET_LIST_NOTIFY_SUCCESS,
        listNotify: dataList
      });
    }
  } catch (error) {
    Funcs.log(error);
  }
}
