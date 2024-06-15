import {
  OVERVIEW_GET,
  OVERVIEW_GET_SUCCESS,
  OVERVIEW_GET_DETAILS,
  OVERVIEW_GET_DETAILS_SUCCESS,
  OVERVIEW_DOWNLOAD,
  OVERVIEW_DOWNLOAD_SUCCESS,
  OVERVIEW_DOWNLOAD_ERROR,
  OVERVIEW_DOWNLOAD_CLEAN,
  CSAT_GET,
  CSAT_GET_SUCCESS,
  CSAT_GET_DETAILS,
  CSAT_GET_DETAILS_SUCCESS,
  USER_REPORT_GET_LIST,
  USER_REPORT_GET_LIST_SUCCESS,
  GET_SEARCH_USER_REPORT_LIST,
  GET_SEARCH_USER_REPORT_LIST_SUCCESS,
  USER_REPORT_UPDATE,
  USER_REPORT_UPDATE_SUCCESS,
  USER_REPORT_UPDATE_ERROR,
  USER_REPORT_DOWNLOAD,
  USER_REPORT_DOWNLOAD_SUCCESS,
  USER_REPORT_DOWNLOAD_ERROR,
  GET_CUSTOM_DATE_REPORT_DATA,
  GET_CUSTOM_DATE_REPORT_DATA_CLEAN,
} from 'redux/constants';

const INIT_STATE = {
  overview: [],
  overviewLoading: false,
  overviewDetails: [],
  overviewDetailsLoading: false,
  loadedUserReports: false,
  userReportsList: { totalCount: 0, allUsersReport: [] },
  successAdd: false,
  since: null,
  until: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case OVERVIEW_GET:
      return { ...state, overviewLoading: true };
    case OVERVIEW_GET_SUCCESS:
      return { ...state, overview: action.payload, overviewLoading: false };
    case OVERVIEW_GET_DETAILS:
      return { ...state, overviewDetailsLoading: true };
    case OVERVIEW_GET_DETAILS_SUCCESS:
      return {
        ...state,
        overviewDetails: action.payload,
        overviewDetailsLoading: false,
      };

    case OVERVIEW_DOWNLOAD:
      return { ...state, downloadSuccess: false };
    case OVERVIEW_DOWNLOAD_SUCCESS:
      return {
        ...state,
        downloadContent: action.payload,
        downloadSuccess: true,
      };
    case OVERVIEW_DOWNLOAD_ERROR:
      return { ...state, downloadSuccess: false };
    case OVERVIEW_DOWNLOAD_CLEAN:
      return { ...state, downloadContent: [], downloadSuccess: false };

    case CSAT_GET:
      return { ...state, overviewLoading: true };
    case CSAT_GET_SUCCESS:
      return { ...state, overview: action.payload, overviewLoading: false };
    case CSAT_GET_DETAILS:
      return { ...state, overviewDetailsLoading: true };
    case CSAT_GET_DETAILS_SUCCESS:
      return {
        ...state,
        overviewDetails: action.payload.payload,
        csatTotalCount: action.payload.pagination.total_count,
        totalPages: action.payload.pagination.total_pages,
        overviewDetailsLoading: false,
      };

    case USER_REPORT_GET_LIST:
      return { ...state, loadedUserReports: true };

    case USER_REPORT_GET_LIST_SUCCESS:
      return {
        ...state,
        userReportsList: {
          allUsersReport: action.payload.reports,
          totalCount: action.payload.pagination.total_count,
        },
      };

    case GET_SEARCH_USER_REPORT_LIST:
      return { ...state, loadedUserReports: true };

    case GET_SEARCH_USER_REPORT_LIST_SUCCESS:
      return {
        ...state,
        userReportsList: {
          allUsersReport: action.payload.reports ?? [],
          totalCount: action.payload.pagination.total_count ?? 0,
        },
      };

    case USER_REPORT_UPDATE:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case USER_REPORT_UPDATE_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case USER_REPORT_UPDATE_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case USER_REPORT_DOWNLOAD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case USER_REPORT_DOWNLOAD_SUCCESS:
      return {
        ...state,
        downloadURL: action.payload.response.url,
      };

    case USER_REPORT_DOWNLOAD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case GET_CUSTOM_DATE_REPORT_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case GET_CUSTOM_DATE_REPORT_DATA_CLEAN:
      return {
        ...state,
        since: '',
        until: '',
      };

    default:
      return { ...state };
  }
};
