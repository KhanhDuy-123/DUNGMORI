import BlogActionType from '../actionTypes/BlogActionType';

const initialState = { listBlog: [], listSeries: [] };

export const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case BlogActionType.GET_LIST_NEW_BLOG_SUCCESS:
      return { ...state, listBlog: action.listBlog };
    case BlogActionType.GET_LIST_SERIES_SUCCESS:
      return { ...state, listSeries: action.listSeries };
    default:
      return state;
  }
};
