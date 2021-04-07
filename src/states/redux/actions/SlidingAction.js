import { IS_SLIDING, IS_SLIDING_COMPLETE } from './ActionTypes';

export function onSliding() {
  return {
    type: IS_SLIDING
  };
}

export function onSliComplete() {
  return {
    type: IS_SLIDING_COMPLETE
  };
}
