import { LIST_OWNED } from '../actions/ActionTypes';

const initialState = { listCourse: [] };

export const listOwnCourseReducer = (state = initialState, action) => {
  if (action.type == LIST_OWNED) {
    return (state = {
      ...state,
      listCourse: action.payload
    });
  }
  return state;
};
