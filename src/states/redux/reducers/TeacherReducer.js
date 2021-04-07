import TeacherActionType from '../actionTypes/TeacherActionType';

const initialState = { listTeacher: [] };
export const teacherReducer = (state = initialState, action) => {
  if (action.type == TeacherActionType.GET_LIST_TEACHER_SUCCESS) {
    return { ...state, listTeacher: action.listTeacher };
  }
  return state;
};
