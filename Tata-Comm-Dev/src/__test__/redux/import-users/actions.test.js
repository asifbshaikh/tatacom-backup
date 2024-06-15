import * as actions from 'redux/import-users/actions';
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
import { describe, it, expect } from '@jest/globals';

describe('Channels Actions', () => {
  const item = {};
  it.each([
    [actions.getImportUserFileList, GET_PAST_IMPORTUSERS_FILE_LIST],
    [
      actions.getImportUserFileListSuccess,
      GET_PAST_IMPORTUSERS_FILE_LIST_SUCCESS,
    ],
    [actions.getColumnAttributeList, GET_COLUMN_ATTRIBUTE_LIST],
    [actions.getColumnAttributeListSuccess, GET_COLUMN_ATTRIBUTE_LIST_SUCCESS],
    [actions.uploadImportUserCSVFile, UPLOAD_IMPORTUSERS_CSV_FILE],
    [
      actions.uploadImportUserCSVFileSuccess,
      UPLOAD_IMPORTUSERS_CSV_FILE_SUCCESS,
    ],
    [actions.uploadImportUserCSVFileError, UPLOAD_IMPORTUSERS_CSV_FILE_ERROR],
    [actions.uploadImportUserCSVFileClean, UPLOAD_IMPORTUSERS_CSV_FILE_CLEAN],
    [actions.getImportUsersUploadData, GET_IMPORTUSERS_UPLOAD_DATA],
    [actions.setSelectUser, SET_SELECT_USER],
    [actions.setSelectedCheckbox, SET_SELECTED_CHECKBOX],
    [actions.importUserDataClean, IMPORTUSER_DATA_CLEAN],
  ])('should create %p action', (actionCreator, expectedType) => {
    expect(actionCreator(item)).toEqual({
      type: expectedType,
      payload: item,
    });
  });
});
