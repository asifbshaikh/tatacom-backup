import { getCurrentUser } from 'helpers/Utils';
import { isAuthGuardActive, currentUser } from 'constants/defaultValues';
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  REGISTER_USER_CLEAN,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  FORGOT_PASSWORD_CLEAN,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_CLEAN,
  VALIDITY_CHECK,
  VALIDITY_CHECK_SUCCESS,
  VALIDITY_CHECK_ERROR,
  PROFILE_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_ERROR,
  PROFILE_UPDATE_CLEAN,
  PROFILE_AVATAR_DELETE,
  PROFILE_AVATAR_DELETE_SUCCESS,
  UPDATE_AVAILABILITY,
  UPDATE_AVAILABILITY_SUCCESS,
  UPDATE_AVAILABILITY_ERROR,
  UPDATE_AVAILABILITY_CLEAN,
  NOTIFICATION_SETTINGS_GET,
  NOTIFICATION_SETTINGS_GET_SUCCESS,
  NOTIFICATION_SETTINGS_POST,
  NOTIFICATION_SETTINGS_POST_SUCCESS,
  NOTIFICATION_SETTINGS_POST_ERROR,
  NOTIFICATION_SETTINGS_POST_CLEAN,
  LOGOUT_SUCCESS_OR_FAILURE,
  SET_CURRENT_USER_AVAILABILITY,
} from 'redux/constants';

const INIT_STATE = {
  currentUser: isAuthGuardActive ? currentUser : getCurrentUser(),
  forgotUserMail: '',
  newPwdSuccessStatus: '',
  resetPasswordCode: '',
  loading: false,
  error: '',
  notificationSettings: {},
  registerUserInfo: '',
  successUpdateAvailibility: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        error: '',
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        currentUser: null,
        error: action.payload.message,
      };
    case FORGOT_PASSWORD:
      return { ...state, loading: true, error: '' };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        forgotUserMail: action.payload,
        error: '',
      };
    case FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        forgotUserMail: '',
        error: action.payload.message,
      };
    case FORGOT_PASSWORD_CLEAN:
      return {
        ...state,
        loading: false,
        forgotUserMail: '',
        error: '',
      };
    case RESET_PASSWORD:
      return { ...state, loading: true, error: '' };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        newPwdSuccessStatus: action.payload,
        resetPasswordCode: '',
        error: '',
      };
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        newPwdSuccessStatus: '',
        resetPasswordCode: '',
        error: action.payload.message,
      };
    case RESET_PASSWORD_CLEAN:
      return {
        ...state,
        loading: false,
        newPwdSuccessStatus: '',
        error: '',
      };
    case REGISTER_USER:
      return { ...state, loading: true, error: '' };
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        registerUserInfo: action.payload,
        error: '',
      };
    case REGISTER_USER_ERROR:
      return {
        ...state,
        loading: false,
        registerUserInfo: null,
        error: action.payload.message,
      };
    case REGISTER_USER_CLEAN:
      return {
        ...state,
        loading: false,
        registerUserInfo: null,
        error: '',
      };
    case LOGOUT_USER:
      return { ...state, currentUser: null, error: '' };

    case VALIDITY_CHECK:
      return { ...state, loading: true, error: '' };
    case VALIDITY_CHECK_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        error: '',
      };
    case VALIDITY_CHECK_ERROR:
      return {
        ...state,
        loading: false,
        currentUser: null,
        error: action.payload.message,
      };

    case PROFILE_UPDATE:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: true,
      };

    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: true,
        loadingUpdate: false,
        currentUser: action.payload,
      };

    case PROFILE_UPDATE_ERROR:
      return {
        ...state,
        errorUpdate: action.payload,
        successUpdate: false,
        loadingUpdate: false,
      };

    case PROFILE_UPDATE_CLEAN:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: false,
      };

    case PROFILE_AVATAR_DELETE:
      return state;

    case PROFILE_AVATAR_DELETE_SUCCESS:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: true,
        loadingUpdate: false,
        currentUser: { ...state.currentUser, avatar_url: '' },
      };

    case UPDATE_AVAILABILITY:
      return {
        ...state,
        errorUpdate: {},
        successUpdateAvailibility: false,
        loadingUpdate: true,
      };

    case UPDATE_AVAILABILITY_SUCCESS:
      return {
        ...state,
        errorUpdate: {},
        successUpdateAvailibility: true,
        loadingUpdate: false,
        currentUser: action.payload,
      };

    case UPDATE_AVAILABILITY_ERROR:
      return {
        ...state,
        errorUpdate: action.payload,
        successUpdateAvailibility: false,
        loadingUpdate: false,
      };

    case UPDATE_AVAILABILITY_CLEAN:
      return {
        ...state,
        errorUpdate: {},
        successUpdateAvailibility: false,
        loadingUpdate: false,
      };

    case NOTIFICATION_SETTINGS_GET:
      return state;
    case NOTIFICATION_SETTINGS_GET_SUCCESS:
      return { ...state, notificationSettings: action.payload };

    case NOTIFICATION_SETTINGS_POST:
      return {
        ...state,
        errorNotificationSetting: {},
        successNotificationSetting: false,
        loadingNotificationSetting: true,
      };
    case NOTIFICATION_SETTINGS_POST_SUCCESS:
      return {
        ...state,
        errorNotificationSetting: {},
        successNotificationSetting: true,
        loadingNotificationSetting: false,
        notificationSettings: action.payload,
      };
    case NOTIFICATION_SETTINGS_POST_ERROR:
      return {
        ...state,
        errorNotificationSetting: action.payload,
        successNotificationSetting: false,
        loadingNotificationSetting: false,
      };
    case NOTIFICATION_SETTINGS_POST_CLEAN:
      return {
        ...state,
        errorNotificationSetting: {},
        successNotificationSetting: false,
        loadingNotificationSetting: false,
      };
    case LOGOUT_SUCCESS_OR_FAILURE:
      return {
        ...state,
        logoutSuccess: action.payload,
      };
    case SET_CURRENT_USER_AVAILABILITY:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          availability: action.payload[state.currentUser?.id],
        },
      };
    default:
      return { ...state };
  }
};
