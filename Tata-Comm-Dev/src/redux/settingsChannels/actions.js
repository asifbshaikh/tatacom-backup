import {
  SETTINGS_SMS_CHANNELS_GET,
  SETTINGS_SMS_CHANNELS_GET_SUCCESS,
  SETTINGS_SMS_CHANNELS_ADD_SUCCESS,
  SETTINGS_SMS_CHANNELS_ADD_ERROR,
  SETTINGS_SMS_CHANNELS_ADD,
  SETTINGS_SMS_CHANNELS_ADD_REMOVE_FAIL,
  SETTINGS_SMS_CHANNELS_ADD_REMOVE,
  SETTINGS_SMS_CHANNELS_ADD_REMOVE_SUCCESS,
  SETTINGS_SMS_CHANNELS_RESET,
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
  SETTINGS_WHATSAPP_CHANNELS_GET,
  SETTINGS_WHATSAPP_CHANNELS_ADD,
  SETTINGS_WHATSAPP_CHANNELS_ADD_SUCCESS,
  SETTINGS_WHATSAPP_CHANNELS_ADD_ERROR,
  SETTINGS_WHATSAPP_CHANNELS_ADD_CLEANUP,
  SETTINGS_WHATSAPP_CHANNELS_GET_SUCCESS,
  SETTINGS_WHATSAPP_CHANNELS_REMOVE,
  SETTINGS_WHATSAPP_CHANNELS_REMOVE_SUCCESS,
  SETTINGS_WHATSAPP_CHANNELS_REMOVE_ERROR,
  SETTINGS_WHATSAPP_CHANNELS_EDIT,
  SETTINGS_WHATSAPP_CHANNELS_EDIT_SUCCESS,
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
  ADD_MOBILE_PUSH_CONFIGURATION_SUCCESS,
  ADD_MOBILE_PUSH_CONFIGURATION,
  GET_MOBILE_PUSH_CONFIGURATION_SUCCESS,
  MOBILE_PUSH_CONFIGURATION_CLEANUP,
  MOBILE_PUSH_CONFIGURATION_ADD_ERROR,
} from 'redux/constants';

export const getSettingsSMSConnectorList = (userId) => ({
  type: SETTINGS_SMS_CHANNELS_GET,
  payload: userId,
});

export const getSettingsSMSSuccess = (items) => ({
  type: SETTINGS_SMS_CHANNELS_GET_SUCCESS,
  payload: items,
});

export const addChannelConnector = (userId) => ({
  type: SETTINGS_SMS_CHANNELS_ADD,
  payload: userId,
});

export const addChannelConnectorSuccess = (items) => ({
  type: SETTINGS_SMS_CHANNELS_ADD_SUCCESS,
  payload: items,
});

export const addChannelConnectorError = (error) => ({
  type: SETTINGS_SMS_CHANNELS_ADD_ERROR,
  payload: error,
});
export const addChannelConnectorClean = (error) => ({
  type: SETTINGS_SMS_CHANNELS_ADD_CLEANUP,
  payload: error,
});

export const removeChannelConnector = (data) => ({
  type: SETTINGS_SMS_CHANNELS_ADD_REMOVE,
  payload: data,
});

export const removeChannelConnectorSuccess = (data) => ({
  type: SETTINGS_SMS_CHANNELS_ADD_REMOVE_SUCCESS,
  payload: data,
});

export const removeChannelConnectorFail = (error) => ({
  type: SETTINGS_SMS_CHANNELS_ADD_REMOVE_FAIL,
  payload: error,
});

export const resetSmSChannelStates = () => ({
  type: SETTINGS_SMS_CHANNELS_RESET,
  payload: null,
});

export const editChannelConnector = (userId) => ({
  type: SETTINGS_SMS_CHANNELS_EDIT,
  payload: userId,
});
export const editChannelConnectorSuccess = (items) => ({
  type: SETTINGS_SMS_CHANNELS_EDIT_SUCCESS,
  payload: items,
});

export const getEmailConnectorList = (items) => ({
  type: SETTINGS_EMAIL_CHANNELS_GET,
  payload: items,
});

export const getEmailConnectorListSuccess = (items) => ({
  type: SETTINGS_EMAIL_CHANNELS_GET_SUCCESS,
  payload: items,
});

export const addEmailConnector = (items) => ({
  type: SETTINGS_EMAIL_CHANNELS_ADD,
  payload: items,
});

export const addEmailConnectorSuccess = (items) => ({
  type: SETTINGS_EMAIL_CHANNELS_ADD_SUCCESS,
  payload: items,
});

export const addEmailConnectorError = (error) => ({
  type: SETTINGS_EMAIL_CHANNELS_ADD_ERROR,
  payload: error,
});

export const addEmailConnectorClean = (error) => ({
  type: SETTINGS_EMAIL_CHANNELS_ADD_CLEANUP,
  payload: error,
});

export const editEmailConnector = (items) => ({
  type: SETTINGS_EMAIL_CHANNELS_EDIT,
  payload: items,
});
export const editEmailConnectorSuccess = (items) => ({
  type: SETTINGS_EMAIL_CHANNELS_EDIT_SUCCESS,
  payload: items,
});

export const editEmailConnectorError = (error) => ({
  type: SETTINGS_EMAIL_CHANNELS_EDIT_ERROR,
  payload: error,
});

export const removeEmailConnector = (data) => ({
  type: SETTINGS_EMAIL_CHANNELS_REMOVE,
  payload: data,
});

export const removeEmailConnectorSuccess = (data) => ({
  type: SETTINGS_EMAIL_CHANNELS_REMOVE_SUCCESS,
  payload: data,
});

export const removeEmailConnectorFail = (error) => ({
  type: SETTINGS_EMAIL_CHANNELS_REMOVE_FAIL,
  payload: error,
});

export const addEmailGeneralSettings = (data) => ({
  type: EMAIL_GENERAL_SETTINGS_ADD,
  payload: data,
});

export const addEmailGeneralSettingsSuccess = (res) => ({
  type: EMAIL_GENERAL_SETTINGS_ADD_SUCCESS,
  payload: res,
});

export const addEmailGeneralSettingsClean = (res) => ({
  type: EMAIL_GENERAL_SETTINGS_ADD_CLEAN,
  payload: res,
});

export const addEmailGeneralSettingsError = (err) => ({
  type: EMAIL_GENERAL_SETTINGS_ADD_ERROR,
  payload: err,
});

export const getEmailGeneralSettingsList = (userId) => ({
  type: EMAIL_GENERAL_SETTINGS_GET,
  payload: userId,
});

export const getEmailGeneralSettingsListSuccess = (items) => ({
  type: EMAIL_GENERAL_SETTINGS_GET_SUCCESS,
  payload: items,
});

export const cleanGetSettingsList = () => ({
  type: EMAIL_GENERAL_SETTINGS_GET_CLEAN,
});

export const getInboxList = (userId) => ({
  type: GET_INBOX_LIST,
  payload: userId,
});

export const getInboxListSuccess = (items) => ({
  type: GET_INBOX_LIST_SUCCESS,
  payload: items,
});

// FC actions
export const addFreqCappingConfig = (data) => ({
  type: SETTINGS_CHANNELS_FC_CONFIG_ADD,
  payload: data,
});

export const addFreqCappingConfigSuccess = (res) => ({
  type: SETTINGS_CHANNELS_FC_CONFIG_ADD_SUCCESS,
  payload: res,
});

export const addFreqCappingConfigClean = (res) => ({
  type: SETTINGS_CHANNELS_FC_CONFIG_ADD_CLEAN,
  payload: res,
});

export const addFreqCappingConfigError = (err) => ({
  type: SETTINGS_CHANNELS_FC_CONFIG_ADD_ERROR,
  payload: err,
});

export const getSettingsFCList = (userId) => ({
  type: SETTINGS_CHANNELS_FC_GET,
  payload: userId,
});

export const getSettingsFCListSuccess = (items) => ({
  type: SETTINGS_CHANNELS_FC_GET_SUCCESS,
  payload: items,
});

// DnD Actions
export const addDnDConfig = (data) => ({
  type: SETTINGS_CHANNELS_DND_CONFIG_ADD,
  payload: data,
});

export const addDnDConfigSuccess = (res) => ({
  type: SETTINGS_CHANNELS_DND_CONFIG_ADD_SUCCESS,
  payload: res,
});

export const addDnDConfigClean = (res) => ({
  type: SETTINGS_CHANNELS_DND_CONFIG_ADD_CLEAN,
  payload: res,
});

export const addDnDConfigError = (err) => ({
  type: SETTINGS_CHANNELS_DND_CONFIG_ADD_ERROR,
  payload: err,
});

export const getSettingsDnDList = (userId) => ({
  type: SETTINGS_CHANNELS_DND_GET,
  payload: userId,
});

export const getSettingsDnDListSuccess = (items) => ({
  type: SETTINGS_CHANNELS_DND_GET_SUCCESS,
  payload: items,
});

// whatsApp Actions

export const getSettingsWhatsAppConnectorList = (userId) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_GET,
  payload: userId,
});

export const getSettingsWhatsAppConnectorListSuccess = (userId) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_GET_SUCCESS,
  payload: userId,
});

export const addWhatsAppChannelConnector = (userId) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_ADD,
  payload: userId,
});

export const addWhatsAppChannelConnectorSuccess = (items) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_ADD_SUCCESS,
  payload: items,
});

export const addWhatsAppChannelConnectorError = (error) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_ADD_ERROR,
  payload: error,
});

export const addWhatsAppChannelConnectorClean = (error) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_ADD_CLEANUP,
  payload: error,
});

export const removeWhatsAppChannelConnector = (error) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_REMOVE,
  payload: error,
});

export const removeWhatsAppChannelConnectorSuccess = (error) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_REMOVE_SUCCESS,
  payload: error,
});

export const removeWhatsAppChannelConnectorError = (error) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_REMOVE_ERROR,
  payload: error,
});

export const editWhatsAppChannelConnector = (error) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_EDIT,
  payload: error,
});

export const editWhatsAppChannelConnectorSuccess = (error) => ({
  type: SETTINGS_WHATSAPP_CHANNELS_EDIT_SUCCESS,
  payload: error,
});

export const getCountryDropdownList = (userId) => ({
  type: COUNTRY_LIST_GET,
  payload: userId,
});

export const getCountryDropdownListSuccess = (items) => ({
  type: COUNTRY_LIST_GET_SUCCESS,
  payload: items,
});

export const getMobilePushConfiguration = () => ({
  type: GET_MOBILE_PUSH_CONFIGURATION,
  payload: null,
});

export const getMobilePushConfigurationSuccess = (items) => ({
  type: GET_MOBILE_PUSH_CONFIGURATION_SUCCESS,
  payload: items,
});

export const addMobilePushConfiguration = (payload) => ({
  type: ADD_MOBILE_PUSH_CONFIGURATION,
  payload,
});

export const addMobilePushConfigurationSuccess = (items) => ({
  type: ADD_MOBILE_PUSH_CONFIGURATION_SUCCESS,
  payload: items,
});

export const addMobilePushConfigurationFail = (errorMessage) => ({
  type: MOBILE_PUSH_CONFIGURATION_ADD_ERROR,
  payload: errorMessage,
});

export const cleanMobilePushConfiguration = () => ({
  type: MOBILE_PUSH_CONFIGURATION_CLEANUP,
});
