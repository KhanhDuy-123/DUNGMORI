import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

let widthParent = width;
let heightParent = height;
let landscape = width > height;
if (landscape) {
  widthParent = height;
  heightParent = width;
}

let scale = widthParent / 320;
let scaleWidth = scale;
let scaleHeight = heightParent / 528;
if (scale >= 1.5) scale = 1.5;

let isIPad = widthParent > 600;

export default {
  widthParent,
  heightParent,
  scale,
  scaleWidth,
  scaleHeight,
  isIPad
};
