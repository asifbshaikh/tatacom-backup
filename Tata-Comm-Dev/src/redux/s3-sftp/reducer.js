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

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case S3SFTP_IMPORT_SOURCE_TYPE_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case S3SFTP_IMPORT_SOURCE_TYPE_ADD_SUCCESS:
      return {
        ...state,
        selectSource: {
          ...state.selectSource,
          ...action.payload,
        },
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case DB_CONFIG_SAVE:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successSaveAdd: false,
        loadingAdd: true,
      };

    case DB_CONFIG_SAVE_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successSaveAdd: true,
        loadingAdd: false,
      };

    case DB_CONFIG_TEST:
      return {
        ...state,
        loaded: false,
        errorTestAdd: {},
        successTestAdd: false,
        loadingTestAdd: true,
      };

    case DB_CONFIG_TEST_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorTestAdd: {},
        successTestAdd: true,
        loadingTestAdd: false,
      };

    case DB_CONFIG_TEST_ERROR:
      return {
        ...state,
        loaded: true,
        errorTestAdd: action.payload,
        successTestAdd: false,
        loadingTestAdd: false,
      };

    case DATABASE_CONFIGURE_FORMAT_ADD_SUCCESS:
      return {
        ...state,
        dataBaseFormat: {
          ...state.dataBaseFormat,
          ...action.payload,
        },
      };

    case DB_CONFIG_SAVE_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successSaveAdd: false,
        loadingAdd: false,
      };

    case DB_CONFIG_SHOW:
      return {
        ...state,
        loaded: false,
        errorShowAdd: {},
        successShowAdd: false,
        loadingShowAdd: true,
        dbConfigData: {},
      };

    case DB_CONFIG_SHOW_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorShowAdd: {},
        successShowAdd: true,
        loadingShowAdd: false,
        dbConfigData: action.payload,
      };

    case DB_CONFIG_SHOW_ERROR:
      return {
        ...state,
        loaded: true,
        errorShowAdd: action.payload,
        successShowAdd: false,
        loadingShowAdd: false,
        dbConfigData: {},
      };

    case DB_CONFIG_CLEAR_SHOW_ERROR:
      return {
        ...state,
        loaded: true,
        errorShowAdd: {},
        successShowAdd: false,
        loadingShowAdd: false,
        dbConfigData: {},
      };

    case DB_CONFIG_CLEAR_TEST_ERROR:
      return {
        ...state,
        loaded: true,
        errorShowAdd: {},
        errorTestAdd: {},
        successTestAdd: false,
        loadingTestAdd: false,
      };
    case DB_MESSAGE_CLEAN:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successSaveAdd: false,
        loadingAdd: false,
      };

    case GET_DB_CONNECTION_LIST:
      return { ...state, loadedDbConnections: true };

    case GET_DB_CONNECTION_LIST_SUCCESS:
      return {
        ...state,
        dbConnectionList: [...action.payload.db_configurations],
        pagination: action.payload.pagination,
      };

    case DB_CONFIG_EDIT:
      return {
        ...state,
        loaded: false,
        errorEditAdd: {},
        successEditAdd: false,
        loadingEditAdd: true,
      };

    case DB_CONFIG_EDIT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorEditAdd: {},
        successEditAdd: true,
        loadingEditAdd: false,
      };

    case DB_CONFIG_EDIT_ERROR:
      return {
        ...state,
        loaded: true,
        errorEditAdd: action.payload,
        successEditAdd: false,
        loadingEditAdd: false,
      };

    case DB_CONFIG_CLEAR_EDIT_ERROR:
      return {
        ...state,
        loaded: true,
        errorEditAdd: {},
        successEditAdd: false,
        loadingEditAdd: false,
      };

    case DB_CONNECTION_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case DB_CONNECTION_DELETE_SUCCESS:
      return {
        ...state,
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case DB_CONNECTION_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case DB_CONNECTION_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case GET_DB_CONNECTION_DROPDOWN_LIST:
      return { ...state, loadedDbConnections: true };

    case GET_DB_CONNECTION_DROPDOWN_LIST_SUCCESS:
      return {
        ...state,
        dbConnectionDropdownList: [action.payload],
      };

    case GET_TABLE_PREVIEW:
      return {
        ...state,
        tableDetails: action.payload,
        errorTableAdd: {},
        successTableAdd: false,
        previewData: {},
      };

    case GET_TABLE_PREVIEW_SUCCESS:
      return {
        ...state,
        errorTableAdd: {},
        successTableAdd: true,
        previewData: action.payload,
      };

    case GET_TABLE_PREVIEW_ERROR:
      return {
        ...state,
        errorTableAdd: action.payload,
        successTableAdd: false,
        previewData: {},
      };

    case CLEAR_TABLE_PREVIEW:
      return {
        ...state,
        errorTableAdd: {},
        successTableAdd: false,
        previewData: {},
      };

    case GET_IMPORT_SCHEDULER_LIST:
      return { ...state, loadedImportScheduler: true };

    case GET_IMPORT_SCHEDULER_LIST_SUCCESS:
      return {
        ...state,
        importScheduler: [...action.payload.db_schedules],
        pagination: action.payload.pagination,
      };

    case GET_IMPORT_SCHEDULER_DETAIL:
      return {
        ...state,
        successSchedulerDetail: false,
        errorSchedulerDetail: false,
        loadingSchedulerDetail: true,
      };

    case GET_IMPORT_SCHEDULER_DETAIL_SUCCESS:
      return {
        ...state,
        successSchedulerDetail: true,
        importSchedulerDetails: action.payload.response.db_schedule,
        errorSchedulerDetail: {},
        loadingSchedulerDetail: false,
      };

    case GET_IMPORT_SCHEDULER_DETAIL_ERROR:
      return {
        ...state,
        successSchedulerDetail: false,
        errorSchedulerDetail: action.payload,
        importSchedulerDetails: {},
        loadingSchedulerDetail: false,
      };

    case CLEAR_GET_IMPORT_SCHEDULER_DETAIL:
      return {
        ...state,
        errorSchedulerDetail: {},
        successSchedulerDetail: false,
        importSchedulerDetails: {},
        loadingSchedulerDetail: false,
      };

    case GET_IMPORT_SCHEDULER_BY_ID:
      return {
        ...state,
        loaded: false,
        errorShowAdd: {},
        successShowAdd: false,
        loadingShowAdd: true,
        formSuccess: false,
      };

    case GET_IMPORT_SCHEDULER_BY_ID_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorShowAdd: {},
        successShowAdd: true,
        loadingShowAdd: false,
        ...action.payload,
      };

    case ADD_UPDATE_S3SFTP_DB_IMPORT:
      return {
        ...state,
        loaded: false,
        errorShowAdd: {},
        formSuccess: false,
        loadingShowAdd: true,
      };
    case ADD_UPDATE_S3SFTP_DB_IMPORT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorShowAdd: {},
        formSuccess: true,
        loadingShowAdd: false,
      };

    case ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR:
      return {
        ...state,
        loaded: true,
        errorShowAdd: action.payload,
        formSuccess: false,
        loadingShowAdd: false,
      };

    case ADD_UPDATE_S3SFTP_DB_IMPORT_CLEAN_UP:
      return {
        ...state,
        selectSource: {},
        dataBaseFormat: {},
        schedule: {},
        formSuccess: false,
        errorShowAdd: {},
      };

    case ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR_CLEAN_UP:
      return {
        ...state,
        loaded: true,
        errorShowAdd: {},
        successAdd: false,
        loadingShowAdd: false,
      };

    case SHOW_IMPORT_LIST:
      return {
        ...state,
        loaded: false,
        errorImportListAdd: {},
        successImportListAdd: false,
        loadingImportListAdd: true,
      };

    case SHOW_IMPORT_LIST_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorImportListAdd: {},
        successImportListAdd: action.payload.response.imports,
        loadingImportListAdd: false,
      };

    case SHOW_IMPORT_LIST_ERROR:
      return {
        ...state,
        loaded: true,
        errorImportListAdd: action.payload,
        successImportListAdd: false,
        loadingImportListAdd: false,
      };

    case DB_IMPORT_LIST_CLEAN_ERROR:
      return {
        ...state,
        loaded: true,
        errorImportListAdd: {},
        successImportListAdd: {},
        loadingImportListAdd: false,
      };

    case DELETE_IMPORT:
      return {
        ...state,
        loaded: false,
        errorImportDeleteAdd: {},
        successImportDeleteAdd: false,
        loadingImportDeleteAdd: true,
      };

    case DELETE_IMPORT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorImportDeleteAdd: {},
        successImportDeleteAdd: action.payload.response,
        loadingImportDeleteAdd: true,
      };

    case DELETE_IMPORT_ERROR:
      return {
        ...state,
        loaded: true,
        errorImportDeleteAdd: action.payload,
        successImportDeleteAdd: false,
        loadingImportDeleteAdd: false,
      };

    case DELETE_IMPORT_CLEAN_ERROR:
      return {
        ...state,
        loaded: true,
        errorImportDeleteAdd: {},
        successImportDeleteAdd: {},
        loadingImportDeleteAdd: false,
      };

    default:
      return { ...state };
  }
};
