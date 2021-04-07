import BookingKaiwaActionType from 'states/redux/actionTypes/BookingKaiwaActionType';
import Store from 'states/redux/Store';

const getBookingRemain = () => {
  Store.dispatch({
    type: BookingKaiwaActionType.GET_BOOKING_REMAIN
  });
};

const getBookingKaiwa = (date) => {
  Store.dispatch({
    type: BookingKaiwaActionType.GET_LIST_CALENDAR,
    date
  });
};
const bookingKaiwa = (data, dateRegister) => {
  Store.dispatch({
    type: BookingKaiwaActionType.BOOKING_CANLENDAR_KAIWA,
    data,
    dateRegister
  });
};
const cancelBookingKaiwa = (id, dateRegister) => {
  Store.dispatch({
    type: BookingKaiwaActionType.CANCEL_CANLENDAR_KAIWA,
    id,
    dateRegister
  });
};

export default { getBookingRemain, getBookingKaiwa, bookingKaiwa, cancelBookingKaiwa };
