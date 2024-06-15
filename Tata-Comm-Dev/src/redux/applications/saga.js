import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import {
  APPLICATIONS_GET,
  APPLICATIONS_DELETE,
  APPLICATIONS_ADD,
} from 'redux/constants';

import {
  getApplicationsSuccess,
  deleteApplicationSuccess,
  deleteApplicationError,
  addApplicationSuccess,
  addApplicationError,
} from './actions';

const getApplicationsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}integrations/apps`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getApplications({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getApplicationsAsync, payload);
    yield put(getApplicationsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteApplicationRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}integrations/hooks/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteApplication({ payload }) {
  try {
    const response = yield call(deleteApplicationRequest, payload);
    yield put(deleteApplicationSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteApplicationError(errorMsg));
  }
}

const addApplicationRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  const itemIdStr = postData.id ? `/${postData.id}` : '';
  return axios[method](
    `${apiUrlNew()}integrations/hooks${itemIdStr}`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addApplication({ payload }) {
  try {
    const response = yield call(addApplicationRequest, payload);
    yield put(addApplicationSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addApplicationError(errorMsg));
  }
}

export function* watchGetApplications() {
  yield takeEvery(APPLICATIONS_GET, getApplications);
  yield takeEvery(APPLICATIONS_DELETE, deleteApplication);
  yield takeEvery(APPLICATIONS_ADD, addApplication);
}

export default function* rootSaga() {
  yield all([fork(watchGetApplications)]);
}
