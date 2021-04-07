import CourseActionType from '../actionTypes/CourseActionType';

export function onResetCourse() {
  return {
    type: CourseActionType.GET_COURSE_SUCCESS,
    course: {},
    lesson: [],
    isStillTime: false
  };
}
