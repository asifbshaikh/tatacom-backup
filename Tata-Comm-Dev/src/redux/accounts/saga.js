import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import {
  ACCOUNT_GET,
  ACCOUNTS_GET,
  ACCOUNTS_DELETE,
  ACCOUNTS_ADD,
} from 'redux/constants';

import {
  getAccountSuccess,
  getAccountsSuccess,
  deleteAccountSuccess,
  deleteAccountError,
  addAccountSuccess,
  addAccountError,
} from './actions';

const getAccountAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getAccount({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getAccountAsync, payload);
    yield put(getAccountSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getAccountsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}accounts`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getAccounts({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getAccountsAsync, payload);
    yield put(getAccountsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteAccountRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}accounts/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteAccount({ payload }) {
  try {
    const response = yield call(deleteAccountRequest, payload);
    yield put(deleteAccountSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteAccountError(errorMsg));
  }
}

const addAccountRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  // const itemIdStr = postData.id ? `/${postData.id}` : '';
  const itemIdStr = '/';
  return axios[method](`${apiUrlNew()}${itemIdStr}`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addAccount({ payload }) {
  try {
    const response = yield call(addAccountRequest, payload);
    yield put(addAccountSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addAccountError(errorMsg));
  }
}

export function* watchGetAccounts() {
  yield takeEvery(ACCOUNT_GET, getAccount);
  yield takeEvery(ACCOUNTS_GET, getAccounts);
  yield takeEvery(ACCOUNTS_DELETE, deleteAccount);
  yield takeEvery(ACCOUNTS_ADD, addAccount);
}

export default function* rootSaga() {
  yield all([fork(watchGetAccounts)]);
}
