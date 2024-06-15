import {
  all,
  call,
  fork,
  put,
  select,
  delay,
  takeEvery,
} from 'redux-saga/effects';

import axios from 'axios';

import {
  getHeaders,
  commonRequestException,
  apiUrlNewV3,
} from 'helpers/ApiHelper';

import { currentAccount } from 'helpers/Utils';
import {
  GET_QUERY_LIST,
  GET_SEGMENTATION_LIST,
  GET_CUSTOM_SEGMENT_LIST,
  SEGMENTATION_ARCHIEVE,
  USER_COUNT_FILTER,
  SEGMENT_CREATE,
  GET_CATEGORY_DROPDOWN_LIST,
  SEGMENT_USER_EXPORT,
  SEGMENT_RERUN_QUERY,
  SEGMENT_QUERY_DETAILS,
  GET_USERS_AFTER_SEG_LIST,
  SEGMENT_QUERY_CLEANUP,
  EDIT_FILE_SEGMENT,
  GET_CUSTOM_SEG_LIST,
  GET_VIEW_SEGMENT_DATA,
  SEGMENT_QUERY_ALERT,
  GET_USER_EVENTS_LIST,
  GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS,
  GET_EDIT_SEGMENT_DATA,
  CREATE_CUSTOM_EVENT,
  SEGMENT_USER_EXPORT_BY_SEGMENT_ID,
  SEGMENT_UPDATE,
  USE_THIS_VERSION,
  FETCH_USER_COUNT,
  GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST,
} from 'redux/constants';

import {
  getQueryListSuccess,
  getSegmentationSuccess,
  getCustomSegmentionSuccess,
  segmentationArchieveSuccess,
  segmentCreateSuccess,
  getCategoryDropdownListSuccess,
  segmentUserExportSuccess,
  reRunQuerySuccess,
  viewQueryDetailsSuccess,
  getUserAfterSegListDataSuccess,
  userCountFilterSuccess,
  segmentQueryRunAlertSuccess,
  editFileSegmentSuccess,
  editFileSegmentError,
  getCustomSegListDataSuccess,
  getViewSegDataSuccess,
  getuserEventsListSuccess,
  getuserAttributesBasedOnUserEventsSuccess,
  createCustomEventSuccess,
  createCustomEventError,
  segmentUserExportBySegmentFilterIdSuccess,
  getEditSegmentDataSuccess,
  updateSegmentSuccess,
  updateSegmentError,
  useThisVersionSuccess,
  useThisVersionError,
  fetchUserCountSuccess,
  getCampaignChannelAndTypeListSuccess,
  getExportCategoryDropdownListSuccess,
} from './actions';
import { segmentionState } from 'data/segments/createSegmentFilterData';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';

const getSegmentationListAsync = async (payload) => {
  const method = 'get';

  let query = `?page=${payload.pageno}`;
  if (payload.selectedPageSize) {
    query += `&limit=${payload.selectedPageSize}`;
  }
  if (payload.archievedSegment) {
    query += `&archived=${payload.archievedSegment}`;
  }
  if (payload.filter) {
    query += `&segment_types=${payload.filter}`;
  }
  if (payload.query) {
    query += `&search=${payload.query}`;
  }

  return axios[method](`${apiUrlNewV3()}segments${query} `, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

const segmentationArchieveAsync = async (id) => {
  const method = 'patch';
  return axios[method](
    `${apiUrlNewV3()}segments/${id}/archieve_unarchieve`,
    {},
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

const segmentCreateRequest = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}segments/`,
    {
      segment: {
        name: payload.name,
        segment_type: payload.type,
        source_type: payload.source,
        segment_filter_id: payload.filter_id,
      },
      created_from: payload.created_from,
      included_filters: payload.included_filters,
      excluded_filters: payload.excluded_filters,
      audience_type: payload.audience_type,
      exclude_users: payload.exclude_users,
    },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

const getQueryListAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segment_filters`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data?.list_query_result;
  });
};

const getCustomSegmentListAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segments/get_custom_segments`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data.custom_segments;
  });
};

function* getCustomSegment({ payload }) {
  try {
    const response = yield call(getCustomSegmentListAsync, payload);
    yield put(getCustomSegmentionSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* getSegmentationList({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getSegmentationListAsync, payload);
    yield put(getSegmentationSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* segmentationArchieve({ payload }) {
  try {
    const response = yield call(segmentationArchieveAsync, payload);
    yield put(segmentationArchieveSuccess(response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  } catch (error) {
    commonRequestException(error);
  }
}

function* getQueryList() {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getQueryListAsync);
    yield put(getQueryListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const userCountFilterRequest = async (filters) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}segments/get_user_count_by_filter`,
    filters,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

const segmentUserExportRequest = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}segments/${payload.segment_id}/export_users`,
    payload,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* userCountFilter({
  payload: { payload, callback, isQueryList = false },
}) {
  try {
    const response = yield call(userCountFilterRequest, payload);
    yield put(userCountFilterSuccess(response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });

    if (isQueryList) {
      const segmentationState = yield select(segmentionState);
      segmentationState.listQueryResult.unshift(response.segment_filter);
      yield put(getQueryListSuccess(segmentationState.listQueryResult));
      yield put({ type: FETCH_USER_COUNT, id: response?.segment_filter?.id });
    }

    if (callback) {
      yield call(callback, response);
    }
  } catch (error) {
    commonRequestException(error);
  }
}
function* fetchUserCountforQueryList({ id }) {
  let result;
  try {
    do {
      result = yield call(viewQueryDetailsRequest, id);
      if (result?.list_query_result?.status === SegmentationEnums.ACTIVE) {
        yield put(fetchUserCountSuccess(result?.list_query_result));
      }
      yield delay(3 * 1000);
    } while (result?.list_query_result?.status !== SegmentationEnums.ACTIVE);
  } catch (error) {
    commonRequestException(error);
  }
}

function* segmentCreate({ payload }) {
  try {
    const response = yield call(segmentCreateRequest, payload);
    yield put(segmentCreateSuccess(payload, response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  } catch (error) {
    commonRequestException(error);
  }
}

const getCategoryDropdownListDataAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segments/get_user_property_list`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};
const getUserEventsListAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segments/get_user_events`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data.user_events;
  });
};
const getUserAttributesBasedOnUserEventAsync = async (eventId) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}segments/get_user_event_attributes?event_id=${eventId}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data.event_attributes;
  });
};

const segmentRerunQueryRequest = async (id) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}segments/query_rerun`,
    { sf_id: id },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

const viewQueryDetailsRequest = async (id) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segment_filters/${id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCategoryDropdownListData({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCategoryDropdownListDataAsync, payload);
    yield put(getCategoryDropdownListSuccess(response));
    yield put(getExportCategoryDropdownListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}
function* getUserEventsList() {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getUserEventsListAsync);
    yield put(getuserEventsListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}
function* getUserAttributesBasedOnUserEvent({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(
      getUserAttributesBasedOnUserEventAsync,
      payload
    );
    yield put(getuserAttributesBasedOnUserEventsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* segmentUserExport({ payload }) {
  try {
    const response = yield call(segmentUserExportRequest, payload);
    yield put(segmentUserExportSuccess(response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  } catch (error) {
    commonRequestException(error);
  }
}

function* segmentRerunQuery({ payload }) {
  try {
    const response = yield call(segmentRerunQueryRequest, payload);
    yield put(reRunQuerySuccess(response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
    yield call(getQueryList);
  } catch (error) {
    commonRequestException(error);
  }
}

function* segmentQueryDetails({ payload }) {
  try {
    const response = yield call(viewQueryDetailsRequest, payload);
    yield put(viewQueryDetailsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getUserAfterSegListDataAsync = async (payload) => {
  let query = '';
  if (payload?.segmentId) {
    query = `?segment_id=${payload.segmentId}`;
  } else {
    query = `?segment_filter_id=${payload.queryId}`;
  }

  if (payload?.filterType?.name && payload?.filterType?.name !== '') {
    query += `&search_name=${payload?.filterType?.name}`;
  }

  if (payload?.filterType?.email && payload?.filterType?.email !== '') {
    query += `&search_email=${payload?.filterType?.email}`;
  }
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}segments/sample_users_details${query}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getUserAfterSegList({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getUserAfterSegListDataAsync, payload);
    yield put(getUserAfterSegListDataSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}
const segmentQueryRunAlertRequest = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}segments/query_filter_rerun_success_email`,
    { sf_id: payload.queryId, to_send_email_ids: payload.email },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* segmentQueryAlert({ payload }) {
  try {
    const response = yield call(segmentQueryRunAlertRequest, payload);
    yield put(segmentQueryRunAlertSuccess(response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  } catch (error) {
    commonRequestException(error);
  }
}

const getViewSegmentDataAsync = async ({ id }) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segments/${id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getViewSegmentData({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getViewSegmentDataAsync, payload);
    yield put(getViewSegDataSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const fileSegmentEditRequest = async (item) => {
  const formData = new FormData();
  formData.append('import_file', item.file);
  formData.append('event_type', item.edit_file_data.event_type);
  formData.append('emails', item.edit_file_data.emails);
  formData.append('account_user_id', item.edit_file_data.account_user_id);

  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}segments/${
      item.edit_file_data.segment_id
    }/edit_file_segment`,
    formData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};
const getCustomSegmentListRequest = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segments/get_custom_segments`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCustomSegmentList({ payload }) {
  try {
    const response = yield call(getCustomSegmentListRequest, payload);
    yield put(getCustomSegListDataSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getEditSegmentDetailsRequest = async (id) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segments/${id}/edit`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};
const createCustomEventRequest = async (payload) => {
  const method = 'post';
  return axios[method](`${apiUrlNewV3()}create_custom_event`, payload, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* fileSegmentEdit({ payload }) {
  try {
    const response = yield call(fileSegmentEditRequest, payload);
    yield put(editFileSegmentSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(editFileSegmentError(errorMsg));
  }
}
function* customEventCreation({ payload }) {
  try {
    const response = yield call(createCustomEventRequest, payload);
    yield put(createCustomEventSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(createCustomEventError(errorMsg));
  }
}

const exportUserBySegmentFilterIdRequest = async (payload) => {
  const method = 'post';
  return axios[method](`${apiUrlNewV3()}segments/export_users`, payload, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getEditSegmentData({ payload }) {
  try {
    const response = yield call(getEditSegmentDetailsRequest, payload);
    yield put(getEditSegmentDataSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}
function* exportUsersBySegmentFilterId({ payload }) {
  try {
    const response = yield call(exportUserBySegmentFilterIdRequest, payload);
    yield put(segmentUserExportBySegmentFilterIdSuccess(response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  } catch (error) {
    commonRequestException(error);
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  }
}

const updateSegmentRequest = async (payload) => {
  const method = 'patch';
  return axios[method](
    `${apiUrlNewV3()}segments/${payload.segment_id}`,
    {
      segment: {
        name: payload.name,
        segment_type: payload.type,
        segment_filter_id: payload.filter_id,
      },
      created_from: payload.created_from,
      included_filters: payload.included_filters,
      excluded_filters: payload.excluded_filters,
      audience_type: payload.audience_type,
      exclude_users: payload.exclude_users,
    },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* segmentUpdate({ payload }) {
  try {
    const response = yield call(updateSegmentRequest, payload);
    yield put(updateSegmentSuccess(response));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateSegmentError(errorMsg));
    yield put({ type: SEGMENT_QUERY_CLEANUP });
  }
}

const segmentUseThisVersionRequest = async (item) => {
  const method = 'put';
  return axios[method](
    `${apiUrlNewV3()}segments/${item.segmentId}/restore_version`,
    {
      version_id: item.version_id,
    },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* segmentUseThisVersion({ payload }) {
  try {
    const response = yield call(segmentUseThisVersionRequest, payload);
    yield put(useThisVersionSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(useThisVersionError(errorMsg));
  }
}

const getCampaignChannelAndTypeListAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}segments/campaign_channel_type_list`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCampaignChannelAndTypeList() {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCampaignChannelAndTypeListAsync);
    yield put(getCampaignChannelAndTypeListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

export function* watchGetSegments() {
  yield takeEvery(GET_SEGMENTATION_LIST, getSegmentationList);
  yield takeEvery(GET_CUSTOM_SEGMENT_LIST, getCustomSegment);
  yield takeEvery(SEGMENTATION_ARCHIEVE, segmentationArchieve);
  yield takeEvery(GET_QUERY_LIST, getQueryList);
  yield takeEvery(USER_COUNT_FILTER, userCountFilter);
  yield takeEvery(SEGMENT_CREATE, segmentCreate);
  yield takeEvery(GET_CATEGORY_DROPDOWN_LIST, getCategoryDropdownListData);
  yield takeEvery(GET_USER_EVENTS_LIST, getUserEventsList);
  yield takeEvery(
    GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS,
    getUserAttributesBasedOnUserEvent
  );
  yield takeEvery(SEGMENT_USER_EXPORT, segmentUserExport);
  yield takeEvery(SEGMENT_RERUN_QUERY, segmentRerunQuery);
  yield takeEvery(SEGMENT_QUERY_DETAILS, segmentQueryDetails);
  yield takeEvery(GET_USERS_AFTER_SEG_LIST, getUserAfterSegList);
  yield takeEvery(GET_VIEW_SEGMENT_DATA, getViewSegmentData);
  yield takeEvery(SEGMENT_QUERY_ALERT, segmentQueryAlert);
  yield takeEvery(EDIT_FILE_SEGMENT, fileSegmentEdit);
  yield takeEvery(GET_CUSTOM_SEG_LIST, getCustomSegmentList);
  yield takeEvery(GET_USERS_AFTER_SEG_LIST, getUserAfterSegList);
  yield takeEvery(GET_EDIT_SEGMENT_DATA, getEditSegmentData);
  yield takeEvery(CREATE_CUSTOM_EVENT, customEventCreation);
  yield takeEvery(
    SEGMENT_USER_EXPORT_BY_SEGMENT_ID,
    exportUsersBySegmentFilterId
  );
  yield takeEvery(SEGMENT_UPDATE, segmentUpdate);
  yield takeEvery(USE_THIS_VERSION, segmentUseThisVersion);
  yield takeEvery(FETCH_USER_COUNT, fetchUserCountforQueryList);

  yield takeEvery(
    GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST,
    getCampaignChannelAndTypeList
  );
}

export default function* rootSaga() {
  yield all([fork(watchGetSegments)]);
}
