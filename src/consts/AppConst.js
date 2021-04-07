import { isIphoneX } from 'common/helpers/IPhoneXHelper';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

const IS_ANDROID = Platform.OS === 'android';

const KEY = {
  ONE_SIGNAL: '1ce69e5d-d698-471a-9662-5fe958bd6d81',
  YOUTUBE_API: 'AIzaSyDeBrETf1Kizc0Z8c-3sMgcY6VSnOsH6K4',
  GOOGLE_SPEECH_API: 'AIzaSyBhoOBQc--7aUsUZ-gbBCEtsjI2En0dyKc',
  CRYPTO: '5927d42f6be3c971472aaeac626853ef',
  CODEPUSH: {
    ANDROID: {
      DEV: 'UOR02e_OOoaTnSF5em9aYzKd8P9yicgMuc9DT',
      PROD: 'gdJ6Jck9Eue3AcPCCXxOQlr9sxgppfaYPUWsK'
    },
    IOS: {
      DEV: 'sI_yZ-OrQ82BGWX6u-pCDaCM9gCpMfCK1463y',
      PROD: '2pVj8wzGZaSzHFdkb5k7nzWuOgc_jAWGubSMZ'
    }
  }
};

const { CODEPUSH_KEY_ANDROID, CODEPUSH_KEY_IOS } = Config;
const CODEPUSH_KEY = IS_ANDROID ? CODEPUSH_KEY_ANDROID : CODEPUSH_KEY_IOS;
const IS_DEV_BUILD = CODEPUSH_KEY === KEY.CODEPUSH[Platform.OS.toUpperCase()].DEV;

export default {
  KEY,
  PATCH: '090321_0912',
  VERSION: DeviceInfo.getVersion(),
  BUILD_NUMBER: DeviceInfo.getBuildNumber(),
  TEST_FLIGHT_VERSION: '1.22',
  IS_DEV_BUILD,
  IS_ANDROID,
  IS_IOS: Platform.OS === 'ios',
  SYSTEM_VERSION: DeviceInfo.getSystemVersion(),
  IS_IPHONEX: isIphoneX()
};
