import {
  CREATE_CONTROL_GROUPS,
  CREATE_CONTROL_GROUPS_SUCCESS,
  CREATE_CONTROL_GROUPS_FAILURE,
  CREATE_CONTROL_GROUPS_SUCCESS_RESET,
  DELETE_CONTROL_GROUPS_SUCCESS,
  DELETE_CONTROL_GROUPS_SUCCESS_RESET,
  GET_CONTROL_GROUPS_SUCCESS,
  DOWNLOAD_CONTROL_GROUPS_SUCCESS,
  DOWNLOAD_CONTROL_GROUPS_RESET,
} from 'redux/constants';

const INIT_STATE = {
  controlGroups: [],
  controlGroupsSuccess: false,
  controlGroupsFailure: false,
  controlGroupsError: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CREATE_CONTROL_GROUPS:
      return { ...state };

    case GET_CONTROL_GROUPS_SUCCESS:
      return {
        ...state,
        controlGroups: [...action.payload],
        controlGroupsSuccess: false,
      };

    case CREATE_CONTROL_GROUPS_SUCCESS:
      return {
        ...state,
        controlGroups: action.payload,
        controlGroupsSuccess: true,
      };

    case CREATE_CONTROL_GROUPS_FAILURE:
      return {
        ...state,
        controlGroupsFailure: true,
        controlGroupsError: action.payload,
      };

    case CREATE_CONTROL_GROUPS_SUCCESS_RESET:
      return {
        ...state,
        controlGroupsSuccess: false,
      };

    case DELETE_CONTROL_GROUPS_SUCCESS:
      return {
        ...state,
        deleteControlGroupsSuccess: true,
        deleteErrorMsg: '',
      };

    case DELETE_CONTROL_GROUPS_SUCCESS_RESET:
      return {
        ...state,
        deleteControlGroupsSuccess: false,
        deleteErrorMsg: action.payload,
      };

    case DOWNLOAD_CONTROL_GROUPS_SUCCESS:
      return {
        ...state,
        downloadControlGroupsSuccess: true,
        errorMsg: '',
      };

    case DOWNLOAD_CONTROL_GROUPS_RESET:
      return {
        ...state,
        downloadControlGroupsSuccess: false,
        errorMsg: action.payload,
      };

    default:
      return { ...state };
  }
};
