import createSegementEnums from 'enums/createSegment/createSegementEnums';
import {
  GET_SEGMENTATION_LIST,
  GET_SEGMENTATION_LIST_SUCCESS,
  GET_CUSTOM_SEGMENT_LIST,
  GET_CUSTOM_SEGMENT_LIST_SUCCESS,
  GET_SEGMENTATION_DETAILS,
  GET_SEGMENTATION_DETAILS_SUCCESS,
  SEGMENTATION_ARCHIEVE,
  SEGMENTATION_ARCHIEVE_SUCCESS,
  GET_QUERY_LIST,
  GET_QUERY_LIST_SUCCESS,
  USER_COUNT_FILTER,
  USER_COUNT_FILTER_SUCCESS,
  USER_COUNT_FILTER_RESET,
  SEGMENT_CREATE,
  SEGMENT_CREATE_SUCCESS,
  GET_CATEGORY_DROPDOWN_LIST,
  GET_CATEGORY_DROPDOWN_LIST_SUCCESS,
  SEGMENT_USER_EXPORT,
  SEGMENT_USER_EXPORT_SUCCESS,
  SEGMENT_RERUN_QUERY,
  SEGMENT_RERUN_QUERY_SUCCESS,
  SEGMENT_QUERY_DETAILS,
  SEGMENT_QUERY_DETAILS_SUCCESS,
  GET_USERS_AFTER_SEG_LIST,
  GET_USERS_AFTER_SEG_LIST_SUCCESS,
  SEGMENT_QUERY_CLEANUP,
  GET_VIEW_SEGMENT_DATA,
  GET_VIEW_SEGMENT_DATA_SUCCESS,
  SEGMENT_QUERY_ALERT,
  SEGMENT_QUERY_ALERT_SUCCESS,
  GET_CUSTOM_SEG_LIST_SUCCESS,
  GET_CUSTOM_SEG_LIST,
  GET_USER_EVENTS_LIST,
  GET_USER_EVENTS_LIST_SUCCESS,
  GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS,
  GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS_SUCCESS,
  CREATE_CUSTOM_EVENT,
  CREATE_CUSTOM_EVENT_SUCCESS,
  CREATE_CUSTOM_EVENT_ERROR,
  PERSIST_APPLIED_FILTERS_ALL_SEG,
  SEGMENT_USER_EXPORT_BY_SEGMENT_ID,
  SEGMENT_USER_EXPORT_BY_SEGMENT_ID_SUCCESS,
  GET_EDIT_SEGMENT_DATA,
  GET_EDIT_SEGMENT_DATA_SUCCESS,
  CLEAR_EDIT_SEGMENT_DATA,
  SEGMENT_UPDATE,
  SEGMENT_UPDATE_SUCCESS,
  EDIT_FILE_SEGMENT,
  EDIT_FILE_SEGMENT_SUCCESS,
  EDIT_FILE_SEGMENT_ERROR,
  SEGMENT_UPDATE_ERROR,
  USE_THIS_VERSION,
  USE_THIS_VERSION_SUCCESS,
  USE_THIS_VERSION_ERROR,
  FETCH_USER_COUNT_SUCCESS,
  GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST_SUCCESS,
  GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST,
  GET_EXPORT_CATEGORY_DROPDOWN_LIST_SUCCESS,
} from 'redux/constants';

const INIT_STATE = {
  loadedSegmentation: false,
  segmentationList: [],
  customSegmentationlist: [],
  segmentDetails: {},
  totalCount: 0,
  listQueryResult: [],
  loaded: false,
  errorAdd: {},
  successAdd: false,
  loadingAdd: true,
  lastExecutedFilterId: null,
  usersCount: null,
  loadedSegmentationAgents: false,
  categoryDropdownList: [],
  queryDetails: {},
  usersAfterSegList: [],
  lastExecutedQueryId: 0,
  segmentExportSuccessMessage: '',
  loading: false,
  successSegmentAdd: false,
  archieved: false,
  customSegLoad: false,
  customSegList: [],
  viewSegmentData: {},
  viewSegmentDataLoad: false,
  userEventsList: [],
  userAttributesBasedOnUserEventsList: [],
  successAddPopOver: false,
  allSegAppliedFilters: {
    searchString: '',
    segmentType: [],
    toggleFilter: false,
  },
  editSegmentData: {},
  successSegmentUpdate: false,
  campaignChannelAndTypeList: [],
  exportCategoryDropdownList: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SEGMENTATION_LIST:
      return { ...state, loadedSegmentation: true };

    case GET_SEGMENTATION_LIST_SUCCESS:
      return {
        ...state,
        segmentationList: [...action.payload.data],
        totalCount: action.payload.pagination.total_count,
      };

    case GET_CUSTOM_SEGMENT_LIST:
      return { ...state, loadedSegmentation: true };

    case GET_CUSTOM_SEGMENT_LIST_SUCCESS:
      return {
        ...state,
        customSegmentationlist: [action.payload],
      };

    case GET_CATEGORY_DROPDOWN_LIST:
      return { ...state };

    case GET_CATEGORY_DROPDOWN_LIST_SUCCESS: {
      let updatedCustomAttributes = [];
      if (action?.payload?.custom_attributes?.length > 0) {
        updatedCustomAttributes = action.payload.custom_attributes?.map(
          (item) => {
            item.category = createSegementEnums.CATEGORY.CUSTOM_ATTRIBUTES;
            return item;
          }
        );
      }
      return {
        ...state,
        categoryDropdownList: [
          ...action.payload.user_properties,
          ...updatedCustomAttributes,
        ],
      };
    }

    case GET_USER_EVENTS_LIST:
      return { ...state };

    case GET_USER_EVENTS_LIST_SUCCESS:
      return { ...state, userEventsList: action.payload };

    case GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS:
      return { ...state };

    case GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS_SUCCESS:
      return { ...state, userAttributesBasedOnUserEventsList: action.payload };

    case GET_SEGMENTATION_DETAILS:
      return { ...state, loadedSegmentation: true };

    case GET_SEGMENTATION_DETAILS_SUCCESS:
      return { ...state, segmentDetails: action.payload };

    case SEGMENTATION_ARCHIEVE:
      return { ...state, archieved: false, segmentDetails: action.payload };

    case SEGMENTATION_ARCHIEVE_SUCCESS:
      return { ...state, archieved: true, segmentDetails: action.payload };

    case GET_QUERY_LIST:
      return { ...state, loadedSegmentation: true };

    case GET_QUERY_LIST_SUCCESS:
      return {
        ...state,
        listQueryResult: [...action.payload],
        loadedSegmentation: false,
      };

    case USER_COUNT_FILTER:
      return { ...state, loadedSegmentation: true };

    case USER_COUNT_FILTER_SUCCESS:
      return {
        ...state,
        loadedSegmentation: false,
        successAdd: true,
        lastExecutedFilterId: action?.payload?.segment_filter?.id,
        usersCount:
          action?.payload?.segment_filter?.reachable_users?.total_users,
      };
    case USER_COUNT_FILTER_RESET:
      return {
        ...state,
        lastExecutedFilterId: null,
        usersCount: null,
        successAdd: false,
      };
    case SEGMENT_CREATE:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successSegmentAdd: false,
        loadingAdd: true,
      };

    case SEGMENT_CREATE_SUCCESS:
      return {
        ...state,
        segmentDetails: action.payload,
        loaded: true,
        errorAdd: {},
        successSegmentAdd: true,
        loadingAdd: false,
      };

    case SEGMENT_USER_EXPORT:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loading: true,
      };

    case SEGMENT_USER_EXPORT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        segmentExportSuccessMessage: action.payload.message,
        loading: false,
      };

    case SEGMENT_RERUN_QUERY:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successReRun: false,
        loadingAdd: true,
      };

    case SEGMENT_RERUN_QUERY_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successReRun: true,
        loadingAdd: false,
      };

    case SEGMENT_QUERY_DETAILS:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        loadingAdd: true,
      };

    case SEGMENT_QUERY_DETAILS_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        queryDetails: action.payload,
        loadingAdd: false,
      };

    case GET_USERS_AFTER_SEG_LIST:
      return { ...state };

    case GET_USERS_AFTER_SEG_LIST_SUCCESS:
      return {
        ...state,
        usersAfterSegList: action.payload.sample_user_details,
      };

    case SEGMENT_QUERY_CLEANUP:
      return {
        ...state,
        errorAdd: {},
        successReRun: false,
        loadingAdd: false,
        segmentExportSuccessMessage: '',
        loading: false,
        successAdd: false,
        successSegmentAdd: false,
        successSegmentUpdate: false,
        archieved: false,
        errorUpdate: false,
      };

    case GET_VIEW_SEGMENT_DATA:
      return { ...state, viewSegmentDataLoad: false };

    case GET_VIEW_SEGMENT_DATA_SUCCESS:
      return {
        ...state,
        viewSegmentDataLoad: true,
        viewSegmentData: action?.payload?.segment,
      };

    case SEGMENT_QUERY_ALERT:
      return {
        ...state,
        successAdd: false,
      };
    case SEGMENT_QUERY_ALERT_SUCCESS:
      return {
        ...state,
        successAdd: true,
      };

    case GET_CUSTOM_SEG_LIST:
      return { ...state, customSegLoad: true };

    case GET_EDIT_SEGMENT_DATA:
      return { ...state, viewSegmentDataLoad: true };

    case GET_EDIT_SEGMENT_DATA_SUCCESS:
      return {
        ...state,
        editSegmentData: action.payload.segment,
        viewSegmentDataLoad: false,
      };

    case CLEAR_EDIT_SEGMENT_DATA:
      return {
        ...state,
        editSegmentData: {},
        editSegmentError: false,
        useThisVersionError: false,
      };

    case GET_CUSTOM_SEG_LIST_SUCCESS:
      return {
        ...state,
        customSegLoad: false,
        customSegList: action.payload?.custom_segments,
      };

    case CREATE_CUSTOM_EVENT:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAddPopOver: false,
        loading: true,
      };

    case CREATE_CUSTOM_EVENT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAddPopOver: true,
        loading: false,
      };

    case CREATE_CUSTOM_EVENT_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAddPopOver: false,
        loadingAdd: false,
      };

    case PERSIST_APPLIED_FILTERS_ALL_SEG:
      return {
        ...state,
        allSegAppliedFilters: { ...action.payload },
      };

    case SEGMENT_USER_EXPORT_BY_SEGMENT_ID:
      return {
        ...state,
        loaded: false,
        successAdd: false,
        loading: true,
      };
    case SEGMENT_USER_EXPORT_BY_SEGMENT_ID_SUCCESS:
      return {
        ...state,
        loaded: true,
        segmentExportSuccessMessage: action.payload.message,
        loading: false,
      };

    case SEGMENT_UPDATE:
      return {
        ...state,
      };
    case SEGMENT_UPDATE_SUCCESS:
      return {
        ...state,
        updateSegment: action.payload,
        successSegmentUpdate: true,
      };
    case SEGMENT_UPDATE_ERROR:
      return {
        ...state,
        errorUpdate: action.payload.errorMsg,
        successSegmentUpdate: false,
      };

    case EDIT_FILE_SEGMENT:
      return {
        ...state,
        loaded: false,
        editSegmentError: false,
        editSegmentSuccess: false,
        loadingAdd: true,
      };

    case EDIT_FILE_SEGMENT_SUCCESS:
      return {
        ...state,
        loaded: true,
        editSegmentError: false,
        editSegmentSuccess: true,
        successMessage: action.payload.message,
        loadingAdd: false,
      };

    case EDIT_FILE_SEGMENT_ERROR:
      return {
        ...state,
        loaded: true,
        editSegmentError: true,
        editSegmentErrorMessage: action.payload.errorMsg,
        editSegmentSuccess: false,
        loadingAdd: false,
      };

    case USE_THIS_VERSION:
      return {
        ...state,
        loaded: false,
        useThisVersionError: false,
        useThisVersionSuccess: false,
        loadingAdd: true,
      };

    case USE_THIS_VERSION_SUCCESS:
      return {
        ...state,
        loaded: true,
        useThisVersionError: false,
        useThisVersionSuccess: true,
        loadingAdd: false,
      };

    case USE_THIS_VERSION_ERROR:
      return {
        ...state,
        loaded: true,
        useThisVersionError: true,
        useThisVersionErrorMessage: action.payload.errorMsg,
        useThisVersionSuccess: false,
        loadingAdd: false,
      };

    case FETCH_USER_COUNT_SUCCESS:
      return {
        ...state,
        listQueryResult: state.listQueryResult.map((query) => {
          return query.id === action.payload.id ? { ...action.payload } : query;
        }),
      };

    case GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST:
      return {
        ...state,
      };
    case GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST_SUCCESS:
      return {
        ...state,
        campaignChannelAndTypeList: action.payload,
      };

    case GET_EXPORT_CATEGORY_DROPDOWN_LIST_SUCCESS: {
      return {
        ...state,
        exportCategoryDropdownList: Object.entries(action.payload).map(
          ([key, valueList]) => {
            return valueList.map((value) => {
              return {
                value: value.name,
                label: value.displayed_name,
                category: key,
              };
            });
          }
        ),
      };
    }

    default:
      return { ...state };
  }
};
