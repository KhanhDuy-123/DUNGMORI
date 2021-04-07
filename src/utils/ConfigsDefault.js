import Theme from 'assets/Theme';
import AppConst from 'consts/AppConst';

const isTestFlightVersion = AppConst.TEST_FLIGHT_VERSION === AppConst.VERSION;

let NODE_DEV = 'local';
// NODE_DEV = 'development';
NODE_DEV = 'production';
if (!__DEV__) NODE_DEV = 'production';
// if (!__DEV__ && AppConst.IS_DEV_BUILD) NODE_DEV = 'development';

const language = __DEV__ ? 'vi' : 'vi';

const testAccount = {
  // email: __DEV__ ? 'quynhtrang2010neu@gmail.com' : '',
  // password: __DEV__ ? '20101995' : ''
  email: __DEV__ ? 'giangdinhnd@gmail.com' : '',
  password: __DEV__ ? '123456789' : ''
};

const enabledFeature = {
  sticker: false,
  purchase: !isTestFlightVersion || AppConst.IS_ANDROID || __DEV__,
  downloadVideo: true,
  checkCorrectKaiwa1: true,
  kaiwaCertificateReceive: AppConst.IS_DEV_BUILD,
  testingCertificateReceive: AppConst.IS_DEV_BUILD,
  testingCertificateReceiveIgnoreResult: false,
  reviewViaFacebook: true,
  takeGift: true,
  commentKaiwaForTeacher: true,
  additionalCourse: true,
  pictureGuess: true
};

export default {
  // startScreen: __DEV__ && 'DebugScreen',
  NODE_DEV,
  testAccount,
  language,
  theme: Theme.TYPE.NORMAL,
  enabledFeature
};
