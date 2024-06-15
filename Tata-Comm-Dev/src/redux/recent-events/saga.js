import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  apiUrlNewV3,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';
import { GET_RECENT_EVENTS } from 'redux/constants';
import { getRecentEventListSuccess } from './actions';

const getRecentEventListAsync = async ({ payload }) => {
  const method = 'get';

  let query = `?page=${payload?.currentPage}`;
  if (payload?.selectedPageSize) {
    query += `&result_per_page=${payload?.selectedPageSize}`;
  }

  return axios[method](`${apiUrlNewV3()}get_event_log${query}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getRecentEventsList(payload) {
  try {
    const response = yield call(getRecentEventListAsync, payload);
    yield put(getRecentEventListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

export function* watchDBimports() {
  yield takeEvery(GET_RECENT_EVENTS, getRecentEventsList);
}
export default function* rootSaga() {
  yield all([fork(watchDBimports)]);
}
