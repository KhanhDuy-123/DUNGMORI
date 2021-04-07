import PaymentActionType from '../actionTypes/PaymentActionType';
import Store from 'states/redux/Store';

const createIapInvoice = (params, successCallback = () => {}, failedCallback = () => {}) => {
  Store.dispatch({
    type: PaymentActionType.CREATE_IAP_INVOICE,
    params,
    successCallback,
    failedCallback
  });
};

export default {
  createIapInvoice
};
