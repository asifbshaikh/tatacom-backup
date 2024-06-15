import {
  CANNEDS_GET,
  CANNEDS_GET_SUCCESS,
  CANNEDS_DELETE,
  CANNEDS_DELETE_SUCCESS,
  CANNEDS_DELETE_ERROR,
  CANNEDS_DELETE_CLEAN,
  CANNEDS_ADD,
  CANNEDS_ADD_SUCCESS,
  CANNEDS_ADD_ERROR,
  CANNEDS_ADD_CLEAN,
} from 'redux/constants';

export const getCanneds = (userId) => ({
  type: CANNEDS_GET,
  payload: userId,
});
export const getCannedsSuccess = (items) => ({
  type: CANNEDS_GET_SUCCESS,
  payload: items,
});

export const deleteCanned = (item) => ({
  type: CANNEDS_DELETE,
  payload: item,
});

export const deleteCannedSuccess = (items) => ({
  type: CANNEDS_DELETE_SUCCESS,
  payload: items,
});

export const deleteCannedError = (error) => ({
  type: CANNEDS_DELETE_ERROR,
  payload: error,
});

export const deleteCannedClean = (item) => ({
  type: CANNEDS_DELETE_CLEAN,
  payload: item,
});

export const addCanned = (item) => ({
  type: CANNEDS_ADD,
  payload: item,
});

export const addCannedSuccess = (items) => ({
  type: CANNEDS_ADD_SUCCESS,
  payload: items,
});

export const addCannedError = (error) => ({
  type: CANNEDS_ADD_ERROR,
  payload: error,
});

export const addCannedClean = (item) => ({
  type: CANNEDS_ADD_CLEAN,
  payload: item,
});
