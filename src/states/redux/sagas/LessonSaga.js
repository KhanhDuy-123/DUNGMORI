import Images from 'assets/Images';
import Lang from 'assets/Lang';
import DropAlert from 'common/components/base/DropAlert';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import moment from 'moment';
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import LessonActionType from 'states/redux/actionTypes/LessonActionType';
import Utils from 'utils/Utils';

export function* watchLesson() {
  yield takeLatest(LessonActionType.UPDATE_LESSON_NEW, updateNewProgressLesson);
  yield takeLatest(LessonActionType.GET_LIST_LESSON_HOME, getListHomeLesson);
  yield takeLatest(LessonActionType.GET_LIST_LESSON, getListLesson);
  yield takeLatest(LessonActionType.UPDATE_LESSON, updateProgressLesson);
  yield takeLatest(LessonActionType.CHOOSE_SPECIAL_LESSON, chooseSpecialLesson);
  yield takeLatest(LessonActionType.GET_LESSON_INFO, getLessonInfo);
  yield takeLatest(LessonActionType.GET_LESSON_DETAIL, getLessonDetail);
  yield takeLatest(LessonActionType.GET_VIDEO_QUESTION, getVideoQuestion);
  yield takeLatest(LessonActionType.GET_LESSON_LUYEN_DE, getLessonLuyenDe);
  yield takeLatest(LessonActionType.GET_RESULT_LUYEN_DE, getResultLuyenDe);
  yield takeLatest(LessonActionType.SUBMIT_ANSWER_RESULT, submitAnswer);
}

export function* getListHomeLesson() {
  try {
    let listHomeLesson = [];
    const lesson = yield call(Fetch.get, Const.API.HOME.GET_LIST_LESSON, null, true);
    listHomeLesson = lesson.data.lessons;
    for (let i = 0; i < listHomeLesson.length; i++) {
      let item = listHomeLesson[i];
      let name = '';
      if (item.avatar_name == '' || item.avatar_name == null) {
        name = item.name.split(' ');
        if (name[0]?.toUpperCase() == 'FLASHCARD' || name[0]?.toUpperCase() == 'FLASH') {
          item.avatar_name = Images.imgFlashCard;
        } else if (name[0]?.toUpperCase() == 'TEST' || name[0]?.toUpperCase() == 'BÀI THI') {
          item.avatar_name = Images.imgTest;
        } else {
          item.avatar_name = Images.imgDocument;
        }
      } else {
        item.avatar_name = { uri: Const.RESOURCE_URL.LESSON.DEFAULT + item.avatar_name };
      }
      listHomeLesson[i] = { ...item };
    }
    yield put({
      type: LessonActionType.GET_LIST_LESSON_HOME_SUCCESS,
      titleHomeLesson: lesson.data.title,
      listHomeLesson
    });
  } catch (error) {
    Funcs.log(error);
    yield put({
      type: LessonActionType.GET_LIST_LESSON_HOME_ERROR,
      payload: error
    });
  }
}

let step = 0;
let examProgressLesson = 0;
let videoProgressLesson = 0;
let lessonParentProgress = 0;
let videoProgressSpec = 0;
let examProgressSpec = 0;
let lessonSpecProgress = 0;
let videoProgress = 0;
let examProgress = 0;
let isSelected = false;
let totalProgress = 0;

function* getListLesson({ courseId, onSuccess }) {
  //Reset cac gia tri ve mac dinh
  step = 0;
  examProgressLesson = 0;
  videoProgressLesson = 0;
  lessonParentProgress = 0;
  videoProgressSpec = 0;
  examProgressSpec = 0;
  lessonSpecProgress = 0;
  videoProgress = 0;
  examProgress = 0;
  isSelected = false;
  totalProgress = 0;
  yield put({
    type: LessonActionType.GET_LIST_LESSON_SUCCESS,
    listLesson: [],
    listSpecLesson: [],
    totalProgress: 0
  });
  try {
    const res = yield call(Fetch.get, Const.API.LESSON.GET_LIST_LESSION, { courseId }, true);
    if (res.status == Fetch.Status.SUCCESS) {
      // Parse data lesson
      let data = res.data.lesson;
      for (var i = 0; i < data.length; i += 1) {
        let progress = 0;
        let lessons = data[i].lessons;
        if (!lessons) {
          step += 1;
          continue;
        }
        try {
          lessons = lessons.replace(/[&\/\\]/g, '');
          lessons = Funcs.jsonParse(lessons);
          let videoPro = 0;
          let examPro = 0;
          for (var j = 0; j < lessons.length; j += 1) {
            lessons[j].group_id = data[i].id;
            videoPro += lessons[j].video_progress;
            examPro += lessons[j].example_progress;
            progress += (lessons[j].video_progress + lessons[j].example_progress) / 2;
          }
          progress = progress / lessons.length;
          examProgressLesson += examPro / lessons.length; //tong progress video cua bai hoc
          videoProgressLesson += videoPro / lessons.length; //tong example cua bai hoc
        } catch (err) {
          Funcs.log('JSON', data[i].lessons);
          Funcs.log(err);
          lessons = [];
        }
        data[i].lessons = lessons;
        data[i].progress = progress;
        totalProgress += progress;
        lessonParentProgress = totalProgress; //tong progress cua ca bai hoc
      }

      //parse data speclesson
      let specData = res.data.specialLesson;
      for (var i = 0; i < specData.length; i += 1) {
        let progress = 0;
        let lessons = specData[i].lessons;
        if (!lessons) continue;
        specData[i].selected == 1 ? (isSelected = true) : (isSelected = false);
        try {
          lessons = lessons.replace(/[&\/\\]/g, '');
          lessons = Funcs.jsonParse(lessons);
          let videoSpecPro = 0;
          let examSpecPro = 0;
          for (var j = 0; j < lessons.length; j += 1) {
            lessons[j].group_id = specData[i].id;
            lessons[j].selected = specData[i].selected;
            videoSpecPro += lessons[j].video_progress;
            examSpecPro += lessons[j].example_progress;
            progress += (lessons[j].video_progress + lessons[j].example_progress) / 2;
          }
          videoProgressSpec += videoSpecPro / lessons.length; //tong prorgress video chuyen nganh
          examProgressSpec += examSpecPro / lessons.length; //tong progress example chuyen nganh
          progress = progress / lessons.length;
        } catch (err) {
          Funcs.log('JSON', specData[i].lessons);
          Funcs.log(err);
        }
        specData[i].lessons = lessons;
        specData[i].progress = progress;
        totalProgress += progress;
        lessonSpecProgress += progress; //tong progress bai hoc chuyen nganh
      }
      examProgress = examProgressLesson + examProgressSpec; //tong progress example cua ca khoa hoc
      videoProgress = videoProgressSpec + videoProgressLesson; // tong progress video cua ca khoa hoc
      const totalGroup = isSelected ? specData.length + data.length - step : data.length - step; // tinh tong so bai hoc
      totalProgress = totalProgress / totalGroup;
      totalProgress = Math.round(totalProgress); // tong progress cua ca khoa hoc
      yield put({
        type: LessonActionType.GET_LIST_LESSON_SUCCESS,
        listLesson: data,
        listSpecLesson: specData,
        totalProgress: totalProgress,
        courseOwner: res.data.courseOwner
      });

      yield onSuccess(data, specData);
    } else if (res.status === Fetch.Status.NETWORK_ERROR) {
      DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* updateNewProgressLesson({ data, onSuccess }) {
  try {
    let params = {
      videoProgress: data.videoProgress,
      exampleProgress: data.exampleProgress,
      lessonId: data.lessonId
    };
    let lessonGroupIndex = 0;
    let lessonIndex = 0;
    let groupLessons = [...data.groupLessons];
    let update = yield call(Fetch.post, Const.API.LESSON.UPDATE_PROGRESS_LESSON, params, true);
    if (data.lessonGroupId && update.status === 200) {
      let videoProcess = 0;
      let exampleProcess = 0;
      for (let i = 0; i < groupLessons.length; i++) {
        let itemParent = { ...groupLessons[i] };
        if (itemParent.id == data.lessonGroupId) {
          lessonGroupIndex = i;
          let lesson = itemParent.lessons;
          for (let j = 0; j < lesson.length; j++) {
            let itemLesson = { ...lesson[j] };
            itemLesson.update = itemLesson.id == data.lessonId;
            if (itemLesson.id == data.lessonId) {
              itemLesson.example_progress = update.data.example_progress;
              itemLesson.video_progress = update.data.video_progress;
              lessonIndex = j;
            }
            lesson[j] = itemLesson;
            //Sắp xếp tên bài học
            lesson = lesson?.sort((a, b) => {
              let nameA = a.name.split(':');
              nameA = nameA[0];
              let nameB = b.name.split(':');
              nameB = nameB[0];
              if (parseInt(nameA) > parseInt(nameB)) return 1;
              else if (parseInt(nameA) < parseInt(nameB)) return -1;
              return 0;
            });
            videoProcess += itemLesson.video_progress;
            exampleProcess += itemLesson.example_progress;
          }
          itemParent.example_progress = exampleProcess / lesson.length;
          itemParent.video_progress = videoProcess / lesson.length;
          groupLessons[i] = itemParent;
        }
      }
      yield onSuccess(groupLessons, lessonGroupIndex, lessonIndex);
      let lessonCondition = yield select((state) => state.lessonReducer.lessonCondition);
      if (lessonCondition.lessonType === Const.LESSON_TYPE.PICTURE_GUESS) {
        yield put({
          type: LessonActionType.GET_LESSON_DETAIL_SUCCESS
        });
      }
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* updateProgressLesson({ data, onSuccess, onScrolltoLesson, onScrollToSpecLesson }) {
  try {
    let params = {
      videoProgress: data.videoProgress,
      exampleProgress: data.exampleProgress,
      lessonId: data.lessonId
    };
    let listData = [];
    let update = yield call(Fetch.post, Const.API.LESSON.UPDATE_PROGRESS_LESSON, params, true);
    if (data.lessonGroupId && update.status === 200) {
      if (data.selected) {
        videoProgressSpec = 0;
        examProgressSpec = 0;
      } else {
        videoProgressLesson = 0;
        examProgressLesson = 0;
      }
      let listLesson = yield select((state) => state.lessonReducer.listLesson);
      let listSpecLesson = yield select((state) => state.lessonReducer.listSpecLesson);
      listData = data.selected ? listSpecLesson : listLesson;
      let listOld = data.selected ? listLesson : listSpecLesson;
      let totalProgress = 0;
      if (!listData) return yield onSuccess([]);
      listData = listData?.map((item) => {
        let lessons = item.lessons;
        if (lessons) {
          let videoPro = 0;
          let examPro = 0;
          item.update = item.id === data.lessonGroupId;
          if (item.id === data.lessonGroupId) {
            let progress = 0;
            for (var j = 0; j < lessons.length; j += 1) {
              let itemLesson = { ...lessons[j] };
              itemLesson.isActive = itemLesson.id === data.lessonId;
              if (itemLesson.id === data.lessonId) {
                itemLesson.example_progress = update.data.example_progress;
                itemLesson.video_progress = update.data.video_progress;
                itemLesson.count ? (itemLesson.count += 1) : (itemLesson.count = 1);
              }
              itemLesson.update = false;
              progress += (itemLesson.video_progress + itemLesson.example_progress) / 2;
              lessons[j] = itemLesson;
            }
            progress = progress / lessons.length;
            item.progress = progress;
            item = { ...item };
          }

          //tinh lai tong so progress vido, exam cua ca khoa hoc
          for (let j = 0; j < lessons.length; j += 1) {
            videoPro += lessons[j].video_progress;
            examPro += lessons[j].example_progress;
          }
          if (data.selected) {
            videoProgressSpec += videoPro / lessons.length;
            examProgressSpec += examPro / lessons.length;
          } else {
            videoProgressLesson += videoPro / lessons.length;
            examProgressLesson += examPro / lessons.length;
          }
          totalProgress += item.progress;
          data.selected ? (lessonSpecProgress = totalProgress) : (lessonParentProgress = totalProgress);
        }
        return item;
      });

      //tong so progress video, exam cua ca khoa hoc
      videoProgress = videoProgressLesson + videoProgressSpec;
      examProgress = examProgressLesson + examProgressSpec;
      const totalGroup = isSelected ? listOld.length + listData.length - step : listData.length - step;
      totalProgress = (lessonParentProgress + lessonSpecProgress) / totalGroup;
      totalProgress = Math.round(totalProgress);
      if (data.selected) {
        yield put({
          type: LessonActionType.UPDATE_LIST_SPEC_LESSON_SUCCESS,
          listSpecLesson: listData,
          totalProgress
        });
        yield onScrollToSpecLesson();
      } else {
        yield put({
          type: LessonActionType.UPDATE_LIST_LESSON_SUCCESS,
          listLesson: listData,
          totalProgress
        });
        let index = 0;
        listData.find((e, ind) => {
          if (e.id == data.lessonGroupId) {
            index = ind;
          }
        });
        yield onScrolltoLesson(index);
      }
    }
    yield onSuccess(listData);
  } catch (error) {
    Funcs.log(error);
  }
}

function* chooseSpecialLesson({ courseId, lessonGroupId, onSuccess }) {
  try {
    const data = {
      courseId,
      lessonGroupId
    };
    LoadingModal.show();
    let chooseResponse = yield call(Fetch.post, Const.API.LESSON.CHOOSE_SPECIAL_LESSON, data, true);
    LoadingModal.hide();
    if (chooseResponse.status == Fetch.Status.SUCCESS) {
      let specData = yield select((state) => state.lessonReducer.listSpecLesson);
      let totalPG = yield select((state) => state.lessonReducer.totalProgress);
      let data = [];
      let progress = 0;
      let videoProgress = 0;
      let examProgress = 0;
      for (let i = 0; i <= specData.length; i++) {
        if (!specData[i]) continue;
        if (specData[i].id == lessonGroupId) {
          specData[i].selected = 1;
          let lessons = specData[i].lessons;
          lessons.map((e) => {
            e.selected = 1;
            videoProgress += e.video_progress;
            examProgress += e.example_progress;
            return e;
          });
          progress = (videoProgress + examProgress) / 2;
          specData[i].progress = progress / lessons.length;
          data.push(specData[i]);
          break;
        }
      }
      yield put({
        type: LessonActionType.UPDATE_LIST_SPEC_LESSON_SUCCESS,
        listSpecLesson: data,
        totalProgress: totalPG
      });
      yield onSuccess();
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* getLessonInfo({ lessonId }) {
  let courseName = '';
  let lessonName = '';
  let isExam = 0;
  let isStillTime = false;
  let courseId = null;
  const lessonInfor = yield call(Fetch.get, Const.API.LESSON.GET_LESSON_INFO, { lessonId: lessonId }, true);
  if (lessonInfor.status == Fetch.Status.SUCCESS) {
    try {
      lessonName = lessonInfor.data.name;
      isExam = lessonInfor.data.is_examination;
      courseName = lessonInfor.data.course_name;
      courseId = lessonInfor.data.course_id;
      Utils.currentTime = lessonInfor.data.current_time;

      //check thời hạn khoá học
      if (lessonInfor.data.course_expired) {
        const currentTime = moment().valueOf();
        const timeExpired = moment(lessonInfor.data.course_expired).format('x');
        isStillTime = currentTime < parseInt(timeExpired);
      } else if (courseName == 'N5') {
        isStillTime = true;
      } else {
        isStillTime = false;
      }
      let lessonInfo = {
        lessonName,
        courseName,
        isExam,
        isStillTime,
        courseId
      };
      yield put({
        type: LessonActionType.GET_LESSON_INFO_SUCCESS,
        lessonInfo
      });
    } catch (err) {
      console.log('ERROR', err);
    }
  } else {
    LoadingModal.hide();
  }
}

let lessonComponentId = null;
function* getLessonDetail({ lessonId, onSuccess }) {
  yield take(LessonActionType.GET_LESSON_INFO_SUCCESS);
  lessonComponentId = null;
  let kaiwaNo2Demo = {};
  let listDocument = [];
  let listQuestions = [];
  let listVideo = [];
  let document = [];
  let lessonType = '';
  let checkRenderTab = null;
  let totalAnswer = 0;
  let typeVideo = 'youtube';
  let kaiwaLesson = false;
  const lessonDetail = yield call(Fetch.get, Const.API.LESSON.GET_LESSON_DETAIL, { lessonId: lessonId }, true);
  if (lessonDetail.status == Fetch.Status.SUCCESS) {
    //loc document
    listDocument = lessonDetail.data.filter((e) => {
      return e.type == Const.LESSON_TYPE.PDF || e.type == Const.LESSON_TYPE.FLASHCARD;
    });

    //loc cau tra loi
    listQuestions = lessonDetail.data.filter((e, index) => {
      if (
        e.type !== Const.LESSON_TYPE.PDF &&
        e.type !== Const.LESSON_TYPE.FLASHCARD &&
        e.type !== Const.LESSON_TYPE.VIDEO &&
        e.type !== Const.LESSON_TYPE.KANJI_QUESTION &&
        e.type !== Const.LESSON_TYPE.VIDEO_QUESTION
      ) {
        let item = { ...e };
        try {
          if (e.type == Const.LESSON_TYPE.KAIWA) {
            item.value = Funcs.jsonParse(e.value);
            //lấy câu hỏi mẫu
            if (item.value && item.value.type == 1) {
              kaiwaNo2Demo = { ...item.value, id: e.id };
            }
          }
        } catch (error) {
          Funcs.log(error, 'ERROR PARSE QUESTION VALUE');
        }
        if (e.type == Const.LESSON_TYPE.KAIWA) kaiwaLesson = true;
        if (e.answers) totalAnswer += 1;
        if (e.type == Const.LESSON_TYPE.QUIZ_TEST && !lessonType) lessonType = Const.LESSON_TYPE.QUIZ_TEST;
        if (e.type == Const.LESSON_TYPE.PICTURE_GUESS && !lessonType) lessonType = Const.LESSON_TYPE.PICTURE_GUESS;
        return e;
      }
    });

    //loc danh sach video
    listVideo = [];
    let listData = lessonDetail.data;
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].type == Const.LESSON_TYPE.VIDEO || listData[i].type == Const.LESSON_TYPE.VIDEO_QUESTION) {
        //Check type video la video or Youtube video
        typeVideo = listData[i].server == 'youtube' ? listData[i].server : 'video';
        listVideo.push(listData[i]);
        lessonComponentId = listData[i].id;
      }
    }
  } else {
    LoadingModal.hide();
    DropAlert.warn('Lỗi', lessonDetail.data.message);
    NavigationService.pop();
  }

  if (totalAnswer == 0) {
    document = listQuestions.filter((e) => e.type == Const.LESSON_TYPE.DOCUMENT);
    listDocument = listDocument.concat(document);
    listQuestions = listQuestions.filter((e) => e.type !== Const.LESSON_TYPE.DOCUMENT);
  }

  //check render tab
  if (listDocument.length == 0) {
    checkRenderTab = Const.LESSON_TYPE.DOCUMENT;
  } else if (listQuestions.length == 0) {
    checkRenderTab = Const.LESSON_TYPE.MULTI_CHOISE_QUESTION;
  }

  let lessonCondition = {
    lessonType,
    checkRenderTab
  };
  yield put({
    type: LessonActionType.GET_LESSON_DETAIL_SUCCESS,
    kaiwaNo2Demo,
    listDocument,
    listQuestions,
    listVideo,
    document,
    lessonCondition
  });
  yield onSuccess(typeVideo, totalAnswer, kaiwaLesson, listVideo);
  LoadingModal.hide();
}

function* getVideoQuestion() {
  yield take(LessonActionType.GET_LESSON_DETAIL_SUCCESS);
  try {
    if (!lessonComponentId) return;
    let videoQuestion = yield call(Fetch.get, Const.API.LESSON.GET_VIDEO_QUESTION, { lessonComponentId }, true);
    if (videoQuestion.status == Fetch.Status.SUCCESS) {
      yield put({
        type: LessonActionType.GET_VIDEO_QUESTION_SUCCESS,
        videoQuestionInfo: videoQuestion.data
      });
    }
  } catch (error) {
    Funcs.log(`ERROR VIDEO QUESTION`, error);
  }
}

function* getLessonLuyenDe(value) {
  try {
    LoadingModal.show();
    let res = yield Fetch.get(Const.API.LESSON.GET_LESSON_LUYEN_DE, { courseId: value.courseId }, true);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      let dataLDKN = res.data.filter((item) => item.type_ld === Const.COURSE_TYPE.LDKN);
      let dataLDTH = res.data.filter((item) => item.type_ld === Const.COURSE_TYPE.LDTH);
      yield put({
        type: LessonActionType.GET_LESSON_LUYEN_DE_SUCCESS,
        dataLDKN,
        dataLDTH
      });
    }
  } catch (error) {
    Funcs.log(`ERROR LESSON LUYEN DE`, error);
  }
}

function* getResultLuyenDe(value) {
  try {
    LoadingModal.show();
    let res = yield Fetch.get(Const.API.LESSON.GET_RESULT_LUYEN_DE, { lessonId: value.lessonId }, true);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      res.data.data = JSON.parse(res.data.data);
      yield put({
        type: LessonActionType.GET_RESULT_LUYEN_DE_SUCCESS,
        listResultLuyenDe: res.data
      });
    }
  } catch (err) {
    Funcs.log(`ERROR RESULT LUYEN DE`, err);
  }
}

function* submitAnswer(value) {
  try {
    LoadingModal.show();
    let res = yield Fetch.post(Const.API.LESSON.SUBMIT_ANSWER, value.data, true);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      yield value.onSuccess(res.data);
    }
  } catch (err) {
    Funcs.log('ERROR SUBMIT ANSWER', err);
  }
}
