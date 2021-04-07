import Store from 'states/redux/Store';
import LessonActionType from '../actionTypes/LessonActionType';

const getListLesson = (courseId, onSuccess = () => {}) =>
  Store.dispatch({
    type: LessonActionType.GET_LIST_LESSON,
    courseId,
    onSuccess
  });

const updateLesson = (data, onSuccess = () => {}, onScrolltoLesson = () => {}, onScrollToSpecLesson = () => {}) =>
  Store.dispatch({
    type: LessonActionType.UPDATE_LESSON,
    onScrolltoLesson,
    onScrollToSpecLesson,
    data,
    onSuccess
  });

const updateLessonNew = (data, onSuccess = () => {}, onScrolltoLesson = () => {}, onScrollToSpecLesson = () => {}) =>
  Store.dispatch({
    type: LessonActionType.UPDATE_LESSON_NEW,
    onScrolltoLesson,
    onScrollToSpecLesson,
    data,
    onSuccess
  });

const chooseSpecialLesson = (courseId, lessonGroupId, onSuccess) =>
  Store.dispatch({
    type: LessonActionType.CHOOSE_SPECIAL_LESSON,
    courseId,
    lessonGroupId,
    onSuccess
  });

const getLessonInfo = (lessonId) =>
  Store.dispatch({
    type: LessonActionType.GET_LESSON_INFO,
    lessonId
  });

const getLessonDetail = (lessonId, onSuccess) =>
  Store.dispatch({
    type: LessonActionType.GET_LESSON_DETAIL,
    lessonId,
    onSuccess
  });

const getVideoQuestion = () =>
  Store.dispatch({
    type: LessonActionType.GET_VIDEO_QUESTION
  });

const getLessonLuyenDe = (courseId) =>
  Store.dispatch({
    type: LessonActionType.GET_LESSON_LUYEN_DE,
    courseId
  });

const getResultLuyenDe = (lessonId) =>
  Store.dispatch({
    type: LessonActionType.GET_RESULT_LUYEN_DE,
    lessonId
  });

const submitAnswer = (data, onSuccess = () => {}) =>
  Store.dispatch({
    type: LessonActionType.SUBMIT_ANSWER_RESULT,
    data,
    onSuccess
  });

export default {
  getListLesson,
  updateLesson,
  chooseSpecialLesson,
  getLessonInfo,
  getLessonDetail,
  getVideoQuestion,
  updateLessonNew,
  getLessonLuyenDe,
  getResultLuyenDe,
  submitAnswer
};
