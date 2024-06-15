import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';

import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import {
  GET_NOTIFICATIONS_LIST,
  GET_NOTIFICATION_UNREAD_COUNT,
  UPDATE_NOTIFICATION_READ_STATUS,
} from 'redux/constants';

import {
  getNotificationsListSuccess,
  getNotificationsUnReadCountSuccess,
} from './actions';

const getNotificationsListRequest = async (param) => {
  const method = 'get';
  const { currentPage } = param;

  const apiUrlNotification = `${apiUrlNew()}notifications?page=${currentPage}`;
  return axios[method](apiUrlNotification, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};
function* getNotificationsList({ payload }) {
  try {
    const response = yield call(getNotificationsListRequest, payload);
    yield put(getNotificationsListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getNotificationUnReadCountRequest = async () => {
  const method = 'get';

  const apiUrlNotification = `${apiUrlNew()}notifications/unread_count`;
  return axios[method](apiUrlNotification, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getNotificationsUnReadCount() {
  try {
    const response = yield call(getNotificationUnReadCountRequest);
    yield put(getNotificationsUnReadCountSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const updateNotificationReadStatusRequest = async (payload) => {
  const method = 'post';
  const statusPayload = !payload.markAllDone ? payload : null;
  const apiUrlNotification = `${apiUrlNew()}notifications/read_all`;
  return axios[method](apiUrlNotification, statusPayload, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* updateNotificationReadStatus({ payload }) {
  try {
    yield call(updateNotificationReadStatusRequest, payload);
    yield call(getNotificationsUnReadCount);
    if (payload.callBack) {
      yield put(payload.callBack());
    }
  } catch (error) {
    commonRequestException(error);
  }
}

export function* watchGetNotificationsList() {
  yield takeEvery(GET_NOTIFICATIONS_LIST, getNotificationsList);
  yield takeEvery(GET_NOTIFICATION_UNREAD_COUNT, getNotificationsUnReadCount);
  yield takeEvery(
    UPDATE_NOTIFICATION_READ_STATUS,
    updateNotificationReadStatus
  );
}

export default function* rootSaga() {
  yield all([fork(watchGetNotificationsList)]);
}
