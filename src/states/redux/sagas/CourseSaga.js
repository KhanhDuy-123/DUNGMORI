import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import CourseConst from 'consts/CourseConst';
import moment from 'moment';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LIST_OWNED } from 'states/redux/actions';
import CourseActionType from 'states/redux/actionTypes/CourseActionType';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';

export function* watchCourse() {
  yield takeLatest(CourseActionType.GET_LIST_COURSE, getListCourse);
  yield takeLatest(CourseActionType.GET_LIST_COURSE_COMBO, getListCourseCombo);
  yield takeLatest(CourseActionType.GET_COURSE, getCourse);
  yield takeLatest(CourseActionType.GET_STAGES, getStages);
}

function* getStages({ courseId, onSuccess }) {
  try {
    var res = yield call(Fetch.get, Const.API.COURSE.GET_STAGES, { courseId }, true);
    if (res.status === Fetch.Status.SUCCESS) {
      yield put({
        type: CourseActionType.GET_STAGES_SUCCESS,
        data: res.data
      });
      yield onSuccess(res.data);
    }
  } catch (error) {
    Funcs.log(error);
  }
}

export function* getListCourse() {
  try {
    const regex = new RegExp('EJU');
    const regexKaiwa = new RegExp('Kaiwa');
    const course = yield call(Fetch.get, Const.API.HOME.GET_ALL_COURSE, null, true);
    let listCourse = course.data;
    let listOwned = [];
    let listEju = [];
    let listKaiwa = [];
    let isShifting = false;
    Utils.listCourse = listCourse;
    for (let i = 0; i < listCourse.length; i++) {
      if (listCourse[i].price == 0 || (listCourse[i].owned && listCourse[i].owned == 1)) {
        listOwned.push(listCourse[i]);
      }
      let name = regex.exec(listCourse[i].name);
      if (name && name[0] == 'EJU') {
        listEju.push(listCourse[i]);
      }
      let nameKaiwa = regexKaiwa.exec(listCourse[i].name);
      if (nameKaiwa && nameKaiwa[0] === 'Kaiwa') {
        listKaiwa.push(listCourse[i]);
      }
      if (listCourse[i].id == CourseConst.SPECIAL.ID && !isShifting) {
        listCourse.unshift(listCourse[i]);
        listCourse.splice(i + 1, 1);
        isShifting = true;
      }
    }
    listCourse = listCourse.filter((e) => {
      let name = regex.exec(e.name);
      let nameKaiwa = regexKaiwa.exec(e.name);
      if (!name && !nameKaiwa) {
        return e;
      }
    });

    // Hiện thị 2 kaiwa  mới
    for (let i = 0; i < listKaiwa.length; i++) {
      if (listKaiwa[i].id == CourseConst.KAIWA.ID && !listKaiwa[i].owned) {
        listKaiwa.splice(i, 1);
        break;
      }
    }
    yield put({
      type: LIST_OWNED,
      payload: listOwned
    });
    yield put({
      type: CourseActionType.GET_LIST_COURSE_SUCCESS,
      listCourse,
      listEju,
      listKaiwa
    });
  } catch (error) {
    Funcs.log(error);
    yield put({
      type: CourseActionType.GET_LIST_COURSE_ERROR,
      listCourse: []
    });
  }
}

function* getListCourseCombo({ onSuccess }) {
  let listCombo = [];
  let listSingle = [];
  try {
    //Lấy danh sách khoá học sở hữu
    let listOwned = yield select((state) => state.listOwnCourseReducer.listCourse);

    //Call api
    let response = yield call(Fetch.get, Const.API.HOME.GET_COMBO);
    if (response.status == Fetch.Status.SUCCESS) {
      try {
        let listData = response.data;
        for (let i = 0; i < listData.length; i++) {
          let item = { ...listData[i] };
          item.combo = JSON.parse(item.combo);
          let combo = [...item.combo];
          for (let j = 0; j < combo.length; j++) {
            let comboItem = { ...combo[j] };
            comboItem.services = JSON.parse(comboItem.services);
            for (let a = 0; a < listOwned.length; a++) {
              if (listOwned[a].name == combo[j].name) {
                comboItem.owned = 1;
              }
            }
            if (comboItem.services.courses.length > 1) {
              listCombo.push(comboItem);
            } else if (comboItem.id !== CourseConst.KAIWA.ID) {
              listSingle.push(comboItem);
            }
            combo[j] = comboItem;
          }
          item.combo = combo;
        }
        yield put({
          type: CourseActionType.GET_LIST_COURSE_COMBO_SUCCESS,
          listCombo,
          listSingle
        });
      } catch (error) {
        Funcs.log(error);
      }
      yield onSuccess();
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* getCourse({ courseId }) {
  try {
    let currentTime = yield call(Fetch.get, Const.API.HOME.GET_CURRENT_TIME_SERVER);
    currentTime = currentTime.data.result.current;
    var res = yield call(Fetch.get, Const.API.COURSE.GET_COURSE, { id: courseId }, true);
    if (res.status === Fetch.Status.SUCCESS) {
      let course = res.data;
      const timeExpired = moment(res.data.watch_expired_day).format('x');
      let lesson = [];
      try {
        lesson = JSON.parse(res.data.lessons);
        course.stats_data = JSON.parse(course.stats_data);
      } catch (error) {
        Funcs.log(error);
      }
      yield put({
        type: CourseActionType.GET_COURSE_SUCCESS,
        course,
        lesson,
        isStillTime: currentTime < timeExpired || (res.data?.name == 'N5' || res.data?.name == 'Chuyên Ngành')
      });
    }
  } catch (error) {
    Funcs.log(error);
  }
}
