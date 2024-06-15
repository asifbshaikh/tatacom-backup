import DashboardEnums from 'enums/dashboard/dashboardEnums';
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

const INIT_STATE = {
  loaded: false,
  loadedDashboardCampaignList: false,
  dashboardCampaignList: [],
  abDashboardCampaign1List: [],
  abDashboardCampaign2List: [],
  campaignStatus: DashboardEnums.ALL,
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

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DASHBOARD_CAMPAIGNS_LIST:
      return { ...state, loadedDashboardCampaignList: true };

    case GET_DASHBOARD_CAMPAIGNS_LIST_SUCCESS:
      return {
        ...state,
        dashboardCampaignList: action.payload.campaigns,
        metrics: action.payload.metrics,
        pagination: action.payload.pagination,
      };
    case GET_AB_DASHBOARD_CAMPAIGNS_LIST_SUCCESS: {
      const updatedList = {
        metrics: action.payload.metrics,
        pagination: action.payload.pagination,
      };
      if (action.payload.type === DashboardEnums.AB_CAMPAIGN_1) {
        updatedList.abDashboardCampaign1List = action.payload.campaigns;
        updatedList.metricsCampaignListC1 = action.payload.metrics;
        updatedList.abCampaign1Pagination = action.payload.pagination;
      } else {
        updatedList.abDashboardCampaign2List = action.payload.campaigns;
        updatedList.metricsCampaignListC2 = action.payload.metrics;
        updatedList.abCampaign2Pagination = action.payload.pagination;
      }
      return {
        ...state,
        ...updatedList,
      };
    }
    case GET_DASHBOARD_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case GET_DASHBOARD_CAMPAIGN_INFO:
      return {
        ...state,
      };

    case GET_DASHBOARD_CAMPAIGN_INFO_SUCCESS:
      return {
        ...state,
        campaignInfo: action.payload,
      };

    case GET_CAMPAIGN_ANALYTICS:
      return {
        ...state,
      };

    case GET_CAMPAIGN_ANALYTICS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case DASHBOARD_AB_COMPARISON_CLEANUP: {
      if (action.payload) {
        return {
          ...state,
          ...action.payload,
        };
      } else {
        return {
          ...state,
          abDashboardCampaign1List: [],
          abDashboardCampaign2List: [],
          campaign1Info: {},
          campaign2Info: {},
          metricsCampaignListC1: null,
          abCampaign1Pagination: null,
          metricsCampaignListC2: null,
          abCampaign2Pagination: null,
        };
      }
    }

    case GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_SUCCESS:
      return {
        ...state,
        exportSuccess: true,
      };

    case GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_FAILURE:
      return {
        ...state,
        exportSuccess: false,
      };

    case GET_CAMPAIGNS_DETAILS_EXPORT_DOWNLOAD_RESET:
      return {
        ...state,
        exportSuccess: '',
      };

    case GET_EMAIL_SUBMIT:
      return {
        ...state,
        ...action.payload,
      };

    case EMAIL_SUBMIT_SUCCESS:
      return {
        ...state,
        emailSuccess: action.payload,
      };

    case SET_FILTER_VALUES:
      return {
        ...state,
        filters: action.payload,
      };

    case RESCHEDULE_CAMPAIGN:
      return {
        ...state,
        ...action.payload,
      };

    case CANCEL_CAMPAIGN:
      return {
        ...state,
        ...action.payload,
      };
    case RESCHEDULE_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case CANCEL_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case PAUSE_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case RESUME_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case GENERATE_TINY_URL_REPORT:
      return {
        ...state,
        loaded: false,
        tinyUrlReportError: {},
        tinyUrlReportSuccess: false,
        tinyUrlReportLoading: true,
      };

    case GENERATE_TINY_URL_REPORT_SUCCESS:
      return {
        ...state,
        tinyUrlReport: action.payload.response.campaign,
        loaded: true,
        tinyUrlReportError: {},
        tinyUrlReportSuccess: true,
        tinyUrlReportLoading: false,
      };

    case GENERATE_TINY_URL_REPORT_ERROR:
      return {
        ...state,
        loaded: true,
        tinyUrlReportError: action.payload,
        tinyUrlReportSuccess: false,
        tinyUrlReportLoading: false,
      };

    case GENERATE_TINY_URL_REPORT_CLEAN:
      return {
        ...state,
        loaded: true,
        tinyUrlReportError: {},
        tinyUrlReportSuccess: false,
        tinyUrlReportLoading: false,
      };

    default:
      return { ...state };
  }
};
