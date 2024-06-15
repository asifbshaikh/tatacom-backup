import reducer from 'redux/settingsChannels/reducer';
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
} from 'redux/constants';
import { describe, expect, it } from '@jest/globals';

describe('DB Import Reducer', () => {
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
    generalSettingsList: {},
  };

  const createAction = (type, payload) => ({ type, payload });

  it.each([
    [SETTINGS_SMS_CHANNELS_GET, {}],
    [
      SETTINGS_SMS_CHANNELS_ADD_ERROR,
      {
        loaded: true,
        successAdd: false,
        loadingAdd: false,
      },
    ],
    [
      SETTINGS_SMS_CHANNELS_EDIT,
      {
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      },
    ],
    [
      SETTINGS_SMS_CHANNELS_EDIT_SUCCESS,
      { loaded: true, errorAdd: {}, successAdd: true, loadingAdd: false },
    ],
    [
      SETTINGS_SMS_CHANNELS_ADD_CLEANUP,
      {
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
        successRemoveConnector: false,
        removeFail: false,
        successRemove: false,
      },
    ],

    [SETTINGS_SMS_CHANNELS_ADD_REMOVE, { successRemove: false }],
    [SETTINGS_SMS_CHANNELS_ADD_REMOVE_SUCCESS, { successRemove: true }],
    [
      SETTINGS_SMS_CHANNELS_ADD_REMOVE_FAIL,
      { removeFail: true, errorMessaage: {} },
    ],
    [SETTINGS_SMS_CHANNELS_RESET, { loadingAdd: false, successAdd: false }],
    [SETTINGS_EMAIL_CHANNELS_GET, {}],
    [
      SETTINGS_EMAIL_CHANNELS_ADD,
      { errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_ADD_SUCCESS,
      {
        loaded: true,
        errorAdd: {},
        tataEmailConnectors: [{}],
        successAdd: true,
        loadingAdd: false,
      },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_ADD_ERROR,
      { loaded: true, successAdd: false, loadingAdd: false },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_ADD_CLEANUP,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_EDIT,
      { errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_EDIT_SUCCESS,
      { loaded: true, errorAdd: {}, successAdd: true, loadingAdd: false },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_EDIT_ERROR,
      {
        loaded: true,
        successAdd: false,
        loadingAdd: false,
      },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_REMOVE,
      { errorAdd: {}, successAdd: false, loadingDelete: true },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_REMOVE_SUCCESS,
      { errorAdd: {}, successAdd: true, loadingDelete: false },
    ],
    [
      SETTINGS_EMAIL_CHANNELS_REMOVE_FAIL,
      {
        successAdd: false,
        loadingDelete: false,
      },
    ],
    [
      EMAIL_GENERAL_SETTINGS_ADD,
      { errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      EMAIL_GENERAL_SETTINGS_ADD_SUCCESS,
      {
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      },
    ],
    [
      EMAIL_GENERAL_SETTINGS_ADD_CLEAN,
      {
        errorAdd: {},
        addSettingsResponse: {},
        successAdd: false,
        loadingAdd: false,
      },
    ],
    [
      EMAIL_GENERAL_SETTINGS_ADD_ERROR,
      { successAdd: false, loadingAdd: false },
    ],
    [EMAIL_GENERAL_SETTINGS_GET, {}],

    [EMAIL_GENERAL_SETTINGS_GET_CLEAN, {}],
    [
      SETTINGS_CHANNELS_FC_CONFIG_ADD,
      { errorFCAdd: {}, successFCAdd: false, loadingFCAdd: true },
    ],
    [
      SETTINGS_CHANNELS_FC_CONFIG_ADD_SUCCESS,
      {
        errorFCAdd: {},
        successFCAdd: true,
        loadingFCAdd: false,
      },
    ],
    [
      SETTINGS_CHANNELS_FC_CONFIG_ADD_CLEAN,
      { errorFCAdd: {}, successFCAdd: false, loadingFCAdd: false },
    ],
    [
      SETTINGS_CHANNELS_FC_CONFIG_ADD_ERROR,
      { successFCAdd: false, loadingFCAdd: false },
    ],
    [
      SETTINGS_CHANNELS_DND_CONFIG_ADD,
      { errorDnDAdd: {}, successDnDAdd: false, loadingDnDAdd: true },
    ],
    [
      SETTINGS_CHANNELS_DND_CONFIG_ADD_SUCCESS,
      { errorDnDAdd: {}, successDnDAdd: true, loadingDnDAdd: false },
    ],
    [
      SETTINGS_CHANNELS_DND_CONFIG_ADD_CLEAN,
      { errorDnDAdd: {}, successDnDAdd: false, loadingDnDAdd: false },
    ],
    [
      SETTINGS_CHANNELS_DND_CONFIG_ADD_ERROR,
      { successDnDAdd: false, loadingDnDAdd: false },
    ],
    [SETTINGS_CHANNELS_DND_GET, { loadingDnDAdd: true }],
    [
      SETTINGS_WHATSAPP_CHANNELS_ADD,
      { errorWAAdd: {}, successWAAdd: false, loadingWAAdd: true },
    ],
    [
      SETTINGS_WHATSAPP_CHANNELS_ADD_SUCCESS,
      {
        tataWhatsAppConnectors: [{}],
        loaded: true,
        errorWAAdd: {},
        successWAAdd: true,
        loadingWAAdd: false,
      },
    ],
    [
      SETTINGS_WHATSAPP_CHANNELS_ADD_ERROR,
      { loaded: true, successWAAdd: false, loadingWAAdd: false },
    ],
    [
      SETTINGS_WHATSAPP_CHANNELS_ADD_CLEANUP,
      {
        loaded: true,
        errorWAAdd: {},
        successWAAdd: false,
        loadingWAAdd: false,
      },
    ],
    [SETTINGS_WHATSAPP_CHANNELS_GET, {}],
    [SETTINGS_WHATSAPP_CHANNELS_REMOVE, { successWARemove: false }],
    [
      SETTINGS_WHATSAPP_CHANNELS_REMOVE_SUCCESS,
      { successWARemove: true, tataWhatsAppConnectors: [] },
    ],
    [SETTINGS_WHATSAPP_CHANNELS_REMOVE_ERROR, {}],
    [
      SETTINGS_WHATSAPP_CHANNELS_EDIT,
      { errorWAAdd: {}, successWAAdd: false, loadingWAAdd: true },
    ],
    [
      SETTINGS_WHATSAPP_CHANNELS_EDIT_SUCCESS,
      { loaded: true, errorWAAdd: {}, successWAAdd: true, loadingWAAdd: false },
    ],
    [COUNTRY_LIST_GET, {}],
    [COUNTRY_LIST_GET_SUCCESS, { countryList: {} }],
  ])('should handle %p', (actionType, expectedState) => {
    const action = createAction(actionType, {});
    expect(reducer(INIT_STATE, action)).toEqual({
      ...INIT_STATE,
      ...expectedState,
    });
  });
});
