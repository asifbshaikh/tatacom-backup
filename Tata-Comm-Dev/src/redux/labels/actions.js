import {
  LABELS_GET,
  LABELS_GET_SUCCESS,
  LABELS_DELETE,
  LABELS_DELETE_SUCCESS,
  LABELS_DELETE_ERROR,
  LABELS_DELETE_CLEAN,
  LABELS_ADD,
  LABELS_ADD_SUCCESS,
  LABELS_ADD_ERROR,
  LABELS_ADD_CLEAN,
} from 'redux/constants';

export const getLabels = (userId) => ({
  type: LABELS_GET,
  payload: userId,
});
export const getLabelsSuccess = (items) => ({
  type: LABELS_GET_SUCCESS,
  payload: items,
});

export const deleteLabel = (item) => ({
  type: LABELS_DELETE,
  payload: item,
});

export const deleteLabelSuccess = (items) => ({
  type: LABELS_DELETE_SUCCESS,
  payload: items,
});

export const deleteLabelError = (error) => ({
  type: LABELS_DELETE_ERROR,
  payload: error,
});

export const deleteLabelClean = (item) => ({
  type: LABELS_DELETE_CLEAN,
  payload: item,
});

export const addLabel = (item) => ({
  type: LABELS_ADD,
  payload: item,
});

export const addLabelSuccess = (items) => ({
  type: LABELS_ADD_SUCCESS,
  payload: items,
});

export const addLabelError = (error) => ({
  type: LABELS_ADD_ERROR,
  payload: error,
});

export const addLabelClean = (item) => ({
  type: LABELS_ADD_CLEAN,
  payload: item,
});
