import * as actions from 'redux/segmentation/actions';
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
} from 'redux/constants';
import { describe, it, expect } from '@jest/globals';

describe('Channels Actions', () => {
  const item = {};

  it.each([
    [actions.getSegmentation, GET_SEGMENTATION_LIST],
    [actions.getSegmentationSuccess, GET_SEGMENTATION_LIST_SUCCESS],
    [actions.getCustomSegmentList, GET_CUSTOM_SEGMENT_LIST],
    [actions.getCustomSegmentionSuccess, GET_CUSTOM_SEGMENT_LIST_SUCCESS],
    [actions.getCategoryDropdownList, GET_CATEGORY_DROPDOWN_LIST],
    [
      actions.getCategoryDropdownListSuccess,
      GET_CATEGORY_DROPDOWN_LIST_SUCCESS,
    ],
    [actions.segmentationArchieve, SEGMENTATION_ARCHIEVE],
    [actions.segmentationArchieveSuccess, SEGMENTATION_ARCHIEVE_SUCCESS],

    [actions.getQueryListSuccess, GET_QUERY_LIST_SUCCESS],

    [actions.userCountFilterSuccess, USER_COUNT_FILTER_SUCCESS],

    [actions.segmentCreate, SEGMENT_CREATE],
    [actions.segmentCreateSuccess, SEGMENT_CREATE_SUCCESS],
    [actions.segmentUserExport, SEGMENT_USER_EXPORT],
    [actions.segmentUserExportSuccess, SEGMENT_USER_EXPORT_SUCCESS],
    [actions.reRunQuery, SEGMENT_RERUN_QUERY],
    [actions.reRunQuerySuccess, SEGMENT_RERUN_QUERY_SUCCESS],
    [actions.viewQueryDetails, SEGMENT_QUERY_DETAILS],
    [actions.viewQueryDetailsSuccess, SEGMENT_QUERY_DETAILS_SUCCESS],
    [actions.getUserAfterSegListData, GET_USERS_AFTER_SEG_LIST],
    [actions.getUserAfterSegListDataSuccess, GET_USERS_AFTER_SEG_LIST_SUCCESS],

    [actions.getViewSegData, GET_VIEW_SEGMENT_DATA],
    [actions.getViewSegDataSuccess, GET_VIEW_SEGMENT_DATA_SUCCESS],
    [actions.segmentQueryRunAlert, SEGMENT_QUERY_ALERT],
    [actions.segmentQueryRunAlertSuccess, SEGMENT_QUERY_ALERT_SUCCESS],
    [actions.getCustomSegListData, GET_CUSTOM_SEG_LIST],
    [actions.getCustomSegListDataSuccess, GET_CUSTOM_SEG_LIST_SUCCESS],

    [actions.getuserEventsListSuccess, GET_USER_EVENTS_LIST_SUCCESS],
    [
      actions.getuserAttributesBasedOnUserEvents,
      GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS,
    ],
    [
      actions.getuserAttributesBasedOnUserEventsSuccess,
      GET_USER_ATTRIBUTES_BASED_ON_USER_EVENTS_SUCCESS,
    ],
    [actions.getEditSegmentData, GET_EDIT_SEGMENT_DATA],
    [actions.getEditSegmentDataSuccess, GET_EDIT_SEGMENT_DATA_SUCCESS],
    [actions.clearEditSegmentData, CLEAR_EDIT_SEGMENT_DATA],
    [actions.createCustomEvent, CREATE_CUSTOM_EVENT],
    [actions.createCustomEventSuccess, CREATE_CUSTOM_EVENT_SUCCESS],
    [actions.createCustomEventError, CREATE_CUSTOM_EVENT_ERROR],
    [actions.editFileSegment, EDIT_FILE_SEGMENT],
    [actions.editFileSegmentSuccess, EDIT_FILE_SEGMENT_SUCCESS],
    [actions.editFileSegmentError, EDIT_FILE_SEGMENT_ERROR],
    [actions.saveAppliedFiltersInAllSegment, PERSIST_APPLIED_FILTERS_ALL_SEG],
    [
      actions.segmentUserExportBySegmentFilterId,
      SEGMENT_USER_EXPORT_BY_SEGMENT_ID,
    ],
    [
      actions.segmentUserExportBySegmentFilterIdSuccess,
      SEGMENT_USER_EXPORT_BY_SEGMENT_ID_SUCCESS,
    ],
    [actions.updateSegment, SEGMENT_UPDATE],
    [actions.updateSegmentSuccess, SEGMENT_UPDATE_SUCCESS],
    [actions.updateSegmentError, SEGMENT_UPDATE_ERROR],
    [actions.useThisVersion, USE_THIS_VERSION],
    [actions.useThisVersionSuccess, USE_THIS_VERSION_SUCCESS],
    [actions.useThisVersionError, USE_THIS_VERSION_ERROR],
  ])('should create %p action', (actionCreator, expectedType) => {
    expect(actionCreator(item)).toEqual({
      type: expectedType,
      payload: item,
    });
  });

  it.each([
    [actions.getQueryList, GET_QUERY_LIST],
    [actions.userCountFilterSegmentReset, USER_COUNT_FILTER_RESET],
    [actions.cleanReRunQuery, SEGMENT_QUERY_CLEANUP],
    [actions.getuserEventsList, GET_USER_EVENTS_LIST],
  ])('should create %p action', (actionCreator, expectedType) => {
    expect(actionCreator()).toEqual({
      type: expectedType,
    });
  });

  it.each([[actions.userCountFilter, USER_COUNT_FILTER]])(
    'should create %p action',
    (actionCreator, expectedType) => {
      expect(actionCreator()).toEqual({
        type: expectedType,
        payload: {
          callback: undefined,
          payload: undefined,
        },
      });
    }
  );
});
