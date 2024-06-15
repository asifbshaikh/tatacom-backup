import {
  GET_SEGMENTATION_LIST,
  GET_SEGMENTATION_LIST_SUCCESS,
  GET_CUSTOM_SEGMENT_LIST,
  GET_CUSTOM_SEGMENT_LIST_SUCCESS,
  SEGMENTATION_ARCHIEVE,
  SEGMENTATION_ARCHIEVE_SUCCESS,
  GET_QUERY_LIST,
  GET_QUERY_LIST_SUCCESS,
  USER_COUNT_FILTER_SUCCESS,
  USER_COUNT_FILTER_RESET,
  USER_COUNT_FILTER,
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
  SEGMENT_QUERY_ALERT_SUCCESS,
  SEGMENT_QUERY_ALERT,
  EDIT_FILE_SEGMENT,
  EDIT_FILE_SEGMENT_SUCCESS,
  EDIT_FILE_SEGMENT_ERROR,
  GET_CUSTOM_SEG_LIST_SUCCESS,
  GET_CUSTOM_SEG_LIST,
  GET_USER_EVENTS_LIST,
  GET_USER_EVENTS_LIST_SUCCESS,
  GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS,
  GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS_SUCCESS,
  GET_EDIT_SEGMENT_DATA,
  GET_EDIT_SEGMENT_DATA_SUCCESS,
  CREATE_CUSTOM_EVENT,
  CREATE_CUSTOM_EVENT_SUCCESS,
  CREATE_CUSTOM_EVENT_ERROR,
  PERSIST_APPLIED_FILTERS_ALL_SEG,
  SEGMENT_USER_EXPORT_BY_SEGMENT_ID,
  SEGMENT_USER_EXPORT_BY_SEGMENT_ID_SUCCESS,
  CLEAR_EDIT_SEGMENT_DATA,
  SEGMENT_UPDATE,
  SEGMENT_UPDATE_SUCCESS,
  SEGMENT_UPDATE_ERROR,
  USE_THIS_VERSION,
  USE_THIS_VERSION_SUCCESS,
  USE_THIS_VERSION_ERROR,
  FETCH_USER_COUNT,
  FETCH_USER_COUNT_SUCCESS,
  GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST,
  GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST_SUCCESS,
  GET_EXPORT_CATEGORY_DROPDOWN_LIST_SUCCESS,
} from 'redux/constants';

export const getSegmentation = (item) => ({
  type: GET_SEGMENTATION_LIST,
  payload: item,
});

export const getSegmentationSuccess = (items) => ({
  type: GET_SEGMENTATION_LIST_SUCCESS,
  payload: items,
});

export const getCustomSegmentList = (item) => ({
  type: GET_CUSTOM_SEGMENT_LIST,
  payload: item,
});

export const getCustomSegmentionSuccess = (items) => ({
  type: GET_CUSTOM_SEGMENT_LIST_SUCCESS,
  payload: items,
});

export const getCategoryDropdownList = (userId) => ({
  type: GET_CATEGORY_DROPDOWN_LIST,
  payload: userId,
});

export const getCategoryDropdownListSuccess = (items) => ({
  type: GET_CATEGORY_DROPDOWN_LIST_SUCCESS,
  payload: items,
});
export const segmentationArchieve = (id) => ({
  type: SEGMENTATION_ARCHIEVE,
  payload: id,
});

export const segmentationArchieveSuccess = (items) => ({
  type: SEGMENTATION_ARCHIEVE_SUCCESS,
  payload: items,
});

export const getQueryList = () => ({ type: GET_QUERY_LIST });

export const getQueryListSuccess = (items) => ({
  type: GET_QUERY_LIST_SUCCESS,
  payload: items,
});

export const userCountFilter = (item, callback, isQueryList = false) => ({
  type: USER_COUNT_FILTER,
  payload: { payload: item, callback, isQueryList: isQueryList },
});

export const userCountFilterSuccess = (items) => ({
  type: USER_COUNT_FILTER_SUCCESS,
  payload: items,
});

export const userCountFilterSegmentReset = () => ({
  type: USER_COUNT_FILTER_RESET,
});

export const segmentCreate = (item) => ({
  type: SEGMENT_CREATE,
  payload: item,
});

export const segmentCreateSuccess = (item) => ({
  type: SEGMENT_CREATE_SUCCESS,
  payload: item,
});

export const segmentUserExport = (items) => ({
  type: SEGMENT_USER_EXPORT,
  payload: items,
});

export const segmentUserExportSuccess = (id) => ({
  type: SEGMENT_USER_EXPORT_SUCCESS,
  payload: id,
});

export const reRunQuery = (id) => ({
  type: SEGMENT_RERUN_QUERY,
  payload: id,
});
export const reRunQuerySuccess = (item) => ({
  type: SEGMENT_RERUN_QUERY_SUCCESS,
  payload: item,
});

export const viewQueryDetails = (id) => ({
  type: SEGMENT_QUERY_DETAILS,
  payload: id,
});
export const viewQueryDetailsSuccess = (id) => ({
  type: SEGMENT_QUERY_DETAILS_SUCCESS,
  payload: id,
});

export const getUserAfterSegListData = (item) => ({
  type: GET_USERS_AFTER_SEG_LIST,
  payload: item,
});

export const getUserAfterSegListDataSuccess = (items) => ({
  type: GET_USERS_AFTER_SEG_LIST_SUCCESS,
  payload: items,
});
export const cleanReRunQuery = () => ({
  type: SEGMENT_QUERY_CLEANUP,
});

export const getViewSegData = (item) => ({
  type: GET_VIEW_SEGMENT_DATA,
  payload: item,
});

export const getViewSegDataSuccess = (items) => ({
  type: GET_VIEW_SEGMENT_DATA_SUCCESS,
  payload: items,
});
export const segmentQueryRunAlert = (items) => ({
  type: SEGMENT_QUERY_ALERT,
  payload: items,
});

export const segmentQueryRunAlertSuccess = (items) => ({
  type: SEGMENT_QUERY_ALERT_SUCCESS,
  payload: items,
});

export const getCustomSegListData = (item) => ({
  type: GET_CUSTOM_SEG_LIST,
  payload: item,
});

export const getCustomSegListDataSuccess = (items) => ({
  type: GET_CUSTOM_SEG_LIST_SUCCESS,
  payload: items,
});

export const getuserEventsList = () => ({
  type: GET_USER_EVENTS_LIST,
});

export const getuserEventsListSuccess = (items) => ({
  type: GET_USER_EVENTS_LIST_SUCCESS,
  payload: items,
});

export const getuserAttributesBasedOnUserEvents = (eventId) => ({
  type: GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS,
  payload: eventId,
});

export const getuserAttributesBasedOnUserEventsSuccess = (items) => ({
  type: GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS_SUCCESS,
  payload: items,
});

export const getEditSegmentData = (segmentId) => ({
  type: GET_EDIT_SEGMENT_DATA,
  payload: segmentId,
});

export const getEditSegmentDataSuccess = (items) => ({
  type: GET_EDIT_SEGMENT_DATA_SUCCESS,
  payload: items,
});

export const clearEditSegmentData = (items) => ({
  type: CLEAR_EDIT_SEGMENT_DATA,
  payload: items,
});

export const createCustomEvent = (items) => ({
  type: CREATE_CUSTOM_EVENT,
  payload: items,
});

export const createCustomEventSuccess = (items) => ({
  type: CREATE_CUSTOM_EVENT_SUCCESS,
  payload: items,
});

export const createCustomEventError = (error) => ({
  type: CREATE_CUSTOM_EVENT_ERROR,
  payload: error,
});

export const editFileSegment = (item) => ({
  type: EDIT_FILE_SEGMENT,
  payload: item,
});

export const editFileSegmentSuccess = (items) => ({
  type: EDIT_FILE_SEGMENT_SUCCESS,
  payload: items,
});

export const editFileSegmentError = (error) => ({
  type: EDIT_FILE_SEGMENT_ERROR,
  payload: error,
});

export const saveAppliedFiltersInAllSegment = (items) => ({
  type: PERSIST_APPLIED_FILTERS_ALL_SEG,
  payload: items,
});

export const segmentUserExportBySegmentFilterId = (items) => ({
  type: SEGMENT_USER_EXPORT_BY_SEGMENT_ID,
  payload: items,
});

export const segmentUserExportBySegmentFilterIdSuccess = (items) => ({
  type: SEGMENT_USER_EXPORT_BY_SEGMENT_ID_SUCCESS,
  payload: items,
});

export const updateSegment = (items) => ({
  type: SEGMENT_UPDATE,
  payload: items,
});

export const updateSegmentSuccess = (items) => ({
  type: SEGMENT_UPDATE_SUCCESS,
  payload: items,
});

export const updateSegmentError = (error) => ({
  type: SEGMENT_UPDATE_ERROR,
  payload: error,
});

export const useThisVersion = (item) => ({
  type: USE_THIS_VERSION,
  payload: item,
});

export const useThisVersionSuccess = (items) => ({
  type: USE_THIS_VERSION_SUCCESS,
  payload: items,
});

export const useThisVersionError = (error) => ({
  type: USE_THIS_VERSION_ERROR,
  payload: error,
});

export const fetchUserCountforQueryList = () => ({
  type: FETCH_USER_COUNT,
});

export const fetchUserCountSuccess = (data) => ({
  type: FETCH_USER_COUNT_SUCCESS,
  payload: data,
});

export const getCampaignChannelAndTypeList = () => ({
  type: GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST,
});

export const getCampaignChannelAndTypeListSuccess = (items) => ({
  type: GET_CAMPAIGN_CHANNEL_AND_TYPE_LIST_SUCCESS,
  payload: items,
});

export const getExportCategoryDropdownListSuccess = (items) => ({
  type: GET_EXPORT_CATEGORY_DROPDOWN_LIST_SUCCESS,
  payload: items,
});
