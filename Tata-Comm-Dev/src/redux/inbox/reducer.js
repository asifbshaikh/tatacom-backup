import {
  GET_INBOX,
  GET_INBOX_SUCCESS,
  CHAT_GET_CONVERSATIONS_NEWWW,
  CHAT_GET_CONVERSATIONS_SUCCESS_NEWWW,
  CHAT_GET_CONVERSATIONS_ERROR_NEWWW,
  CHAT_CHANGE_CONVERSATION_MUTED,
  CHAT_CHANGE_CONVERSATION_MUTED_SUCCESS,
  CHAT_CHANGE_CONVERSATION_STATUS,
  CHAT_CHANGE_CONVERSATION_STATUS_SUCCESS,
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
  CHAT_SEND_MESSAGE_CLEAN,
  CHAT_SEND_MESSAGE_ERROR,
  DELETE_INBOX,
  DELETE_INBOX_SUCCESS,
  DELETE_INBOX_ERROR,
  DELETE_INBOX_CLEAN,
  CHAT_GET_LASTSEEN_SUCCESS,
  ADD_ATTRIBUTES_CONVERSATION_SUCCESS,
  ADD_ATTRIBUTES_CONVERSATION_ITEM,
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
  ADVANCED_CONVERSATION_FILTERS_CLEAN_UP,
  GET_CUSTOM_FILTERS_SUCCESS,
  MESSAGE_CLEAN,
  GET_CUSTOM_FILTERS_ERROR,
  GET_CUSTOM_FILTERS,
  DELETE_CUSTOM_FILTERS_ERROR,
  DELETE_CUSTOM_FILTERS_SUCCESS,
  DELETE_CUSTOM_FILTERS,
  SAVE_ADVANCED_CONVERSATION_FILTERS,
  SAVE_ADVANCED_CONVERSATION_FILTERS_SUCCESS,
  SAVE_ADVANCED_CONVERSATION_FILTERS_ERROR,
  GET_ALL_INBOXES,
  GET_ALL_INBOX_SUCCESS,
  ADD_CONVERSATION_SURVEY_RESPONSE,
  ADD_CONVERSATION_SURVEY_RESPONSE_SUCCESS,
  GET_CONVERSATION_SURVEY_RESPONSE,
  GET_CONVERSATION_SURVEY_RESPONSE_SUCCESS,
  ADD_MESSAGE_SUCCESS,
  FETCH_CONVERSATION_STATS,
  FETCH_CONVERSATION_STATS_META,
  FETCH_CONVERSATION_STATS_META_SUCCESS,
  CONVERSATION_CONTACT_DETAILS_UPDATE,
  UPDATE_CONVERSATION,
  DELETE_FROM_CONVERSATION,
  NEW_CONVERSATIONS_LIST,
  ADD_USER_TYPING_TO_CONVERSATION,
  REMOVE_USER_TYPING_FROM_CONVERSATION,
  UPDATE_CONVERSATION_CONTACT,
} from 'redux/constants';

const INIT_STATE = {
  loaded: false,
  inboxes: [],
  loadedInboxes: false,
  conversations: null,
  loadingConversations: false,
  loadingMessages: false,
  errorMessages: {},
  messages: {},
  noMoreMessages: false,
  selectedConversationId: null,
  lastSeenData: {},
  errorConversationAttributes: {},
  successConversationAttributes: false,
  loadingConversationAttributes: false,
  converstaionFiltersOptions: [],
  conversationFilters: {},
  successAppliedFilters: false,
  errorAppliedFilters: {},
  customFiltersLoading: false,
  customFiltersSuccess: false,
  customFiltersError: {},
  deleteCustomFiltersSuccess: false,
  deleteCustomFiltersError: {},
  savedCustomFilters: false,
  errorCustomFilter: {},
  folders: [],
  addSurveyResponse: false,
  surveyResponse: {},
  getSurveyResponse: false,
  existingSurveyResponse: {},
  updateFeedbackLoading: false,
  showOptionalFeedback: false,
  getSurveyLoading: true,
  fetchConversationStat: false,
  loadMeta: false,
  typingUsersRecords: {},
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INBOX:
      return { ...state, loaded: false, loadedInboxes: false };

    case GET_INBOX_SUCCESS:
      return {
        ...state,
        loaded: true,
        loadedInboxes: true,
        inboxes: action.payload.payload,
      };
    case GET_ALL_INBOXES:
      return { ...state, loaded: false, loadedInboxes: false };

    case GET_ALL_INBOX_SUCCESS:
      return {
        ...state,
        loaded: true,
        loadedInboxes: true,
        inboxes: action.payload.payload,
        inboxTotalCount: action.payload.pagination.total_count,
        totalPages: action.payload.pagination.total_pages,
      };

    case CHAT_GET_CONVERSATIONS_NEWWW:
      return {
        ...state,
        loadingConversations: true,
        noMoreMessages: false,
        selectedConversationId: null,
        messages: {},
      };

    case CHAT_GET_CONVERSATIONS_SUCCESS_NEWWW:
      // eslint-disable-next-line no-case-declarations
      let responseToReturn = action.payload.data;
      if (state.conversations?.payload && action.payload?.data?.payload) {
        responseToReturn = {
          meta: { ...state.conversations.meta, ...action.payload?.data?.meta },
          payload: [
            ...state.conversations.payload,
            ...action.payload.data.payload,
          ],
        };
      }
      // eslint-disable-next-line no-case-declarations
      let emptyingMsgData = {};
      if (action.payload?.id) {
        // adding conversation details for the case of url hit
        // eslint-disable-next-line no-case-declarations
        const newResponse = action.payload;
        newResponse.donotshowinlisting = true;
        responseToReturn = {
          ...state.conversations,
          payload: [...state.conversations.payload, newResponse],
        };
      } else {
        // removing previous messages and selectedConversationId
        // eslint-disable-next-line no-case-declarations
        emptyingMsgData = {
          messages: {},
          noMoreMessages: false,
          selectedConversationId: null,
        };
      }
      return {
        ...state,
        loadingConversations: false,
        conversations: responseToReturn,
        // selectedUserId: action.payload.selectedUser,
        ...emptyingMsgData,
      };

    case CHAT_GET_CONVERSATIONS_ERROR_NEWWW:
      return { ...state, loadingConversations: false, error: action.payload };

    case CHAT_GET_CONVERSATIONS_CLEAN_NEWWW:
      return { ...state, conversations: null };

    case CHAT_CHANGE_CONVERSATION_MUTED:
      return { ...state, loadingConversationStatus: true };

    case CHAT_CHANGE_CONVERSATION_MUTED_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const updatedPayload = state.conversations.payload.map((obj) => {
        if (obj.id === action.payload.params.id) {
          // change mute status, if it is updated to muted, change status: 'resolved' as per gui
          return {
            ...obj,
            muted: action.payload.params.muted,
            ...(action.payload.params.muted ? { status: 'resolved' } : {}),
          };
        }
        return obj; // otherwise return object as is
      });
      // eslint-disable-next-line no-case-declarations
      const updatedConversations = {
        ...state.conversations,
        payload: updatedPayload,
      };
      return {
        ...state,
        conversations: updatedConversations,
        loadingConversationStatus: false,
      };

    case CHAT_CHANGE_CONVERSATION_STATUS:
      return { ...state, loadingConversationStatus: true };

    case CHAT_CHANGE_CONVERSATION_STATUS_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const updatedPayloadStatus = state.conversations.payload.map((obj) => {
        if (obj.id === action.payload.params.id) {
          return {
            ...obj,
            status: action.payload.response.payload.current_status,
            snoozed_until: action.payload.response.payload.snoozed_until,
          };
        }
        return obj; // otherwise return object as is
      });
      // eslint-disable-next-line no-case-declarations
      const updatedConversationsStatus = {
        ...state.conversations,
        payload: updatedPayloadStatus,
      };
      return {
        ...state,
        conversations: updatedConversationsStatus,
        loadingConversationStatus: false,
      };

    case CHAT_SEND_CONVERSATION:
      return {
        ...state,
        errorSendConversation: {},
        successSendConversation: false,
        loadingSendConversation: true,
      };

    case CHAT_SEND_CONVERSATION_SUCCESS:
      return {
        ...state,
        errorSendConversation: {},
        successSendConversation: true,
        loadingSendConversation: false,
      };

    case CHAT_SEND_CONVERSATION_ERROR:
      return {
        ...state,
        errorSendConversation: action.payload,
        successSendConversation: false,
        loadingSendConversation: false,
      };

    case CHAT_SEND_CONVERSATION_CLEAN:
      return {
        ...state,
        errorSendConversation: {},
        successSendConversation: false,
        loadingSendConversation: false,
      };

    case CHAT_GET_MESSAGES:
      return { ...state, loadingMessages: true, errorMessages: {} };

    case CHAT_GET_MESSAGES_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let response = state.messages;
      // eslint-disable-next-line no-case-declarations
      const noMoreMessages =
        typeof action.payload.response.payload !== 'undefined' &&
        action.payload.response.payload.length < 20;
      if (
        action.payload.params.id === state.selectedConversationId &&
        action.payload.params.isLoadMore
      ) {
        // add payload to previous payload i.e messages list
        const oldResponse = action.payload.response.payload;
        const newResponse = response.payload;
        response.payload = [...oldResponse, ...newResponse];
        // response = {...response, payload: [...response.payload, action.payload.response.payload]}
      } else {
        response = action.payload.response; // first time loading
      }
      return {
        ...state,
        loadingMessages: false,
        errorMessages: {},
        messages: response,
        selectedConversationId: action.payload.params.id,
        noMoreMessages,
        conversationInboxDeactivated:
          action.payload.response.meta.is_conversation_channel_disabled,
      };

    case CHAT_GET_MESSAGES_ERROR:
      return {
        ...state,
        loadingMessages: false,
        errorMessages: action.payload,
        messages: {},
      };

    case CHAT_DELETE_MESSAGES:
      return { ...state };

    case CHAT_DELETE_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: {
          ...state.messages,
          payload: state.messages.payload.map((message) =>
            message.id === action.payload.id ? action.payload : message
          ),
        },
      };

    case CHAT_SEND_MESSAGE:
      return {
        ...state,
        errorSendMessage: {},
        successSendMessage: false,
        loadingSendMessage: true,
      };

    case CHAT_SEND_MESSAGE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const responseMsg = state.messages;
      // eslint-disable-next-line no-case-declarations
      const isMessageExists = responseMsg.payload.find((msg) => {
        return msg.id === action.payload.id;
      });
      if (action.payload.id && !isMessageExists) {
        // add payload to previous payload i.e messages list
        const oldResponse = responseMsg.payload;
        const newResponse = [action.payload];
        responseMsg.payload = [...oldResponse, ...newResponse];
        // response = {...response, payload: [...response.payload, action.payload.response.payload]}
      }
      return {
        ...state,
        messages: responseMsg,
        errorSendMessage: {},
        successSendMessage: true,
        loadingSendMessage: false,
      };

    case CHAT_SEND_MESSAGE_ERROR:
      return {
        ...state,
        errorSendMessage: action.payload,
        successSendMessage: false,
        loadingSendMessage: false,
      };

    case CHAT_SEND_MESSAGE_CLEAN:
      return {
        ...state,
        errorSendMessage: {},
        successSendMessage: false,
        loadingSendMessage: false,
      };
    case CHAT_GET_LASTSEEN_SUCCESS: {
      let updatedConversations;
      if (action.payload.lastSeenData.id && action.payload.updateConversation) {
        updatedConversations = state.conversations.payload.map((item) =>
          item.id === action.payload.lastSeenData.id
            ? action.payload.lastSeenData
            : item
        );
      } else {
        updatedConversations = state.conversations.payload || [];
      }
      return {
        ...state,
        lastSeenData: action.payload.lastSeenData,
        conversations: {
          ...state.conversations,
          payload: updatedConversations,
        },
      };
    }

    case DELETE_INBOX:
      return {
        ...state,
        errorDeleteInbox: {},
        successDeleteInbox: false,
        loadingDeleteInbox: true,
      };

    case DELETE_INBOX_SUCCESS:
      return {
        ...state,
        inboxes: state.inboxes.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDeleteInbox: {},
        successDeleteInbox: true,
        loadingDeleteInbox: false,
      };

    case DELETE_INBOX_ERROR:
      return {
        ...state,
        errorDeleteInbox: action.payload,
        successDeleteInbox: false,
        loadingDeleteInbox: false,
      };

    case DELETE_INBOX_CLEAN:
      return {
        ...state,
        errorDeleteInbox: {},
        successDeleteInbox: false,
        loadingDeleteInbox: false,
      };
    case ADD_ATTRIBUTES_CONVERSATION_ITEM:
      return {
        ...state,
        errorConversationAttributes: {},
        successConversationAttributes: false,
        loadingConversationAttributes: true,
      };
    case ADD_ATTRIBUTES_CONVERSATION_SUCCESS:
      return {
        ...state,
        errorConversationAttributes: {},
        successConversationAttributes: true,
        loadingConversationAttributes: false,
        lastSeenData: {
          ...state.lastSeenData,
          custom_attributes: {
            ...action.payload.custom_attributes,
          },
        },
      };
    case ADD_ATTRIBUTES_CONVERSATION_ERROR:
      return {
        ...state,
        errorConversationAttributes: action.payload,
        successConversationAttributes: false,
        loadingConversationAttributes: false,
      };
    case ADD_ATTRIBUTES_CONVERSATION_CLEAN:
      return {
        ...state,
        errorConversationAttributes: {},
        successConversationAttributes: false,
        loadingConversationAttributes: false,
      };

    case GET_CUSTOM_ATTRIBUTES:
      return {
        ...state,
        loadingCustomAttributes: true,
      };

    case GET_CUSTOM_ATTRIBUTES_SUCCESS:
      return {
        ...state,
        loadingCustomAttributes: false,
        converstaionFiltersOptions: action.payload,
      };

    case GET_CUSTOM_ATTRIBUTES_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CONVERSATION_FILTERS:
      return {
        ...state,
        conversationFilters: {
          ...action.payload,
          filters: action.payload.filters,
        },
      };

    case GET_CUSTOM_FILTERS:
      return {
        ...state,
        customFiltersLoading: true,
        customFiltersSuccess: false,
        customFiltersError: {},
      };
    case GET_CUSTOM_FILTERS_SUCCESS:
      return {
        ...state,
        customFiltersLoading: false,
        customFiltersSuccess: true,
        conversationFilters: { ...action.payload.filter },
        folders: [...action.payload.folders],
      };

    case MESSAGE_CLEAN:
      return {
        ...state,
        selectedConversationId: null,
        messages: {},
      };

    case GET_CUSTOM_FILTERS_ERROR:
      return {
        ...state,
        customFiltersLoading: false,
        customFiltersSuccess: false,
        customFiltersError: { ...action.payload },
      };

    case DELETE_CUSTOM_FILTERS:
      return {
        ...state,
        deleteCustomFiltersSuccess: false,
        deleteCustomFiltersError: {},
      };
    case DELETE_CUSTOM_FILTERS_SUCCESS:
      return {
        ...state,
        deleteCustomFiltersSuccess: true,
        conversationFilters: { ...action.payload.filters },
        folders: [...action.payload.folders],
      };

    case DELETE_CUSTOM_FILTERS_ERROR:
      return {
        ...state,
        deleteCustomFiltersSuccess: false,
        deleteCustomFiltersError: {},
      };

    case ADVANCED_CONVERSATION_FILTERS:
      return {
        ...state,
        successAppliedFilters: false,
        errorAppliedFilters: {},
      };

    case ADVANCED_CONVERSATION_FILTERS_SUCCESS:
      return {
        ...state,
        successAppliedFilters: true,
        errorAppliedFilters: {},
        conversations: action.payload,
      };

    case ADVANCED_CONVERSATION_FILTERS_ERROR:
      return {
        ...state,
        errorAppliedFilters: action.payload,
      };

    case ADVANCED_CONVERSATION_FILTERS_CLEAN_UP:
      return {
        ...state,
        error: {},
        errorAppliedFilters: {},
        successAppliedFilters: false,
        customFiltersLoading: false,
        customFiltersSuccess: false,
        deleteCustomFiltersSuccess: false,
        deleteCustomFiltersError: {},
        savedCustomFilters: false,
        errorCustomFilter: {},
      };

    case SAVE_ADVANCED_CONVERSATION_FILTERS:
      return {
        ...state,
        savedCustomFilters: false,
        errorCustomFilter: {},
      };

    case SAVE_ADVANCED_CONVERSATION_FILTERS_SUCCESS:
      return {
        ...state,
        savedCustomFilters: true,
        errorCustomFilter: {},
        conversationFilters: { ...action.payload.filter },
        folders: [...state?.folders, ...action.payload?.folders],
      };

    case SAVE_ADVANCED_CONVERSATION_FILTERS_ERROR:
      return {
        ...state,
        errorAppliedFilters: action.payload,
      };

    case ADD_CONVERSATION_SURVEY_RESPONSE: {
      const feedback =
        action.payload?.newParams?.message?.submitted_values
          ?.csat_survey_response?.feedback_message;
      return {
        ...state,
        addSurveyResponse: true,
        updateFeedbackLoading: feedback ? true : false,
        showOptionalFeedback: true,
      };
    }

    case ADD_CONVERSATION_SURVEY_RESPONSE_SUCCESS: {
      const message = action.payload?.csat_survey_response?.feedback_message;
      return {
        ...state,
        surveyResponse: action.payload,
        updateFeedbackLoading: false,
        showOptionalFeedback: !message ? true : false,
      };
    }

    case GET_CONVERSATION_SURVEY_RESPONSE:
      return {
        ...state,
        getSurveyResponse: true,
        getSurveyLoading: true,
      };

    case GET_CONVERSATION_SURVEY_RESPONSE_SUCCESS: {
      const message = action.payload?.csat_survey_response?.feedback_message;
      return {
        ...state,
        existingSurveyResponse: action.payload,
        showOptionalFeedback: !message ? true : false,
        getSurveyLoading: false,
      };
    }

    case ADD_MESSAGE_SUCCESS:
      return {
        ...state,
        conversations: {
          ...state.conversations,
          payload: action.payload.conversationPayload,
        },
        messages: { ...action.payload.messages },
      };

    case FETCH_CONVERSATION_STATS:
      return {
        ...state,
        fetchConversationStat: action.payload,
      };

    case FETCH_CONVERSATION_STATS_META:
      return {
        ...state,
        loading: false,
        loadMeta: false,
      };
    case FETCH_CONVERSATION_STATS_META_SUCCESS:
      return {
        ...state,
        loading: true,
        loadMeta: true,
        conversations: {
          ...state.conversations,
          meta: {
            ...action.payload.meta,
          },
        },
      };

    case CONVERSATION_CONTACT_DETAILS_UPDATE:
      // eslint-disable-next-line no-case-declarations
      let updateConversations = null;
      // eslint-disable-next-line no-case-declarations
      let updatedMessages = {};
      if (state.conversations) {
        updateConversations = {
          ...state.conversations,
          payload: state?.conversations?.payload?.map((conversation) => {
            return conversation.meta.sender.id === action.payload.id
              ? {
                  ...conversation,
                  meta: { ...conversation.meta, sender: action.payload },
                }
              : conversation;
          }),
        };
      }

      if (state.messages?.meta) {
        updatedMessages = {
          ...state.messages,
          meta: {
            ...state.messages.meta,
            ...(state.messages?.meta?.contact?.id === action.payload.id
              ? { contact: action.payload }
              : { contact: state.messages?.meta?.contact }),
          },
        };
      }
      return {
        ...state,
        loading: true,
        loadMeta: true,
        conversations: updateConversations,
        messages: updatedMessages,
      };

    case UPDATE_CONVERSATION:
      // eslint-disable-next-line no-case-declarations
      let updatedConv = state.conversations?.payload || [];
      // eslint-disable-next-line no-case-declarations
      const currentConversationIndex = updatedConv.findIndex(
        (c) => c.id === action.payload.id
      );
      if (currentConversationIndex > -1) {
        const { messages, ...conversationAttributes } = action.payload;
        const currentConversation = {
          ...updatedConv[currentConversationIndex],
          ...conversationAttributes,
        };
        updatedConv[currentConversationIndex] = currentConversation;
      } else {
        updatedConv.push(action.payload);
      }

      return {
        ...state,
        conversations: {
          ...state.conversations,
          payload: updatedConv,
        },
      };

    case DELETE_FROM_CONVERSATION:
      // eslint-disable-next-line no-case-declarations
      let conversaionList = state.conversations?.payload || [];

      // eslint-disable-next-line no-case-declarations
      const deleteConv = conversaionList.filter(
        (c) => c.meta.sender.id !== action.payload
      );

      // eslint-disable-next-line no-case-declarations
      const messagesConversationId =
        state.messages?.payload?.[0]?.conversation_id;
      // eslint-disable-next-line no-case-declarations
      const selectedConversation = conversaionList.find(
        (c) => c.meta.sender.id === action.payload
      );

      return {
        ...state,
        conversations: {
          ...state.conversations,
          payload: deleteConv,
        },
        messages:
          selectedConversation?.id === messagesConversationId
            ? {}
            : { ...state.messages },
      };

    case NEW_CONVERSATIONS_LIST:
      // eslint-disable-next-line no-case-declarations
      let newConv = state.conversations?.payload;
      // eslint-disable-next-line no-case-declarations
      const conIndex = newConv?.findIndex(
        (con) => con.id === action.payload?.id
      );
      if (conIndex === -1) {
        newConv.unshift(action.payload);
      }
      return {
        ...state,
        conversations: {
          ...state.conversations,
          payload: newConv,
        },
      };

    case ADD_USER_TYPING_TO_CONVERSATION:
      // eslint-disable-next-line no-case-declarations
      const userPayload = action.payload.user;
      // eslint-disable-next-line no-case-declarations
      const records =
        state.typingUsersRecords[action.payload.conversationId] || [];
      // eslint-disable-next-line no-case-declarations
      const hasUserRecordAlready = !!records?.filter(
        (record) =>
          record.id === userPayload.id && record.type === userPayload.type
      ).length;
      return {
        ...state,
        typingUsersRecords: !hasUserRecordAlready
          ? {
              ...state.typingUsersRecords,
              [action.payload.conversationId]: [userPayload],
            }
          : { ...state.typingUsersRecords },
      };

    case REMOVE_USER_TYPING_FROM_CONVERSATION:
      // eslint-disable-next-line no-case-declarations
      const recordTOff =
        state.typingUsersRecords[action.payload.conversationId] || [];
      // eslint-disable-next-line no-case-declarations
      const updatedRecords = recordTOff.filter((record) => {
        return (
          record.id !== action.payload.user?.id ||
          record.type !== action.payload.user.type
        );
      });
      return {
        ...state,
        typingUsersRecords: {
          ...state.typingUsersRecords,
          [action.payload.conversationId]: updatedRecords,
        },
      };

    case UPDATE_CONVERSATION_CONTACT:
      // eslint-disable-next-line no-case-declarations
      const { conversationId, sender } = action.payload;

      // eslint-disable-next-line no-case-declarations
      let updatedConversation = state.conversations?.payload || [];

      return {
        ...state,
        conversations: {
          ...state.conversations,
          payload: updatedConversation.map((items) =>
            items.id === conversationId
              ? {
                  ...items,
                  meta: {
                    ...items.meta,
                    sender: sender,
                  },
                }
              : items
          ),
        },
      };

    default:
      return { ...state };
  }
};
