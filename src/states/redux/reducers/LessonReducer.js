import LessonActionType from 'states/redux/actionTypes/LessonActionType';
import { GET_LIST_QUESTION } from '../actions/ActionTypes';

const initialState = { isExam: 0 };

export const lessonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LessonActionType.GET_LIST_LESSON_HOME_SUCCESS:
      return {
        ...state,
        listHomeLesson: action.listHomeLesson,
        titleHomeLesson: action.titleHomeLesson
      };
    case LessonActionType.GET_LIST_LESSON_SUCCESS:
      return {
        ...state,
        listLesson: action.listLesson,
        listSpecLesson: action.listSpecLesson,
        totalProgress: action.totalProgress,
        courseOwner: action.courseOwner
      };
    case LessonActionType.UPDATE_LIST_LESSON_SUCCESS:
      return {
        ...state,
        listLesson: action.listLesson,
        totalProgress: action.totalProgress
      };
    case LessonActionType.UPDATE_LIST_SPEC_LESSON_SUCCESS:
      return {
        ...state,
        listSpecLesson: action.listSpecLesson,
        totalProgress: action.totalProgress
      };
    case LessonActionType.GET_LESSON_INFO_SUCCESS:
      return {
        ...state,
        lessonInfo: action.lessonInfo
      };
    case LessonActionType.GET_LESSON_DETAIL_SUCCESS:
      return {
        ...state,
        kaiwaNo2Demo: action.kaiwaNo2Demo,
        listDocument: action.listDocument,
        listQuestions: action.listQuestions,
        listVideo: action.listVideo,
        document: action.document,
        lessonCondition: action.lessonCondition
      };
    case LessonActionType.GET_VIDEO_QUESTION_SUCCESS:
      return {
        ...state,
        videoQuestionInfo: action.videoQuestionInfo
      };
    case LessonActionType.GET_LESSON_LUYEN_DE_SUCCESS:
      return {
        ...state,
        listLDKN: action.dataLDKN,
        listLDTH: action.dataLDTH
      };
    case LessonActionType.GET_RESULT_LUYEN_DE_SUCCESS:
      return {
        ...state,
        listResultLuyenDe: action.listResultLuyenDe
      };
    default:
      return state;
  }
};
