import reducer from 'redux/import-users/reducer';
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
import { describe, expect, it } from '@jest/globals';
import DashboardEnums from 'enums/dashboard/dashboardEnums';

describe('DB Import Reducer', () => {
  const INIT_STATE = {
    loaded: false,
    error: {},
    success: false,
    loading: false,
    loadedImportUserList: false,
    importusersList: { totalCount: 0, importList: [] },
    loadedColAttributes: false,
    colAttributesList: [],
    skippedColumns: [],
    segmentName: '',
    showSegmentName: false,
    firstRowHeaders: true,
    updateExistingUsers: false,
    selectUser: '',
    colAttributeWithType: {},
    newCustomAttributes: [],
    selectedCheckbox: '',
    columnAttributeOptions: [],
    csvFile: {},
    checkColumnAttributes: [],
    selectedColumnType: [],
    customAttributeName: [],
  };

  const createAction = (type, payload) => ({ type, payload });

  it.each([
    [GET_PAST_IMPORTUSERS_FILE_LIST, { loadedImportUserList: true }],
    [
      GET_PAST_IMPORTUSERS_FILE_LIST_SUCCESS,
      {
        importusersList: {
          importList: undefined,
          totalCount: undefined,
        },
      },
    ],
    [GET_COLUMN_ATTRIBUTE_LIST, { loadedColAttributes: true }],
    [GET_COLUMN_ATTRIBUTE_LIST_SUCCESS, { colAttributesList: {} }],
    [
      UPLOAD_IMPORTUSERS_CSV_FILE,
      {
        loaded: false,
        errorUpload: {},
        successUpload: false,
        loadingUpload: true,
      },
    ],
    [
      UPLOAD_IMPORTUSERS_CSV_FILE_SUCCESS,
      {
        loaded: true,
        errorUpload: {},
        successUpload: true,
        loadingUpload: false,
      },
    ],
    [
      UPLOAD_IMPORTUSERS_CSV_FILE_ERROR,
      {
        loaded: true,
        errorUpload: {},
        successUpload: false,
        loadingUpload: false,
      },
    ],
    [
      UPLOAD_IMPORTUSERS_CSV_FILE_CLEAN,
      {
        loaded: true,
        errorUpload: {},
        successUpload: false,
        loadingUpload: false,
      },
    ],
    [SET_SELECTED_CHECKBOX, { selectedCheckbox: {} }],
    [SET_SELECT_USER, { selectUser: {} }],
    [GET_IMPORTUSERS_UPLOAD_DATA, {}],
    [
      IMPORTUSER_DATA_CLEAN,
      {
        segmentName: '',
        firstRowHeaders: true,
        updateExistingUsers: false,
        selectUser: '',
        colAttributeWithType: {},
        newCustomAttributes: [],
        selectedCheckbox: '',
        columnAttributeOptions: [],
        checkColumnAttributes: [],
        selectedColumnType: [],
        customAttributeName: [],
      },
    ],
    ['', {}],
  ])('should handle %p', (actionType, expectedState) => {
    const action = createAction(actionType, {});
    expect(reducer(INIT_STATE, action)).toEqual({
      ...INIT_STATE,
      ...expectedState,
    });
  });
});
