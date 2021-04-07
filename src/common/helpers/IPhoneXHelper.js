import DeviceInfo from 'react-native-device-info';
import { Dimensions, Platform, StatusBar } from 'react-native';

const dimenScreen = Dimensions.get('screen').height;
const dimenWindow = Dimensions.get('window').height;

export var isIphone12 = false;

export async function init() {
  let name = await DeviceInfo.getDeviceName();
  isIphone12 = name.toLowerCase().indexOf('iphone 12') >= 0;
}

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight() {
  let statusBarHeight = 20;
  if (Platform.OS === 'android') {
    statusBarHeight = StatusBar.currentHeight;
  } else if (isIphoneX() || isIphone12) {
    statusBarHeight = dimenScreen - (dimenWindow - getBottomSpace());
  }
  return statusBarHeight;
}

export function getBottomSpace() {
  return isIphoneX() || isIphone12 ? 34 : 0;
}

export default {
  isIphoneX,
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace,
  isIphone12,
  init
};
