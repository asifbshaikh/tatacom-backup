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
  DB_CONFIG_EDIT,
  DB_CONFIG_EDIT_SUCCESS,
  DB_CONFIG_EDIT_ERROR,
  DB_CONFIG_CLEAR_SHOW_ERROR,
  DB_CONFIG_CLEAR_TEST_ERROR,
  GET_DB_CONNECTION_LIST_SUCCESS,
  GET_DB_CONNECTION_LIST,
  DB_CONFIG_CLEAR_EDIT_ERROR,
  GET_DB_CONNECTION_DROPDOWN_LIST,
  GET_DB_CONNECTION_DROPDOWN_LIST_SUCCESS,
  GET_TABLE_PREVIEW,
  GET_TABLE_PREVIEW_SUCCESS,
  GET_TABLE_PREVIEW_ERROR,
  CLEAR_TABLE_PREVIEW,
  GET_IMPORT_SCHEDULER_LIST,
  GET_IMPORT_SCHEDULER_LIST_SUCCESS,
  GET_IMPORT_SCHEDULER_BY_ID,
  GET_IMPORT_SCHEDULER_BY_ID_SUCCESS,
  ADD_UPDATE_S3SFTP_DB_IMPORT,
  ADD_UPDATE_S3SFTP_DB_IMPORT_SUCCESS,
  ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR,
  ADD_UPDATE_S3SFTP_DB_IMPORT_CLEAN_UP,
  ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR_CLEAN_UP,
  DB_CONNECTION_DELETE,
  DB_CONNECTION_DELETE_SUCCESS,
  DB_CONNECTION_DELETE_ERROR,
  DB_CONNECTION_DELETE_CLEAN,
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
} from 'redux/constants';

export const addS3SFTPImportSourceType = (item) => ({
  type: S3SFTP_IMPORT_SOURCE_TYPE_ADD,
  payload: item,
});

export const addS3SFTPImportSourceTypeSuccess = (item) => ({
  type: S3SFTP_IMPORT_SOURCE_TYPE_ADD_SUCCESS,
  payload: item,
});

export const saveDBConfig = (item) => ({
  type: DB_CONFIG_SAVE,
  payload: item,
});

export const saveDBConfigSuccess = (item) => ({
  type: DB_CONFIG_SAVE_SUCCESS,
  payload: item,
});

export const saveDBConfigError = (item) => ({
  type: DB_CONFIG_SAVE_ERROR,
  payload: item,
});

export const dbMessageClean = (error) => ({
  type: DB_MESSAGE_CLEAN,
  payload: error,
});
export const testDBConfig = (item) => ({
  type: DB_CONFIG_TEST,
  payload: item,
});

export const testDBConfigSuccess = (item) => ({
  type: DB_CONFIG_TEST_SUCCESS,
  payload: item,
});

export const testDBConfigError = (item) => ({
  type: DB_CONFIG_TEST_ERROR,
  payload: item,
});
export const addDataBaseConfigureFormatSuccess = (item) => ({
  type: DATABASE_CONFIGURE_FORMAT_ADD_SUCCESS,
  payload: item,
});

export const showDBConfig = (item) => ({
  type: DB_CONFIG_SHOW,
  payload: item,
});

export const showDBConfigSuccess = (item) => ({
  type: DB_CONFIG_SHOW_SUCCESS,
  payload: item,
});

export const showDBConfigError = (item) => ({
  type: DB_CONFIG_SHOW_ERROR,
  payload: item,
});

export const editDBConfig = (item) => ({
  type: DB_CONFIG_EDIT,
  payload: item,
});

export const editDBConfigSuccess = (item) => ({
  type: DB_CONFIG_EDIT_SUCCESS,
  payload: item,
});

export const editDBConfigError = (item) => ({
  type: DB_CONFIG_EDIT_ERROR,
  payload: item,
});

export const editDBConfigClearError = (item) => ({
  type: DB_CONFIG_CLEAR_EDIT_ERROR,
  payload: item,
});

export const dBConfigClearShowError = (item) => ({
  type: DB_CONFIG_CLEAR_SHOW_ERROR,
  payload: item,
});

export const dBConfigClearTestError = (item) => ({
  type: DB_CONFIG_CLEAR_TEST_ERROR,
  payload: item,
});

export const getDbConnectionList = (item) => ({
  type: GET_DB_CONNECTION_LIST,
  payload: item,
});

export const getDbConnectionListSuccess = (item) => ({
  type: GET_DB_CONNECTION_LIST_SUCCESS,
  payload: item,
});

export const getDbConnectionDropdownList = (item) => ({
  type: GET_DB_CONNECTION_DROPDOWN_LIST,
  payload: item,
});

export const getDbConnectionDropdownListSuccess = (item) => ({
  type: GET_DB_CONNECTION_DROPDOWN_LIST_SUCCESS,
  payload: item,
});

export const getTablePreview = (item) => ({
  type: GET_TABLE_PREVIEW,
  payload: item,
});

export const getTablePreviewSuccess = (item) => ({
  type: GET_TABLE_PREVIEW_SUCCESS,
  payload: item,
});

export const getTablePreviewError = (item) => ({
  type: GET_TABLE_PREVIEW_ERROR,
  payload: item,
});

export const clearTablePreview = (item) => ({
  type: CLEAR_TABLE_PREVIEW,
  payload: item,
});

export const getImportSchedulerList = (item) => ({
  type: GET_IMPORT_SCHEDULER_LIST,
  payload: item,
});

export const getImportSchedulerListSuccess = (item) => ({
  type: GET_IMPORT_SCHEDULER_LIST_SUCCESS,
  payload: item,
});

export const getImportSchedulerById = (item) => ({
  type: GET_IMPORT_SCHEDULER_BY_ID,
  payload: item,
});

export const deleteDbConnection = (item) => ({
  type: DB_CONNECTION_DELETE,
  payload: item,
});

export const deleteDbConnectionSuccess = (item) => ({
  type: DB_CONNECTION_DELETE_SUCCESS,
  payload: item,
});

export const deleteDbConnectionError = (item) => ({
  type: DB_CONNECTION_DELETE_ERROR,
  payload: item,
});

export const deleteDbConnectionClean = (item) => ({
  type: DB_CONNECTION_DELETE_CLEAN,
  payload: item,
});

export const getImportSchedulerDetail = (item) => ({
  type: GET_IMPORT_SCHEDULER_DETAIL,
  payload: item,
});

export const getImportSchedulerDetailSuccess = (item) => ({
  type: GET_IMPORT_SCHEDULER_DETAIL_SUCCESS,
  payload: item,
});

export const getImportSchedulerDetailError = (item) => ({
  type: GET_IMPORT_SCHEDULER_DETAIL_ERROR,
  payload: item,
});

export const clearImportSchedulerDetail = (item) => ({
  type: CLEAR_GET_IMPORT_SCHEDULER_DETAIL,
  payload: item,
});

export const saveDBImport = (item) => ({
  type: DB_IMPORT_SAVE,
  payload: item,
});

export const getImportSchedulerByIdSuccess = (item) => ({
  type: GET_IMPORT_SCHEDULER_BY_ID_SUCCESS,
  payload: item,
});
export const addUpdateS3SFTPImport = (item) => ({
  type: ADD_UPDATE_S3SFTP_DB_IMPORT,
  payload: item,
});

export const addUpdateS3SFTPImportSuccess = (item) => ({
  type: ADD_UPDATE_S3SFTP_DB_IMPORT_SUCCESS,
  payload: item,
});

export const addUpdateS3SFTPImportError = (item) => ({
  type: ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR,
  payload: item,
});

export const addUpdateS3SFTPImportCleanUp = () => ({
  type: ADD_UPDATE_S3SFTP_DB_IMPORT_CLEAN_UP,
});

export const addUpdateS3SFTPImportErrorCleanUp = () => ({
  type: ADD_UPDATE_S3SFTP_DB_IMPORT_ERROR_CLEAN_UP,
});

export const showImportList = (item) => ({
  type: SHOW_IMPORT_LIST,
  payload: item,
});

export const showImportListSuccess = (item) => ({
  type: SHOW_IMPORT_LIST_SUCCESS,
  payload: item,
});

export const showImportListError = (item) => ({
  type: SHOW_IMPORT_LIST_ERROR,
  payload: item,
});

export const cleanImportListError = (item) => ({
  type: DB_IMPORT_LIST_CLEAN_ERROR,
  payload: item,
});

export const deleteImport = (item) => ({
  type: DELETE_IMPORT,
  payload: item,
});

export const deleteImportSuccess = (item) => ({
  type: DELETE_IMPORT_SUCCESS,
  payload: item,
});

export const deleteImportError = (item) => ({
  type: DELETE_IMPORT_ERROR,
  payload: item,
});

export const cleanDeleteImportError = (item) => ({
  type: DELETE_IMPORT_CLEAN_ERROR,
  payload: item,
});
