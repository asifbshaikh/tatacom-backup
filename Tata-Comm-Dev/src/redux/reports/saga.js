import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';

import {
  apiUrlNewV3,
  apiUrlNewV2,
  getHeaders,
  commonRequestException,
  apiUrlNew,
} from 'helpers/ApiHelper';

import {
  OVERVIEW_GET,
  OVERVIEW_GET_DETAILS,
  OVERVIEW_DOWNLOAD,
  CSAT_GET,
  CSAT_GET_DETAILS,
  USER_REPORT_GET_LIST,
  GET_SEARCH_USER_REPORT_LIST,
  USER_REPORT_UPDATE,
  USER_REPORT_DOWNLOAD,
} from 'redux/constants';

import {
  getOverviewSuccess,
  getOverviewDetailsSuccess,
  downloadOverviewSuccess,
  downloadOverviewError,
  getCsatSuccess,
  getCsatDetailsSuccess,
  getUserReportsSuccess,
  getSearchUserReportsSuccess,
  updateUserReportError,
  updateUserReportSuccess,
  downloadUserReportSuccess,
  downlaodUserReportError,
} from './actions';

const getOverviewAsync = async (param) => {
  const method = 'get';
  // /reports/summary?since=1673634600&until=1674239399&type=account&group_by=day
  return axios[method](`${apiUrlNewV2()}reports/summary`, {
    headers: getHeaders(),
    params: param,
  }).then((res) => {
    return res.data;
  });
};
function* getOverview({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getOverviewAsync, payload);
    yield put(getOverviewSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getOverviewDetailsAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV2()}reports`, {
    headers: getHeaders(),
    params: param,
  }).then((res) => {
    return res.data;
  });
};
function* getOverviewDetails({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getOverviewDetailsAsync, payload);
    yield put(getOverviewDetailsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const downloadOverviewAsync = async (param) => {
  const method = 'get';
  let urlType = '';
  switch (param.type) {
    case 'team':
      urlType = 'teams';
      break;
    case 'label':
      urlType = 'labels';
      break;
    case 'inbox':
      urlType = 'inboxes';
      break;
    default:
      urlType = 'agents';
      break;
  }
  return axios[method](`${apiUrlNewV2()}reports/${urlType}`, {
    headers: getHeaders(),
    params: param,
  }).then((res) => {
    return res.data;
  });
};
function* downloadOverview({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(downloadOverviewAsync, payload);
    yield put(downloadOverviewSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(downloadOverviewError(errorMsg));
  }
}

const getCsatAsync = async (param) => {
  const method = 'get';
  // /reports/summary?since=1673634600&until=1674239399&type=account&group_by=day
  return axios[method](`${apiUrlNew()}csat_survey_responses/metrics`, {
    headers: getHeaders(),
    params: param,
  }).then((res) => {
    return res.data;
  });
};
function* getCsat({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCsatAsync, payload);
    yield put(getCsatSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getCsatDetailsAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}csat_survey_responses`, {
    headers: getHeaders(),
    params: param,
  }).then((res) => {
    return res.data;
  });
};
function* getCsatDetails({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCsatDetailsAsync, payload);
    yield put(getCsatDetailsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getUserReportsAsync = async ({ page, selectedPageSize }) => {
  const method = 'get';
  const res = await axios[method](
    `${apiUrlNewV3()}users/3/contacts_reports?limit=${selectedPageSize}&page=${page}`,
    {
      headers: getHeaders(),
    }
  );
  return res.data;
};

function* getUsersReport({ payload }) {
  try {
    const response = yield call(getUserReportsAsync, payload);
    yield put(getUserReportsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getSearchUserReportsAsync = async ({
  page,
  selectedPageSize,
  searchWord,
}) => {
  const method = 'get';
  const res = await axios[method](
    `${apiUrlNewV3()}users/3/contacts_reports?limit=${selectedPageSize}&page=${page}&search=${searchWord}`,
    {
      headers: getHeaders(),
    }
  );
  return res.data;
};

function* getSearchUsersReport({ payload }) {
  try {
    const response = yield call(getSearchUserReportsAsync, payload);
    yield put(getSearchUserReportsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const updateUsersReportRequest = async (row) => {
  const method = `put`;
  return axios[method](
    `${apiUrlNewV3()}users/3/contacts_reports/${row.id}/rerun_report`,
    row,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* updateUsersReport({ payload }) {
  try {
    const response = yield call(updateUsersReportRequest, payload);
    yield put(updateUserReportSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateUserReportError(errorMsg));
  }
}

const downloadUsersReportRequest = async (row) => {
  const method = `put`;
  return axios[method](
    `${apiUrlNewV3()}users/3/contacts_reports/${row.id}/download_file`,
    row,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* downloadUsersReport({ payload }) {
  try {
    const response = yield call(downloadUsersReportRequest, payload);
    yield put(downloadUserReportSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(downlaodUserReportError(errorMsg));
  }
}

export function* watchOverview() {
  yield takeEvery(OVERVIEW_GET, getOverview);
  yield takeEvery(OVERVIEW_GET_DETAILS, getOverviewDetails);
  yield takeEvery(OVERVIEW_DOWNLOAD, downloadOverview);
}
export function* watchCsat() {
  yield takeEvery(CSAT_GET, getCsat);
  yield takeEvery(CSAT_GET_DETAILS, getCsatDetails);
}

export function* watchUsersReport() {
  yield takeEvery(USER_REPORT_GET_LIST, getUsersReport);
}

export function* watchSearchUsersReport() {
  yield takeEvery(GET_SEARCH_USER_REPORT_LIST, getSearchUsersReport);
}

export function* watchUpdateUsersReport() {
  yield takeEvery(USER_REPORT_UPDATE, updateUsersReport);
}

export function* watchDownloadUsersReport() {
  yield takeEvery(USER_REPORT_DOWNLOAD, downloadUsersReport);
}

export default function* rootSaga() {
  yield all([
    fork(watchOverview),
    fork(watchCsat),
    fork(watchUsersReport),
    fork(watchSearchUsersReport),
    fork(watchUpdateUsersReport),
    fork(watchDownloadUsersReport),
  ]);
}
