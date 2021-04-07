import Lang from 'assets/Lang';
import * as RNIap from 'react-native-iap';
import Funcs from '../helpers/Funcs';

export default class IapService {
  static async purchase(productId, callback) {
    try {
      Funcs.log('Purchase', productId);
      await RNIap.initConnection();
      const products = await RNIap.getProducts([productId]);
      if (products.length < 1) {
        callback(false, Lang.iapPurechar.text_not_search_payment_code);
        return;
      }

      // Buy
      var res = await RNIap.requestPurchase(productId);
      callback(true, res);
      return;
    } catch (err) {
      Funcs.log(err);
    }
    callback(false, Lang.iapPurechar.text_payment_not_success);
  }

  static async subscription(productId, callback) {
    try {
      Funcs.log('Purchase subscription', productId);
      await RNIap.initConnection();
      const products = await RNIap.getProducts([productId]);
      if (products.length < 1) {
        callback(false, Lang.iapPurechar.text_not_search_payment_code);
        return;
      }

      // Buy
      var res = await RNIap.requestSubscription(productId);
      callback(true, res);
      return;
    } catch (err) {
      Funcs.log(err);
    }
    callback(false, Lang.iapPurechar.text_payment_not_success);
  }
}
