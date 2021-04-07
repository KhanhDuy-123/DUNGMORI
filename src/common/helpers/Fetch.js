import Lang from 'assets/Lang';
import axios from 'axios';
import Files from 'common/helpers/Files';
import AppConst from 'consts/AppConst';
import UrlConst from 'consts/UrlConst';
import RNHeicConverter from 'react-native-heic-converter';
import UserActionCreator from 'states/redux/actionCreators/UserActionCreator';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import Funcs from './Funcs';

const Status = {
  INTERNAL_SERVER_ERROR: 500,
  NOT_EXITS: 400,
  UNAUTHORIZED_TOKEN_INVALID: 401,
  SUCCESS: 200,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ALREADY_EXIST: 409,
  PHONE_DOES_NOT_EXIT: 426,
  CODE_DOES_NOT_EXIT: 427,
  PHONE_ALREADY_LOGIN_SOCIAL: 428,
  POINT_NOT_ENOUGH: 429,
  DATE_EXPIRY: 434,
  NUMBER_EXPIRED: 432,
  NOT_ENTER_YOUR_CODE: 430,
  ERROR_MULTI_CODE: 435,
  ANYONE_LOGIN_THIS_ACCOUNT: 588,
  GENERIC_ERROR: 1000,
  NETWORK_ERROR: 1001
};

const baseURL = UrlConst.API + '/api/';
const instance = axios.create({
  baseURL,
  timeout: 120000
});

async function parseErrorResult(err, config) {
  var result = err && err.response;
  if (!result) result = { config, status: Status.NETWORK_ERROR, message: 'Network error' };
  result = { ...result, config };
  Funcs.log('ERROR', result);

  // Check only one device login to one account
  if (result.status === Status.ANYONE_LOGIN_THIS_ACCOUNT) {
    UserActionCreator.verifySessionFailed({ title: Lang.alert.text_alert_kickout_user_title, message: Lang.alert.text_alert_kickout_user });
  }

  // Check authenticate
  if (result.status === Status.UNAUTHORIZED_TOKEN_INVALID) {
    Utils.token = '';
    UserActionCreator.verifySessionFailed({ message: Lang.splash.text_session_expired });
  }
  return result;
}

async function parseSuccessResult(res, config) {
  var result = {
    data: res.data,
    status: res.status,
    config
  };
  Funcs.log('SUCCESS', result);
  return result;
}

async function get(url, params, isAuth, cancelRequest, staticUrl = false) {
  let headers = { deviceId: Utils.deviceId, language: Configs.language };
  if (isAuth) {
    headers.token = Utils.token;
  }
  headers['Cache-Control'] = 'no-cache';
  headers['Expires'] = 'no-cache';
  const config = { url, params, headers, method: 'GET' };
  try {
    let fullUrl = staticUrl ? url : baseURL + url;
    Funcs.log('GET', fullUrl, { params, headers });
    var res = await instance.get(url, {
      params,
      baseURL: staticUrl ? '' : baseURL,
      headers,
      cancelToken: new axios.CancelToken(function executor(c) {
        if (cancelRequest) cancelRequest.cancel = c;
      })
    });
    return parseSuccessResult(res, config);
  } catch (err) {
    return parseErrorResult(err, config);
  }
}

async function post(url, params, isAuth, cancelRequest, staticUrl = false) {
  let headers = { deviceId: Utils.deviceId, language: Configs.language };
  if (isAuth) {
    headers.token = Utils.token;
  }
  const config = { url, params, headers, method: 'POST' };
  try {
    let fullUrl = staticUrl ? url : baseURL + url;
    Funcs.log('POST', fullUrl, { params, headers });
    var res = await instance.post(url, params, {
      baseURL: staticUrl ? '' : baseURL,
      headers,
      cancelToken: new axios.CancelToken(function executor(c) {
        if (cancelRequest) cancelRequest.cancel = c;
      })
    });
    return parseSuccessResult(res, config);
  } catch (err) {
    return parseErrorResult(err, config);
  }
}

async function postForm(url, params, isAuth, cancelRequest) {
  async function convertHeicImage(imgData) {
    try {
      const ingnoreConvertTypes = ['jpg', 'jpeg', 'png', 'image/jpeg', 'image/jpg', 'image/png'];
      if (ingnoreConvertTypes.indexOf(imgData.type?.toLowerCase()) >= 0) return;
      Funcs.log('Convert heic to jpg', imgData.uri);
      let convertedImage = await RNHeicConverter.convert({ path: imgData.uri, quality: 0.75 });
      convertedImage = convertedImage?.path;
      arrayImageConverted.push(convertedImage);
      imgData.uri = convertedImage;
      imgData.type = 'image/jpg';
    } catch (err) {
      Funcs.log('ERROR', err);
    }
  }
  // Check heic file
  let { images, image } = params;
  const arrayImageConverted = [];
  if (AppConst.IS_IOS) {
    if (images?.length > 0) {
      for (let i = 0; i < images.length; i += 1) await convertHeicImage(images[i]);
      params = { ...params, images };
    }
    if (image) {
      await convertHeicImage(image);
      params = { ...params, image };
    }
  }

  // Form data
  let formData = new FormData();
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((val) => formData.append(`${key}`, val));
    } else {
      formData.append(key, value);
    }
  });
  let headers = { deviceId: Utils.deviceId, language: Configs.language };
  if (isAuth) {
    headers.token = Utils.token;
  }
  const config = { url, params, headers, method: 'POST_FORM' };
  try {
    Funcs.log('POST_FORM', baseURL + url, { params, headers });
    var res = await instance.post(url, formData, {
      headers,
      cancelToken: new axios.CancelToken(function executor(c) {
        if (cancelRequest) cancelRequest.cancel = c;
      })
    });

    // Delete converted file
    for (let i = 0; i < arrayImageConverted.length; i += 1) {
      Files.deleteFile(arrayImageConverted[i]);
    }
    return parseSuccessResult(res, config);
  } catch (err) {
    return parseErrorResult(err, config);
  }
}

export default {
  get,
  post,
  postForm,
  Status
};
