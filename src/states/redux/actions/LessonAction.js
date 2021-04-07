import LessonActionType from '../actionTypes/LessonActionType';

export function onChangeVideoQuestion(videoInfo) {
  return {
    type: LessonActionType.GET_VIDEO_QUESTION_SUCCESS,
    videoQuestionInfo: videoInfo
  };
}

export function resetLessonInfo() {
  return {
    type: LessonActionType.GET_LESSON_INFO_SUCCESS,
    lessonInfo: {}
  };
}

export function resetLessonDetail() {
  return {
    type: LessonActionType.GET_LESSON_DETAIL_SUCCESS,
    kaiwaNo2Demo: {},
    listDocument: [],
    listQuestions: [],
    listVideo: [],
    document: [],
    lessonCondition: {}
  };
}
