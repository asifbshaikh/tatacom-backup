import * as actions from 'redux/dashboard-campaigns/actions';
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
import { describe, it, expect } from '@jest/globals';

describe('Channels Actions', () => {
  const item = {};

  it.each([
    [actions.getDashboardCampaignsList, GET_DASHBOARD_CAMPAIGNS_LIST],
    [
      actions.getDashboardCampaignsListSuccess,
      GET_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
    ],
    [actions.getAbDashboardCampaign1List, GET_AB_DASHBOARD_CAMPAIGN1_LIST],
    [actions.getAbDashboardCampaign2List, GET_AB_DASHBOARD_CAMPAIGN2_LIST],
    [
      actions.getAbDashboardCampaignsListSuccess,
      GET_AB_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
    ],
    [actions.getDashboardData, GET_DASHBOARD_DATA],
    [actions.getCampaignInfo, GET_DASHBOARD_CAMPAIGN_INFO],
    [actions.getCampaignInfoSuccess, GET_DASHBOARD_CAMPAIGN_INFO_SUCCESS],
    [actions.getCampaignAnalytics, GET_CAMPAIGN_ANALYTICS],
    [actions.getCampaignAnalyticsSuccess, GET_CAMPAIGN_ANALYTICS_SUCCESS],
    [
      actions.getCampaignsDetailsExportDownload,
      GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD,
    ],
    [
      actions.getCampaignsDetailsExportDownloadSuccess,
      GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_SUCCESS,
    ],
    [actions.cleanABComparisonAnalyticsData, DASHBOARD_AB_COMPARISON_CLEANUP],
    [actions.getEmailSubmit, GET_EMAIL_SUBMIT],
    [actions.emailSuccess, EMAIL_SUBMIT_SUCCESS],
    [actions.setFiltersValue, SET_FILTER_VALUES],
    [actions.rescheduleCampaign, RESCHEDULE_CAMPAIGN],
    [actions.cancelCampaign, CANCEL_CAMPAIGN],
    [actions.rescheduleSuccess, RESCHEDULE_SUCCESS],
    [actions.cancelSuccess, CANCEL_SUCCESS],
    [actions.pauseCampaign, PAUSE_CAMPAIGN],
    [actions.resumeCampaign, RESUME_CAMPAIGN],
    [actions.pauseSuccess, PAUSE_SUCCESS],
    [actions.resumeSuccess, RESUME_SUCCESS],
    [actions.generateTinyUrlReport, GENERATE_TINY_URL_REPORT],
    [actions.generateTinyUrlReportSuccess, GENERATE_TINY_URL_REPORT_SUCCESS],
    [actions.generateTinyUrlReportError, GENERATE_TINY_URL_REPORT_ERROR],
    [actions.generateTinyUrlReportClean, GENERATE_TINY_URL_REPORT_CLEAN],
  ])('should create %p action', (actionCreator, expectedType) => {
    expect(actionCreator(item)).toEqual({
      type: expectedType,
      payload: item,
    });
  });

  it.each([
    [
      actions.getCampaignsDetailsExportDownloadFailure,
      GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_FAILURE,
    ],
    [
      actions.getCampaignsDetailsExportDownloadReset,
      GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_RESET,
    ],
  ])('should create %p action', (actionCreator, expectedType) => {
    expect(actionCreator()).toEqual({
      type: expectedType,
      payload: '',
    });
  });
});
