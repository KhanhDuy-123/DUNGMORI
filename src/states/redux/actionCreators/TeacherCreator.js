import Store from '../Store';
import TeacherActionType from '../actionTypes/TeacherActionType';

const getListTeacher = () =>
  Store.dispatch({
    type: TeacherActionType.GET_LIST_TEACHER
  });

export default { getListTeacher };
