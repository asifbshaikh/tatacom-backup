import {
  SETTINGS_EMAIL_CHANNELS_ADD,
  SETTINGS_EMAIL_CHANNELS_ADD_SUCCESS,
  SETTINGS_EMAIL_CHANNELS_ADD_ERROR,
  SETTINGS_EMAIL_CHANNELS_ADD_CLEANUP,
  SETTINGS_EMAIL_CHANNELS_EDIT,
  SETTINGS_EMAIL_CHANNELS_EDIT_SUCCESS,
  SETTINGS_EMAIL_CHANNELS_EDIT_ERROR,
  SETTINGS_EMAIL_CHANNELS_REMOVE,
  SETTINGS_EMAIL_CHANNELS_REMOVE_SUCCESS,
  SETTINGS_EMAIL_CHANNELS_REMOVE_FAIL,
  SETTINGS_SMS_CHANNELS_GET,
  SETTINGS_SMS_CHANNELS_GET_SUCCESS,
  SETTINGS_SMS_CHANNELS_ADD,
  SETTINGS_SMS_CHANNELS_ADD_REMOVE,
  SETTINGS_SMS_CHANNELS_ADD_REMOVE_SUCCESS,
  SETTINGS_SMS_CHANNELS_ADD_REMOVE_FAIL,
  SETTINGS_SMS_CHANNELS_RESET,
  SETTINGS_SMS_CHANNELS_ADD_SUCCESS,
  SETTINGS_SMS_CHANNELS_ADD_CLEANUP,
  SETTINGS_CHANNELS_FC_CONFIG_ADD_SUCCESS,
  SETTINGS_CHANNELS_FC_CONFIG_ADD,
  SETTINGS_CHANNELS_FC_CONFIG_ADD_CLEAN,
  SETTINGS_CHANNELS_FC_CONFIG_ADD_ERROR,
  SETTINGS_CHANNELS_DND_CONFIG_ADD_ERROR,
  SETTINGS_CHANNELS_DND_CONFIG_ADD_CLEAN,
  SETTINGS_CHANNELS_DND_CONFIG_ADD_SUCCESS,
  SETTINGS_CHANNELS_DND_CONFIG_ADD,
  SETTINGS_CHANNELS_FC_GET_SUCCESS,
  SETTINGS_CHANNELS_FC_GET,
  SETTINGS_CHANNELS_DND_GET,
  SETTINGS_CHANNELS_DND_GET_SUCCESS,
  SETTINGS_SMS_CHANNELS_EDIT,
  SETTINGS_SMS_CHANNELS_EDIT_SUCCESS,
  SETTINGS_SMS_CHANNELS_ADD_ERROR,
  SETTINGS_WHATSAPP_CHANNELS_ADD,
  SETTINGS_WHATSAPP_CHANNELS_ADD_SUCCESS,
  SETTINGS_WHATSAPP_CHANNELS_ADD_ERROR,
  SETTINGS_WHATSAPP_CHANNELS_ADD_CLEANUP,
  SETTINGS_WHATSAPP_CHANNELS_GET,
  SETTINGS_WHATSAPP_CHANNELS_GET_SUCCESS,
  SETTINGS_WHATSAPP_CHANNELS_REMOVE_SUCCESS,
  SETTINGS_WHATSAPP_CHANNELS_REMOVE,
  SETTINGS_WHATSAPP_CHANNELS_REMOVE_ERROR,
  SETTINGS_WHATSAPP_CHANNELS_EDIT_SUCCESS,
  SETTINGS_WHATSAPP_CHANNELS_EDIT,
  COUNTRY_LIST_GET_SUCCESS,
  COUNTRY_LIST_GET,
  EMAIL_GENERAL_SETTINGS_ADD,
  EMAIL_GENERAL_SETTINGS_ADD_SUCCESS,
  EMAIL_GENERAL_SETTINGS_ADD_CLEAN,
  EMAIL_GENERAL_SETTINGS_ADD_ERROR,
  EMAIL_GENERAL_SETTINGS_GET,
  EMAIL_GENERAL_SETTINGS_GET_SUCCESS,
  EMAIL_GENERAL_SETTINGS_GET_CLEAN,
  SETTINGS_EMAIL_CHANNELS_GET,
  SETTINGS_EMAIL_CHANNELS_GET_SUCCESS,
  GET_INBOX_LIST,
  GET_INBOX_LIST_SUCCESS,
  GET_MOBILE_PUSH_CONFIGURATION,
  GET_MOBILE_PUSH_CONFIGURATION_SUCCESS,
  ADD_MOBILE_PUSH_CONFIGURATION,
  ADD_MOBILE_PUSH_CONFIGURATION_SUCCESS,
  MOBILE_PUSH_CONFIGURATION_CLEANUP,
  MOBILE_PUSH_CONFIGURATION_ADD_ERROR,
} from 'redux/constants';

const INIT_STATE = {
  tataSMSConnectors: [],
  tataEmailConnectors: [],
  tataWhatsAppConnectors: [],
  successAdd: false,
  successRemove: false,
  removeFail: false,
  errorAdd: {},
  loadingAdd: false,
  errorWAAdd: {},
  successWAAdd: false,
  loadingWAAdd: false,
  successWARemove: false,
  removeWAFail: {},

  addFCResponse: {},
  successFCAdd: false,
  errorFCAdd: {},
  loadingFCAdd: false,
  freqCappingList: {},

  addDnDResponse: {},
  successDnDAdd: false,
  errorDnDAdd: {},
  loadingDnDAdd: false,
  doNotDistList: {},
  countryList: [],

  addSettingsResponse: {},
  addSuccess: false,
  generalSettingsList: {},
  mobilePushConfiguration: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SETTINGS_SMS_CHANNELS_GET:
      return { ...state };

    case SETTINGS_SMS_CHANNELS_GET_SUCCESS:
      return {
        ...state,
        tataSMSConnectors: action.payload,
      };

    case SETTINGS_SMS_CHANNELS_ADD:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: true };

    case SETTINGS_SMS_CHANNELS_ADD_SUCCESS:
      return {
        ...state,
        tataSMSConnectors: [...state.tataSMSConnectors, action.payload],
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case SETTINGS_SMS_CHANNELS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case SETTINGS_SMS_CHANNELS_EDIT:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: true };

    case SETTINGS_SMS_CHANNELS_EDIT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case SETTINGS_SMS_CHANNELS_ADD_CLEANUP:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
        successRemoveConnector: false,
        removeFail: false,
        successRemove: false,
      };

    case SETTINGS_SMS_CHANNELS_ADD_REMOVE:
      return {
        ...state,
        successRemove: false,
      };

    case SETTINGS_SMS_CHANNELS_ADD_REMOVE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const filteredData = state.tataSMSConnectors.filter(
        (item) => item.id !== action.payload.payload
      );
      return {
        ...state,
        successRemove: true,
        tataSMSConnectors: [...filteredData],
      };

    case SETTINGS_SMS_CHANNELS_ADD_REMOVE_FAIL:
      return { ...state, removeFail: true, errorMessaage: action?.payload };

    case SETTINGS_SMS_CHANNELS_RESET:
      return { ...state, loadingAdd: false, successAdd: false };

    // Email Reducer

    case SETTINGS_EMAIL_CHANNELS_GET:
      return { ...state };

    case SETTINGS_EMAIL_CHANNELS_GET_SUCCESS:
      return {
        ...state,
        tataEmailConnectors: action.payload,
      };

    case SETTINGS_EMAIL_CHANNELS_ADD:
      return {
        ...state,
        errorAdd: {},
        successEmailConnector: false,
        loadingAdd: true,
      };

    case SETTINGS_EMAIL_CHANNELS_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      return {
        ...state,
        tataEmailConnectors: [...state.tataEmailConnectors, action.payload],
        loaded: true,
        errorAdd: {},
        successEmailConnector: true,
        loadingAdd: false,
      };

    case SETTINGS_EMAIL_CHANNELS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successEmailConnector: false,
        loadingAdd: false,
      };

    case SETTINGS_EMAIL_CHANNELS_ADD_CLEANUP:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
        emailChannelRemove: false,
        successEmailConnector: false,
      };

    case SETTINGS_EMAIL_CHANNELS_EDIT:
      return {
        ...state,
        errorAdd: {},
        successEmailConnector: false,
        loadingAdd: true,
      };

    case SETTINGS_EMAIL_CHANNELS_EDIT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successEmailConnector: true,
        loadingAdd: false,
      };

    case SETTINGS_EMAIL_CHANNELS_EDIT_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successEmailConnector: false,
        loadingAdd: false,
      };

    case SETTINGS_EMAIL_CHANNELS_REMOVE:
      return {
        ...state,
        errorAdd: {},
        emailChannelRemove: false,
        loadingDelete: true,
        successEmailConnector: false,
      };

    case SETTINGS_EMAIL_CHANNELS_REMOVE_SUCCESS:
      return {
        ...state,
        errorAdd: {},
        emailChannelRemove: true,
        loadingDelete: false,
      };
    case SETTINGS_EMAIL_CHANNELS_REMOVE_FAIL:
      return {
        ...state,
        errorAdd: action.payload,
        emailChannelRemove: false,
        loadingDelete: false,
      };

    case EMAIL_GENERAL_SETTINGS_ADD:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: true };

    case EMAIL_GENERAL_SETTINGS_ADD_SUCCESS:
      return {
        ...state,
        addSettingsResponse: action.payload,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };
    case EMAIL_GENERAL_SETTINGS_ADD_CLEAN:
      return {
        ...state,
        errorAdd: {},
        addSettingsResponse: {},
        successAdd: false,
        loadingAdd: false,
      };

    case EMAIL_GENERAL_SETTINGS_ADD_ERROR:
      return {
        ...state,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case EMAIL_GENERAL_SETTINGS_GET:
      return { ...state };

    case EMAIL_GENERAL_SETTINGS_GET_SUCCESS:
      return { ...state, generalSettingsList: action.payload.data };

    case EMAIL_GENERAL_SETTINGS_GET_CLEAN:
      return { ...state, generalSettingsList: {} };

    case GET_INBOX_LIST:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: true };

    case GET_INBOX_LIST_SUCCESS:
      return {
        ...state,
        loadingAdd: false,
        allInboxList: action.payload.payload,
      };

    // FC Reducer
    case SETTINGS_CHANNELS_FC_CONFIG_ADD:
      return {
        ...state,
        errorFCAdd: {},
        successFCAdd: false,
        loadingFCAdd: true,
      };
    case SETTINGS_CHANNELS_FC_CONFIG_ADD_SUCCESS:
      return {
        ...state,
        addFCResponse: action.payload,
        errorFCAdd: {},
        successFCAdd: true,
        loadingFCAdd: false,
      };

    case SETTINGS_CHANNELS_FC_CONFIG_ADD_CLEAN:
      return {
        ...state,
        errorFCAdd: {},
        successFCAdd: false,
        loadingFCAdd: false,
      };

    case SETTINGS_CHANNELS_FC_CONFIG_ADD_ERROR:
      return {
        ...state,
        errorFCAdd: action.payload,
        successFCAdd: false,
        loadingFCAdd: false,
      };

    case SETTINGS_CHANNELS_FC_GET:
      return { ...state };

    case SETTINGS_CHANNELS_FC_GET_SUCCESS:
      return { ...state, freqCappingList: action.payload?.fc_dnd_setting };

    // DnD Reducer
    case SETTINGS_CHANNELS_DND_CONFIG_ADD:
      return {
        ...state,
        errorDnDAdd: {},
        successDnDAdd: false,
        loadingDnDAdd: true,
      };

    case SETTINGS_CHANNELS_DND_CONFIG_ADD_SUCCESS:
      return {
        ...state,
        addDnDResponse: action.payload,
        errorDnDAdd: {},
        successDnDAdd: true,
        loadingDnDAdd: false,
      };
    case SETTINGS_CHANNELS_DND_CONFIG_ADD_CLEAN:
      return {
        ...state,
        errorDnDAdd: {},
        successDnDAdd: false,
        loadingDnDAdd: false,
      };

    case SETTINGS_CHANNELS_DND_CONFIG_ADD_ERROR:
      return {
        ...state,
        errorDnDAdd: action.payload,
        successDnDAdd: false,
        loadingDnDAdd: false,
      };

    case SETTINGS_CHANNELS_DND_GET:
      return { ...state, loadingDnDAdd: true };

    case SETTINGS_CHANNELS_DND_GET_SUCCESS:
      return {
        ...state,
        doNotDistList: action.payload?.fc_dnd_setting,
        loadingDnDAdd: false,
      };

    //  WhatsApp States
    case SETTINGS_WHATSAPP_CHANNELS_ADD:
      return {
        ...state,
        errorWAAdd: {},
        successWAAdd: false,
        loadingWAAdd: true,
      };

    case SETTINGS_WHATSAPP_CHANNELS_ADD_SUCCESS:
      return {
        ...state,
        tataWhatsAppConnectors: [
          ...state.tataWhatsAppConnectors,
          action.payload,
        ],
        loaded: true,
        errorWAAdd: {},
        successWAAdd: true,
        loadingWAAdd: false,
      };

    case SETTINGS_WHATSAPP_CHANNELS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorWAAdd: action.payload,
        successWAAdd: false,
        loadingWAAdd: false,
      };

    case SETTINGS_WHATSAPP_CHANNELS_ADD_CLEANUP:
      return {
        ...state,
        loaded: true,
        errorWAAdd: {},
        successWAAdd: false,
        loadingWAAdd: false,
      };

    case SETTINGS_WHATSAPP_CHANNELS_GET:
      return { ...state };

    case SETTINGS_WHATSAPP_CHANNELS_GET_SUCCESS:
      return {
        ...state,
        tataWhatsAppConnectors: action.payload,
      };

    case SETTINGS_WHATSAPP_CHANNELS_REMOVE:
      return {
        ...state,
        successWARemove: false,
      };

    case SETTINGS_WHATSAPP_CHANNELS_REMOVE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const filteredWAData = state.tataWhatsAppConnectors.filter(
        (item) => item.id !== action.payload.payload
      );
      return {
        ...state,
        successWARemove: true,
        tataWhatsAppConnectors: [...filteredWAData],
      };

    case SETTINGS_WHATSAPP_CHANNELS_REMOVE_ERROR:
      return { ...state, removeWAFail: action.payload };

    case SETTINGS_WHATSAPP_CHANNELS_EDIT:
      return {
        ...state,
        errorWAAdd: {},
        successWAAdd: false,
        loadingWAAdd: true,
      };

    case SETTINGS_WHATSAPP_CHANNELS_EDIT_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorWAAdd: {},
        successWAAdd: true,
        loadingWAAdd: false,
      };

    case COUNTRY_LIST_GET:
      return { ...state };

    case COUNTRY_LIST_GET_SUCCESS:
      return { ...state, countryList: action.payload };

    // MOBILE PUSH CONFIGURATION

    case GET_MOBILE_PUSH_CONFIGURATION:
      return { ...state };

    case GET_MOBILE_PUSH_CONFIGURATION_SUCCESS:
      return { ...state, mobilePushConfiguration: action.payload };

    case ADD_MOBILE_PUSH_CONFIGURATION:
      return { ...state, loading: true, addSuccess: false };

    case ADD_MOBILE_PUSH_CONFIGURATION_SUCCESS:
      return {
        ...state,
        mobilePushConfiguration: action.payload,
        loading: false,
        addSuccess: true,
      };

    case MOBILE_PUSH_CONFIGURATION_CLEANUP:
      return {
        addSuccess: false,
        failSuccess: false,
      };

    case MOBILE_PUSH_CONFIGURATION_ADD_ERROR:
      return {
        failSuccess: action.payload,
      };
    default:
      return { ...state };
  }
};
