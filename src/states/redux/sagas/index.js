import { all, fork } from 'redux-saga/effects';
import { watchAuthenticateSocial } from './AuthenticateSage';
import { watchBlog } from './BlogSaga';
import { watchBooking } from './BookingKaiwaSaga';
import { watchCourse } from './CourseSaga';
import { watchHome } from './HomeSaga';
import { watchLesson } from './LessonSaga';
import { watchNotify } from './NotifySaga';
import { watchPayment } from './PaymentSaga';
import { watchTeacher } from './TeacherSaga';
import { watchTesting } from './TestingSaga';
import { watchUser } from './UserSaga';

export default function* rootSaga() {
  yield all([
    fork(watchUser),
    fork(watchAuthenticateSocial),
    fork(watchLesson),
    fork(watchCourse),
    fork(watchHome),
    fork(watchPayment),
    fork(watchNotify),
    fork(watchBlog),
    fork(watchBooking),
    fork(watchTeacher),
    fork(watchTesting)
  ]);
}
