import {
  CHANNEL_GET,
  CHANNEL_GET_SUCCESS,
  CHANNEL_ADD,
  CHANNEL_ADD_SUCCESS,
  CHANNEL_ADD_ERROR,
  CHANNEL_ADD_CLEAN,
  CHANNEL_UPDATE,
  CHANNEL_UPDATE_SUCCESS,
  CHANNEL_UPDATE_ERROR,
  CHANNEL_UPDATE_CLEAN,
  CHANNEL_AVATAR_DELETE,
  CHANNEL_AVATAR_DELETE_SUCCESS,
  CHANNEL_GET_AGENTS,
  CHANNEL_GET_AGENTS_SUCCESS,
  CHANNEL_ADD_AGENT,
  CHANNEL_ADD_AGENT_SUCCESS,
  CHANNEL_ADD_AGENT_ERROR,
  CHANNEL_ADD_AGENT_CLEAN,
  ADD_INBOX,
  ADD_INBOX_SUCCESS,
  ADD_INBOX_ERROR,
  ADD_INBOX_CLEAN,
  INBOX_UPDATE,
  INBOX_UPDATE_SUCCESS,
  INBOX_UPDATE_ERROR,
  INBOX_UPDATE_CLEAN,
  CONNECTOR_GET,
  CONNECTOR_GET_SUCCESS,
} from 'redux/constants';

const INIT_STATE = {
  successAdd: false,
  errorAdd: {},
  loadingAdd: false,
  successAddAgents: false,
  errorAddAgents: {},
  loadingAddAgents: false,
  loadedChannel: false,
  editFormData: {},
  channelAgents: [],
  loadedChannelAgents: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANNEL_GET:
      return { ...state, loadedChannel: true, loadedChannelAgents: false };

    case CHANNEL_GET_SUCCESS:
      return { ...state, editFormData: action.payload };

    case CHANNEL_ADD:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: true };

    case CHANNEL_ADD_SUCCESS:
      return {
        ...state,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
        addData: action.payload,
      };

    case CHANNEL_ADD_ERROR:
      return {
        ...state,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case CHANNEL_ADD_CLEAN:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: false };

    case CHANNEL_UPDATE:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: true,
      };

    case CHANNEL_UPDATE_SUCCESS:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: true,
        loadingUpdate: false,
        editFormData: action.payload,
      };

    case CHANNEL_UPDATE_ERROR:
      return {
        ...state,
        errorUpdate: action.payload,
        successUpdate: false,
        loadingUpdate: false,
      };

    case ADD_INBOX:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: true };

    case ADD_INBOX_SUCCESS:
      return {
        ...state,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
        addData: action.payload,
      };

    case ADD_INBOX_ERROR:
      return {
        ...state,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case ADD_INBOX_CLEAN:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: false };

    case INBOX_UPDATE:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: true,
      };

    case INBOX_UPDATE_SUCCESS:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: true,
        loadingUpdate: false,
        editFormData: action.payload,
      };

    case INBOX_UPDATE_ERROR:
      return {
        ...state,
        errorUpdate: action.payload,
        successUpdate: false,
        loadingUpdate: false,
      };

    case INBOX_UPDATE_CLEAN:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: false,
      };

    case CHANNEL_AVATAR_DELETE:
      return state;

    case CHANNEL_AVATAR_DELETE_SUCCESS:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: true,
        loadingUpdate: false,
        editFormData: action.payload,
      };

    case CHANNEL_UPDATE_CLEAN:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: false,
      };

    case CHANNEL_GET_AGENTS:
      return { ...state, loadedChannelAgents: true };

    case CHANNEL_GET_AGENTS_SUCCESS:
      return { ...state, channelAgents: action.payload.payload };

    case CHANNEL_ADD_AGENT:
      return {
        ...state,
        errorAddAgents: {},
        successAddAgents: false,
        loadingAddAgents: true,
      };

    case CHANNEL_ADD_AGENT_SUCCESS:
      return {
        ...state,
        errorAddAgents: {},
        successAddAgents: true,
        loadingAddAgents: false,
      };

    case CHANNEL_ADD_AGENT_ERROR:
      return {
        ...state,
        errorAddAgents: action.payload,
        successAddAgents: false,
        loadingAddAgents: false,
      };

    case CHANNEL_ADD_AGENT_CLEAN:
      return {
        ...state,
        errorAddAgents: {},
        successAddAgents: false,
        loadingAddAgents: false,
      };

    case CONNECTOR_GET:
      return { ...state, loadedChannel: true, loadedChannelAgents: false };

    case CONNECTOR_GET_SUCCESS:
      return { ...state, connectorList: action.payload };

    default:
      return { ...state };
  }
};
