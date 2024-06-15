import {
  AGENTS_GET,
  AGENTS_GET_SUCCESS,
  AGENTS_DELETE,
  AGENTS_DELETE_SUCCESS,
  AGENTS_DELETE_ERROR,
  AGENTS_DELETE_CLEAN,
  AGENTS_ADD,
  AGENTS_ADD_SUCCESS,
  AGENTS_ADD_ERROR,
  AGENTS_ADD_CLEAN,
  ASSIGN_AGENT,
  ASSIGN_AGENT_SUCCESS,
  ASSIGN_AGENT_ERROR,
  UPDATE_AGENTS_PRESENCE,
} from '../constants';

export const getAgents = (userId) => ({
  type: AGENTS_GET,
  payload: userId,
});
export const getAgentsSuccess = (items) => ({
  type: AGENTS_GET_SUCCESS,
  payload: items,
});

export const deleteAgent = (item) => ({
  type: AGENTS_DELETE,
  payload: item,
});

export const deleteAgentSuccess = (items) => ({
  type: AGENTS_DELETE_SUCCESS,
  payload: items,
});

export const deleteAgentError = (error) => ({
  type: AGENTS_DELETE_ERROR,
  payload: error,
});

export const deleteAgentClean = (item) => ({
  type: AGENTS_DELETE_CLEAN,
  payload: item,
});

export const addAgent = (item) => ({
  type: AGENTS_ADD,
  payload: item,
});

export const addAgentSuccess = (items) => ({
  type: AGENTS_ADD_SUCCESS,
  payload: items,
});

export const addAgentError = (error) => ({
  type: AGENTS_ADD_ERROR,
  payload: error,
});

export const addAgentClean = (item) => ({
  type: AGENTS_ADD_CLEAN,
  payload: item,
});

export const assignAgent = (item) => ({
  type: ASSIGN_AGENT,
  payload: item,
});

export const assignAgentSucess = (items) => ({
  type: ASSIGN_AGENT_SUCCESS,
  payload: items,
});

export const assignAgentError = (error) => ({
  type: ASSIGN_AGENT_ERROR,
  payload: error,
});

export const updateAgentPresence = (item) => ({
  type: UPDATE_AGENTS_PRESENCE,
  payload: item,
});
