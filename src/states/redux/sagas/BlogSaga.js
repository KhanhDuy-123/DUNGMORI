import LoadingModal from 'common/components/base/LoadingModal';
import Const from 'consts/Const';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import BlogActionType from '../actionTypes/BlogActionType';

export function* watchBlog() {
  yield takeLatest(BlogActionType.GET_LIST_NEW_BLOG, getNewBlogs);
  yield takeLatest(BlogActionType.GET_LIST_SERIES, getSeries);
}

export function* getNewBlogs({ loadmore = false, page = 1, keyWords = '', onSuccess = () => {}, seriesId } = {}) {
  try {
    let data = { page };
    let listBlog = [];
    if (keyWords) data.key_words = keyWords;
    if (seriesId) data.series_id = seriesId;
    if (loadmore) listBlog = yield select((state) => state.blogReducer.listBlog);
    const newBlogs = yield call(Fetch.get, Const.API.BLOG.GET_NEW_BLOG, data, false);
    LoadingModal.hide();
    if (newBlogs.status == Fetch.Status.SUCCESS) {
      if (newBlogs.data.newBlogs.length > 0) {
        listBlog = [...listBlog, ...newBlogs.data.newBlogs];
        yield put({
          type: BlogActionType.GET_LIST_NEW_BLOG_SUCCESS,
          listBlog: listBlog
        });
      }
      if (onSuccess !== undefined) yield onSuccess(listBlog, keyWords);
    }
  } catch (error) {
    Funcs.log(error);
  }
}

function* getSeries({ loadmore, page }) {
  try {
    const data = {
      page: page
    };
    let listSeries = [];
    if (loadmore) listSeries = yield select((state) => state.blogReducer.listSeries);
    let series = yield call(Fetch.get, Const.API.BLOG.GET_SERIES, data, false);
    LoadingModal.hide();
    if (series.status == Fetch.Status.SUCCESS) {
      if (series.data.series.length > 0) {
        listSeries = listSeries.concat(series.data.series);
        yield put({
          type: BlogActionType.GET_LIST_SERIES_SUCCESS,
          listSeries
        });
      }
    }
  } catch (error) {
    Funcs.log(error);
  }
}
