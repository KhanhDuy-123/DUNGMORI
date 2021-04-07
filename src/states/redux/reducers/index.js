import { combineReducers } from 'redux';
import { USER_LOGOUT } from '../actions';
import { advertimentReducer } from './AdvertimentReducer';
import { authenticateReducer } from './AuthenticateReducer';
import { blogReducer } from './BlogReducer';
import { bookingKaiwaReducer } from './BookingKaiwaReducer';
import { changeServerReducer } from './ChangeServerReducer';
import { changeTestJLPTReducer } from './ChangeTestJLPTReducer';
import { countNotifyReducers } from './CountNotiReducer';
import { courseReducer } from './CourseReducer';
import { homeReducer } from './HomeReducer';
import { inputCommentReducer } from './InputCommentReducer';
import { languageReducer } from './LangReducer';
import { lessonReducer } from './LessonReducer';
import { listOwnCourseReducer } from './ListOwnCourseReducer';
import { notifyReducer } from './NotifyReducer';
import { percentKaiwaReducer } from './PercentKaiwaReducer';
import { qualityVideoReducer } from './QualityVideoReducer';
import { saveSpendTimeReducer } from './SaveSpendTimeReducer';
import { slidingReducer } from './SlidingReducer';
import { speedVideoReducer } from './SpeedVideoReducer';
import { teacherReducer } from './TeacherReducer';
import { testingReducer } from './TestingReducer';
import { userReducer } from './UserReducer';
import { videoDownloadReducer } from './VideoDownloadReducer';
import { videoNoteReducer } from './VideoNoteReducer';

const appReducer = combineReducers({
  userReducer,
  homeReducer,
  authenticateReducer,
  changeServerReducer,
  qualityVideoReducer,
  speedVideoReducer,
  percentKaiwaReducer,
  countNotifyReducers,
  listOwnCourseReducer,
  inputCommentReducer,
  saveSpendTimeReducer,
  languageReducer,
  lessonReducer,
  courseReducer,
  advertimentReducer,
  notifyReducer,
  videoDownloadReducer,
  changeTestJLPTReducer,
  blogReducer,
  bookingKaiwaReducer,
  videoNoteReducer,
  slidingReducer,
  teacherReducer,
  testingReducer
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
