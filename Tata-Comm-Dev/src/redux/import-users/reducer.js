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

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PAST_IMPORTUSERS_FILE_LIST:
      return { ...state, loadedImportUserList: true };

    case GET_PAST_IMPORTUSERS_FILE_LIST_SUCCESS:
      return {
        ...state,
        importusersList: {
          importList: action.payload.data,
          totalCount: action.payload.total_records,
        },
      };

    case GET_COLUMN_ATTRIBUTE_LIST:
      return { ...state, loadedColAttributes: true };

    case GET_COLUMN_ATTRIBUTE_LIST_SUCCESS:
      return {
        ...state,
        colAttributesList: action.payload,
      };

    case UPLOAD_IMPORTUSERS_CSV_FILE:
      return {
        ...state,
        loaded: false,
        errorUpload: {},
        successUpload: false,
        loadingUpload: true,
      };

    case UPLOAD_IMPORTUSERS_CSV_FILE_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorUpload: {},
        successUpload: true,
        loadingUpload: false,
      };

    case UPLOAD_IMPORTUSERS_CSV_FILE_ERROR:
      return {
        ...state,
        loaded: true,
        errorUpload: action.payload,
        successUpload: false,
        loadingUpload: false,
      };

    case UPLOAD_IMPORTUSERS_CSV_FILE_CLEAN:
      return {
        ...state,
        ...INIT_STATE,
        loaded: true,
        errorUpload: {},
        successUpload: false,
        loadingUpload: false,
      };

    case GET_IMPORTUSERS_UPLOAD_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case SET_SELECT_USER:
      return {
        ...state,
        selectUser: action.payload,
      };

    case SET_SELECTED_CHECKBOX:
      return {
        ...state,
        selectedCheckbox: action.payload,
      };

    case IMPORTUSER_DATA_CLEAN:
      return {
        ...state,
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
      };

    default:
      return { ...state };
  }
};
