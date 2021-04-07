import BlogActionType from '../actionTypes/BlogActionType';
import Store from '../Store';

const getListBlog = (loadmore = false, page = 1, keyWords, onSuccess = () => {}, seriesId = null) =>
  Store.dispatch({
    type: BlogActionType.GET_LIST_NEW_BLOG,
    page,
    keyWords,
    onSuccess,
    loadmore,
    seriesId
  });

const getListSeries = (loadmore = false, page = 1) =>
  Store.dispatch({
    type: BlogActionType.GET_LIST_SERIES,
    page,
    loadmore
  });

export default {
  getListBlog,
  getListSeries
};
