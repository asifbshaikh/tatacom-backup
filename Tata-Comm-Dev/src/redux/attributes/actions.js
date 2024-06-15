import {
  ATTRIBUTES_GET,
  ATTRIBUTES_GET_SUCCESS,
  ATTRIBUTES_DELETE,
  ATTRIBUTES_DELETE_SUCCESS,
  ATTRIBUTES_DELETE_ERROR,
  ATTRIBUTES_DELETE_CLEAN,
  ATTRIBUTES_ADD,
  ATTRIBUTES_ADD_SUCCESS,
  ATTRIBUTES_ADD_ERROR,
  ATTRIBUTES_ADD_CLEAN,
} from 'redux/constants';

export const getAttributes = (userId) => ({
  type: ATTRIBUTES_GET,
  payload: userId,
});
export const getAttributesSuccess = (items) => ({
  type: ATTRIBUTES_GET_SUCCESS,
  payload: items,
});

export const deleteAttribute = (item) => ({
  type: ATTRIBUTES_DELETE,
  payload: item,
});

export const deleteAttributeSuccess = (items) => ({
  type: ATTRIBUTES_DELETE_SUCCESS,
  payload: items,
});

export const deleteAttributeError = (error) => ({
  type: ATTRIBUTES_DELETE_ERROR,
  payload: error,
});

export const deleteAttributeClean = (item) => ({
  type: ATTRIBUTES_DELETE_CLEAN,
  payload: item,
});

export const addAttribute = (item) => ({
  type: ATTRIBUTES_ADD,
  payload: item,
});

export const addAttributeSuccess = (items) => ({
  type: ATTRIBUTES_ADD_SUCCESS,
  payload: items,
});

export const addAttributeError = (error) => ({
  type: ATTRIBUTES_ADD_ERROR,
  payload: error,
});

export const addAttributeClean = (item) => ({
  type: ATTRIBUTES_ADD_CLEAN,
  payload: item,
});
