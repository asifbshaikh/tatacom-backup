import reducer from 'redux/dashboard-campaigns/reducers';
import {
  GET_DASHBOARD_CAMPAIGNS_LIST,
  GET_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
  GET_AB_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_CAMPAIGN_INFO,
  GET_DASHBOARD_CAMPAIGN_INFO_SUCCESS,
  GET_CAMPAIGN_ANALYTICS_SUCCESS,
  GET_CAMPAIGN_ANALYTICS,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_SUCCESS,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_FAILURE,
  GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_RESET,
  DASHBOARD_AB_COMPARISON_CLEANUP,
  GET_EMAIL_SUBMIT,
  EMAIL_SUBMIT_SUCCESS,
  SET_FILTER_VALUES,
  RESCHEDULE_CAMPAIGN,
  CANCEL_CAMPAIGN,
  RESCHEDULE_SUCCESS,
  CANCEL_SUCCESS,
  PAUSE_SUCCESS,
  RESUME_SUCCESS,
  GENERATE_TINY_URL_REPORT_ERROR,
  GENERATE_TINY_URL_REPORT_SUCCESS,
  GENERATE_TINY_URL_REPORT,
  GENERATE_TINY_URL_REPORT_CLEAN,
} from 'redux/constants';
import { describe, expect, it } from '@jest/globals';
import DashboardEnums from 'enums/dashboard/dashboardEnums';

describe('DB Import Reducer', () => {
  const INIT_STATE = {
    loaded: false,
    loadedDashboardCampaignList: false,
    dashboardCampaignList: [],
    abDashboardCampaign1List: [],
    abDashboardCampaign2List: [],
    campaignStatus: {},
    selectChannel: [],
    selectDeliveryType: [],
    startDate: '',
    endDate: '',
    selectDateType: [],
    showRefresh: false,
    campaignTypes: [],
    channelType: [],
    campaignName: '',
    campaignInfo: {},
    network: false,
    loading: false,
    currentPage: 1,
    campaign1Info: {},
    campaign2Info: {},
    metricsCampaignListC1: null,
    abCampaign1Pagination: null,
    metricsCampaignListC2: null,
    abCampaign2Pagination: null,
    emailSuccess: '',
    filters: {},
    cancel: false,
    pause: false,
    resume: false,
    tinyUrlReport: {},
  };

  const createAction = (type, payload) => ({ type, payload });

  it.each([
    [GET_DASHBOARD_CAMPAIGNS_LIST, { loadedDashboardCampaignList: true }],
    [
      GET_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
      {
        dashboardCampaignList: undefined,
        metrics: undefined,
        pagination: undefined,
      },
    ],
    [
      GET_AB_DASHBOARD_CAMPAIGNS_LIST_SUCCESS,
      {
        abCampaign2Pagination: undefined,
        abDashboardCampaign2List: undefined,
        metrics: undefined,
        metricsCampaignListC2: undefined,
        pagination: undefined,
      },
    ],
    [GET_DASHBOARD_DATA, {}],
    [GET_DASHBOARD_CAMPAIGN_INFO, {}],
    [GET_DASHBOARD_CAMPAIGN_INFO_SUCCESS, { campaignInfo: {} }],
    [GET_CAMPAIGN_ANALYTICS, {}],
    [GET_CAMPAIGN_ANALYTICS_SUCCESS, {}],
    [
      DASHBOARD_AB_COMPARISON_CLEANUP,
      {
        abDashboardCampaign1List: [],
        abDashboardCampaign2List: [],
        campaign1Info: {},
        campaign2Info: {},
        metricsCampaignListC1: null,
        abCampaign1Pagination: null,
        metricsCampaignListC2: null,
        abCampaign2Pagination: null,
      },
    ],
    [GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_SUCCESS, { exportSuccess: true }],
    [GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_FAILURE, { exportSuccess: false }],
    [GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_RESET, { exportSuccess: '' }],
    [GET_EMAIL_SUBMIT, {}],
    [EMAIL_SUBMIT_SUCCESS, { emailSuccess: {} }],
    [SET_FILTER_VALUES, { filters: {} }],
    [RESCHEDULE_CAMPAIGN, {}],
    [CANCEL_CAMPAIGN, {}],
    [RESCHEDULE_SUCCESS, {}],
    [CANCEL_SUCCESS, {}],
    [PAUSE_SUCCESS, {}],
    [RESUME_SUCCESS, {}],
    [
      GENERATE_TINY_URL_REPORT,
      {
        loaded: false,
        tinyUrlReportError: {},
        tinyUrlReportSuccess: false,
        tinyUrlReportLoading: true,
      },
    ],
    [
      GENERATE_TINY_URL_REPORT_ERROR,
      {
        loaded: true,
        tinyUrlReportError: {},
        tinyUrlReportSuccess: false,
        tinyUrlReportLoading: false,
      },
    ],
    [
      GENERATE_TINY_URL_REPORT_CLEAN,
      {
        loaded: true,
        tinyUrlReportError: {},
        tinyUrlReportSuccess: false,
        tinyUrlReportLoading: false,
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
