import {
  GET_PAST_IMPORTUSERS_FILE_LIST,
  GET_PAST_IMPORTUSERS_FILE_LIST_SUCCESS,
  GET_COLUMN_ATTRIBUTE_LIST,
  GET_COLUMN_ATTRIBUTE_LIST_SUCCESS,
  UPLOAD_IMPORTUSERS_CSV_FILE,
  UPLOAD_IMPORTUSERS_CSV_FILE_CLEAN,
  UPLOAD_IMPORTUSERS_CSV_FILE_ERROR,
  UPLOAD_IMPORTUSERS_CSV_FILE_SUCCESS,
  GET_IMPORTUSERS_UPLOAD_DATA,
  SET_SELECT_USER,
  SET_SELECTED_CHECKBOX,
  IMPORTUSER_DATA_CLEAN,
} from 'redux/constants';

export const getImportUserFileList = (item) => ({
  type: GET_PAST_IMPORTUSERS_FILE_LIST,
  payload: item,
});

export const getImportUserFileListSuccess = (items) => ({
  type: GET_PAST_IMPORTUSERS_FILE_LIST_SUCCESS,
  payload: items,
});

export const getColumnAttributeList = (item) => ({
  type: GET_COLUMN_ATTRIBUTE_LIST,
  payload: item,
});

export const getColumnAttributeListSuccess = (items) => ({
  type: GET_COLUMN_ATTRIBUTE_LIST_SUCCESS,
  payload: items,
});

export const uploadImportUserCSVFile = (item) => ({
  type: UPLOAD_IMPORTUSERS_CSV_FILE,
  payload: item,
});

export const uploadImportUserCSVFileSuccess = (items) => ({
  type: UPLOAD_IMPORTUSERS_CSV_FILE_SUCCESS,
  payload: items,
});

export const uploadImportUserCSVFileError = (error) => ({
  type: UPLOAD_IMPORTUSERS_CSV_FILE_ERROR,
  payload: error,
});

export const uploadImportUserCSVFileClean = (item) => ({
  type: UPLOAD_IMPORTUSERS_CSV_FILE_CLEAN,
  payload: item,
});

export const getImportUsersUploadData = (item) => ({
  type: GET_IMPORTUSERS_UPLOAD_DATA,
  payload: item,
});

export const setSelectUser = (selectUser) => ({
  type: SET_SELECT_USER,
  payload: selectUser,
});

export const setSelectedCheckbox = (selectedCheckbox) => ({
  type: SET_SELECTED_CHECKBOX,
  payload: selectedCheckbox,
});

export const importUserDataClean = (item) => ({
  type: IMPORTUSER_DATA_CLEAN,
  payload: item,
});
