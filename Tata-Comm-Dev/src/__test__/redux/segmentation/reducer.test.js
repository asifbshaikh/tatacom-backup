import reducer from 'redux/segmentation/reducer';
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
} from 'redux/constants';
import { describe, expect, it } from '@jest/globals';

describe('DB Import Reducer', () => {
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
  };

  const createAction = (type, payload) => ({ type, payload });

  it.each([
    [GET_SEGMENTATION_LIST, { loadedSegmentation: true }],
    [GET_CUSTOM_SEGMENT_LIST, { loadedSegmentation: true }],
    [GET_CUSTOM_SEGMENT_LIST_SUCCESS, { customSegmentationlist: [{}] }],
    [GET_CATEGORY_DROPDOWN_LIST, {}],
    [GET_USER_EVENTS_LIST, {}],
    [GET_USER_EVENTS_LIST_SUCCESS, { userEventsList: {} }],
    [GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS, {}],
    [
      GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS_SUCCESS,
      { userAttributesBasedOnUserEventsList: {} },
    ],
    [GET_SEGMENTATION_DETAILS, { loadedSegmentation: true }],
    [GET_SEGMENTATION_DETAILS_SUCCESS, { segmentDetails: {} }],
    [SEGMENTATION_ARCHIEVE, { archieved: false, segmentDetails: {} }],
    [SEGMENTATION_ARCHIEVE_SUCCESS, { archieved: true, segmentDetails: {} }],
    [GET_QUERY_LIST, { loadedSegmentation: true }],
    [USER_COUNT_FILTER, { loadedSegmentation: true }],
    [
      USER_COUNT_FILTER_SUCCESS,
      {
        loadedSegmentation: false,
        successAdd: true,
        lastExecutedFilterId: undefined,
        usersCount: undefined,
      },
    ],
    [
      USER_COUNT_FILTER_RESET,
      { lastExecutedFilterId: null, usersCount: null, successAdd: false },
    ],
    [
      SEGMENT_CREATE,
      {
        loaded: false,
        errorAdd: {},
        successSegmentAdd: false,
        loadingAdd: true,
      },
    ],
    [
      SEGMENT_CREATE_SUCCESS,
      {
        segmentDetails: {},
        loaded: true,
        errorAdd: {},
        successSegmentAdd: true,
        loadingAdd: false,
      },
    ],
    [
      SEGMENT_USER_EXPORT,
      { loaded: false, errorAdd: {}, successAdd: false, loading: true },
    ],
    [
      SEGMENT_USER_EXPORT_SUCCESS,
      {
        loaded: true,
        errorAdd: {},
        successAdd: true,
        segmentExportSuccessMessage: undefined,
        loading: false,
      },
    ],
    [
      SEGMENT_RERUN_QUERY,
      { loaded: false, errorAdd: {}, successReRun: false, loadingAdd: true },
    ],
    [
      SEGMENT_RERUN_QUERY_SUCCESS,
      { loaded: true, errorAdd: {}, successReRun: true, loadingAdd: false },
    ],
    [SEGMENT_QUERY_DETAILS, { loaded: false, errorAdd: {}, loadingAdd: true }],
    [
      SEGMENT_QUERY_DETAILS_SUCCESS,
      {
        loaded: true,
        errorAdd: {},
        queryDetails: {},
        loadingAdd: false,
      },
    ],
    [GET_USERS_AFTER_SEG_LIST, {}],
    [GET_USERS_AFTER_SEG_LIST_SUCCESS, { usersAfterSegList: undefined }],
    [
      SEGMENT_QUERY_CLEANUP,
      {
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
      },
    ],
    [GET_VIEW_SEGMENT_DATA, { viewSegmentDataLoad: false }],
    [
      GET_VIEW_SEGMENT_DATA_SUCCESS,
      { viewSegmentDataLoad: true, viewSegmentData: undefined },
    ],
    [SEGMENT_QUERY_ALERT, { successAdd: false }],
    [SEGMENT_QUERY_ALERT_SUCCESS, { successAdd: true }],
    [GET_CUSTOM_SEG_LIST, { customSegLoad: true }],
    [GET_EDIT_SEGMENT_DATA, { viewSegmentDataLoad: true }],
    [
      GET_EDIT_SEGMENT_DATA_SUCCESS,
      { editSegmentData: undefined, viewSegmentDataLoad: false },
    ],
    [
      CLEAR_EDIT_SEGMENT_DATA,
      {
        editSegmentData: {},
        editSegmentError: false,
        useThisVersionError: false,
      },
    ],
    [
      GET_CUSTOM_SEG_LIST_SUCCESS,
      { customSegLoad: false, customSegList: undefined },
    ],
    [
      CREATE_CUSTOM_EVENT,
      { loaded: false, errorAdd: {}, successAddPopOver: false, loading: true },
    ],
    [
      CREATE_CUSTOM_EVENT_SUCCESS,
      { loaded: true, errorAdd: {}, successAddPopOver: true, loading: false },
    ],
    [
      CREATE_CUSTOM_EVENT_ERROR,
      {
        loaded: true,
        errorAdd: {},
        successAddPopOver: false,
        loadingAdd: false,
      },
    ],
    [PERSIST_APPLIED_FILTERS_ALL_SEG, { allSegAppliedFilters: {} }],
    [
      SEGMENT_USER_EXPORT_BY_SEGMENT_ID,
      { loaded: false, successAdd: false, loading: true },
    ],
    [
      SEGMENT_USER_EXPORT_BY_SEGMENT_ID_SUCCESS,
      { loaded: true, segmentExportSuccessMessage: undefined, loading: false },
    ],
    [SEGMENT_UPDATE, {}],
    [SEGMENT_UPDATE_SUCCESS, { updateSegment: {}, successSegmentUpdate: true }],
    [
      SEGMENT_UPDATE_ERROR,
      { errorUpdate: undefined, successSegmentUpdate: false },
    ],
    [
      EDIT_FILE_SEGMENT,
      {
        loaded: false,
        editSegmentError: false,
        editSegmentSuccess: false,
        loadingAdd: true,
      },
    ],
    [
      EDIT_FILE_SEGMENT_SUCCESS,
      {
        loaded: true,
        editSegmentError: false,
        editSegmentSuccess: true,
        successMessage: undefined,
        loadingAdd: false,
      },
    ],
    [
      EDIT_FILE_SEGMENT_ERROR,
      {
        loaded: true,
        editSegmentError: true,
        editSegmentErrorMessage: undefined,
        editSegmentSuccess: false,
        loadingAdd: false,
      },
    ],
    [
      USE_THIS_VERSION,
      {
        loaded: false,
        useThisVersionError: false,
        useThisVersionSuccess: false,
        loadingAdd: true,
      },
    ],
    [
      USE_THIS_VERSION_SUCCESS,
      {
        loaded: true,
        useThisVersionError: false,
        useThisVersionSuccess: true,
        loadingAdd: false,
      },
    ],
    [
      USE_THIS_VERSION_ERROR,
      {
        loaded: true,
        useThisVersionError: true,
        useThisVersionErrorMessage: undefined,
        useThisVersionSuccess: false,
        loadingAdd: false,
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