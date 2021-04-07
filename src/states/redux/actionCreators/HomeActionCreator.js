import LessonActionType from 'states/redux/actionTypes/LessonActionType';
import Store from 'states/redux/Store';

const getHomeLesson = () =>
  Store.dispatch({
    type: LessonActionType.GET_LIST_LESSON_HOME
  });

export default {
  getHomeLesson
};
