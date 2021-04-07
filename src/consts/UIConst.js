import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// 375 iphone 6
const scale = width / 375 < 1.5 ? width / 375 : 1.5;

export default {
  WIDTH: width,
  HEIGHT: height,
  SCALE: scale,
  FONT_SIZE: 13 * scale,
  MAX_WIDTH: width - 40 > 400 ? 400 : width - 40,
  LOGO_STYLE: {
    width: 90 * scale,
    height: 90 * scale
  }
};
