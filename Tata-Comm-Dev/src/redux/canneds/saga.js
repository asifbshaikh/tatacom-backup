import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import { CANNEDS_GET, CANNEDS_DELETE, CANNEDS_ADD } from 'redux/constants';

import {
  getCannedsSuccess,
  deleteCannedSuccess,
  deleteCannedError,
  addCannedSuccess,
  addCannedError,
} from './actions';

const getCannedsAsync = async (param) => {
  const method = 'get';
  // let searchParams = '';
  // if (typeof param === 'object' && param.search) {
  //     searchParams = `?search=${param.search}`;
  // }
  return axios[method](`${apiUrlNew()}canned_responses`, {
    headers: getHeaders(),
    ...(typeof param === 'object' ? { params: param } : {}),
  }).then((res) => {
    return res.data;
  });
};

function* getCanneds({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCannedsAsync, payload);
    yield put(getCannedsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteCannedRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}canned_responses/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteCanned({ payload }) {
  try {
    const response = yield call(deleteCannedRequest, payload);
    yield put(deleteCannedSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteCannedError(errorMsg));
  }
}

const addCannedRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  const itemIdStr = postData.id ? `/${postData.id}` : '';
  return axios[method](`${apiUrlNew()}canned_responses${itemIdStr}`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addCanned({ payload }) {
  try {
    const response = yield call(addCannedRequest, payload);
    yield put(addCannedSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addCannedError(errorMsg));
  }
}

export function* watchGetCanneds() {
  yield takeEvery(CANNEDS_GET, getCanneds);
  yield takeEvery(CANNEDS_DELETE, deleteCanned);
  yield takeEvery(CANNEDS_ADD, addCanned);
}

export default function* rootSaga() {
  yield all([fork(watchGetCanneds)]);
}
