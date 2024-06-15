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

export const getOverview = (userId) => ({
  type: OVERVIEW_GET,
  payload: userId,
});
export const getOverviewSuccess = (items) => ({
  type: OVERVIEW_GET_SUCCESS,
  payload: items,
});

export const getOverviewDetails = (userId) => ({
  type: OVERVIEW_GET_DETAILS,
  payload: userId,
});
export const getOverviewDetailsSuccess = (items) => ({
  type: OVERVIEW_GET_DETAILS_SUCCESS,
  payload: items,
});

export const downloadOverview = (item) => ({
  type: OVERVIEW_DOWNLOAD,
  payload: item,
});
export const downloadOverviewSuccess = (items) => ({
  type: OVERVIEW_DOWNLOAD_SUCCESS,
  payload: items,
});
export const downloadOverviewError = (error) => ({
  type: OVERVIEW_DOWNLOAD_ERROR,
  payload: error,
});
export const downloadOverviewClean = (item) => ({
  type: OVERVIEW_DOWNLOAD_CLEAN,
  payload: item,
});

export const getCsat = (userId) => ({
  type: CSAT_GET,
  payload: userId,
});
export const getCsatSuccess = (items) => ({
  type: CSAT_GET_SUCCESS,
  payload: items,
});

export const getCsatDetails = (userId) => ({
  type: CSAT_GET_DETAILS,
  payload: userId,
});
export const getCsatDetailsSuccess = (items) => ({
  type: CSAT_GET_DETAILS_SUCCESS,
  payload: items,
});

export const getUserReports = (userId) => ({
  type: USER_REPORT_GET_LIST,
  payload: userId,
});
export const getUserReportsSuccess = (items) => ({
  type: USER_REPORT_GET_LIST_SUCCESS,
  payload: items,
});

export const getSearchUserReports = (items) => ({
  type: GET_SEARCH_USER_REPORT_LIST,
  payload: items,
});

export const getSearchUserReportsSuccess = (items) => ({
  type: GET_SEARCH_USER_REPORT_LIST_SUCCESS,
  payload: items,
});

export const updateUserReport = (items) => ({
  type: USER_REPORT_UPDATE,
  payload: items,
});

export const updateUserReportSuccess = (error) => ({
  type: USER_REPORT_UPDATE_SUCCESS,
  payload: error,
});

export const updateUserReportError = (error) => ({
  type: USER_REPORT_UPDATE_ERROR,
  payload: error,
});

export const downloadUserReport = (items) => ({
  type: USER_REPORT_DOWNLOAD,
  payload: items,
});

export const downloadUserReportSuccess = (error) => ({
  type: USER_REPORT_DOWNLOAD_SUCCESS,
  payload: error,
});

export const downlaodUserReportError = (error) => ({
  type: USER_REPORT_DOWNLOAD_ERROR,
  payload: error,
});

export const getCustomDateReportData = (item) => ({
  type: GET_CUSTOM_DATE_REPORT_DATA,
  payload: item,
});

export const getCustomDateReportDataClean = () => ({
  type: GET_CUSTOM_DATE_REPORT_DATA_CLEAN,
});
