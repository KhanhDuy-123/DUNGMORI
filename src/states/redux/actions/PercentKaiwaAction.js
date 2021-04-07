import { PERCENT_KAIWA } from './ActionTypes';

export function onSavePercent(payload) {
  return {
    type: PERCENT_KAIWA,
    payload: payload
  };
}
