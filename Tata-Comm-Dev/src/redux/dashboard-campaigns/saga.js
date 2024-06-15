import {
  all,
  call,
  fork,
  put,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import {
  apiUrlNewV3,
  commonRequestException,
  getHeaders,
} from 'helpers/ApiHelper';
import {
  GET_CAMPAIGN_ANALYTICS,
  GET_DASHBOARD_CAMPAIGNS_LIST,
  GET_DASHBOARD_CAMPAIGN_INFO,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD,
  GET_EMAIL_SUBMIT,
  GET_AB_DASHBOARD_CAMPAIGN2_LIST,
  GET_AB_DASHBOARD_CAMPAIGN1_LIST,
  GET_OPTIONS_FOR_FILTERS,
  RESCHEDULE_CAMPAIGN,
  CANCEL_CAMPAIGN,
  PAUSE_CAMPAIGN,
  RESUME_CAMPAIGN,
  GENERATE_TINY_URL_REPORT,
} from 'redux/constants';
import {
  getDashboardCampaignsListSuccess,
  getCampaignInfoSuccess,
  getCampaignAnalyticsSuccess,
  getCampaignsDetailsExportDownloadSuccess,
  getCampaignsDetailsExportDownloadFailure,
  getAbDashboardCampaignsListSuccess,
  emailSuccess,
  cancelSuccess,
  resumeSuccess,
  pauseSuccess,
  generateTinyUrlReportSuccess,
  generateTinyUrlReportError,
  generateTinyUrlReportClean,
} from './actions';
import { NotificationManager } from 'components/common/react-notifications';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import IntlMessages from 'helpers/IntlMessages';

const getDashboardCampaignsListRequest = async (payload) => {
  let query = `?page=${payload?.page}&limit=${payload?.selectedPageSize}`;
  if (payload?.filter) {
    query += `&query=${payload?.filter.toLowerCase()}`;
  }
  if (payload?.campaign_name && payload?.campaign_name !== '') {
    query += `&campaign_name=${payload?.campaign_name.toLowerCase()}`;
  }
  if (payload?.delivery_types && payload?.delivery_types?.length > 0) {
    query += `&delivery_types=${payload?.delivery_types
      .toString()
      .toLowerCase()}`;
  }
  if (payload?.start_date && payload?.start_date?.length > 0) {
    query += `&start_date=${payload?.start_date.toString().toLowerCase()}`;
  }
  if (payload?.end_date && payload?.end_date?.length > 0) {
    query += `&end_date=${payload?.end_date.toString().toLowerCase()}`;
  }
  if (payload?.channel_types && payload?.channel_types?.length > 0) {
    query += `&channel_types=${payload?.channel_types
      .toString()
      .toLowerCase()}`;
  }
  if (payload.moreFilters) {
    if (payload.moreFilters.filter === 'status') {
      let query1 = payload.moreFilters.value.map((val) => val.value);
      query += `&status=${query1}`;
    } else if (payload.moreFilters.filter === 'createdBy') {
      let query1 = payload.moreFilters.createdBy;
      query += `&created_by=${query1}`;
    } else if (payload.moreFilters.filter === 'both') {
      let query1 = payload.moreFilters.value.map((val) => val.value);
      query += `&status=${query1}&created_by=${payload.moreFilters.createdBy}`;
    }
  }
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}campaigns${query}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getDashboardCampaignsList({ payload }) {
  try {
    const response = yield call(getDashboardCampaignsListRequest, payload);
    yield put(getDashboardCampaignsListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* getAbDashboardCampaign1List({ payload }) {
  try {
    const response = yield call(getDashboardCampaignsListRequest, payload);
    // update campaign list data based on type
    response.type = payload.type;
    yield put(getAbDashboardCampaignsListSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    NotificationManager.error(errorMsg.errorMsg);
  }
}
function* getAbDashboardCampaign2List({ payload }) {
  try {
    const response = yield call(getDashboardCampaignsListRequest, payload);
    // update campaign list data based on type
    response.type = payload.type;
    yield put(getAbDashboardCampaignsListSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    NotificationManager.error(errorMsg.errorMsg);
  }
}
const getDashboardCampaignInfoRequest = async (payload) => {
  let query = '';
  if (payload?.type === 'Info') {
    query = `/${payload.campaignID}`;
  }
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}campaigns${query}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getDashboardCampaignInfo({ payload }) {
  try {
    const response = yield call(getDashboardCampaignInfoRequest, payload);
    yield put(getCampaignInfoSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* getCampaignAnalytics({ payload }) {
  try {
    const response = yield call(getDashboardCampaignInfoRequest, payload);
    if (payload.campaign === '1') {
      yield put(getCampaignAnalyticsSuccess({ campaign1Info: response }));
    } else {
      yield put(getCampaignAnalyticsSuccess({ campaign2Info: response }));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    NotificationManager.error(errorMsg.errorMsg);
  }
}

const getDownloadRequest = async (payload) => {
  let query = '';
  query = `.${payload.format.value}?start_date=${payload.start_date}&end_date=${payload.end_date}`;

  if (payload?.page) {
    query += `&page=${payload?.page}`;
  }
  if (payload?.filter) {
    query += `&query=${payload?.filter.toLowerCase()}`;
  }
  if (payload?.campaign_name && payload?.campaign_name !== '') {
    query += `&campaign_name=${payload?.campaign_name.toLowerCase()}`;
  }
  if (payload?.delivery_types && payload?.delivery_types?.length > 0) {
    query += `&delivery_types=${payload?.delivery_types
      .toString()
      .toLowerCase()}`;
  }
  if (payload?.channel_types && payload?.channel_types?.length > 0) {
    query += `&channel_types=${payload?.channel_types
      .toString()
      .toLowerCase()}`;
  }
  if (payload?.moreFilters) {
    let status = payload?.moreFilters?.value.map((val) => val.value);
    let createdBy = payload?.moreFilters?.createdBy
      ? payload?.moreFilters?.createdBy
      : '';
    query += `&status=${status}&created_by=${createdBy}`;
  }
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}campaigns${query}`, {
    headers: getHeaders(),
    responseType: 'blob',
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaigns_${payload.start_date.replace(
      /-/g,
      ''
    )}_to_${payload.end_date.replace(/-/g, '')}.${payload.format.value}`;
    a.click();
    return res.data;
  });
};

function* getCampaignsDetailsExportDownload({ payload }) {
  try {
    const response = yield call(getDownloadRequest, payload);
    if (response) {
      yield put(
        getCampaignsDetailsExportDownloadSuccess({ successResponse: response })
      );
    }
  } catch (error) {
    yield put(getCampaignsDetailsExportDownloadFailure());
  }
}

const getEmailsRequest = async (payload) => {
  const method = 'post';
  return axios[method](`${apiUrlNewV3()}contact_support_mails`, payload, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* emailSubmit({ payload }) {
  try {
    const response = yield call(getEmailsRequest, payload);
    yield put(emailSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    NotificationManager.error(
      <IntlMessages id={errorMsg.errorMsg} />,
      'Error',
      2000,
      null,
      null
    );
  }
}

const getActionsRequest = async (payload) => {
  let query = '';
  let method = 'put';
  if (payload.filter === DashboardEnums.RESCHEDULE) {
    query = `/${payload.id}/reschedule`;
  } else if (payload?.payloadData?.action_type === DashboardEnums.CANCEL) {
    query = `/${payload.id}`;
  } else if (
    payload?.payloadData?.action_type === DashboardEnums.PAUSE ||
    payload?.payloadData?.action_type === DashboardEnums.RESUME
  ) {
    query = `/${payload.id}`;
  }
  const payloadData = payload?.payloadData;
  if (payloadData) {
    return axios[method](`${apiUrlNewV3()}campaigns${query}`, payloadData, {
      headers: getHeaders(),
    }).then((res) => {
      return res.data;
    });
  } else {
    return axios[method](`${apiUrlNewV3()}campaigns${query}`, {
      headers: getHeaders(),
    }).then((res) => {
      return res.data;
    });
  }
};

function* rescheduleCampaign({ payload }) {
  try {
    const response = yield call(getActionsRequest, payload);
    if (response) {
      NotificationManager.success(
        <IntlMessages
          id={'DASHBOARD.CAMPAIGN.LABELS.SUCCESSFULLY_RESCHEDULED'}
        />,
        'Success',
        6000,
        null,
        null
      );
    }
  } catch (error) {
    commonRequestException(error);
    NotificationManager.error(
      <IntlMessages
        id={'DASHBOARD.CAMPAIGN.LABELS.UNSUCCESSFULLY_RESCHEDULED'}
      />,
      'Error',
      6000,
      null,
      null
    );
  }
}

function* cancelCampaign({ payload }) {
  try {
    const response = yield call(getActionsRequest, payload);
    if (response) {
      NotificationManager.success(
        <IntlMessages
          id={'DASHBOARD.CAMPAIGN.LABELS.SUCCESSFULLY_CANCELLED'}
        />,
        'Success',
        6000,
        null,
        null
      );
      yield put(cancelSuccess({ cancel: true }));
      yield put(resumeSuccess({ resume: false }));
      yield put(pauseSuccess({ pause: false }));
    }
  } catch (error) {
    commonRequestException(error);
    yield put(cancelSuccess({ cancel: false }));
    NotificationManager.error(
      <IntlMessages
        id={'DASHBOARD.CAMPAIGN.LABELS.UNSUCCESSFULLY_CANCELLED'}
      />,
      'Error',
      6000,
      null,
      null
    );
  }
}

function* pauseCampaign({ payload }) {
  try {
    const response = yield call(getActionsRequest, payload);
    if (response) {
      NotificationManager.success(
        <IntlMessages id={'DASHBOARD.CAMPAIGN.LABELS.SUCCESSFULLY_PAUSED'} />,
        'Success',
        6000,
        null,
        null
      );
      yield put(pauseSuccess({ pause: true }));
      yield put(resumeSuccess({ resume: false }));
      yield put(cancelSuccess({ cancel: false }));
    }
  } catch (error) {
    commonRequestException(error);
    yield put(pauseSuccess({ pause: false }));
    NotificationManager.error(
      <IntlMessages id={'DASHBOARD.CAMPAIGN.LABELS.UNSUCCESSFULLY_PAUSED'} />,
      'Error',
      6000,
      null,
      null
    );
  }
}

function* resumeCampaign({ payload }) {
  try {
    const response = yield call(getActionsRequest, payload);
    if (response) {
      NotificationManager.success(
        <IntlMessages id={'DASHBOARD.CAMPAIGN.LABELS.SUCCESSFULLY_RESUMED'} />,
        'Success',
        6000,
        null,
        null
      );
      yield put(resumeSuccess({ resume: true }));
      yield put(pauseSuccess({ pause: false }));
      yield put(cancelSuccess({ cancel: false }));
    }
  } catch (error) {
    commonRequestException(error);
    yield put(resumeSuccess({ resume: false }));
    NotificationManager.error(
      <IntlMessages id={'DASHBOARD.CAMPAIGN.LABELS.UNSUCCESSFULLY_RESUMED'} />,
      'Error',
      6000,
      null,
      null
    );
  }
}

//  Tiny URL Report for whatsapp campaign

const generateTinyUrlReportAsync = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}campaigns/generate_tiny_url_report`,
    payload,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* generateTinyUrlReport({ payload }) {
  try {
    const response = yield call(generateTinyUrlReportAsync, payload);
    yield put(generateTinyUrlReportSuccess({ response }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(generateTinyUrlReportError(errorMsg));
    yield put(generateTinyUrlReportClean());
  }
}

export function* watchGetDashboardCampaignsList() {
  yield takeEvery(GET_DASHBOARD_CAMPAIGNS_LIST, getDashboardCampaignsList);
  yield takeLatest(
    GET_AB_DASHBOARD_CAMPAIGN1_LIST,
    getAbDashboardCampaign1List
  );
  yield takeLatest(
    GET_AB_DASHBOARD_CAMPAIGN2_LIST,
    getAbDashboardCampaign2List
  );
  yield takeEvery(GET_DASHBOARD_CAMPAIGN_INFO, getDashboardCampaignInfo);
  yield takeEvery(GET_CAMPAIGN_ANALYTICS, getCampaignAnalytics);
  yield takeEvery(
    GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD,
    getCampaignsDetailsExportDownload
  );
  yield takeEvery(GET_EMAIL_SUBMIT, emailSubmit);
  yield takeEvery(RESCHEDULE_CAMPAIGN, rescheduleCampaign);
  yield takeEvery(CANCEL_CAMPAIGN, cancelCampaign);
  yield takeEvery(PAUSE_CAMPAIGN, pauseCampaign);
  yield takeEvery(RESUME_CAMPAIGN, resumeCampaign);
  yield takeEvery(GENERATE_TINY_URL_REPORT, generateTinyUrlReport);
}

export default function* rootSaga() {
  yield all([fork(watchGetDashboardCampaignsList)]);
}
