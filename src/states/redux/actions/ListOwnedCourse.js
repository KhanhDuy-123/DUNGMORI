import { LIST_OWNED } from './ActionTypes';

export function onSaveListCourse(payload) {
  return {
    type: LIST_OWNED,
    payload: payload
  };
}
