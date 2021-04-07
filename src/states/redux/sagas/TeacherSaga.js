import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import { call, put, takeLatest } from 'redux-saga/effects';
import TeacherActionType from '../actionTypes/TeacherActionType';

export function* watchTeacher() {
  yield takeLatest(TeacherActionType.GET_LIST_TEACHER, getListTeacher);
}

export function* getListTeacher() {
  try {
    let response = yield call(Fetch.get, Const.API.TEACHER.GET_LIST_TEACHER);
    if (response.status == Fetch.Status.SUCCESS) {
      yield put({
        type: TeacherActionType.GET_LIST_TEACHER_SUCCESS,
        listTeacher: response.data
      });
    }
  } catch (error) {
    Funcs.log(error);
  }
}
