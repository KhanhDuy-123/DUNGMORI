import Const from 'consts/Const';
import CryptoJS from 'crypto-js';
import Funcs from 'common/helpers/Funcs';

export default {
  encrypt: (str, key = Const.APP_KEY.CRYPTO) => {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(str), key).toString();
    } catch (err) {
      Funcs.log('ERROR', err);
    }
    return null;
  },

  decrypt: (str, key = Const.APP_KEY.CRYPTO) => {
    try {
      let data = CryptoJS.AES.decrypt(str, key);
      data = data.toString(CryptoJS.enc.Utf8);
      data = JSON.parse(data);
      return data;
    } catch (err) {
      Funcs.log('ERROR', err);
    }
    return null;
  }
};
