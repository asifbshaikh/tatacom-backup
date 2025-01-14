import reducer from 'redux/campaigns/reducer';
import {
  CAMPAIGNS_GET,
  CAMPAIGNS_GET_SUCCESS,
  CAMPAIGNS_DELETE,
  CAMPAIGNS_DELETE_SUCCESS,
  CAMPAIGNS_DELETE_ERROR,
  CAMPAIGNS_DELETE_CLEAN,
  CAMPAIGNS_ADD,
  CAMPAIGNS_ADD_SUCCESS,
  CAMPAIGNS_ADD_ERROR,
  CAMPAIGNS_ADD_CLEAN,
  CAMPAIGNS_CREATE_TYPE_ADD,
  CAMPAIGNS_CREATE_ADD,
  CAMPAIGNS_CREATE_ADD_SUCCESS,
  CAMPAIGNS_CREATE_ADD_ERROR,
  CAMPAIGNS_CREATE_ADD_CLEAN,
  CLEAR_CAMPAIGN_ON_TYPE_CHANGE,
  CAMPAIGNS_CREATE_TYPE_ADD_SUCCESS,
  SMS_CAMAPAIGNS_TEMPLATES_GET_ALL,
  SMS_CAMAPAIGNS_TEMPLATES_GET_ALL_SUCCESS,
  SMS_CAMAPAIGN_TEMPLATE_DELETE,
  SMS_CAMAPAIGN_TEMPLATE_DELETE_SUCCESS,
  SMS_CAMAPAIGN_TEMPLATE_DELETE_ERROR,
  SMS_CAMAPAIGN_TEMPLATE_DELETE_CLEAN,
  SMS_CAMAPAIGN_TEMPLATE_ADD,
  SMS_CAMAPAIGN_TEMPLATE_ADD_SUCCESS,
  SMS_CAMAPAIGN_TEMPLATE_ADD_ERROR,
  SMS_CAMAPAIGN_TEMPLATE_ADD_CLEAN,
  SMS_CAMAPAIGN_TEMPLATE_UPDATE,
  SMS_CAMAPAIGN_TEMPLATE_UPDATE_SUCCESS,
  SMS_CAMAPAIGN_TEMPLATE_UPDATE_ERROR,
  SMS_CAMAPAIGN_TEMPLATE_UPDATE_CLEAN,
  SCHEDULE_SMS_CAMPAIGN,
  SCHEDULE_SMS_CAMPAIGN_SUCCESS,
  SCHEDULE_SMS_CAMPAIGN_ERROR,
  SCHEDULE_SMS_CAMPAIGN_CLEAN,
  SMS_CAMAPAIGN_TAGS,
  SMS_CAMAPAIGN_TAGS_SUCCESS,
  SMS_CAMAPAIGNS_GET_ALL_SENDER_ID,
  SMS_CAMAPAIGNS_GET_ALL_SENDER_ID_SUCCESS,
  SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID,
  SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_SUCCESS,
  SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_ERROR,
  SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID,
  SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID_SUCCESS,
  SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID_ERROR,
  SMS_CONTENT_GENERATE_TINY_URL,
  SMS_CONTENT_GENERATE_TINY_URL_SUCCESS,
  SMS_CONTENT_GENERATE_PERSONALIZED_MSG,
  SMS_CONTENT_GENERATE_PERSONALIZED_MSG_SUCCESS,
  SMS_CONTENT_GENERATE_PERSONALIZED_MSG_RESET,
  SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_CLEAN,
  TEST_SMS_CAMPAIGN,
  TEST_SMS_CAMPAIGN_SUCCESS,
  TEST_SMS_CAMPAIGN_ERROR,
  TEST_SMS_CAMPAIGN_CLEAN,
  TEST_EMAIL_CAMPAIGN,
  TEST_EMAIL_CAMPAIGN_SUCCESS,
  TEST_EMAIL_CAMPAIGN_ERROR,
  TEST_EMAIL_CAMPAIGN_CLEAN,
  GET_SMS_SEARCH_TEMPLATES,
  GET_SMS_SEARCH_TEMPLATES_SUCCESS,
  SMS_CAMPAIGN_SAVE_AS_DRAFT,
  SMS_CAMPAIGN_SAVE_AS_DRAFT_SUCCESS,
  SMS_CAMPAIGN_SAVE_AS_DRAFT_ERROR,
  SMS_CAMPAIGN_SAVE_AS_DRAFT_CLEAN,
  SMS_CAMPAIGN_UPDATE_STEP_INDEX,
  SMS_CAMPAIGN_NAME,
  FETCH_TEMPLATES_REQUEST,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATES_FAILURE,
  FETCH_EMAIL_TEMPLATES_REQUEST,
  FETCH_EMAIL_TEMPLATES_SUCCESS,
  FETCH_EMAIL_TEMPLATES_FAILURE,
  GET_EMAIL_ADDRESS,
  GET_EMAIL_ADDRESS_SUCCESS,
  SET_SUBJECT,
  SET_PREVIEW_TEXT,
  SET_EMAIL_CONNECTOR,
  SET_SENDER_NAME,
  SET_FROM_EMAIL_ADDRESS,
  SET_REPLY_TO_EMAIL_ADDRESS,
  SET_CC,
  SET_BCC,
  SET_FORM_EMAIL_CREATION,
  SET_EMAIL_TARGET_AUDIENCE,
  RESET_SUCCESS,
  ADD_EMAIL_TEMPLATE,
  ADD_EMAIL_TEMPLATE_SUCCESS,
  ADD_EMAIL_TEMPLATE_FAILURE,
  ADD_EMAIL_TEMPLATE_ERROR_RESET,
  EMAIL_TEMPLATE_ID,
  SET_DEFAULT_BTN,
  GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST,
  GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST_SUCCESS,
  GET_WHATSAPP_CAMPAIGN_DETAILED_TEMPLATES_LIST,
  TEST_WHATSAPP_CAMPAIGN,
  TEST_WHATSAPP_CAMPAIGN_SUCCESS,
  TEST_WHATSAPP_CAMPAIGN_ERROR,
  TEST_WHATSAPP_CAMPAIGN_CLEAN,
  SET_CAMPAIGN_INBOX_ID,
  CLEAN_SELECTED_EMAIL_TEMPLATE,
  GET_CAMPAIGN_INFO_BY_ID_SUCCESS,
  GET_CAMPAIGN_INFO_BY_ID,
} from 'redux/constants';
import { describe, expect, it } from '@jest/globals';

describe('DB Import Reducer', () => {
  const INIT_STATE = {
    loadedCampaigns: false,
    campaigns: [],
    createCampaign: {
      selectAudience: {},
      contentConfiguration: {},
      scheudleAndGoals: {},
    },
    smsCampaignTemplates: { totalCount: 0, templates: [] },
    campaignTags: [],
    senderIds: [],
    templateListBasedOnSenderId: [],
    convertedTinyUrls: [],
    convertedPersonalizedMsg: {},
    stepIndex: 0,
    saveAsDraftResponse: {},
    templates: [],
    loading: false,
    error: null,
    emailCampaignTemplates: { totalCount: 0, savedTemplates: [] },
    subject: '',
    previewText: '',
    emailConnector: '',
    senderName: '',
    fromEmailAddress: [],
    replyToEmailAddress: '',
    cc: '',
    bcc: '',
    emailAddress: [],
    formEmailCreation: {
      subject: '',
      emailConnector: '',
      senderName: '',
      fromEmailAddress: [],
      replyToEmailAddress: '',
      cc: '',
      bcc: '',
    },
    emailTemplate: null,
    emailTempId: null,
    templateListWABasedOnConnectorID: [],
    templateListWADetailedList: [],
    // WhatsApp Test Campaign
    errorTestWAAdd: {},
    successTestWAAdd: false,
    loadingTestWAAdd: false,
    inboxId: '',
    defaultBtn: true,
    campaignInfo: {},
    stepId: '',
  };

  const createAction = (type, payload) => ({ type, payload });

  it.each([
    [CAMPAIGNS_GET, { loadedCampaigns: true }],
    [
      CAMPAIGNS_DELETE,
      { errorDelete: {}, successDelete: false, loadingDelete: true },
    ],
    [
      CAMPAIGNS_DELETE_ERROR,
      { errorDelete: {}, successDelete: false, loadingDelete: false },
    ],
    [
      CAMPAIGNS_DELETE_CLEAN,
      { errorDelete: {}, successDelete: false, loadingDelete: false },
    ],
    [
      CAMPAIGNS_ADD,
      { loaded: false, errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      CAMPAIGNS_ADD_ERROR,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      CAMPAIGNS_ADD_CLEAN,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [SMS_CAMAPAIGNS_TEMPLATES_GET_ALL, { loadedCampaigns: true }],
    [
      SMS_CAMAPAIGN_TEMPLATE_DELETE,
      { errorDelete: {}, successDelete: false, loadingDelete: true },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_DELETE_SUCCESS,
      { errorDelete: {}, successDelete: true, loadingDelete: false },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_DELETE_ERROR,
      { errorDelete: {}, successDelete: false, loadingDelete: false },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_DELETE_CLEAN,
      { errorDelete: {}, successDelete: false, loadingDelete: false },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_ADD,
      { loaded: false, errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_ADD_ERROR,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_ADD_CLEAN,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_UPDATE,
      { loaded: false, errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_UPDATE_ERROR,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      SMS_CAMAPAIGN_TEMPLATE_UPDATE_CLEAN,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      CAMPAIGNS_CREATE_TYPE_ADD,
      { loaded: false, errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      CAMPAIGNS_CREATE_ADD,
      { loaded: false, errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      CAMPAIGNS_CREATE_TYPE_ADD_SUCCESS,
      {
        createCampaign: {
          contentConfiguration: {},
          scheudleAndGoals: {},
          selectAudience: {},
        },
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      },
    ],
    [
      CAMPAIGNS_CREATE_ADD_SUCCESS,
      {
        createCampaign: {
          contentConfiguration: {},
          scheudleAndGoals: {},
          selectAudience: {},
        },
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      },
    ],
    [
      CAMPAIGNS_CREATE_ADD_ERROR,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      CAMPAIGNS_CREATE_ADD_CLEAN,
      {
        loaded: true,
        errorAdd: {},
        createCampaign: {},
        successAdd: false,
        loadingAdd: false,
      },
    ],
    [
      CLEAR_CAMPAIGN_ON_TYPE_CHANGE,
      {
        loaded: true,
        errorAdd: {},
        createCampaign: {
          selectAudience: {},
          contentConfiguration: {},
          scheudleAndGoals: {},
        },
        inboxId: '',
        successAdd: false,
        loadingAdd: false,
        formEmailCreation: {
          subject: '',
          emailConnector: '',
          senderName: '',
          fromEmailAddress: [],
          replyToEmailAddress: '',
          cc: '',
          bcc: '',
        },
        saveAsDraftResponse: {},
        emailTemplate: null,
      },
    ],
    [
      SCHEDULE_SMS_CAMPAIGN,
      { loaded: false, errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      SCHEDULE_SMS_CAMPAIGN_SUCCESS,
      {
        campaigns: [{}],
        smsCampaignTemplates: {
          selectAudience: {},
          contentConfiguration: {},
          scheudleAndGoals: {},
        },
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      },
    ],
    [
      TEST_SMS_CAMPAIGN,
      { loaded: false, errorAdd: {}, successAdd: false, loadingAdd: true },
    ],
    [
      TEST_SMS_CAMPAIGN_SUCCESS,
      { loaded: true, errorAdd: {}, successAdd: true, loadingAdd: false },
    ],
    [
      TEST_SMS_CAMPAIGN_ERROR,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      TEST_SMS_CAMPAIGN_CLEAN,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      TEST_EMAIL_CAMPAIGN,
      { loaded: false, errorAdd: {}, successEmailAdd: false, loadingAdd: true },
    ],
    [
      TEST_EMAIL_CAMPAIGN_SUCCESS,
      { loaded: true, errorAdd: {}, successEmailAdd: true, loadingAdd: false },
    ],
    [
      TEST_EMAIL_CAMPAIGN_ERROR,
      { loaded: true, errorAdd: {}, successEmailAdd: false, loadingAdd: false },
    ],
    [
      TEST_EMAIL_CAMPAIGN_CLEAN,
      { loaded: true, errorAdd: {}, successEmailAdd: false, loadingAdd: false },
    ],
    [
      SCHEDULE_SMS_CAMPAIGN_ERROR,
      { loaded: true, errorAdd: {}, successAdd: false, loadingAdd: false },
    ],
    [
      SCHEDULE_SMS_CAMPAIGN_CLEAN,
      {
        createCampaign: {
          selectAudience: {},
          contentConfiguration: {},
          scheudleAndGoals: {},
        },
        campaignInfo: {},
        stepIndex: 0,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
        saveAsDraftResponse: {},
        formEmailCreation: {
          subject: '',
          emailConnector: '',
          senderName: '',
          fromEmailAddress: [],
          replyToEmailAddress: '',
          cc: '',
          bcc: '',
        },
        emailTemplate: null,
        stepId: '',
      },
    ],
    [SMS_CAMAPAIGN_TAGS, { loadedCampaigns: true }],
    [SET_DEFAULT_BTN, { defaultBtn: {} }],
    [SMS_CAMAPAIGN_TAGS_SUCCESS, { campaignTags: {} }],
    [SMS_CAMAPAIGNS_GET_ALL_SENDER_ID, { loadedCampaigns: true }],
    [SMS_CAMAPAIGNS_GET_ALL_SENDER_ID_SUCCESS, { senderIds: {} }],
    [
      SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID,
      { loadedCampaigns: true },
    ],
    [
      SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_SUCCESS,
      { templateListBasedOnSenderId: {} },
    ],
    [SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_ERROR, { errorAdd: {} }],
    [
      SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_CLEAN,
      {
        errorAdd: {},
        createCampaign: {
          contentConfiguration: {
            defaultmessage: '',
          },
          scheudleAndGoals: {},
          selectAudience: {},
        },
      },
    ],
    [
      SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID,
      { loadedCampaigns: true },
    ],
    [
      SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID_ERROR,
      { errorAdd: {} },
    ],
    [SMS_CONTENT_GENERATE_TINY_URL, { loadedCampaigns: true }],
    [
      SMS_CONTENT_GENERATE_TINY_URL_SUCCESS,
      {
        convertedTinyUrls: [
          {
            initialURL: undefined,
            tinyUrl: undefined,
          },
        ],
      },
    ],
    [SMS_CONTENT_GENERATE_PERSONALIZED_MSG, { loadedCampaigns: true }],
    [GET_SMS_SEARCH_TEMPLATES, { loadedCampaigns: true }],
    [
      SMS_CONTENT_GENERATE_PERSONALIZED_MSG_RESET,
      { convertedPersonalizedMsg: '' },
    ],
    [
      SMS_CAMPAIGN_SAVE_AS_DRAFT,
      { loaded: false, saveError: {}, saveSuccess: false, saveloading: true },
    ],
    [
      SMS_CAMPAIGN_SAVE_AS_DRAFT_SUCCESS,
      {
        saveAsDraftResponse: undefined,
        loaded: true,
        saveError: {},
        saveSuccess: true,
        saveloading: false,
      },
    ],
    [
      SMS_CAMPAIGN_SAVE_AS_DRAFT_ERROR,
      { loaded: true, saveError: {}, saveSuccess: false, saveloading: false },
    ],
    [
      SMS_CAMPAIGN_SAVE_AS_DRAFT_CLEAN,
      { loaded: true, saveError: {}, saveSuccess: false, saveloading: false },
    ],
    [
      SMS_CAMPAIGN_UPDATE_STEP_INDEX,
      {
        stepIndex: {},
      },
    ],
    [
      SMS_CAMPAIGN_NAME,
      {
        createCampaign: {
          contentConfiguration: {},
          scheudleAndGoals: {},
          selectAudience: {
            campaignName: {},
          },
        },
      },
    ],
    [FETCH_TEMPLATES_REQUEST, { loading: true, error: null }],
    [FETCH_TEMPLATES_SUCCESS, { loading: false, templates: {} }],
    // [FILE, {}],
    // [FILE, {}],
    // [FILE, {}],
    // [GET_CAMPAIGN_INFO_BY_ID_SUCCESS, { mappedCampaignObj: {} }],
  ])('should handle %p', (actionType, expectedState) => {
    const action = createAction(actionType, {});
    expect(reducer(INIT_STATE, action)).toEqual({
      ...INIT_STATE,
      ...expectedState,
    });
  });
});
