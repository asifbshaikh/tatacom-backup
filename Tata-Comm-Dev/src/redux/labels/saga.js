import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import { LABELS_GET, LABELS_DELETE, LABELS_ADD } from 'redux/constants';

import {
  getLabelsSuccess,
  deleteLabelSuccess,
  deleteLabelError,
  addLabelSuccess,
  addLabelError,
} from './actions';

const getLabelsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}labels`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getLabels({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getLabelsAsync, payload);
    yield put(getLabelsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteLabelRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}labels/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteLabel({ payload }) {
  try {
    const response = yield call(deleteLabelRequest, payload);
    yield put(deleteLabelSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteLabelError(errorMsg));
  }
}

const addLabelRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  const itemIdStr = postData.id ? `/${postData.id}` : '';
  return axios[method](`${apiUrlNew()}labels${itemIdStr}`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addLabel({ payload }) {
  try {
    const response = yield call(addLabelRequest, payload);
    yield put(addLabelSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addLabelError(errorMsg));
  }
}

export function* watchGetLabels() {
  yield takeEvery(LABELS_GET, getLabels);
  yield takeEvery(LABELS_DELETE, deleteLabel);
  yield takeEvery(LABELS_ADD, addLabel);
}

export default function* rootSaga() {
  yield all([fork(watchGetLabels)]);
}
