import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import {
  S3SFTP_IMPORT_SOURCE_TYPE_ADD,
  DB_CONFIG_TEST,
  DB_CONFIG_SHOW,
  DB_CONFIG_EDIT,
  GET_DB_CONNECTION_LIST,
  DB_CONFIG_SAVE,
  GET_DB_CONNECTION_DROPDOWN_LIST,
  GET_TABLE_PREVIEW,
  GET_IMPORT_SCHEDULER_LIST,
  GET_IMPORT_SCHEDULER_BY_ID,
  ADD_UPDATE_S3SFTP_DB_IMPORT,
  DB_CONNECTION_DELETE,
  GET_IMPORT_SCHEDULER_DETAIL,
  SHOW_IMPORT_LIST,
  DELETE_IMPORT,
} from 'redux/constants';
import axios from 'axios';

import {
  addS3SFTPImportSourceTypeSuccess,
  testDBConfigSuccess,
  testDBConfigError,
  showDBConfigSuccess,
  showDBConfigError,
  editDBConfigSuccess,
  editDBConfigError,
  saveDBConfigSuccess,
  saveDBConfigError,
  getDbConnectionListSuccess,
  getDbConnectionDropdownListSuccess,
  getTablePreviewError,
  getTablePreviewSuccess,
  getImportSchedulerListSuccess,
  addUpdateS3SFTPImportSuccess,
  getImportSchedulerByIdSuccess,
  addUpdateS3SFTPImportError,
  deleteDbConnectionSuccess,
  deleteDbConnectionError,
  getImportSchedulerDetailSuccess,
  getImportSchedulerDetailError,
  saveDBImportError,
  saveDBImportSuccess,
  showImportListSuccess,
  showImportListError,
  deleteImportError,
  deleteImportSuccess,
} from 'redux/s3-sftp/actions';

import {
  apiUrlNewV3,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';
import { getPayloadForEditDB } from 'helpers/S3SFTPHelper';

function* addS3SFTPImportSourceType({ payload }) {
  yield put(addS3SFTPImportSourceTypeSuccess(payload));
}

const getDbConnectionListAsync = async (payload) => {
  const method = 'get';

  let query = `?page=${payload.pageno}`;
  if (payload.selectedPageSize) {
    query += `&per_page=${payload.selectedPageSize}`;
  }

  return axios[method](`${apiUrlNewV3()}configurations/db${query}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getDbConnectionList({ payload }) {
  try {
    const response = yield call(getDbConnectionListAsync, payload);
    yield put(getDbConnectionListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getDbConnectionDropdownListAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}configurations/db/configuration_list`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data.db_configurations;
  });
};

function* getDbConnectionDropdownList({ payload }) {
  try {
    const response = yield call(getDbConnectionDropdownListAsync, payload);
    yield put(getDbConnectionDropdownListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const saveDBConfigurationRequest = async (data) => {
  const method = 'post';
  return axios[method](`${apiUrlNewV3()}configurations/db`, data, {
    headers: getHeaders(),
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const errorMsg = error.response.data;
      return errorMsg;
    });
};

function* saveDBConfiguration({ payload }) {
  try {
    const response = yield call(saveDBConfigurationRequest, payload);
    if ('errors' in response) {
      yield put(saveDBConfigError(response));
    } else {
      yield put(saveDBConfigSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(saveDBConfigError(errorMsg));
  }
}

const testDBConfigurationRequest = async (data) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}configurations/db/test_connection`,
    data,
    {
      headers: getHeaders(),
    }
  )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const errorMsg = error.response.data;
      return errorMsg;
    });
};

function* testDBConfiguration({ payload }) {
  try {
    const response = yield call(testDBConfigurationRequest, payload);
    if ('error' in response || 'errors' in response) {
      yield put(testDBConfigError(response));
    } else {
      yield put(testDBConfigSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(testDBConfigError(errorMsg));
  }
}

const getDbTableDetailsRequest = async (data) => {
  const method = 'post';
  return axios[method](`${apiUrlNewV3()}schedule_details/db/preview`, data, {
    headers: getHeaders(),
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const errorMsg = error.response.data;
      return errorMsg;
    });
};

const showDBConfigurationRequest = async (id) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}configurations/db/${id}`, {
    headers: getHeaders(),
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const errorMsg = error.response.data;
      return errorMsg;
    });
};

function* getDbTableDetails({ payload }) {
  try {
    const response = yield call(getDbTableDetailsRequest, payload);
    if ('error' in response) {
      yield put(getTablePreviewError(response));
    } else {
      yield put(getTablePreviewSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(getTablePreviewError(errorMsg));
  }
}

function* showDBConfiguration({ payload }) {
  try {
    const response = yield call(showDBConfigurationRequest, payload);
    if ('error' in response) {
      yield put(showDBConfigError(response));
    } else {
      yield put(showDBConfigSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(showDBConfigError(errorMsg));
  }
}

const editDBConfigurationRequest = async (data) => {
  const method = 'patch';
  return axios[method](
    `${apiUrlNewV3()}configurations/db/${data.id}`,
    data.edit_payload,
    {
      headers: getHeaders(),
    }
  )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const errorMsg = error.response.data;
      return errorMsg;
    });
};

function* editDBConfiguration({ payload }) {
  try {
    const response = yield call(editDBConfigurationRequest, payload);
    if ('errors' in response) {
      yield put(editDBConfigError(response));
    } else {
      yield put(editDBConfigSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(editDBConfigError(errorMsg));
  }
}

const deleteDbConnectionRequest = async (payload) => {
  const method = 'delete';
  return axios[method](`${apiUrlNewV3()}configurations/db/${payload.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteDbConnection({ payload }) {
  try {
    const response = yield call(deleteDbConnectionRequest, payload);
    yield put(deleteDbConnectionSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteDbConnectionError(errorMsg));
  }
}

const getImportSchedulerListAsync = async (payload) => {
  const method = 'get';

  let query = `?page=${payload.pageno}`;
  if (payload.selectedPageSize) {
    query += `&per_page=${payload.selectedPageSize}`;
  }
  if (payload.import_type) {
    query += `&import_type=${payload.import_type}`;
  }

  return axios[method](`${apiUrlNewV3()}schedule_details/db${query}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getImportSchedulerList({ payload }) {
  try {
    const response = yield call(getImportSchedulerListAsync, payload);
    yield put(getImportSchedulerListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getImportSchedulerDetailsAsync = async ({ id }) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}schedule_details/db/${id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getImportSchedulerDetails({ payload }) {
  try {
    const response = yield call(getImportSchedulerDetailsAsync, payload);
    yield call(showImportList, { payload });
    if ('error' in response) {
      yield put(getImportSchedulerDetailError(response));
    } else {
      yield put(getImportSchedulerDetailSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(getImportSchedulerDetailError(errorMsg));
  }
}

const getImportSchedulerByIdAsync = async ({ id }) => {
  const method = 'get';

  return axios[method](`${apiUrlNewV3()}schedule_details/db/${id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getImportSchedulerById({ payload }) {
  try {
    const response = yield call(getImportSchedulerByIdAsync, payload);
    const mappedObject = yield call(getPayloadForEditDB, response.db_schedule);
    yield put(getImportSchedulerByIdSuccess(mappedObject));
  } catch (error) {
    commonRequestException(error);
  }
}

const addUpdateS3SFTPImportAsync = async (payload) => {
  const method = payload.id ? 'patch' : 'post';
  const id = payload.id ? `/${payload.id}` : '';
  const data = { db_schedule_detail: { ...payload.db_schedule_detail } };
  return axios[method](`${apiUrlNewV3()}schedule_details/db${id}`, data, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addUpdateS3SFTPImport({ payload }) {
  try {
    const response = yield call(addUpdateS3SFTPImportAsync, payload);
    yield put(addUpdateS3SFTPImportSuccess(response));
  } catch (error) {
    yield put(addUpdateS3SFTPImportError(error.response.data));
  }
}

const showImportListRequest = async (id) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}schedule_details/db/${id}/imports`, {
    headers: getHeaders(),
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const errorMsg = error.response.data;
      return errorMsg;
    });
};

function* showImportList({ payload }) {
  try {
    const response = yield call(showImportListRequest, payload.id);
    if ('error' in response) {
      yield put(showImportListError(response));
    } else {
      yield put(showImportListSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(showImportListError(errorMsg));
  }
}

const deleteDbImportRequest = async (payload) => {
  const method = 'patch';
  return axios[method](
    `${apiUrlNewV3()}schedule_details/db/${payload}/deactivate`,
    {},
    {
      headers: getHeaders(),
    }
  )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const errorMsg = error.response.data;
      return errorMsg;
    });
};

function* deleteDbImport({ payload }) {
  try {
    const response = yield call(deleteDbImportRequest, payload);
    if ('errors' in response) {
      yield put(deleteImportError(response));
    } else {
      yield put(deleteImportSuccess({ response, payload }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteImportError(errorMsg));
  }
}

export function* watchDBimports() {
  yield takeEvery(S3SFTP_IMPORT_SOURCE_TYPE_ADD, addS3SFTPImportSourceType);
  yield takeEvery(GET_DB_CONNECTION_LIST, getDbConnectionList);
  yield takeEvery(GET_DB_CONNECTION_DROPDOWN_LIST, getDbConnectionDropdownList);
  yield takeEvery(DB_CONNECTION_DELETE, deleteDbConnection);
  yield takeEvery(DB_CONFIG_SAVE, saveDBConfiguration);
  yield takeEvery(DB_CONFIG_TEST, testDBConfiguration);
  yield takeEvery(GET_TABLE_PREVIEW, getDbTableDetails);
  yield takeEvery(DB_CONFIG_SHOW, showDBConfiguration);
  yield takeEvery(DB_CONFIG_EDIT, editDBConfiguration);
  yield takeEvery(GET_IMPORT_SCHEDULER_LIST, getImportSchedulerList);
  yield takeEvery(GET_IMPORT_SCHEDULER_DETAIL, getImportSchedulerDetails);
  yield takeEvery(SHOW_IMPORT_LIST, showImportList);
  yield takeEvery(DELETE_IMPORT, deleteDbImport);
  yield takeEvery(GET_IMPORT_SCHEDULER_BY_ID, getImportSchedulerById);
  yield takeEvery(ADD_UPDATE_S3SFTP_DB_IMPORT, addUpdateS3SFTPImport);
}

export default function* rootSaga() {
  yield all([fork(watchDBimports)]);
}
