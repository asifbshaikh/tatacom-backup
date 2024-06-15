import {
  CREATE_CONTROL_GROUPS,
  CREATE_CONTROL_GROUPS_SUCCESS,
  CREATE_CONTROL_GROUPS_FAILURE,
  CREATE_CONTROL_GROUPS_SUCCESS_RESET,
  DELETE_CONTROL_GROUPS,
  DOWNLOAD_CONTROL_GROUPS,
  DELETE_CONTROL_GROUPS_SUCCESS_RESET,
  GET_CONTROL_GROUPS,
  GET_CONTROL_GROUPS_SUCCESS,
  DOWNLOAD_CONTROL_GROUPS_SUCCESS,
  DOWNLOAD_CONTROL_GROUPS_RESET,
  DELETE_CONTROL_GROUPS_SUCCESS,
} from 'redux/constants';

export const getControlGroups = (item) => ({
  type: GET_CONTROL_GROUPS,
  payload: item,
});

export const getControlGroupsSuccess = (items) => ({
  type: GET_CONTROL_GROUPS_SUCCESS,
  payload: items,
});

export const createControlGroups = (items) => ({
  type: CREATE_CONTROL_GROUPS,
  payload: items,
});

export const createControlGroupsSuccess = (items) => ({
  type: CREATE_CONTROL_GROUPS_SUCCESS,
  payload: items,
});

export const createControlFailure = (item) => ({
  type: CREATE_CONTROL_GROUPS_FAILURE,
  payload: item,
});

export const createControlGroupsSuccessReset = () => ({
  type: CREATE_CONTROL_GROUPS_SUCCESS_RESET,
});

export const deleteCreateControlGroups = (item) => ({
  type: DELETE_CONTROL_GROUPS,
  payload: item,
});

export const deleteCreateControlGroupsSuccess = () => ({
  type: DELETE_CONTROL_GROUPS_SUCCESS,
});

export const deleteCreateControlGroupsSuccessReset = (item) => ({
  type: DELETE_CONTROL_GROUPS_SUCCESS_RESET,
  payload: item,
});

export const downloadCreateControlGroups = (item) => ({
  type: DOWNLOAD_CONTROL_GROUPS,
  payload: item,
});

export const downloadCreateControlGroupsSuccess = () => ({
  type: DOWNLOAD_CONTROL_GROUPS_SUCCESS,
});

export const downloadCreateControlGroupsReset = (item) => ({
  type: DOWNLOAD_CONTROL_GROUPS_RESET,
  payload: item,
});
