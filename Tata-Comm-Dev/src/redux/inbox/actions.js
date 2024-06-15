import {
  GET_INBOX,
  GET_INBOX_SUCCESS,
  CHAT_GET_CONVERSATIONS_NEWWW,
  CHAT_GET_CONVERSATIONS_SUCCESS_NEWWW,
  CHAT_GET_CONVERSATIONS_ERROR_NEWWW,
  CHAT_CHANGE_CONVERSATION_STATUS,
  CHAT_CHANGE_CONVERSATION_STATUS_SUCCESS,
  CHAT_CHANGE_CONVERSATION_MUTED,
  CHAT_CHANGE_CONVERSATION_MUTED_SUCCESS,
  CHAT_SEND_CONVERSATION,
  CHAT_SEND_CONVERSATION_SUCCESS,
  CHAT_SEND_CONVERSATION_ERROR,
  CHAT_SEND_CONVERSATION_CLEAN,
  CHAT_GET_MESSAGES,
  CHAT_GET_MESSAGES_SUCCESS,
  CHAT_GET_MESSAGES_ERROR,
  CHAT_DELETE_MESSAGES,
  CHAT_DELETE_MESSAGES_SUCCESS,
  CHAT_SEND_MESSAGE,
  CHAT_SEND_MESSAGE_SUCCESS,
  CHAT_SEND_MESSAGE_ERROR,
  CHAT_SEND_MESSAGE_CLEAN,
  DELETE_INBOX,
  DELETE_INBOX_SUCCESS,
  DELETE_INBOX_ERROR,
  DELETE_INBOX_CLEAN,
  CHAT_GET_LASTSEEN_SUCCESS,
  ADD_ATTRIBUTES_CONVERSATION_ITEM,
  ADD_ATTRIBUTES_CONVERSATION_SUCCESS,
  ADD_ATTRIBUTES_CONVERSATION_ERROR,
  ADD_ATTRIBUTES_CONVERSATION_CLEAN,
  CHAT_GET_CONVERSATIONS_CLEAN_NEWWW,
  GET_CUSTOM_ATTRIBUTES,
  GET_CUSTOM_ATTRIBUTES_SUCCESS,
  GET_CUSTOM_ATTRIBUTES_ERROR,
  GET_CONVERSATION_FILTERS,
  ADVANCED_CONVERSATION_FILTERS,
  ADVANCED_CONVERSATION_FILTERS_SUCCESS,
  ADVANCED_CONVERSATION_FILTERS_ERROR,
  SAVE_ADVANCED_CONVERSATION_FILTERS,
  SAVE_ADVANCED_CONVERSATION_FILTERS_SUCCESS,
  SAVE_ADVANCED_CONVERSATION_FILTERS_ERROR,
  ADVANCED_CONVERSATION_FILTERS_CLEAN_UP,
  GET_CUSTOM_FILTERS,
  GET_CUSTOM_FILTERS_SUCCESS,
  GET_CUSTOM_FILTERS_ERROR,
  DELETE_CUSTOM_FILTERS,
  DELETE_CUSTOM_FILTERS_SUCCESS,
  DELETE_CUSTOM_FILTERS_ERROR,
  GET_ALL_INBOXES,
  GET_ALL_INBOX_SUCCESS,
  ADD_CONVERSATION_SURVEY_RESPONSE,
  ADD_CONVERSATION_SURVEY_RESPONSE_SUCCESS,
  GET_CONVERSATION_SURVEY_RESPONSE,
  GET_CONVERSATION_SURVEY_RESPONSE_SUCCESS,
  ADD_MESSAGE,
  ADD_MESSAGE_SUCCESS,
  ON_CONVERSATION_CREATED_EVENT,
  FETCH_CONVERSATION_STATS,
  FETCH_CONVERSATION_STATS_META,
  FETCH_CONVERSATION_STATS_META_SUCCESS,
  CONVERSATION_CONTACT_DETAILS_UPDATE,
  UPDATE_CONVERSATION,
  DELETE_FROM_CONVERSATION,
  NEW_MESSAGE_NOTIFICATION,
  NEW_CONVERSATIONS_LIST,
  UPDATE_TYPING_STATUS,
  ADD_USER_TYPING_TO_CONVERSATION,
  REMOVE_USER_TYPING_FROM_CONVERSATION,
  MESSAGE_CLEAN,
  UPDATE_CONVERSATION_CONTACT,
} from 'redux/constants';

export const getInbox = (item) => ({
  type: GET_INBOX,
  payload: item,
});

export const getInboxSuccess = (items) => ({
  type: GET_INBOX_SUCCESS,
  payload: items,
});

export const getAllInboxes = (item) => ({
  type: GET_ALL_INBOXES,
  payload: item,
});

export const getAllInboxesSuccess = (items) => ({
  type: GET_ALL_INBOX_SUCCESS,
  payload: items,
});

export const getConversationsNewww = (userId) => ({
  type: CHAT_GET_CONVERSATIONS_NEWWW,
  payload: userId,
});
export const getConversationsSuccessNewww = (items) => ({
  type: CHAT_GET_CONVERSATIONS_SUCCESS_NEWWW,
  payload: items,
});
export const getConversationsErrorNewww = (error) => ({
  type: CHAT_GET_CONVERSATIONS_ERROR_NEWWW,
  payload: error,
});

export const changeConversationMuted = (userId) => ({
  type: CHAT_CHANGE_CONVERSATION_MUTED,
  payload: userId,
});
export const changeConversationMutedSuccess = (response) => ({
  type: CHAT_CHANGE_CONVERSATION_MUTED_SUCCESS,
  payload: response,
});

export const changeConversationStatus = (userId) => ({
  type: CHAT_CHANGE_CONVERSATION_STATUS,
  payload: userId,
});
export const changeConversationStatusSuccess = (response) => ({
  type: CHAT_CHANGE_CONVERSATION_STATUS_SUCCESS,
  payload: response,
});

export const sendConversation = (userId) => ({
  type: CHAT_SEND_CONVERSATION,
  payload: userId,
});
export const sendConversationSuccess = (items) => ({
  type: CHAT_SEND_CONVERSATION_SUCCESS,
  payload: items,
});
export const sendConversationError = (error) => ({
  type: CHAT_SEND_CONVERSATION_ERROR,
  payload: error,
});
export const sendConversationClean = (error) => ({
  type: CHAT_SEND_CONVERSATION_CLEAN,
  payload: error,
});

export const loadMessages = (userId) => ({
  type: CHAT_GET_MESSAGES,
  payload: userId,
});
export const loadMessagesSuccess = (response, params) => ({
  type: CHAT_GET_MESSAGES_SUCCESS,
  payload: { response, params },
});
export const loadMessagesError = (error) => ({
  type: CHAT_GET_MESSAGES_ERROR,
  payload: error,
});
export const lastSeenDataSuccess = (lastSeenResponse, updateConversation) => ({
  type: CHAT_GET_LASTSEEN_SUCCESS,
  payload: { lastSeenData: lastSeenResponse, updateConversation },
});

export const deleteMessage = (userId) => ({
  type: CHAT_DELETE_MESSAGES,
  payload: userId,
});
export const deleteMessageSuccess = (response) => ({
  type: CHAT_DELETE_MESSAGES_SUCCESS,
  payload: response,
});

export const sendMessage = (userId) => ({
  type: CHAT_SEND_MESSAGE,
  payload: userId,
});
export const sendMessageSuccess = (items) => ({
  type: CHAT_SEND_MESSAGE_SUCCESS,
  payload: items,
});
export const sendMessageError = (error) => ({
  type: CHAT_SEND_MESSAGE_ERROR,
  payload: error,
});
export const sendMessageClean = (error) => ({
  type: CHAT_SEND_MESSAGE_CLEAN,
  payload: error,
});

export const deleteInbox = (userId) => ({
  type: DELETE_INBOX,
  payload: userId,
});
export const deleteInboxSuccess = (items) => ({
  type: DELETE_INBOX_SUCCESS,
  payload: items,
});
export const deleteInboxError = (error) => ({
  type: DELETE_INBOX_ERROR,
  payload: error,
});
export const deleteInboxClean = (error) => ({
  type: DELETE_INBOX_CLEAN,
  payload: error,
});
export const addAttributesConversationItem = (item) => ({
  type: ADD_ATTRIBUTES_CONVERSATION_ITEM,
  payload: item,
});

export const addAttributesConversationItemSuccess = (items) => ({
  type: ADD_ATTRIBUTES_CONVERSATION_SUCCESS,
  payload: items,
});

export const addAttributesConversationItemError = (error) => ({
  type: ADD_ATTRIBUTES_CONVERSATION_ERROR,
  payload: error,
});

export const addAttributesConversationItemClean = (item) => ({
  type: ADD_ATTRIBUTES_CONVERSATION_CLEAN,
  payload: item,
});
export const conversationClean = () => ({
  type: CHAT_GET_CONVERSATIONS_CLEAN_NEWWW,
});

export const getCustomAttributes = (item) => ({
  type: GET_CUSTOM_ATTRIBUTES,
  payload: item,
});

export const getCustomAttributesSuccess = (item) => ({
  type: GET_CUSTOM_ATTRIBUTES_SUCCESS,
  payload: item,
});

export const getCustomAttributesError = (item) => ({
  type: GET_CUSTOM_ATTRIBUTES_ERROR,
  payload: item,
});

export const getCustomFilters = (item) => ({
  type: GET_CUSTOM_FILTERS,
  payload: item,
});

export const getCustomFiltersSuccess = (item) => ({
  type: GET_CUSTOM_FILTERS_SUCCESS,
  payload: item,
});

export const messageClean = (item) => ({
  type: MESSAGE_CLEAN,
  payload: item,
});

export const getCustomFiltersError = (item) => ({
  type: GET_CUSTOM_FILTERS_ERROR,
  payload: item,
});

export const deleteCustomFilters = (item) => ({
  type: DELETE_CUSTOM_FILTERS,
  payload: item,
});

export const deleteCustomFiltersSuccess = (item) => ({
  type: DELETE_CUSTOM_FILTERS_SUCCESS,
  payload: item,
});

export const deleteCustomFiltersError = (item) => ({
  type: DELETE_CUSTOM_FILTERS_ERROR,
  payload: item,
});

export const getConversationFilters = (item) => ({
  type: GET_CONVERSATION_FILTERS,
  payload: item,
});

export const applyAdvancedConversationFilters = (item) => ({
  type: ADVANCED_CONVERSATION_FILTERS,
  payload: item,
});

export const applyAdvancedConversationFiltersSuccess = (item) => ({
  type: ADVANCED_CONVERSATION_FILTERS_SUCCESS,
  payload: item,
});

export const applyAdvancedConversationFiltersError = (item) => ({
  type: ADVANCED_CONVERSATION_FILTERS_ERROR,
  payload: item,
});

export const applyAdvancedConversationFiltersCleanUp = () => ({
  type: ADVANCED_CONVERSATION_FILTERS_CLEAN_UP,
});

export const saveAdvancedConversationFilters = (item) => ({
  type: SAVE_ADVANCED_CONVERSATION_FILTERS,
  payload: item,
});

export const saveAdvancedConversationFiltersSuccess = (item) => ({
  type: SAVE_ADVANCED_CONVERSATION_FILTERS_SUCCESS,
  payload: item,
});

export const saveAdvancedConversationFiltersError = (item) => ({
  type: SAVE_ADVANCED_CONVERSATION_FILTERS_ERROR,
  payload: item,
});

export const addSurveyResponse = (data) => ({
  type: ADD_CONVERSATION_SURVEY_RESPONSE,
  payload: data,
});

export const addSurveyResponseSuccess = (res) => ({
  type: ADD_CONVERSATION_SURVEY_RESPONSE_SUCCESS,
  payload: res,
});

export const getSurveyResponse = (data) => ({
  type: GET_CONVERSATION_SURVEY_RESPONSE,
  payload: data,
});

export const getSurveyResponseSuccess = (res) => ({
  type: GET_CONVERSATION_SURVEY_RESPONSE_SUCCESS,
  payload: res,
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const addMessageSuccess = (data) => ({
  type: ADD_MESSAGE_SUCCESS,
  payload: data,
});

export const onConversationCreatedEvent = (item) => ({
  type: ON_CONVERSATION_CREATED_EVENT,
  payload: item,
});

export const fetchConversationStats = (item) => ({
  type: FETCH_CONVERSATION_STATS,
  payload: item,
});

export const fetchConversationStatsMeta = (item) => ({
  type: FETCH_CONVERSATION_STATS_META,
  payload: item,
});

export const fetchConversationStatsMetaSuccess = (item) => ({
  type: FETCH_CONVERSATION_STATS_META_SUCCESS,
  payload: item,
});

export const conversationContactDetailsUpdate = (item) => ({
  type: CONVERSATION_CONTACT_DETAILS_UPDATE,
  payload: item,
});

export const updateConversation = (item) => ({
  type: UPDATE_CONVERSATION,
  payload: item,
});

export const deleteFromConversation = (item) => ({
  type: DELETE_FROM_CONVERSATION,
  payload: item,
});

export const newMessageNotification = (item) => ({
  type: NEW_MESSAGE_NOTIFICATION,
  payload: item,
});

export const newConversationList = (item) => ({
  type: NEW_CONVERSATIONS_LIST,
  payload: item,
});

export const updateTypingStatus = (payload) => ({
  type: UPDATE_TYPING_STATUS,
  payload: payload,
});

export const typingOnEvent = (payload) => ({
  type: ADD_USER_TYPING_TO_CONVERSATION,
  payload: payload,
});

export const typingOffEvent = (payload) => ({
  type: REMOVE_USER_TYPING_FROM_CONVERSATION,
  payload: payload,
});

export const updateConversationContactDetails = (payload) => ({
  type: UPDATE_CONVERSATION_CONTACT,
  payload: payload,
});
