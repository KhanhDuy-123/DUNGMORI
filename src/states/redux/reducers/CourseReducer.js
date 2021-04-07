import CourseActionType from 'states/redux/actionTypes/CourseActionType';

const initialState = {};

export const courseReducer = (state = initialState, action) => {
  switch (action.type) {
    case CourseActionType.GET_LIST_COURSE_SUCCESS:
      return {
        ...state,
        listCourse: action.listCourse,
        listEju: action.listEju,
        listKaiwa: action.listKaiwa
      };
    case CourseActionType.GET_LIST_COURSE_COMBO_SUCCESS:
      return {
        ...state,
        listCombo: action.listCombo,
        listSingle: action.listSingle
      };
    case CourseActionType.GET_COURSE_SUCCESS:
      return {
        ...state,
        course: action.course,
        lesson: action.lesson,
        isStillTime: action.isStillTime
      };
    case CourseActionType.GET_STAGES_SUCCESS:
      return {
        ...state,
        stages: action.data
      };
    default:
      return state;
  }
};
