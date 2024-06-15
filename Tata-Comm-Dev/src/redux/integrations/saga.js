import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import {
  INTEGRATIONS_GET,
  INTEGRATIONS_DELETE,
  INTEGRATIONS_ADD,
} from 'redux/constants';

import {
  getIntegrationsSuccess,
  deleteIntegrationSuccess,
  deleteIntegrationError,
  addIntegrationSuccess,
  addIntegrationError,
} from './actions';

const getIntegrationsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}webhooks`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getIntegrations({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getIntegrationsAsync, payload);
    yield put(getIntegrationsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteIntegrationRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}webhooks/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteIntegration({ payload }) {
  try {
    const response = yield call(deleteIntegrationRequest, payload);
    yield put(deleteIntegrationSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteIntegrationError(errorMsg));
  }
}

const addIntegrationRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  const itemIdStr = postData.id ? `/${postData.id}` : '';
  return axios[method](`${apiUrlNew()}webhooks${itemIdStr}`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addIntegration({ payload }) {
  try {
    const response = yield call(addIntegrationRequest, payload);
    yield put(addIntegrationSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addIntegrationError(errorMsg));
  }
}

export function* watchGetIntegrations() {
  yield takeEvery(INTEGRATIONS_GET, getIntegrations);
  yield takeEvery(INTEGRATIONS_DELETE, deleteIntegration);
  yield takeEvery(INTEGRATIONS_ADD, addIntegration);
}

export default function* rootSaga() {
  yield all([fork(watchGetIntegrations)]);
}
