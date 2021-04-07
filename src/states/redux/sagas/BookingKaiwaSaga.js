import Lang from 'assets/Lang';
import DropAlert from 'common/components/base/DropAlert';
import Const from 'consts/Const';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import { call, put, takeLatest } from 'redux-saga/effects';
import BookingKaiwaActionType from 'states/redux/actionTypes/BookingKaiwaActionType';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';

export function* watchBooking() {
  yield takeLatest(BookingKaiwaActionType.GET_BOOKING_REMAIN, getBookingRemain);
  yield takeLatest(BookingKaiwaActionType.GET_LIST_CALENDAR, getListBooking);
  yield takeLatest(BookingKaiwaActionType.BOOKING_CANLENDAR_KAIWA, bookingKaiwa);
  yield takeLatest(BookingKaiwaActionType.CANCEL_CANLENDAR_KAIWA, cancelBookingKaiwa);
}

function* getBookingRemain() {
  try {
    let remain = yield call(Fetch.get, Const.API.BOOKING.GET_BOOKING_KAIWA_REMAIN, null, true);
    if (remain.status === Fetch.Status.SUCCESS) {
      yield put({
        type: BookingKaiwaActionType.GET_BOOKING_REMAIN_SUCCESS,
        data: remain.data
      });
    }
  } catch (error) {
    Funcs.log('####ERROR Remain', error);
  }
}

function* getListBooking(data) {
  try {
    const { date } = data;
    let listBooking = yield call(Fetch.get, Const.API.BOOKING.GET_BOOKING_KAIWA, { date }, true);
    if (listBooking.status == Fetch.Status.SUCCESS) {
      let dataBooking = listBooking.data.list;
      try {
        for (let i = 0; i < dataBooking.length; i++) {
          let parseData = JSON.parse(dataBooking[i].teacher);
          let userBooking1 = '';
          let userBooking2 = '';
          if (dataBooking[i].user_1) {
            userBooking1 = JSON.parse(dataBooking[i].user_1);
          }
          if (dataBooking[i].user_2) {
            userBooking2 = JSON.parse(dataBooking[i].user_2);
          }

          dataBooking[i].teacher = parseData;
          dataBooking[i].user_1 = userBooking1;
          dataBooking[i].user_2 = userBooking2;
        }
      } catch (error) {
        Funcs.log(error, 'Bug list booking kaiwa');
      }
      yield put({
        type: BookingKaiwaActionType.GET_LIST_CALENDAR_SUCCESS,
        allData: dataBooking,
        listBooking: dataBooking,
        canBooking: listBooking.data.canBooking,
        registed: listBooking.data.registed,
        date
      });
    }
  } catch (error) {
    Funcs.log('ERRROR BOOKING', error);
  }
}

function* bookingKaiwa(value) {
  const { data, dateRegister } = value;
  if (data.skype.length === 0) {
    DropAlert.warn('', Lang.flashcard.text_not_empty_ID_Skype);
    return false;
  }
  if (data.skype.trim() === '') {
    DropAlert.warn('', Lang.flashcard.text_not_space_ID_Skype);
    return false;
  }
  let res = yield call(Fetch.post, Const.API.BOOKING.REGISTER_KAIWA, data, true);
  if (res.status === Fetch.Status.SUCCESS) {
    yield put({ type: BookingKaiwaActionType.BOOKING_CANLENDAR_KAIWA_SUCCESS, showModalBookingKaiwa: true });
    yield put({ type: BookingKaiwaActionType.GET_BOOKING_REMAIN });
    yield put({ type: BookingKaiwaActionType.GET_LIST_CALENDAR, date: dateRegister.date });
    // push notify register kaiwa
    let newTime = dateRegister.time.split('~');
    let hour = newTime[0].split(':');
    let timeBooking = hour[0].length === 1 ? `0${newTime[0]}` : newTime[0];
    let timestamp = moment(`${dateRegister.date}T${timeBooking}+07:00`).subtract(1, 'h');
    PushNotification.localNotificationSchedule({
      date: timestamp.toDate(),
      /* iOS and Android properties */
      title: 'DŨNG MORI', // (optional)
      message: Lang.flashcard.text_message_noti_booking_kaiwa, // (required)
      playSound: true, // (optional) default: true
      soundName: 'default'
    });
  } else {
    DropAlert.warn('', res.data?.message);
  }
}

function* cancelBookingKaiwa(value) {
  let res = yield call(Fetch.post, Const.API.BOOKING.CANCEL_BOOKING_KAIWA, { id: value.id }, true);
  if (res.status === Fetch.Status.SUCCESS) {
    yield put({ type: BookingKaiwaActionType.CANCEL_CANLENDAR_KAIWA_SUCCESS, showModalCancelKaiwa: true });
    yield put({ type: BookingKaiwaActionType.GET_BOOKING_REMAIN });
    yield put({ type: BookingKaiwaActionType.GET_LIST_CALENDAR, date: value.dateRegister });
  } else {
    DropAlert.warn('', res.data?.message);
  }
}
