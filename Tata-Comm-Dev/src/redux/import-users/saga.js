import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNewV3,
  commonRequestException,
  getHeaders,
} from 'helpers/ApiHelper';
import { currentUserID } from 'helpers/Utils';
import {
  GET_COLUMN_ATTRIBUTE_LIST,
  GET_PAST_IMPORTUSERS_FILE_LIST,
  UPLOAD_IMPORTUSERS_CSV_FILE,
} from 'redux/constants';
import {
  getImportUserFileListSuccess,
  uploadImportUserCSVFileError,
  uploadImportUserCSVFileSuccess,
  getColumnAttributeListSuccess,
  uploadImportUserCSVFileClean,
} from './actions';

const getPastImportUserListRequest = async (items) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}import_users?user_id=${currentUserID()}&page=${
      items.pageno
    }&result_per_page=${items.selectedPageSize}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getImportUserFileList({ payload }) {
  try {
    const response = yield call(getPastImportUserListRequest, payload);
    yield put(getImportUserFileListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getColAttributeListRequest = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}import_users/user_attribute_mapping`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data.response;
  });
};

function* getColumnAttributeList({ payload }) {
  try {
    const response = yield call(getColAttributeListRequest, payload);
    yield put(getColumnAttributeListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const uploadImportUserCSVFileRequest = async (item, importUser) => {
  const formData = new FormData();
  formData.append('file', item.file);
  formData.append('import_user', importUser);
  const method = 'post';
  return axios[method](`${apiUrlNewV3()}import_users/import`, formData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* uploadImportUserCSVFile({ payload }) {
  try {
    const importUser = JSON.stringify(payload.import_user);
    const response = yield call(
      uploadImportUserCSVFileRequest,
      payload,
      importUser
    );
    yield put(uploadImportUserCSVFileSuccess(response));
    yield put(uploadImportUserCSVFileClean());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(uploadImportUserCSVFileError(errorMsg));
    yield put(uploadImportUserCSVFileClean());
  }
}

export function* watchGetImportUserFileList() {
  yield takeEvery(GET_PAST_IMPORTUSERS_FILE_LIST, getImportUserFileList);
}

export function* watchGetColumnAttributeList() {
  yield takeEvery(GET_COLUMN_ATTRIBUTE_LIST, getColumnAttributeList);
}

export function* watchUploadImportUserCSVFile() {
  yield takeEvery(UPLOAD_IMPORTUSERS_CSV_FILE, uploadImportUserCSVFile);
}

export default function* rootSaga() {
  yield all([fork(watchGetImportUserFileList)]);
  yield all([fork(watchGetColumnAttributeList)]);
  yield all([fork(watchUploadImportUserCSVFile)]);
}
