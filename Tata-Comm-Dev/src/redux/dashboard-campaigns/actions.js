import {
  GET_DASHBOARD_CAMPAIGNS_LIST,
  GET_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_CAMPAIGN_INFO,
  GET_DASHBOARD_CAMPAIGN_INFO_SUCCESS,
  GET_CAMPAIGN_ANALYTICS,
  GET_CAMPAIGN_ANALYTICS_SUCCESS,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_SUCCESS,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_FAILURE,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_RESET,
  GET_AB_DASHBOARD_CAMPAIGN1_LIST,
  GET_AB_DASHBOARD_CAMPAIGN2_LIST,
  GET_AB_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
  DASHBOARD_AB_COMPARISON_CLEANUP,
  GET_EMAIL_SUBMIT,
  EMAIL_SUBMIT_SUCCESS,
  SET_FILTER_VALUES,
  RESCHEDULE_CAMPAIGN,
  CANCEL_CAMPAIGN,
  RESCHEDULE_SUCCESS,
  CANCEL_SUCCESS,
  PAUSE_CAMPAIGN,
  RESUME_CAMPAIGN,
  PAUSE_SUCCESS,
  RESUME_SUCCESS,
  GENERATE_TINY_URL_REPORT,
  GENERATE_TINY_URL_REPORT_SUCCESS,
  GENERATE_TINY_URL_REPORT_ERROR,
  GENERATE_TINY_URL_REPORT_CLEAN,
} from 'redux/constants';

export const getDashboardCampaignsList = (item) => ({
  type: GET_DASHBOARD_CAMPAIGNS_LIST,
  payload: item,
});

export const getDashboardCampaignsListSuccess = (items) => ({
  type: GET_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
  payload: items,
});

export const getAbDashboardCampaign1List = (item) => ({
  type: GET_AB_DASHBOARD_CAMPAIGN1_LIST,
  payload: item,
});

export const getAbDashboardCampaign2List = (item) => ({
  type: GET_AB_DASHBOARD_CAMPAIGN2_LIST,
  payload: item,
});

export const getAbDashboardCampaignsListSuccess = (items) => ({
  type: GET_AB_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
  payload: items,
});

export const getDashboardData = (item) => ({
  type: GET_DASHBOARD_DATA,
  payload: item,
});
export const getCampaignInfo = (item) => ({
  type: GET_DASHBOARD_CAMPAIGN_INFO,
  payload: item,
});

export const getCampaignInfoSuccess = (item) => ({
  type: GET_DASHBOARD_CAMPAIGN_INFO_SUCCESS,
  payload: item,
});

export const getCampaignAnalytics = (item) => ({
  type: GET_CAMPAIGN_ANALYTICS,
  payload: item,
});

export const getCampaignAnalyticsSuccess = (item) => ({
  type: GET_CAMPAIGN_ANALYTICS_SUCCESS,
  payload: item,
});
export const getCampaignsDetailsExportDownload = (item) => ({
  type: GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD,
  payload: item,
});

export const getCampaignsDetailsExportDownloadSuccess = (item) => ({
  type: GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_SUCCESS,
  payload: item,
});

export const getCampaignsDetailsExportDownloadFailure = () => ({
  type: GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_FAILURE,
  payload: '',
});

export const getCampaignsDetailsExportDownloadReset = () => ({
  type: GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_RESET,
  payload: '',
});

export const cleanABComparisonAnalyticsData = (item) => ({
  type: DASHBOARD_AB_COMPARISON_CLEANUP,
  payload: item,
});

export const getEmailSubmit = (item) => ({
  type: GET_EMAIL_SUBMIT,
  payload: item,
});

export const emailSuccess = (item) => ({
  type: EMAIL_SUBMIT_SUCCESS,
  payload: item,
});

export const setFiltersValue = (item) => ({
  type: SET_FILTER_VALUES,
  payload: item,
});

export const rescheduleCampaign = (item) => ({
  type: RESCHEDULE_CAMPAIGN,
  payload: item,
});

export const cancelCampaign = (item) => ({
  type: CANCEL_CAMPAIGN,
  payload: item,
});

export const rescheduleSuccess = (item) => ({
  type: RESCHEDULE_SUCCESS,
  payload: item,
});

export const cancelSuccess = (item) => ({
  type: CANCEL_SUCCESS,
  payload: item,
});

export const pauseCampaign = (item) => ({
  type: PAUSE_CAMPAIGN,
  payload: item,
});

export const resumeCampaign = (item) => ({
  type: RESUME_CAMPAIGN,
  payload: item,
});

export const pauseSuccess = (item) => ({
  type: PAUSE_SUCCESS,
  payload: item,
});

export const resumeSuccess = (item) => ({
  type: RESUME_SUCCESS,
  payload: item,
});

export const generateTinyUrlReport = (item) => ({
  type: GENERATE_TINY_URL_REPORT,
  payload: item,
});

export const generateTinyUrlReportSuccess = (item) => ({
  type: GENERATE_TINY_URL_REPORT_SUCCESS,
  payload: item,
});

export const generateTinyUrlReportError = (item) => ({
  type: GENERATE_TINY_URL_REPORT_ERROR,
  payload: item,
});

export const generateTinyUrlReportClean = (item) => ({
  type: GENERATE_TINY_URL_REPORT_CLEAN,
  payload: item,
});
