import {
  APPLICATIONS_GET,
  APPLICATIONS_GET_SUCCESS,
  APPLICATIONS_DELETE,
  APPLICATIONS_DELETE_SUCCESS,
  APPLICATIONS_DELETE_ERROR,
  APPLICATIONS_DELETE_CLEAN,
  APPLICATIONS_ADD,
  APPLICATIONS_ADD_SUCCESS,
  APPLICATIONS_ADD_ERROR,
  APPLICATIONS_ADD_CLEAN,
  APPLICATIONS_GET_INTEGRATIONS,
  APPLICATIONS_GET_INTEGRATION,
} from 'redux/constants';

export const getApplications = (userId) => ({
  type: APPLICATIONS_GET,
  payload: userId,
});
export const getApplicationsSuccess = (items) => ({
  type: APPLICATIONS_GET_SUCCESS,
  payload: items,
});

export const deleteApplication = (item) => ({
  type: APPLICATIONS_DELETE,
  payload: item,
});

export const deleteApplicationSuccess = (items) => ({
  type: APPLICATIONS_DELETE_SUCCESS,
  payload: items,
});

export const deleteApplicationError = (error) => ({
  type: APPLICATIONS_DELETE_ERROR,
  payload: error,
});

export const deleteApplicationClean = (item) => ({
  type: APPLICATIONS_DELETE_CLEAN,
  payload: item,
});

export const addApplication = (item) => ({
  type: APPLICATIONS_ADD,
  payload: item,
});

export const addApplicationSuccess = (items) => ({
  type: APPLICATIONS_ADD_SUCCESS,
  payload: items,
});

export const addApplicationError = (error) => ({
  type: APPLICATIONS_ADD_ERROR,
  payload: error,
});

export const addApplicationClean = (item) => ({
  type: APPLICATIONS_ADD_CLEAN,
  payload: item,
});

export const getAppIntegrations = (item) => ({
  type: APPLICATIONS_GET_INTEGRATIONS,
  payload: item,
});

export const getIntegration = (item) => ({
  type: APPLICATIONS_GET_INTEGRATION,
  payload: item,
});
