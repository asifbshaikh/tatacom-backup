import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  getHeaders,
  commonRequestException,
  apiUrlNewV3,
} from 'helpers/ApiHelper';

import {
  GET_CONTROL_GROUPS,
  CREATE_CONTROL_GROUPS,
  DELETE_CONTROL_GROUPS,
  DOWNLOAD_CONTROL_GROUPS,
} from 'redux/constants';

import {
  createControlGroupsSuccess,
  createControlFailure,
  getControlGroupsSuccess,
  downloadCreateControlGroupsSuccess,
  downloadCreateControlGroupsReset,
  deleteCreateControlGroupsSuccess,
  deleteCreateControlGroupsSuccessReset,
} from './actions';

const getControlGroupsAsync = async (param) => {
  let method = 'get';
  if (param && param !== '') {
    return axios[method](`${apiUrlNewV3()}global_control_groups/${param}`, {
      headers: getHeaders(),
    }).then((res) => {
      return res.data;
    });
  } else {
    return axios[method](`${apiUrlNewV3()}global_control_groups`, {
      headers: getHeaders(),
    }).then((res) => {
      return res.data;
    });
  }
};

function* getControlGroups({ payload }) {
  try {
    const response = yield call(getControlGroupsAsync, payload);
    yield put(getControlGroupsSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(createControlFailure(errorMsg));
  }
}

const getCreateControlGroupsAsync = async (param) => {
  let method = 'post';
  let postData = param.payload;

  if (param.edit) {
    method = 'put';
    return axios[method](
      `${apiUrlNewV3()}global_control_groups/${param.groupID}`,
      postData,
      {
        headers: getHeaders(),
      }
    ).then((res) => {
      return res.data;
    });
  } else {
    return axios[method](`${apiUrlNewV3()}global_control_groups`, postData, {
      headers: getHeaders(),
    }).then((res) => {
      return res.data;
    });
  }
};

function* createControl({ payload }) {
  try {
    const response = yield call(getCreateControlGroupsAsync, payload);
    yield put(createControlGroupsSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(createControlFailure(errorMsg));
  }
}

const getDeleteControlGroupsAsync = async (param) => {
  let method = 'delete';
  return axios[method](`${apiUrlNewV3()}global_control_groups/${param}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteControlGroups({ payload }) {
  try {
    const response = yield call(getDeleteControlGroupsAsync, payload);
    yield put(deleteCreateControlGroupsSuccess());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteCreateControlGroupsSuccessReset(errorMsg));
  }
}

const getDownloadGroupsAsync = async (param) => {
  let method = 'get';
  return axios[method](
    `${apiUrlNewV3()}global_control_groups/${param.id}/download_users_csv_file`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ControlGroups_${param.id}_${param.created_at}`;
    a.click();
    return res.data;
  });
};

function* downloadControlGroups({ payload }) {
  try {
    const response = yield call(getDownloadGroupsAsync, payload);
    yield put(downloadCreateControlGroupsSuccess());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(downloadCreateControlGroupsReset(errorMsg));
  }
}

export function* watchGetControlGroups() {
  yield takeEvery(GET_CONTROL_GROUPS, getControlGroups);
  yield takeEvery(CREATE_CONTROL_GROUPS, createControl);
  yield takeEvery(DELETE_CONTROL_GROUPS, deleteControlGroups);
  yield takeEvery(DOWNLOAD_CONTROL_GROUPS, downloadControlGroups);
}

export default function* rootSaga() {
  yield all([fork(watchGetControlGroups)]);
}
