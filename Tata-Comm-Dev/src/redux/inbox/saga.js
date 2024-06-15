import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import axios from 'axios';

import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
  apiUrlNewV3,
  apiUrlNewSurvey,
} from 'helpers/ApiHelper';
import {
  GET_INBOX,
  CHAT_GET_CONVERSATIONS_NEWWW,
  CHAT_CHANGE_CONVERSATION_STATUS,
  CHAT_CHANGE_CONVERSATION_MUTED,
  CHAT_SEND_CONVERSATION,
  CHAT_GET_MESSAGES,
  CHAT_DELETE_MESSAGES,
  CHAT_SEND_MESSAGE,
  DELETE_INBOX,
  ADD_ATTRIBUTES_CONVERSATION_ITEM,
  GET_CUSTOM_ATTRIBUTES,
  ADVANCED_CONVERSATION_FILTERS,
  SAVE_ADVANCED_CONVERSATION_FILTERS,
  GET_CUSTOM_FILTERS,
  DELETE_CUSTOM_FILTERS,
  GET_ALL_INBOXES,
  ADD_CONVERSATION_SURVEY_RESPONSE,
  GET_CONVERSATION_SURVEY_RESPONSE,
  ADD_MESSAGE,
  ON_CONVERSATION_CREATED_EVENT,
  FETCH_CONVERSATION_STATS_META,
  NEW_MESSAGE_NOTIFICATION,
  UPDATE_TYPING_STATUS,
} from 'redux/constants';

import {
  getInboxSuccess,
  getConversationsErrorNewww,
  getConversationsSuccessNewww,
  changeConversationMutedSuccess,
  changeConversationStatusSuccess,
  sendConversationSuccess,
  sendConversationError,
  loadMessagesError,
  loadMessagesSuccess,
  deleteMessageSuccess,
  sendMessageSuccess,
  sendMessageError,
  deleteInboxSuccess,
  deleteInboxError,
  lastSeenDataSuccess,
  addAttributesConversationItemSuccess,
  addAttributesConversationItemError,
  getCustomAttributesError,
  getCustomAttributesSuccess,
  applyAdvancedConversationFiltersSuccess,
  applyAdvancedConversationFiltersError,
  saveAdvancedConversationFiltersError,
  saveAdvancedConversationFiltersSuccess,
  deleteCustomFiltersSuccess,
  deleteCustomFiltersError,
  getCustomFiltersError,
  getCustomFiltersSuccess,
  getAllInboxesSuccess,
  addSurveyResponseSuccess,
  getSurveyResponseSuccess,
  addMessageSuccess,
  fetchConversationStatsMetaSuccess,
  newConversationList,
} from './actions';
import {
  authState,
  getConversationFiltersList,
  getCustomAttributesListMapped,
  inboxState,
  mapCustomFilters,
} from 'helpers/ConversationFiltersHelper';
import {
  getAgents,
  getCampaigns,
  getCountryDropdownList,
  getTeams,
} from 'redux/actions';
import {
  findPendingMessageIndex,
  getSelectedChatConversation,
} from 'helpers/conversationEventHelpers';

import { newConstactsList } from 'redux/contacts/actions';
import { currentUserID } from 'helpers/Utils';
import notificationSound from '../../assets/audios/ding.mp3';
import {
  getAssigneeFromNotification,
  notificationEnabled,
  shouldPlayAudio,
} from 'helpers/newMessageNotificationHelper';

const getInboxRequest = async (item) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}inboxes?channel_available=true`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getInbox({ payload }) {
  try {
    const response = yield call(getInboxRequest, payload);
    yield put(getInboxSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getAllInboxesRequest = async (item) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}inboxes?page=${item.page}&per_page=${
      item.selectedPageSize
    }`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getAllInboxes({ payload }) {
  try {
    const response = yield call(getAllInboxesRequest, payload);
    yield put(getAllInboxesSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const loadConversationsNewwAsync = async (param) => {
  const method = 'get';
  let extraParams = '';
  [
    'page',
    'assignee_type',
    { objKey: 'labels', urlKey: 'labels[]' },
    'status',
    { objKey: 'inboxId', urlKey: 'inbox_id' },
    'conversation_type',
  ].map((val) => {
    let objKey = val;
    let urlKey = val;
    if (typeof val === 'object') {
      objKey = val.objKey;
      urlKey = val.urlKey;
    }
    if (typeof param[objKey] !== 'undefined') {
      extraParams += extraParams
        ? `&${urlKey}=${param[objKey]}`
        : `${urlKey}=${param[objKey]}`;
    }
    return false;
  });
  const conversationid = param.conversationid ? param.conversationid : '';
  return axios[method](
    `${apiUrlNew()}conversations/${conversationid}?${extraParams}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* loadConversationsNeww({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(loadConversationsNewwAsync, payload);
    const customFilters = yield select(inboxState);

    yield put(getConversationsSuccessNewww(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(getConversationsErrorNewww(errorMsg));
  }
}

const changeConversationMutedAsync = async (param) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${param.id}/${
      param.muted ? 'mute' : 'unmute'
    }`,
    {},
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* changeConversationMuted({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(changeConversationMutedAsync, payload);
    yield put(changeConversationMutedSuccess({ response, params: payload }));
  } catch (error) {
    commonRequestException(error);
  }
}

const changeConversationStatusAsync = async (param) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${param.id}/toggle_status`,
    param,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* changeConversationStatus({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(changeConversationStatusAsync, payload);
    yield put(changeConversationStatusSuccess({ response, params: payload }));
  } catch (error) {
    commonRequestException(error);
  }
}

const sendConversationAsync = async (param) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${param.conversationId}/transcript`,
    { email: param.email },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* sendConversation({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(sendConversationAsync, payload);
    yield put(sendConversationSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(sendConversationError(errorMsg));
  }
}

const loadMessagesAsync = async (param) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}conversations/${param.id}/messages?before=${param.before}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

const loadLastSeenData = async (conversationId) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${conversationId}/update_last_seen`,
    null,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* loadMessages({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(loadMessagesAsync, payload);
    const lastSeenResponse = yield call(loadLastSeenData, payload.id);
    yield put(loadMessagesSuccess(response, payload));
    yield put(lastSeenDataSuccess(lastSeenResponse, true));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(loadMessagesError(errorMsg));
  }
}

const deleteMessageAsync = async (param) => {
  const method = 'delete';
  return axios[method](
    `${apiUrlNew()}conversations/${param.conversation_id}/messages/${param.id}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};
function* deleteMessage({ payload }) {
  try {
    const response = yield call(deleteMessageAsync, payload);
    yield put(deleteMessageSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const buildCreatePayload = ({
  message,
  isPrivate,
  contentAttributes,
  echoId,
  files,
  ccEmails = '',
  bccEmails = '',
}) => {
  let payload;
  if (files && files.length !== 0) {
    payload = new FormData();
    if (message) {
      payload.append('content', message);
    }
    files.forEach((file) => {
      payload.append('attachments[]', file);
    });
    payload.append('private', isPrivate);
    payload.append('echo_id', echoId);
    payload.append('cc_emails', ccEmails);
    payload.append('bcc_emails', bccEmails);
  } else {
    payload = {
      content: message,
      private: isPrivate,
      echo_id: echoId,
      content_attributes: contentAttributes,
      cc_emails: ccEmails,
      bcc_emails: bccEmails,
    };
  }
  return payload;
};

const sendMessageAsync = async (param) => {
  const method = 'post';
  const postData = buildCreatePayload(param);
  return axios[method](
    `${apiUrlNew()}conversations/${param.conversationId}/messages`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* sendMessage({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(sendMessageAsync, payload);
    yield put(sendMessageSuccess(response));
    const lastSeenResponse = yield call(
      loadLastSeenData,
      payload.conversationId
    );
    yield put(lastSeenDataSuccess(lastSeenResponse, true));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(sendMessageError(errorMsg));
  }
}

const deleteInboxAsync = async (param) => {
  const method = 'delete';
  buildCreatePayload(param);
  return axios[method](`${apiUrlNewV3()}inboxes/${param.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteInbox({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(deleteInboxAsync, payload);
    yield put(deleteInboxSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteInboxError(errorMsg));
  }
}
const addAttributesConversationItemRequest = async ({
  conversationId,
  custom_attributes,
}) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${conversationId}/custom_attributes`,
    { custom_attributes },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addAttributesConversationItem({ payload }) {
  try {
    const response = yield call(addAttributesConversationItemRequest, payload);
    yield put(addAttributesConversationItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addAttributesConversationItemError(errorMsg));
  }
}

const getCustomAttributesAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}custom_attribute_definitions`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCustomAttributesList({ payload }) {
  try {
    const response = yield call(getCustomAttributesAsync, {});
    const convertedResponse = yield call(
      getCustomAttributesListMapped,
      payload.type,
      response
    );
    yield put(getCustomAttributesSuccess(convertedResponse));
    yield put(getCampaigns());
    yield put(getTeams());
    yield put(getAgents());
    yield put(getCountryDropdownList());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(getCustomAttributesError(errorMsg));
  }
}

const getCustomFiltersAsync = async ({ filter_type }) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNew()}custom_filters?filter_type=${filter_type}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getCustomFilters({ payload }) {
  try {
    const response = yield call(getCustomFiltersAsync, payload);
    const latestFilter = response.find((res) => {
      return res.id.toString() === payload?.id || res.id === payload?.id;
    });
    let payloadObj = { folders: response };
    if (latestFilter) {
      const { query, ...rest } = latestFilter;
      const data = { payload: { filters: query.payload } };
      const conversationOptions = yield select(getConversationFiltersList);
      const convertedResponse = yield call(
        mapCustomFilters,
        query.payload,
        conversationOptions
      );
      payloadObj.filter = { filters: [...convertedResponse], ...rest };
      yield call(applyAdvancedConversationFilters, data);
    }
    yield put(getCustomFiltersSuccess(payloadObj));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(getCustomFiltersError(errorMsg));
  }
}

const deleteCustomFiltersAsync = async ({ filter_type, id }) => {
  const method = 'delete';
  return axios[method](
    `${apiUrlNew()}custom_filters/${id}?filter_type=${filter_type}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* deleteCustomFilters({ payload }) {
  try {
    yield call(deleteCustomFiltersAsync, payload);
    const updatedFolders = yield call(getCustomFiltersAsync, payload);
    let payloadObj = { folders: updatedFolders };

    const inboxStateData = yield select(inboxState);
    const { converstaionFiltersOptions, conversationFilters } = inboxStateData;
    const latestFilters = updatedFolders?.[updatedFolders?.length - 1];
    if (latestFilters) {
      const convertedResponse = yield call(
        mapCustomFilters,
        latestFilters.query.payload,
        converstaionFiltersOptions
      );
      payloadObj.filters = {
        ...latestFilters,
        filters: [...convertedResponse],
      };
    } else {
      payloadObj.filters = { filters: [...conversationFilters?.filters] };
    }
    const data = { payload: { ...payloadObj.filters } };
    yield call(applyAdvancedConversationFilters, data);
    yield put(deleteCustomFiltersSuccess(payloadObj));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteCustomFiltersError(errorMsg));
  }
}

const applyAdvancedConversationFiltersRequest = async ({ filters }) => {
  const payload = [...filters];
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/filter?page=1`,
    { payload },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* applyAdvancedConversationFilters({ payload }) {
  try {
    const response = yield call(
      applyAdvancedConversationFiltersRequest,
      payload
    );
    yield put(applyAdvancedConversationFiltersSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(applyAdvancedConversationFiltersError(errorMsg));
  }
}
const saveAdvancedConversationFiltersRequest = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}custom_filters`,
    { ...payload },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* saveAdvancedConversationFilters({ payload }) {
  try {
    const response = yield call(
      saveAdvancedConversationFiltersRequest,
      payload
    );
    const { query, ...rest } = response;
    const conversationOptions = yield select(getConversationFiltersList);
    const convertedResponse = yield call(
      mapCustomFilters,
      query.payload,
      conversationOptions
    );
    yield put(
      saveAdvancedConversationFiltersSuccess({
        filter: { filters: [...convertedResponse], ...rest },
        folders: [response],
      })
    );
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(saveAdvancedConversationFiltersError(errorMsg));
  }
}

const addSurveyResponseAsync = async (param) => {
  const method = 'put';
  const url = `${apiUrlNewSurvey()}csat_survey/${param.id}`;
  return axios[method](url, param.newParams, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addSurveyResponse({ payload }) {
  try {
    const response = yield call(addSurveyResponseAsync, payload);
    yield put(addSurveyResponseSuccess(response));

    if (
      payload?.newParams?.message?.submitted_values?.csat_survey_response
        ?.feedback_message
    ) {
      yield put({
        type: GET_CONVERSATION_SURVEY_RESPONSE,
        payload: { id: payload?.id },
      });
    }
  } catch (error) {
    commonRequestException(error);
  }
}

const getSurveyResponseAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNewSurvey()}csat_survey/${param.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getSurveyResponse({ payload }) {
  try {
    const response = yield call(getSurveyResponseAsync, payload);
    yield put(getSurveyResponseSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* addMessage({ payload }) {
  const inboxReducerData = yield select(inboxState);
  let conversationPayload = inboxReducerData.conversations?.payload;
  let messages = inboxReducerData.messages;
  const { conversation_id: conversationId } = payload.message || {};
  if (!conversationPayload) return;
  const [chat] = yield call(
    getSelectedChatConversation,
    inboxReducerData.conversations?.payload,
    conversationId
  );
  if (!chat) return;
  const pendingMessageIndex = yield call(
    findPendingMessageIndex,
    chat,
    payload.message
  );
  if (pendingMessageIndex !== -1) {
    chat.messages.splice(pendingMessageIndex, 1, payload.message);
  } else {
    chat.messages.push(payload.message);
    chat.timestamp = payload.message.created_at;
  }
  const conversationPayloadIndex =
    inboxReducerData.conversations?.payload?.findIndex(
      (data) => data.id === chat.id
    );
  conversationPayload.splice(conversationPayloadIndex, 1, chat);

  if (inboxReducerData.selectedConversationId === chat.id) {
    const messageIndex = messages.payload.findIndex((message) => {
      return message.id === payload.message.id;
    });
    if (messageIndex === -1) {
      messages.payload.push(payload.message);
    } else {
      messages.payload[messageIndex] = payload.message;
    }
  }

  if (!payload.message?.custom_attributes?.deleted) {
    conversationPayload.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }
  yield put(addMessageSuccess({ conversationPayload, messages }));
}

function* onConversationCreatedEvent(action) {
  const state = yield select();
  const { inboxes, conversationFilters } = state.inboxApp;
  const {
    inbox_id: inboxId,
    meta: { sender },
  } = action.payload;
  const hasAppliedFilters = !!conversationFilters?.filters?.length;
  const isMatchingInboxFilter = !inboxes.includes(inboxId);
  if (
    !hasAppliedFilters &&
    isMatchingInboxFilter
    /**
     * may be needed for mention conversation
     * !isOnMentionsView(rootState) &&
     */
  ) {
    yield put(newConversationList(action.payload));
    yield put(newConstactsList(sender));
  }
}

/* Fetch Coversation Stats API  */
const fecthConversationStatsMetaAsync = async (param) => {
  let extraParams = '';
  [
    'page',
    'assignee_type',
    { objKey: 'labels', urlKey: 'labels[]' },
    'status',
    { objKey: 'inboxId', urlKey: 'inbox_id' },
    'conversation_type',
  ].map((val) => {
    let objKey = val;
    let urlKey = val;
    if (typeof val === 'object') {
      objKey = val.objKey;
      urlKey = val.urlKey;
    }
    if (typeof param[objKey] !== 'undefined') {
      extraParams += extraParams
        ? `&${urlKey}=${param[objKey]}`
        : `${urlKey}=${param[objKey]}`;
    }
    return false;
  });
  const method = 'get';
  return axios[method](`${apiUrlNew()}conversations/meta?${extraParams}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* fetchConversationStatsMeta({ payload }) {
  try {
    const response = yield call(fecthConversationStatsMetaAsync, payload);
    yield put(fetchConversationStatsMetaSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* newMessageNotification({ payload }) {
  const audio = new Audio(notificationSound);
  const { selectedConversationId, conversations } = yield select(inboxState);
  const {
    currentUser: {
      ui_settings: { enable_audio_alerts: enableAudioAlerts = false },
    },
  } = yield select(authState);
  const currentUserId = yield call(currentUserID, {});
  const { conversation_id: incomingConvId } = payload;
  const currentConv =
    conversations?.payload?.find((conversation) => {
      return conversation.id === incomingConvId;
    }) || {};
  const isDocHidden = document.hidden;
  const assigneeId = yield call(getAssigneeFromNotification, currentConv);
  const playAudio = yield call(
    shouldPlayAudio,
    payload,
    selectedConversationId,
    currentUserId,
    isDocHidden
  );
  const isNotificationEnabled = notificationEnabled(
    enableAudioAlerts,
    currentUserId,
    assigneeId
  );

  if (playAudio && isNotificationEnabled) {
    audio.muted = true;
    audio.play();
  }
}

const updateTypingStatusRequest = async (payload) => {
  const method = 'post';
  const conversationId = payload.conversationId;
  delete payload.conversationId;
  return axios[method](
    `${apiUrlNew()}conversations/${conversationId}/toggle_typing_status`,
    { ...payload },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* updateTypingStatus(action) {
  try {
    yield call(updateTypingStatusRequest, action.payload);
  } catch (error) {
    commonRequestException(error);
  }
}

export function* watchGetInbox() {
  yield takeEvery(GET_INBOX, getInbox);
  yield takeEvery(GET_ALL_INBOXES, getAllInboxes);
  yield takeEvery(DELETE_INBOX, deleteInbox);
  yield takeEvery(GET_CUSTOM_ATTRIBUTES, getCustomAttributesList);
  yield takeEvery(
    ADVANCED_CONVERSATION_FILTERS,
    applyAdvancedConversationFilters
  );
  yield takeEvery(
    SAVE_ADVANCED_CONVERSATION_FILTERS,
    saveAdvancedConversationFilters
  );
  yield takeEvery(GET_CUSTOM_FILTERS, getCustomFilters);
  yield takeEvery(DELETE_CUSTOM_FILTERS, deleteCustomFilters);
}

export function* watchGetConversation() {
  yield takeEvery(CHAT_GET_CONVERSATIONS_NEWWW, loadConversationsNeww);
  yield takeEvery(CHAT_CHANGE_CONVERSATION_MUTED, changeConversationMuted);
  yield takeEvery(CHAT_CHANGE_CONVERSATION_STATUS, changeConversationStatus);
  yield takeEvery(CHAT_SEND_CONVERSATION, sendConversation);
  yield takeEvery(
    ADD_ATTRIBUTES_CONVERSATION_ITEM,
    addAttributesConversationItem
  );
  yield takeEvery(ADD_CONVERSATION_SURVEY_RESPONSE, addSurveyResponse);
  yield takeEvery(GET_CONVERSATION_SURVEY_RESPONSE, getSurveyResponse);
  yield takeLatest(ON_CONVERSATION_CREATED_EVENT, onConversationCreatedEvent);
  yield takeEvery(FETCH_CONVERSATION_STATS_META, fetchConversationStatsMeta);
}

export function* watchGetMessages() {
  yield takeEvery(CHAT_GET_MESSAGES, loadMessages);
  yield takeEvery(CHAT_DELETE_MESSAGES, deleteMessage);
  yield takeEvery(CHAT_SEND_MESSAGE, sendMessage);
  yield takeEvery(ADD_MESSAGE, addMessage);
  yield takeEvery(NEW_MESSAGE_NOTIFICATION, newMessageNotification);
}

export function* watchTypingStatus() {
  yield takeEvery(UPDATE_TYPING_STATUS, updateTypingStatus);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetInbox),
    fork(watchGetConversation),
    fork(watchGetMessages),
    fork(watchTypingStatus),
  ]);
}
