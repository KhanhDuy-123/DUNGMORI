import BookingKaiwaActionType from 'states/redux/actionTypes/BookingKaiwaActionType';

const initialState = {};

export const bookingKaiwaReducer = (state = initialState, action) => {
  switch (action.type) {
    case BookingKaiwaActionType.GET_BOOKING_REMAIN_SUCCESS:
      return {
        ...state,
        dataBookingRemain: action.data
      };
    case BookingKaiwaActionType.GET_LIST_CALENDAR_SUCCESS:
      return {
        ...state,
        dataListBooking: action
      };
    case BookingKaiwaActionType.BOOKING_CANLENDAR_KAIWA_SUCCESS:
      return {
        ...state,
        showModalBookingKaiwa: action
      };
    case BookingKaiwaActionType.CANCEL_CANLENDAR_KAIWA_SUCCESS:
      return {
        ...state,
        showModalCancelKaiwa: action
      };
    default:
      return state;
  }
};
