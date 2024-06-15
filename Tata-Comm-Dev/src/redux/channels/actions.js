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

export const getChannel = (userId) => ({
  type: CHANNEL_GET,
  payload: userId,
});
export const getChannelSuccess = (items) => ({
  type: CHANNEL_GET_SUCCESS,
  payload: items,
});

export const addChannel = (userId) => ({
  type: CHANNEL_ADD,
  payload: userId,
});
export const addChannelSuccess = (items) => ({
  type: CHANNEL_ADD_SUCCESS,
  payload: items,
});
export const addChannelError = (error) => ({
  type: CHANNEL_ADD_ERROR,
  payload: error,
});
export const addChannelClean = (error) => ({
  type: CHANNEL_ADD_CLEAN,
  payload: error,
});

export const addInbox = (userId) => ({
  type: ADD_INBOX,
  payload: userId,
});
export const addInboxSuccess = (items) => ({
  type: ADD_INBOX_SUCCESS,
  payload: items,
});
export const addInboxError = (error) => ({
  type: ADD_INBOX_ERROR,
  payload: error,
});
export const addInboxClean = (error) => ({
  type: ADD_INBOX_CLEAN,
  payload: error,
});

export const updateChannel = (userId) => ({
  type: CHANNEL_UPDATE,
  payload: userId,
});
export const updateChannelSuccess = (items) => ({
  type: CHANNEL_UPDATE_SUCCESS,
  payload: items,
});
export const updateChannelError = (error) => ({
  type: CHANNEL_UPDATE_ERROR,
  payload: error,
});
export const updateChannelClean = (error) => ({
  type: CHANNEL_UPDATE_CLEAN,
  payload: error,
});

export const updateInbox = (userId) => ({
  type: INBOX_UPDATE,
  payload: userId,
});
export const updateInboxSuccess = (items) => ({
  type: INBOX_UPDATE_SUCCESS,
  payload: items,
});
export const updateInboxError = (error) => ({
  type: INBOX_UPDATE_ERROR,
  payload: error,
});
export const updateInboxClean = (error) => ({
  type: INBOX_UPDATE_CLEAN,
  payload: error,
});

export const deleteChannelAvatar = (userId) => ({
  type: CHANNEL_AVATAR_DELETE,
  payload: userId,
});
export const deleteChannelAvatarSuccess = (items) => ({
  type: CHANNEL_AVATAR_DELETE_SUCCESS,
  payload: items,
});

export const getChannelAgents = (userId) => ({
  type: CHANNEL_GET_AGENTS,
  payload: userId,
});
export const getChannelAgentsSuccess = (items) => ({
  type: CHANNEL_GET_AGENTS_SUCCESS,
  payload: items,
});

export const addAgentsChannel = (userId) => ({
  type: CHANNEL_ADD_AGENT,
  payload: userId,
});
export const addAgentsChannelSuccess = (items) => ({
  type: CHANNEL_ADD_AGENT_SUCCESS,
  payload: items,
});
export const addAgentsChannelError = (error) => ({
  type: CHANNEL_ADD_AGENT_ERROR,
  payload: error,
});
export const addAgentsChannelClean = (error) => ({
  type: CHANNEL_ADD_AGENT_CLEAN,
  payload: error,
});

export const getConnector = (userId) => ({
  type: CONNECTOR_GET,
  payload: userId,
});
export const getConnectorSuccess = (items) => ({
  type: CONNECTOR_GET_SUCCESS,
  payload: items,
});
