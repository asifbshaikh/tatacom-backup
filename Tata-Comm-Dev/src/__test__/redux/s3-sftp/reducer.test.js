import reducer from 'redux/s3-sftp/reducer';
import {
  S3SFTP_IMPORT_SOURCE_TYPE_ADD,
  S3SFTP_IMPORT_SOURCE_TYPE_ADD_SUCCESS,
  DB_CONFIG_SAVE,
  DB_CONFIG_SAVE_SUCCESS,
  DB_CONFIG_SAVE_ERROR,
  DB_MESSAGE_CLEAN,
  DB_CONFIG_TEST,
  DB_CONFIG_TEST_SUCCESS,
  DB_CONFIG_TEST_ERROR,
  DATABASE_CONFIGURE_FORMAT_ADD_SUCCESS,
  DB_CONFIG_SHOW,
  DB_CONFIG_SHOW_SUCCESS,
  DB_CONFIG_SHOW_ERROR,
  DB_CONFIG_CLEAR_SHOW_ERROR,
  DB_CONFIG_CLEAR_TEST_ERROR,
  GET_DB_CONNECTION_LIST_SUCCESS,
  GET_DB_CONNECTION_LIST,
  DB_CONFIG_EDIT,
  DB_CONFIG_EDIT_SUCCESS,
  DB_CONFIG_EDIT_ERROR,
  DB_CONFIG_CLEAR_EDIT_ERROR,
  DB_CONNECTION_DELETE,
  DB_CONNECTION_DELETE_SUCCESS,
  DB_CONNECTION_DELETE_ERROR,
  DB_CONNECTION_DELETE_CLEAN,
  GET_DB_CONNECTION_DROPDOWN_LIST,
  GET_DB_CONNECTION_DROPDOWN_LIST_SUCCESS,
  GET_TABLE_PREVIEW,
  GET_TABLE_PREVIEW_SUCCESS,
  GET_TABLE_PREVIEW_ERROR,
  CLEAR_TABLE_PREVIEW,
  GET_IMPORT_SCHEDULER_LIST,
  GET_IMPORT_SCHEDULER_LIST_SUCCESS,
  GET_IMPORT_SCHEDULER_DETAIL,
  GET_IMPORT_SCHEDULER_DETAIL_SUCCESS,
  GET_IMPORT_SCHEDULER_DETAIL_ERROR,
  CLEAR_GET_IMPORT_SCHEDULER_DETAIL,
  DB_IMPORT_SAVE,
  DB_IMPORT_SAVE_SUCCESS,
  DB_IMPORT_SAVE_ERROR,
  DB_IMPORT_CLEAN_ERROR,
  SHOW_IMPORT_LIST,
  SHOW_IMPORT_LIST_SUCCESS,
  SHOW_IMPORT_LIST_ERROR,
  DB_IMPORT_LIST_CLEAN_ERROR,
  DELETE_IMPORT,
  DELETE_IMPORT_SUCCESS,
  DELETE_IMPORT_ERROR,
  DELETE_IMPORT_CLEAN_ERROR,
  GET_IMPORT_SCHEDULER_BY_ID,
  GET_IMPORT_SCHEDULER_BY_ID_SUCCESS,
  ADD_UPDATE_S3SFTP_DB_IMPORT,
  ADD_UPDATE_S3SFTP_DB_IMPORT_SUCCESS,
  ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR,
  ADD_UPDATE_S3SFTP_DB_IMPORT_CLEAN_UP,
  ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR_CLEAN_UP,
} from 'redux/constants';

import { describe, expect, it } from '@jest/globals';

describe('DB Import Reducer', () => {
  const INIT_STATE = {
    selectSource: {},
    loaded: false,
    errorAdd: {},
    successAdd: false,
    loadingAdd: false,
    errorTestAdd: {},
    successTestAdd: false,
    loadingTestAdd: false,
    dataBaseFormat: {},
    loadedDbConnections: false,
    dbConnectionList: [],
    pagination: {},
    errorEditAdd: {},
    successEditAdd: false,
    loadingEditAdd: false,
    dbConnectionDropdownList: [],
    errorTableAdd: {},
    successTableAdd: false,
    previewData: {},
    importScheduler: [],
    loadedImportScheduler: false,
    successSaveAdd: false,
    loadedImportSchedulerDetail: false,
    importSchedulerDetails: {},
  };

  it('should handle S3SFTP_IMPORT_SOURCE_TYPE_ADD', () => {
    const action = {
      type: S3SFTP_IMPORT_SOURCE_TYPE_ADD,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorAdd: {},
      successAdd: false,
      loadingAdd: true,
    });
  });

  it('should handle S3SFTP_IMPORT_SOURCE_TYPE_ADD_SUCCESS', () => {
    const prevState = {
      ...INIT_STATE,
      loaded: false,
      errorAdd: {},
      successAdd: false,
      loadingAdd: true,
    };

    const action = {
      type: S3SFTP_IMPORT_SOURCE_TYPE_ADD_SUCCESS,
      payload: {},
    };

    const newState = reducer(prevState, action);

    expect(newState).toEqual({
      ...prevState,
      selectSource: {
        ...prevState.selectSource,
        ...action.payload,
      },
      loaded: true,
      errorAdd: {},
      successAdd: true,
      loadingAdd: false,
    });
  });

  it('should handle DB_CONFIG_SAVE', () => {
    const action = {
      type: DB_CONFIG_SAVE,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorAdd: {},
      successAdd: false,
      loadingAdd: true,
    });
  });

  it('should handle DB_CONFIG_SAVE_SUCCESS', () => {
    const prevState = {
      ...INIT_STATE,
      loaded: false,
      errorAdd: {},
      successSaveAdd: false,
      loadingAdd: true,
    };

    const action = {
      type: DB_CONFIG_SAVE_SUCCESS,
      payload: {},
    };

    const newState = reducer(prevState, action);

    expect(newState).toEqual({
      ...prevState,
      loaded: true,
      errorAdd: {},
      successSaveAdd: true,
      loadingAdd: false,
    });
  });

  it('should handle DB_CONFIG_TEST', () => {
    const action = {
      type: DB_CONFIG_TEST,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorAdd: {},
      successTestAdd: false,
      loadingTestAdd: true,
    });
  });

  it('should handle DB_CONFIG_TEST_SUCCESS', () => {
    const prevState = {
      ...INIT_STATE,
      loaded: false,
      errorAdd: {},
      successTestAdd: false,
      loadingTestAdd: true,
    };

    const action = {
      type: DB_CONFIG_TEST_SUCCESS,
      payload: {},
    };

    const newState = reducer(prevState, action);

    expect(newState).toEqual({
      ...prevState,
      loaded: true,
      errorAdd: {},
      successTestAdd: true,
      loadingTestAdd: false,
    });
  });

  it('should handle DB_CONFIG_TEST_ERROR', () => {
    const action = {
      type: DB_CONFIG_TEST_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorAdd: action.payload,
      successAdd: false,
      loadingAdd: false,
    });
  });

  it('should handle DATABASE_CONFIGURE_FORMAT_ADD_SUCCESS', () => {
    const prevState = {
      ...INIT_STATE,
    };

    const action = {
      type: DATABASE_CONFIGURE_FORMAT_ADD_SUCCESS,
      payload: {},
    };

    const newState = reducer(prevState, action);

    expect(newState).toEqual({
      ...prevState,
      dataBaseFormat: {
        ...prevState.dataBaseFormat,
        ...action.payload,
      },
    });
  });

  it('should handle DB_CONFIG_SAVE_ERROR', () => {
    const action = {
      type: DB_CONFIG_SAVE_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorAdd: action.payload,
      successSaveAdd: false,
      loadingAdd: false,
    });
  });

  it('should handle DB_CONFIG_SHOW_SUCCESS', () => {
    const prevState = {
      ...INIT_STATE,
      loaded: false,
      errorShowAdd: {},
      successShowAdd: false,
      loadingShowAdd: true,
    };

    const action = {
      type: DB_CONFIG_SHOW_SUCCESS,
      payload: {},
    };

    const newState = reducer(prevState, action);

    expect(newState).toEqual({
      ...prevState,
      dbConfigData: action.payload,
      loaded: true,
      errorShowAdd: {},
      successShowAdd: true,
      loadingShowAdd: false,
    });
  });

  it('should handle DB_CONFIG_SHOW_ERROR', () => {
    const action = {
      type: DB_CONFIG_SHOW_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorShowAdd: action.payload,
      successShowAdd: false,
      loadingShowAdd: false,
      dbConfigData: {},
    });
  });

  it('should handle DB_CONFIG_CLEAR_SHOW_ERROR', () => {
    const action = {
      type: DB_CONFIG_CLEAR_SHOW_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorShowAdd: {},
      successShowAdd: false,
      loadingShowAdd: false,
      dbConfigData: {},
    });
  });

  it('should handle DB_CONFIG_CLEAR_TEST_ERROR', () => {
    const action = {
      type: DB_CONFIG_CLEAR_TEST_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorShowAdd: {},
      errorTestAdd: {},
      successTestAdd: false,
      loadingTestAdd: false,
    });
  });

  it('should handle DB_MESSAGE_CLEAN', () => {
    const action = {
      type: DB_MESSAGE_CLEAN,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorAdd: {},
      successSaveAdd: false,
      loadingAdd: false,
    });
  });

  it('should handle GET_DB_CONNECTION_LIST', () => {
    const action = {
      type: GET_DB_CONNECTION_LIST,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loadedDbConnections: true,
    });
  });

  it('should handle DB_CONFIG_EDIT', () => {
    const action = {
      type: DB_CONFIG_EDIT,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorEditAdd: {},
      successEditAdd: false,
      loadingEditAdd: true,
    });
  });

  it('should handle DB_CONFIG_EDIT_ERROR', () => {
    const action = {
      type: DB_CONFIG_EDIT_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorEditAdd: action.payload,
      successEditAdd: false,
      loadingEditAdd: false,
    });
  });

  it('should handle DB_CONFIG_CLEAR_EDIT_ERROR', () => {
    const action = {
      type: DB_CONFIG_CLEAR_EDIT_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorEditAdd: {},
      successEditAdd: false,
      loadingEditAdd: false,
    });
  });

  it('should handle DB_CONNECTION_DELETE', () => {
    const action = {
      type: DB_CONNECTION_DELETE,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorDelete: {},
      successDelete: false,
      loadingDelete: true,
    });
  });

  it('should handle DB_CONNECTION_DELETE_SUCCESS', () => {
    const action = {
      type: DB_CONNECTION_DELETE_SUCCESS,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorDelete: {},
      successDelete: true,
      loadingDelete: false,
    });
  });

  it('should handle DB_CONNECTION_DELETE_ERROR', () => {
    const action = {
      type: DB_CONNECTION_DELETE_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorDelete: action.payload,
      successDelete: false,
      loadingDelete: false,
    });
  });

  it('should handle DB_CONNECTION_DELETE_CLEAN', () => {
    const action = {
      type: DB_CONNECTION_DELETE_CLEAN,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorDelete: {},
      successDelete: false,
      loadingDelete: false,
    });
  });

  it('should handle GET_DB_CONNECTION_DROPDOWN_LIST', () => {
    const action = {
      type: GET_DB_CONNECTION_DROPDOWN_LIST,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loadedDbConnections: true,
    });
  });

  it('should handle GET_DB_CONNECTION_DROPDOWN_LIST_SUCCESS', () => {
    const action = {
      type: GET_DB_CONNECTION_DROPDOWN_LIST_SUCCESS,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      dbConnectionDropdownList: [action.payload],
    });
  });

  it('should handle GET_TABLE_PREVIEW', () => {
    const action = {
      type: GET_TABLE_PREVIEW,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      tableDetails: action.payload,
      errorTableAdd: {},
      successTableAdd: false,
      previewData: {},
    });
  });

  it('should handle GET_TABLE_PREVIEW_SUCCESS', () => {
    const action = {
      type: GET_TABLE_PREVIEW_SUCCESS,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorTableAdd: {},
      successTableAdd: true,
      previewData: action.payload,
    });
  });

  it('should handle GET_TABLE_PREVIEW_ERROR', () => {
    const action = {
      type: GET_TABLE_PREVIEW_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorTableAdd: action.payload,
      successTableAdd: false,
      previewData: {},
    });
  });

  it('should handle CLEAR_TABLE_PREVIEW', () => {
    const action = {
      type: CLEAR_TABLE_PREVIEW,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorTableAdd: {},
      successTableAdd: false,
      previewData: {},
    });
  });

  it('should handle GET_IMPORT_SCHEDULER_LIST', () => {
    const action = {
      type: GET_IMPORT_SCHEDULER_LIST,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loadedImportScheduler: true,
    });
  });

  it('should handle DB_CONFIG_SHOW', () => {
    const action = {
      type: DB_CONFIG_SHOW,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorShowAdd: {},
      successShowAdd: false,
      loadingShowAdd: true,
      dbConfigData: {},
    });
  });

  it('should handle DB_CONFIG_EDIT_SUCCESS', () => {
    const action = {
      type: DB_CONFIG_EDIT_SUCCESS,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorEditAdd: {},
      successEditAdd: true,
      loadingEditAdd: false,
    });
  });

  it('should handle GET_IMPORT_SCHEDULER_DETAIL', () => {
    const action = {
      type: GET_IMPORT_SCHEDULER_DETAIL,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      successSchedulerDetail: false,
      errorSchedulerDetail: false,
      loadingSchedulerDetail: true,
    });
  });

  it('should handle GET_IMPORT_SCHEDULER_DETAIL_ERROR', () => {
    const action = {
      type: GET_IMPORT_SCHEDULER_DETAIL_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      successSchedulerDetail: false,
      errorSchedulerDetail: action.payload,
      importSchedulerDetails: {},
      loadingSchedulerDetail: false,
    });
  });

  it('should handle CLEAR_GET_IMPORT_SCHEDULER_DETAIL', () => {
    const action = {
      type: CLEAR_GET_IMPORT_SCHEDULER_DETAIL,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorSchedulerDetail: {},
      successSchedulerDetail: false,
      importSchedulerDetails: {},
      loadingSchedulerDetail: false,
    });
  });

  it('should handle GET_IMPORT_SCHEDULER_BY_ID', () => {
    const action = {
      type: GET_IMPORT_SCHEDULER_BY_ID,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      errorShowAdd: {},
      successShowAdd: false,
      loadingShowAdd: true,
      formSuccess: false,
    });
  });

  it('should handle GET_IMPORT_SCHEDULER_BY_ID_SUCCESS', () => {
    const action = {
      type: GET_IMPORT_SCHEDULER_BY_ID_SUCCESS,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorShowAdd: {},
      successShowAdd: true,
      loadingShowAdd: false,
      ...action.payload,
    });
  });

  it('should handle ADD_UPDATE_S3SFTP_DB_IMPORT', () => {
    const action = {
      type: ADD_UPDATE_S3SFTP_DB_IMPORT,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorShowAdd: {},
      formSuccess: false,
      loadingShowAdd: true,
    });
  });

  it('should handle ADD_UPDATE_S3SFTP_DB_IMPORT_SUCCESS', () => {
    const action = {
      type: ADD_UPDATE_S3SFTP_DB_IMPORT_SUCCESS,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorShowAdd: {},
      formSuccess: true,
      loadingShowAdd: false,
    });
  });

  it('should handle ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR', () => {
    const action = {
      type: ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorShowAdd: action.payload,
      formSuccess: false,
      loadingShowAdd: false,
    });
  });

  it('should handle ADD_UPDATE_S3SFTP_DB_IMPORT_CLEAN_UP', () => {
    const action = {
      type: ADD_UPDATE_S3SFTP_DB_IMPORT_CLEAN_UP,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      selectSource: {},
      dataBaseFormat: {},
      schedule: {},
      formSuccess: false,
      errorShowAdd: {},
    });
  });

  it('should handle ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR_CLEAN_UP', () => {
    const action = {
      type: ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR_CLEAN_UP,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorShowAdd: {},
      successAdd: false,
      loadingShowAdd: false,
    });
  });

  it('should handle SHOW_IMPORT_LIST', () => {
    const action = {
      type: SHOW_IMPORT_LIST,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorImportListAdd: {},
      successImportListAdd: false,
      loadingImportListAdd: true,
    });
  });

  it('should handle SHOW_IMPORT_LIST_ERROR', () => {
    const action = {
      type: SHOW_IMPORT_LIST_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorImportListAdd: action.payload,
      successImportListAdd: false,
      loadingImportListAdd: false,
    });
  });

  it('should handle DB_IMPORT_LIST_CLEAN_ERROR', () => {
    const action = {
      type: DB_IMPORT_LIST_CLEAN_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorImportListAdd: {},
      successImportListAdd: {},
      loadingImportListAdd: false,
    });
  });

  it('should handle DELETE_IMPORT', () => {
    const action = {
      type: DELETE_IMPORT,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: false,
      errorImportDeleteAdd: {},
      successImportDeleteAdd: false,
      loadingImportDeleteAdd: true,
    });
  });

  it('should handle DELETE_IMPORT_SUCCESS', () => {
    const action = {
      type: DELETE_IMPORT_SUCCESS,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorImportDeleteAdd: {},
      successImportDeleteAdd: action.payload.response,
      loadingImportDeleteAdd: true,
    });
  });

  it('should handle DELETE_IMPORT_ERROR', () => {
    const action = {
      type: DELETE_IMPORT_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorImportDeleteAdd: action.payload,
      successImportDeleteAdd: false,
      loadingImportDeleteAdd: false,
    });
  });

  it('should handle DELETE_IMPORT_CLEAN_ERROR', () => {
    const action = {
      type: DELETE_IMPORT_CLEAN_ERROR,
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
      loaded: true,
      errorImportDeleteAdd: {},
      successImportDeleteAdd: {},
      loadingImportDeleteAdd: false,
    });
  });

  it('should return the current state for unknown action type', () => {
    const action = {
      type: '',
      payload: {},
    };

    const newState = reducer(INIT_STATE, action);

    expect(newState).toEqual({
      ...INIT_STATE,
    });
  });
});
