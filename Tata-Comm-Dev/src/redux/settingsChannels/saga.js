import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import CommonEnums from 'enums/commonEnums';

import {
  apiUrlNewV3,
  getHeaders,
  commonRequestException,
  apiUrlNew,
} from 'helpers/ApiHelper';

import {
  SETTINGS_SMS_CHANNELS_GET,
  SETTINGS_SMS_CHANNELS_ADD,
  SETTINGS_SMS_CHANNELS_ADD_REMOVE,
  SETTINGS_CHANNELS_FC_CONFIG_ADD,
  SETTINGS_CHANNELS_DND_CONFIG_ADD,
  SETTINGS_CHANNELS_FC_GET,
  SETTINGS_CHANNELS_DND_GET,
  SETTINGS_SMS_CHANNELS_EDIT,
  SETTINGS_EMAIL_CHANNELS_ADD,
  SETTINGS_EMAIL_CHANNELS_EDIT,
  SETTINGS_EMAIL_CHANNELS_REMOVE,
  EMAIL_GENERAL_SETTINGS_ADD,
  EMAIL_GENERAL_SETTINGS_GET,
  SETTINGS_WHATSAPP_CHANNELS_ADD,
  SETTINGS_WHATSAPP_CHANNELS_GET,
  SETTINGS_WHATSAPP_CHANNELS_REMOVE,
  SETTINGS_WHATSAPP_CHANNELS_EDIT,
  COUNTRY_LIST_GET,
  SETTINGS_EMAIL_CHANNELS_GET,
  GET_INBOX_LIST,
  GET_MOBILE_PUSH_CONFIGURATION,
  ADD_MOBILE_PUSH_CONFIGURATION,
} from 'redux/constants';

import {
  getSettingsSMSSuccess,
  addChannelConnectorSuccess,
  addChannelConnectorError,
  removeChannelConnectorSuccess,
  removeChannelConnectorFail,
  addFreqCappingConfigSuccess,
  addFreqCappingConfigError,
  addDnDConfigError,
  addDnDConfigSuccess,
  getSettingsFCListSuccess,
  getSettingsDnDListSuccess,
  editChannelConnectorSuccess,
  addEmailConnectorSuccess,
  addEmailConnectorError,
  editEmailConnectorSuccess,
  editEmailConnectorError,
  removeEmailConnectorSuccess,
  removeEmailConnectorFail,
  addEmailGeneralSettingsSuccess,
  addEmailGeneralSettingsError,
  getEmailGeneralSettingsListSuccess,
  addWhatsAppChannelConnectorSuccess,
  addWhatsAppChannelConnectorError,
  getSettingsWhatsAppConnectorListSuccess,
  removeWhatsAppChannelConnectorSuccess,
  editWhatsAppChannelConnectorSuccess,
  removeWhatsAppChannelConnectorError,
  getCountryDropdownListSuccess,
  getEmailConnectorListSuccess,
  addChannelConnectorClean,
  getInboxListSuccess,
  getMobilePushConfigurationSuccess,
  addMobilePushConfigurationSuccess,
  cleanMobilePushConfiguration,
  addMobilePushConfigurationFail,
} from './actions';

const getSMSChannelsAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}channels?channel_type=${param}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

const getChannelsFCandDnDAsync = async (param) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}fc_dnd_settings/${param.id}?channel_type=${
      param.channelType
    }`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

const getCountryListAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}all_countries`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCountryList({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCountryListAsync, payload);
    yield put(getCountryDropdownListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* getChannel({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getSMSChannelsAsync, payload);
    yield put(getSettingsSMSSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* getFreqCapping({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getChannelsFCandDnDAsync, payload);
    yield put(getSettingsFCListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* getDnDList({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getChannelsFCandDnDAsync, payload);
    yield put(getSettingsDnDListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addChannelAsync = async (param) => {
  const method = 'post';
  const url = `${apiUrlNewV3()}channels`;

  return axios[method](url, param, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getEmailConnectorList({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getSMSChannelsAsync, payload);
    yield put(getEmailConnectorListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const editChannelAsync = async ({ newParams, id }) => {
  const method = 'patch';
  const url = `${apiUrlNewV3()}channels/${id}`;
  return axios[method](url, newParams, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addChannelConnectorFn({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addChannelAsync, payload);
    yield put(addChannelConnectorSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addChannelConnectorError(errorMsg));
  }
}

function* editChannelConnectorFn({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(editChannelAsync, payload);
    yield put(editChannelConnectorSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addChannelConnectorError(errorMsg));
  }
}

const deleteChannelConnectorAsync = async (postData) => {
  const method = 'delete';
  return axios[method](
    `${apiUrlNewV3()}channels/${postData.deleteRowId}?type=${
      postData.channel_type
    }`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* removeChannelConnecorConfig({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(deleteChannelConnectorAsync, payload);
    yield put(removeChannelConnectorSuccess({ response, payload }));
    yield put(addChannelConnectorClean());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(removeChannelConnectorFail(errorMsg));
    yield put(addChannelConnectorClean());
  }
}

const addOrUpdateEmailChannelRequest = async (params) => {
  const method = params.channel.id ? `patch` : 'post';
  const itemIdStr = params.channel.id ? `/${params.channel.id}` : '';
  return axios[method](`${apiUrlNewV3()}channels${itemIdStr}`, params, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addEmailChannelConnector({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addOrUpdateEmailChannelRequest, payload);
    yield put(addEmailConnectorSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addEmailConnectorError(errorMsg));
  }
}

function* editEmailChannelConnector({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addOrUpdateEmailChannelRequest, payload);
    yield put(editEmailConnectorSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(editEmailConnectorError(errorMsg));
  }
}

const addFreqCappingChannelAsync = async (param) => {
  const method = 'put';
  const url = `${apiUrlNewV3()}fc_dnd_settings/${param.id}`;

  return axios[method](url, param.newParams, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

const addDnDChannelAsync = async (param) => {
  const method = 'put';
  const url = `${apiUrlNewV3()}fc_dnd_settings/${param.id}`;

  return axios[method](url, param.newParams, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addFreqCappingConfig({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addFreqCappingChannelAsync, payload);
    yield put(addFreqCappingConfigSuccess(response));
    yield call(getFreqCapping, {
      payload: {
        id: response.fc_dnd_setting?.channel_id,
        channelType: payload.newParams.channel_type,
      },
    });
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addFreqCappingConfigError(errorMsg));
  }
}

function* addDnDConfig({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addDnDChannelAsync, payload);
    yield put(addDnDConfigSuccess(response));
    yield call(getDnDList, {
      payload: {
        id: response?.fc_dnd_setting?.channel_id,
        channelType: payload.newParams.channel_type,
      },
    });
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addDnDConfigError(errorMsg));
  }
}

const getInboxListAsync = async (param) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}inboxes?channel_type=${param.Channel_type}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getInboxList({ payload }) {
  try {
    const response = yield call(getInboxListAsync, payload);
    yield put(getInboxListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

// WhatsApp Endpoints

function* getSettingsWhatsAppConnectorList({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getSMSChannelsAsync, payload);
    yield put(getSettingsWhatsAppConnectorListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addWhatsAppChannelsConnectorAsync = async (param) => {
  const method = 'post';
  const url = `${apiUrlNewV3()}channels`;

  return axios[method](url, param, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addWhatsAppChannelConnector({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addWhatsAppChannelsConnectorAsync, payload);
    yield put(addWhatsAppChannelConnectorSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addWhatsAppChannelConnectorError(errorMsg));
  }
}

function* removeWhatsAppChannelConnector({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(deleteChannelConnectorAsync, payload);
    yield put(removeWhatsAppChannelConnectorSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(removeWhatsAppChannelConnectorError(errorMsg));
  }
}

function* editWhatsAppChannelConnector({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(editChannelAsync, payload);
    yield put(editWhatsAppChannelConnectorSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addChannelConnectorError(errorMsg));
  }
}
// Email

const deleteEmailChannelAsync = async (param) => {
  const method = 'delete';
  return axios[method](
    `${apiUrlNewV3()}channels/${param.deleteRowId}?type=${param.channel_type}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* removeEmailChannelConnector({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(deleteEmailChannelAsync, payload);
    yield put(removeEmailConnectorSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(removeEmailConnectorFail(errorMsg));
  }
}

const getEmailGeneralSettingsAsync = async ({ connectorId }) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}email_general_settings/${connectorId}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getEmailGeneralSettings({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getEmailGeneralSettingsAsync, payload);
    yield put(getEmailGeneralSettingsListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addEmailSettingsAsync = async (params) => {
  let method;
  method = 'post';
  let url = `${apiUrlNewV3()}email_general_settings`;
  if (params && params.channelEmailId) {
    method = 'put';
    url = `${apiUrlNewV3()}email_general_settings/${params.channelEmailId}`;
  }
  return axios[method](url, params.newParams, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addEmailGeneralSettings({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addEmailSettingsAsync, payload);
    yield put(addEmailGeneralSettingsSuccess(response));
    yield put(getEmailGeneralSettingsListSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addEmailGeneralSettingsError(errorMsg));
  }
}

// MOBILE PUSH CONFIGURATION
const getMobileConfigurationAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}notification_channels`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getMobilePushConfiguration() {
  try {
    const response = yield call(getMobileConfigurationAsync);
    yield put(getMobilePushConfigurationSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addMobilePushConfigurationAsync = async (param) => {
  const method = param?.data?.id ? 'put' : 'post';
  const url = `${apiUrlNewV3()}notification_channels/${param?.data?.id}`;
  const formData = new FormData();
  if (param?.file) {
    formData.append('channel_secret_file', param?.file);
  }
  formData.append('notification_channel', JSON.stringify(param?.data));
  return axios[method](url, formData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addMobilePushConfiguration({ payload }) {
  try {
    const response = yield call(addMobilePushConfigurationAsync, payload);
    yield put(addMobilePushConfigurationSuccess(response));
    yield call(getMobileConfigurationAsync);
    yield put(cleanMobilePushConfiguration());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addMobilePushConfigurationFail(errorMsg));
    yield put(cleanMobilePushConfiguration());
  }
}

export function* watchGetConnectorList() {
  yield takeEvery(SETTINGS_SMS_CHANNELS_GET, getChannel);
  yield takeEvery(SETTINGS_SMS_CHANNELS_ADD, addChannelConnectorFn);
  yield takeEvery(
    SETTINGS_SMS_CHANNELS_ADD_REMOVE,
    removeChannelConnecorConfig
  );
  yield takeEvery(SETTINGS_CHANNELS_FC_CONFIG_ADD, addFreqCappingConfig);
  yield takeEvery(SETTINGS_CHANNELS_DND_CONFIG_ADD, addDnDConfig);
  yield takeEvery(EMAIL_GENERAL_SETTINGS_ADD, addEmailGeneralSettings);
  yield takeEvery(EMAIL_GENERAL_SETTINGS_GET, getEmailGeneralSettings);
  yield takeEvery(SETTINGS_CHANNELS_FC_GET, getFreqCapping);
  yield takeEvery(SETTINGS_CHANNELS_DND_GET, getDnDList);
  yield takeEvery(SETTINGS_SMS_CHANNELS_EDIT, editChannelConnectorFn);
  yield takeEvery(SETTINGS_EMAIL_CHANNELS_ADD, addEmailChannelConnector);
  yield takeEvery(SETTINGS_EMAIL_CHANNELS_EDIT, editEmailChannelConnector);
  yield takeEvery(SETTINGS_EMAIL_CHANNELS_REMOVE, removeEmailChannelConnector);
  yield takeEvery(
    SETTINGS_WHATSAPP_CHANNELS_GET,
    getSettingsWhatsAppConnectorList
  );
  yield takeEvery(SETTINGS_WHATSAPP_CHANNELS_ADD, addWhatsAppChannelConnector);
  yield takeEvery(
    SETTINGS_WHATSAPP_CHANNELS_REMOVE,
    removeWhatsAppChannelConnector
  );
  yield takeEvery(
    SETTINGS_WHATSAPP_CHANNELS_EDIT,
    editWhatsAppChannelConnector
  );
  yield takeEvery(COUNTRY_LIST_GET, getCountryList);
  yield takeEvery(SETTINGS_EMAIL_CHANNELS_GET, getEmailConnectorList);
  yield takeEvery(GET_INBOX_LIST, getInboxList);

  // MOBILE PUSH CONFIGURATION

  yield takeEvery(GET_MOBILE_PUSH_CONFIGURATION, getMobilePushConfiguration);
  yield takeEvery(ADD_MOBILE_PUSH_CONFIGURATION, addMobilePushConfiguration);
}

export default function* rootSaga() {
  yield all([fork(watchGetConnectorList)]);
}
