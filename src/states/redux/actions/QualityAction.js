import { VIDEO_QUALITY } from './ActionTypes';

export function onChangeHD(quality) {
  return {
    type: VIDEO_QUALITY,
    payload: quality
  };
}
