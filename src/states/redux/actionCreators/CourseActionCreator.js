import Store from 'states/redux/Store';
import CourseActionType from '../actionTypes/CourseActionType';

const getListCombo = (onSuccess) =>
  Store.dispatch({
    type: CourseActionType.GET_LIST_COURSE_COMBO,
    onSuccess
  });

const getListCourse = (courseId) =>
  Store.dispatch({
    type: CourseActionType.GET_COURSE,
    courseId
  });

const getStages = (courseId, onSuccess = () => {}) =>
  Store.dispatch({
    type: CourseActionType.GET_STAGES,
    courseId,
    onSuccess
  });

export default { getListCombo, getListCourse, getStages };
