import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import {
  ATTRIBUTES_GET,
  ATTRIBUTES_DELETE,
  ATTRIBUTES_ADD,
} from 'redux/constants';

import {
  getAttributesSuccess,
  deleteAttributeSuccess,
  deleteAttributeError,
  addAttributeSuccess,
  addAttributeError,
} from './actions';

const getAttributesAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}custom_attribute_definitions`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getAttributes({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getAttributesAsync, payload);
    yield put(getAttributesSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteAttributeRequest = async (postData) => {
  const method = 'delete';
  return axios[method](
    `${apiUrlNew()}custom_attribute_definitions/${postData.id}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* deleteAttribute({ payload }) {
  try {
    const response = yield call(deleteAttributeRequest, payload);
    yield put(deleteAttributeSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteAttributeError(errorMsg));
  }
}

const addAttributeRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  const itemIdStr = postData.id ? `/${postData.id}` : '';
  return axios[method](
    `${apiUrlNew()}custom_attribute_definitions${itemIdStr}`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addAttribute({ payload }) {
  try {
    const response = yield call(addAttributeRequest, payload);
    yield put(addAttributeSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addAttributeError(errorMsg));
  }
}

export function* watchGetAttributes() {
  yield takeEvery(ATTRIBUTES_GET, getAttributes);
  yield takeEvery(ATTRIBUTES_DELETE, deleteAttribute);
  yield takeEvery(ATTRIBUTES_ADD, addAttribute);
}

export default function* rootSaga() {
  yield all([fork(watchGetAttributes)]);
}
