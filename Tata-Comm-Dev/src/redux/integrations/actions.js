import {
  INTEGRATIONS_GET,
  INTEGRATIONS_GET_SUCCESS,
  INTEGRATIONS_DELETE,
  INTEGRATIONS_DELETE_SUCCESS,
  INTEGRATIONS_DELETE_ERROR,
  INTEGRATIONS_DELETE_CLEAN,
  INTEGRATIONS_ADD,
  INTEGRATIONS_ADD_SUCCESS,
  INTEGRATIONS_ADD_ERROR,
  INTEGRATIONS_ADD_CLEAN,
} from 'redux/constants';

export const getIntegrations = (userId) => ({
  type: INTEGRATIONS_GET,
  payload: userId,
});
export const getIntegrationsSuccess = (items) => ({
  type: INTEGRATIONS_GET_SUCCESS,
  payload: items,
});

export const deleteIntegration = (item) => ({
  type: INTEGRATIONS_DELETE,
  payload: item,
});

export const deleteIntegrationSuccess = (items) => ({
  type: INTEGRATIONS_DELETE_SUCCESS,
  payload: items,
});

export const deleteIntegrationError = (error) => ({
  type: INTEGRATIONS_DELETE_ERROR,
  payload: error,
});

export const deleteIntegrationClean = (item) => ({
  type: INTEGRATIONS_DELETE_CLEAN,
  payload: item,
});

export const addIntegration = (item) => ({
  type: INTEGRATIONS_ADD,
  payload: item,
});

export const addIntegrationSuccess = (items) => ({
  type: INTEGRATIONS_ADD_SUCCESS,
  payload: items,
});

export const addIntegrationError = (error) => ({
  type: INTEGRATIONS_ADD_ERROR,
  payload: error,
});

export const addIntegrationClean = (item) => ({
  type: INTEGRATIONS_ADD_CLEAN,
  payload: item,
});
