import LoadingModal from 'common/components/base/LoadingModal';
import Const from 'consts/Const';
import { takeLatest, call } from 'redux-saga/effects';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import StorageService from 'common/services/StorageService';
import PaymentActionType from '../actionTypes/PaymentActionType';

export function* watchPayment() {
  yield takeLatest(PaymentActionType.CREATE_IAP_INVOICE, createIapInvoice);
}

function* createIapInvoice({ params, successCallback, failedCallback }) {
  try {
    let res = yield call(Fetch.post, Const.API.INVOICE.CREATE_IAP_INVOICE, params, true);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      successCallback();

      // Sửa lại khi nào kích hoạt thành công mới xoá data inapp
      StorageService.save('IAP_PURCHASE_DATA', '');
    } else failedCallback(res.data.message);
  } catch (err) {
    Funcs.log(err);
  }
}
