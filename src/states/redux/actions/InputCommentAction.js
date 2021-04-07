import { HIDE_INPUT_COMMENT, SHOW_INPUT_COMMENT } from './ActionTypes';

export function onHideInput() {
  return {
    type: HIDE_INPUT_COMMENT
  };
}

export function onShowInput() {
  return {
    type: SHOW_INPUT_COMMENT
  };
}
