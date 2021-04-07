import { SAVE_SPEND_TIME } from './ActionTypes';

export function onSaveTime(payload) {
  return {
    type: SAVE_SPEND_TIME,
    payload: payload
  };
}
