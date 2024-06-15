import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import { getStepIndex } from 'helpers/Utils';
import { getConvertedStringWithSpace } from 'helpers/campaignHelper';
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
  SET_WHATSAPP_CAMPAIGN_TEMPLATE_CATEGORY,
  SMS_CONTENT_GENERATE_TINY_URL_CLEAN,
  SET_CAMPAIGN_CHANNEL_ID,
} from 'redux/constants';

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

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CAMPAIGNS_GET:
      return { ...state, loadedCampaigns: true };

    case CAMPAIGNS_GET_SUCCESS:
      return { ...state, campaigns: action.payload };

    case CAMPAIGNS_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case CAMPAIGNS_DELETE_SUCCESS:
      return {
        ...state,
        campaigns: state.campaigns.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case CAMPAIGNS_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case CAMPAIGNS_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case CAMPAIGNS_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case CAMPAIGNS_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let newCampaigns = state.campaigns;
      if (action.payload.payload.id) {
        // update record in list
        newCampaigns = newCampaigns.map((item) =>
          item.id === action.payload.payload.id ? action.payload.response : item
        );
      } else {
        // add record in list
        newCampaigns = [...newCampaigns, action.payload.response];
      }
      return {
        ...state,
        campaigns: newCampaigns,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case CAMPAIGNS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case CAMPAIGNS_ADD_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case SMS_CAMAPAIGNS_TEMPLATES_GET_ALL:
      return { ...state, loadedCampaigns: true };

    case SMS_CAMAPAIGNS_TEMPLATES_GET_ALL_SUCCESS:
      return {
        ...state,
        smsCampaignTemplates: {
          templates: action.payload.response.templates,
          totalCount: action.payload.response.total_count,
        },
      };

    case SMS_CAMAPAIGN_TEMPLATE_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case SMS_CAMAPAIGN_TEMPLATE_DELETE_SUCCESS:
      return {
        ...state,
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };
    case SMS_CAMAPAIGN_TEMPLATE_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case SMS_CAMAPAIGN_TEMPLATE_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case SMS_CAMAPAIGN_TEMPLATE_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case SMS_CAMAPAIGN_TEMPLATE_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const addTemplate = state.smsCampaignTemplates.templates;
      return {
        ...state,
        smsCampaignTemplates: {
          ...state.smsCampaignTemplates,
          templates: [...addTemplate, action.payload.response],
          totalCount: state.smsCampaignTemplates.totalCount + 1,
        },
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case SMS_CAMAPAIGN_TEMPLATE_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case SMS_CAMAPAIGN_TEMPLATE_ADD_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case SMS_CAMAPAIGN_TEMPLATE_UPDATE:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case SMS_CAMAPAIGN_TEMPLATE_UPDATE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let updatedTemplates = state.smsCampaignTemplates.templates;

      updatedTemplates = updatedTemplates.map((item) =>
        item.id === action.payload.payload.id ? action.payload.response : item
      );
      return {
        ...state,
        smsCampaignTemplates: {
          ...state.smsCampaignTemplates,
          templates: updatedTemplates,
        },
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case SMS_CAMAPAIGN_TEMPLATE_UPDATE_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };
    case SMS_CAMAPAIGN_TEMPLATE_UPDATE_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case CAMPAIGNS_CREATE_TYPE_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case CAMPAIGNS_CREATE_TYPE_ADD_SUCCESS:
      return {
        ...state,
        createCampaign: {
          ...state.createCampaign,
          selectAudience: {
            ...state.createCampaign.selectAudience,
            ...action.payload,
          },
        },
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case CAMPAIGNS_CREATE_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case CAMPAIGNS_CREATE_ADD_SUCCESS:
      return {
        ...state,
        createCampaign: { ...state.createCampaign, ...action.payload },
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case CAMPAIGNS_CREATE_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case CAMPAIGNS_CREATE_ADD_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        createCampaign: {},
        successAdd: false,
        loadingAdd: false,
      };

    case CLEAR_CAMPAIGN_ON_TYPE_CHANGE:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        createCampaign: {
          selectAudience: { ...action.payload },
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
      };

    case SCHEDULE_SMS_CAMPAIGN:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case SCHEDULE_SMS_CAMPAIGN_SUCCESS:
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload],
        smsCampaignTemplates: {
          selectAudience: {},
          contentConfiguration: {},
          scheudleAndGoals: {},
        },
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case TEST_SMS_CAMPAIGN:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case TEST_SMS_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case TEST_SMS_CAMPAIGN_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case TEST_SMS_CAMPAIGN_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case TEST_EMAIL_CAMPAIGN:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successEmailAdd: false,
        loadingAdd: true,
      };

    case TEST_EMAIL_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successEmailAdd: true,
        loadingAdd: false,
      };

    case TEST_EMAIL_CAMPAIGN_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successEmailAdd: false,
        loadingAdd: false,
      };

    case TEST_EMAIL_CAMPAIGN_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successEmailAdd: false,
        loadingAdd: false,
      };

    case SCHEDULE_SMS_CAMPAIGN_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };
    case SCHEDULE_SMS_CAMPAIGN_CLEAN:
      return {
        ...state,
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
      };

    case SMS_CAMAPAIGN_TAGS:
      return {
        ...state,
        loadedCampaigns: true,
      };

    case SET_DEFAULT_BTN:
      return {
        ...state,
        defaultBtn: action.payload,
      };

    case SMS_CAMAPAIGN_TAGS_SUCCESS:
      return {
        ...state,
        campaignTags: action.payload,
      };
    case SMS_CAMAPAIGNS_GET_ALL_SENDER_ID:
      return { ...state, loadedCampaigns: true };

    case SMS_CAMAPAIGNS_GET_ALL_SENDER_ID_SUCCESS:
      return {
        ...state,
        senderIds: action.payload,
      };
    case SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID:
      return { ...state, loadedCampaigns: true };

    case SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_SUCCESS:
      return {
        ...state,
        templateListBasedOnSenderId: action.payload,
      };
    case SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_ERROR:
      return {
        ...state,
        errorAdd: action.payload,
      };
    case SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_CLEAN:
      return {
        ...state,
        errorAdd: {},
        createCampaign: {
          ...state.createCampaign,
          contentConfiguration: {
            ...state.createCampaign.contentConfiguration,
            defaultmessage: '',
          },
        },
      };
    case SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID:
      return { ...state, loadedCampaigns: true };

    case SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID_SUCCESS:
      return {
        ...state,
        createCampaign: {
          ...state.createCampaign,
          contentConfiguration: {
            ...state.createCampaign.contentConfiguration,
            defaultmessage: action.payload.template.message,
          },
        },
      };
    case SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID_ERROR:
      return {
        ...state,
        errorAdd: action.payload,
      };

    case SMS_CONTENT_GENERATE_TINY_URL:
      return { ...state, loadedCampaigns: true };

    case SMS_CONTENT_GENERATE_TINY_URL_SUCCESS:
      return {
        ...state,
        convertedTinyUrls: [
          ...state.convertedTinyUrls,
          {
            initialURL: action.payload.initialURL,
            tinyUrl: action.payload.tinyUrl,
          },
        ],
      };
    case SMS_CONTENT_GENERATE_TINY_URL_CLEAN:
      return {
        ...state,
        convertedTinyUrls: '',
      };

    case SMS_CONTENT_GENERATE_PERSONALIZED_MSG:
      return { ...state, loadedCampaigns: true };

    case SMS_CONTENT_GENERATE_PERSONALIZED_MSG_SUCCESS:
      return {
        ...state,
        convertedPersonalizedMsg: {
          existing_msg: action.payload.personalizedMsg.existing_msg,
          personalize_message:
            action.payload.personalizedMsg.personalize_message,
          personalise_mapping_attribute:
            action.payload.personalizedMsg.personalise_mapping_attribute,
        },
      };

    case SMS_CONTENT_GENERATE_PERSONALIZED_MSG_RESET:
      return {
        ...state,
        convertedPersonalizedMsg: '',
      };
    case GET_SMS_SEARCH_TEMPLATES:
      return { ...state, loadedCampaigns: true };

    case GET_SMS_SEARCH_TEMPLATES_SUCCESS:
      return {
        ...state,
        smsCampaignTemplates: {
          templates: action.payload.response.templates ?? [],
          totalCount: action.payload.response.total_count ?? 0,
        },
      };

    case SMS_CAMPAIGN_SAVE_AS_DRAFT:
      return {
        ...state,
        loaded: false,
        saveError: {},
        saveSuccess: false,
        saveloading: true,
      };

    case SMS_CAMPAIGN_SAVE_AS_DRAFT_SUCCESS:
      return {
        ...state,
        saveAsDraftResponse: action.payload.response,
        loaded: true,
        saveError: {},
        saveSuccess: true,
        saveloading: false,
      };

    case SMS_CAMPAIGN_SAVE_AS_DRAFT_ERROR:
      return {
        ...state,
        loaded: true,
        saveError: action.payload,
        saveSuccess: false,
        saveloading: false,
      };

    case SMS_CAMPAIGN_SAVE_AS_DRAFT_CLEAN:
      return {
        ...state,
        loaded: true,
        saveError: {},
        saveSuccess: false,
        saveloading: false,
      };

    case SMS_CAMPAIGN_UPDATE_STEP_INDEX:
      return {
        ...state,
        stepIndex: action.payload,
      };

    case SMS_CAMPAIGN_NAME:
      return {
        ...state,
        createCampaign: {
          ...state.createCampaign,
          selectAudience: {
            ...state.createCampaign.selectAudience,
            campaignName: action.payload,
          },
        },
      };

    case FETCH_TEMPLATES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        templates: action.payload,
      };

    case FETCH_TEMPLATES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_EMAIL_TEMPLATES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_EMAIL_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        emailCampaignTemplates: {
          totalCount: action.payload.total_count,
          savedTemplates: action.payload.email_templates,
        },
        error: null,
      };

    case FETCH_EMAIL_TEMPLATES_FAILURE:
      return {
        ...state,
        loading: false,
        emailCampaignTemplates: { totalCount: 0, savedTemplates: [] },
        error: action.payload,
      };

    case GET_EMAIL_ADDRESS:
      return { ...state };

    case GET_EMAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        emailAddress: action.payload,
      };

    case SET_SUBJECT:
      return { ...state, subject: action.payload };

    case SET_PREVIEW_TEXT:
      return { ...state, previewText: action.payload };

    case SET_EMAIL_CONNECTOR:
      return { ...state, emailConnector: action.payload };

    case SET_SENDER_NAME:
      return { ...state, senderName: action.payload };

    case SET_FROM_EMAIL_ADDRESS:
      return { ...state, fromEmailAddress: action.payload };

    case SET_REPLY_TO_EMAIL_ADDRESS:
      return { ...state, replyToEmailAddress: action.payload };

    case SET_CC:
      return { ...state, cc: action.payload };

    case SET_BCC:
      return { ...state, bcc: action.payload };

    case SET_FORM_EMAIL_CREATION:
      return {
        ...state,
        formEmailCreation: { ...state.formEmailCreation, ...action.payload },
      };

    case SET_EMAIL_TARGET_AUDIENCE:
      return {
        ...state,
        createCampaign: {
          ...state.createCampaign,
          selectAudience: { ...action.payload },
        },
      };

    case RESET_SUCCESS:
      return {
        ...state,
        successAdd: false,
      };

    case ADD_EMAIL_TEMPLATE:
      return {
        ...state,
      };

    case ADD_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        emailTemplate: {
          ...state.emailTemplate,
          ...action.payload,
          success: true,
        },
      };

    case ADD_EMAIL_TEMPLATE_FAILURE:
      return {
        ...state,
        emailTemplate: {
          ...action.payload.payload,
          id: state.emailTemplate?.id || null,
          error: action.payload.error,
          success: false,
        },
      };
    case ADD_EMAIL_TEMPLATE_ERROR_RESET:
      return {
        ...state,
        emailTemplate: {
          ...state.emailTemplate,
          error: null,
          success: null,
        },
      };

    case EMAIL_TEMPLATE_ID:
      return {
        ...state,
        emailTempId: action.payload,
      };

    case GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST:
      return { ...state };

    case GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST_SUCCESS:
      return {
        ...state,
        templateListWABasedOnConnectorID: Object.entries(
          action.payload.data
        ).map(([key, valueList]) => {
          return valueList.map((value) => {
            return {
              value: value.name,
              label: getConvertedStringWithSpace(value.name),
              category: getConvertedStringWithSpace(key),
            };
          });
        }),
      };

    case GET_WHATSAPP_CAMPAIGN_DETAILED_TEMPLATES_LIST:
      return {
        ...state,
        templateListWADetailedList: Object.entries(action.payload.data)
          .map(([key, value]) => {
            return value.map((e) => {
              e['template_type'] = key;
              return e;
            });
          })
          .flat(),
      };

    // WhatsApp Test Campaign
    case TEST_WHATSAPP_CAMPAIGN:
      return {
        ...state,
        loaded: false,
        errorTestWAAdd: {},
        successTestWAAdd: false,
        loadingTestWAAdd: true,
      };

    case TEST_WHATSAPP_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorTestWAAdd: {},
        successTestWAAdd: true,
        loadingTestWAAdd: false,
      };

    case TEST_WHATSAPP_CAMPAIGN_ERROR:
      return {
        ...state,
        loaded: true,
        errorTestWAAdd: action.payload,
        successTestWAAdd: false,
        loadingTestWAAdd: false,
      };

    case TEST_WHATSAPP_CAMPAIGN_CLEAN:
      return {
        ...state,
        loaded: true,
        errorTestWAAdd: {},
        successTestWAAdd: false,
        loadingTestWAAdd: false,
      };

    case SET_CAMPAIGN_INBOX_ID:
      return {
        ...state,
        inboxId: action.payload,
      };

    case SET_CAMPAIGN_CHANNEL_ID:
      return {
        ...state,
        channelId: action.payload.channelId,
        channelTypes: action.payload.channelType,
      };

    case GET_CAMPAIGN_INFO_BY_ID:
      return {
        ...state,
      };

    case GET_CAMPAIGN_INFO_BY_ID_SUCCESS: {
      const { campaign } = action.payload;
      let checkCampaignPersonalAttributes = false;
      let checkTinyUrls = false;
      if (
        campaign?.personalise_mapping_attribute &&
        Object.keys(campaign.personalise_mapping_attribute).length
      ) {
        checkCampaignPersonalAttributes = true;
      }

      if (
        campaign?.campaignable?.tiny_urls &&
        campaign.campaignable.tiny_urls?.length > 0
      ) {
        checkTinyUrls = true;
      }

      let mappedCampaignObj = {
        ...state,
        campaignInfo: action.payload,
        saveAsDraftResponse: action.payload,
        inboxId: campaign?.inbox_id ?? '',
        createCampaign: {
          selectAudience: {
            channelType: campaign?.campaign_type.toLowerCase() ?? '',
            campaignType: campaign?.scheduling_type ?? '',
            campaignName: campaign?.title ?? '',
            campaignContentType:
              campaign?.campaignable?.campaign_content_type ?? '',
            audience: campaign?.select_audience ?? '',
            exclude_users: campaign?.exclude_users ?? '',
            selectedUserAttribute: campaign?.selected_contact_attribute,
            audience_type: campaign?.select_audience,
            included_filters: {
              ...campaign?.segment_data?.filter_hash.included_filters,
            },
            excluded_filters: {
              ...(Object.keys(
                campaign?.segment_data?.filter_hash?.excluded_filters
              ).length > 0
                ? { ...campaign?.segment_data?.filter_hash.excluded_filters }
                : {
                    filter_operator: createSegementEnums.INITIALVALUES.AND,
                    filters: [
                      {
                        filter_operator: createSegementEnums.INITIALVALUES.OR,
                        filter_type:
                          createSegementEnums.INITIALVALUES.NESTED_FILTERS,
                        filters: [
                          {
                            filter_type:
                              createSegementEnums.INITIALVALUES.FILTER_BY_USERS,
                          },
                        ],
                      },
                    ],
                  }),
            },
            draftSegmentId: campaign?.segment_data?.id || '',
          },
          contentConfiguration: {
            smsSender:
              (campaign?.channel_info?.sender_id ||
                campaign?.channel_info?.phone_number) ??
              '',
            templateId: campaign?.campaignable?.template_id ?? '',
            message: campaign?.message ?? '',
            templateRecordId: campaign?.campaignable?.template_record_id ?? '',
            personalize: checkCampaignPersonalAttributes,
            tinyUrlConversion: checkTinyUrls,
            actualMessage: campaign?.message ?? '',
          },
        },
        emailTemplate: {
          id: campaign?.campaignable?.email_template_id ?? null,
        },
        stepId: campaign?.campaign_state ?? '',
        stepIndex: campaign?.campaign_state
          ? getStepIndex(campaign.campaign_state)
          : 0,
      };
      if (campaign?.scheduling_type === ScheduleAndGoalsEnums.EVENT_TRIGGERED) {
        mappedCampaignObj.createCampaign.selectAudience.triggerCriteria = {
          included_filters:
            campaign?.contact_event_filter?.filter_hash?.included_filters,
          time_multiplier: campaign?.campaign_scheduler?.time_multiplier,
          time_value: campaign?.campaign_scheduler?.time_value,
          trigger_attr: campaign?.campaign_scheduler?.trigger_attr,
          trigger_message_type: campaign?.campaign_scheduler?.trigger_attr
            ? TargetAudienceEnums.WITH_DELAY
            : TargetAudienceEnums.IMMEDIATELY,
          trigger_relation: campaign?.campaign_scheduler?.trigger_relation,
        };
      }
      if (
        campaign?.personalise_mapping_attribute &&
        Object.keys(campaign?.personalise_mapping_attribute)
      ) {
        mappedCampaignObj.convertedPersonalizedMsg = {
          existing_msg: campaign?.message ?? '',
          personalize_message: campaign?.message ?? '',
          personalise_mapping_attribute:
            campaign?.personalise_mapping_attribute ?? {},
        };
      }
      if (campaign?.campaignable?.tiny_urls?.length > 0) {
        mappedCampaignObj.convertedTinyUrls =
          campaign.campaignable.tiny_urls?.map((item) => ({ tinyUrl: item }));
      }
      if (campaign.campaign_scheduler) {
        mappedCampaignObj.createCampaign.scheudleAndGoals =
          campaign.campaign_scheduler;
      }
      if (
        Array.isArray(campaign.campaign_details) &&
        campaign.campaign_details.length > 0
      ) {
        const mappedFormEmailCreation = {
          subject: campaign?.campaign_details[0]?.subject ?? '',
          emailConnector: campaign?.campaign_details[0].channel_email_id ?? '',
          senderName: campaign?.campaign_details[0]?.sender_name ?? '',
          fromEmailAddress:
            campaign?.campaign_details[0].from_email_address ?? '',
          replyToEmailAddress:
            campaign?.campaign_details[0]?.reply_to_email_address ?? '',
        };
        mappedCampaignObj = {
          ...mappedCampaignObj,
          formEmailCreation: mappedFormEmailCreation,
        };
      }
      return mappedCampaignObj;
    }
    case CLEAN_SELECTED_EMAIL_TEMPLATE:
      return {
        ...state,
        emailTemplate: null,
      };

    case SET_WHATSAPP_CAMPAIGN_TEMPLATE_CATEGORY:
      return {
        ...state,
        whatsAppTemplateCategory: action.payload,
      };

    default:
      return { ...state };
  }
};
