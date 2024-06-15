import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';

import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
  apiUrlNewV3,
} from 'helpers/ApiHelper';

import {
  CHANNEL_GET,
  CHANNEL_ADD,
  CHANNEL_UPDATE,
  CHANNEL_AVATAR_DELETE,
  CHANNEL_ADD_AGENT,
  CHANNEL_GET_AGENTS,
  ADD_INBOX,
  INBOX_UPDATE,
  CONNECTOR_GET,
} from 'redux/constants';

import {
  getChannelSuccess,
  addChannelSuccess,
  addChannelError,
  updateChannelSuccess,
  updateChannelError,
  deleteChannelAvatarSuccess,
  addAgentsChannelSuccess,
  addAgentsChannelError,
  getChannelAgentsSuccess,
  addInboxSuccess,
  addInboxError,
  updateInboxSuccess,
  updateInboxError,
  getConnectorSuccess,
} from './actions';

const buildInboxData = (inboxParams) => {
  const formData = new FormData();
  const { channel = {}, ...inboxProperties } = inboxParams;
  Object.keys(inboxProperties).forEach((key) => {
    formData.append(key, inboxProperties[key]);
  });
  const { selectedFeatureFlags, ...channelParams } = channel;
  // selectedFeatureFlags needs to be empty when creating a website channel
  if (selectedFeatureFlags) {
    if (selectedFeatureFlags.length) {
      selectedFeatureFlags.forEach((featureFlag) => {
        formData.append(`channel[selected_feature_flags][]`, featureFlag);
      });
    } else {
      formData.append('channel[selected_feature_flags][]', '');
    }
  }
  Object.keys(channelParams).forEach((key) => {
    formData.append(`channel[${key}]`, channel[key]);
  });
  return formData;
};

const getChannelAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}inboxes/${param}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getChannel({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getChannelAsync, payload);
    yield put(getChannelSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getChannelAgentsAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}/inbox_members/${param}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getChannelAgents({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getChannelAgentsAsync, payload);
    yield put(getChannelAgentsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addChannelAsync = async (param) => {
  const postData = param.formData !== false ? buildInboxData(param) : param;

  const itemIdStr = param.id ? `/${param.id}` : '';
  const method = param.id ? `patch` : 'post';
  let url = `${apiUrlNew()}inboxes${itemIdStr}`;
  if (param.twilio_channel) {
    url = `${apiUrlNew()}channels/twilio_channel`;
  }
  if (param.tata_channel) {
    url = `${apiUrlNew()}channels/tata_channel`;
  }
  return axios[method](url, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addChannel({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addChannelAsync, payload);
    yield put(addChannelSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addChannelError(errorMsg));
  }
}

function* updateChannel({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addChannelAsync, payload);
    yield put(updateChannelSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateChannelError(errorMsg));
  }
}

const addInboxAsync = async (param) => {
  const postData = param.formData !== false ? buildInboxData(param) : param;
  const itemIdStr = param.id ? `/${param.id}` : '';
  const method = param.id ? `patch` : 'post';
  let url = `${apiUrlNewV3()}inboxes${itemIdStr}`;
  if (param.twilio_channel) {
    url = `${apiUrlNewV3()}channels/twilio_channel`;
  }
  if (param.tata_channel) {
    url = `${apiUrlNewV3()}channels/tata_channel`;
  }
  return axios[method](url, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addInbox({ payload }) {
  try {
    const response = yield call(addInboxAsync, payload);
    yield put(addInboxSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addInboxError(errorMsg));
  }
}

function* updateInbox({ payload }) {
  try {
    const response = yield call(addInboxAsync, payload);
    yield put(updateInboxSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateInboxError(errorMsg));
  }
}

const deleteChannelAvatarAsync = async (param) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}inboxes/${param.id}/avatar`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteChannelAvatar({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(deleteChannelAvatarAsync, payload);
    yield put(deleteChannelAvatarSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addAgentsChannelAsync = async (param) => {
  const method = 'patch';
  const postData = {
    inbox_id: param.inboxId,
    user_ids: param.selectedAgents.map((x) => x.value),
  };
  return axios[method](`${apiUrlNew()}inbox_members`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addAgentsChannel({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addAgentsChannelAsync, payload);
    yield put(addAgentsChannelSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addAgentsChannelError(errorMsg));
  }
}

const getConnectorAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}channels?channel_type=${param}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getConnector({ payload }) {
  try {
    const response = yield call(getConnectorAsync, payload);
    yield put(getConnectorSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

export function* watchAddChannel() {
  yield takeEvery(CHANNEL_GET, getChannel);
  yield takeEvery(CHANNEL_ADD, addChannel);
  yield takeEvery(CHANNEL_UPDATE, updateChannel);
  yield takeEvery(CHANNEL_AVATAR_DELETE, deleteChannelAvatar);
  yield takeEvery(CHANNEL_ADD_AGENT, addAgentsChannel);
  yield takeEvery(CHANNEL_GET_AGENTS, getChannelAgents);
  yield takeEvery(ADD_INBOX, addInbox);
  yield takeEvery(INBOX_UPDATE, updateInbox);
  yield takeEvery(CONNECTOR_GET, getConnector);
}

export default function* rootSaga() {
  yield all([fork(watchAddChannel)]);
}
