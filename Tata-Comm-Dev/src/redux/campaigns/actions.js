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
  CAMPAIGNS_CREATE_TYPE_ADD_SUCCESS,
  CAMPAIGNS_CREATE_ADD,
  CAMPAIGNS_CREATE_ADD_SUCCESS,
  CAMPAIGNS_CREATE_ADD_ERROR,
  CAMPAIGNS_CREATE_ADD_CLEAN,
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
  GET_SMS_SEARCH_TEMPLATES,
  GET_SMS_SEARCH_TEMPLATES_SUCCESS,
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
  GET_EMAIL_TEMPLATE_BY_ID,
  EMAIL_TEMPLATE_ID,
  SET_DEFAULT_BTN,
  GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST_SUCCESS,
  GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST,
  GET_WHATSAPP_CAMPAIGN_DETAILED_TEMPLATES_LIST,
  TEST_WHATSAPP_CAMPAIGN,
  TEST_WHATSAPP_CAMPAIGN_SUCCESS,
  TEST_WHATSAPP_CAMPAIGN_ERROR,
  TEST_WHATSAPP_CAMPAIGN_CLEAN,
  CLEAR_CAMPAIGN_ON_TYPE_CHANGE,
  SET_CAMPAIGN_INBOX_ID,
  CLEAN_SELECTED_EMAIL_TEMPLATE,
  GET_CAMPAIGN_INFO_BY_ID,
  GET_CAMPAIGN_INFO_BY_ID_SUCCESS,
  SET_WHATSAPP_CAMPAIGN_TEMPLATE_CATEGORY,
  SMS_CONTENT_GENERATE_TINY_URL_CLEAN,
  SET_CAMPAIGN_CHANNEL_ID,
} from 'redux/constants';

export const getCampaigns = (userId) => ({
  type: CAMPAIGNS_GET,
  payload: userId,
});
export const getCampaignsSuccess = (items) => ({
  type: CAMPAIGNS_GET_SUCCESS,
  payload: items,
});

export const deleteCampaign = (item) => ({
  type: CAMPAIGNS_DELETE,
  payload: item,
});

export const deleteCampaignSuccess = (items) => ({
  type: CAMPAIGNS_DELETE_SUCCESS,
  payload: items,
});

export const deleteCampaignError = (error) => ({
  type: CAMPAIGNS_DELETE_ERROR,
  payload: error,
});

export const deleteCampaignClean = (item) => ({
  type: CAMPAIGNS_DELETE_CLEAN,
  payload: item,
});

export const addCampaign = (item) => ({
  type: CAMPAIGNS_ADD,
  payload: item,
});

export const addCampaignSuccess = (items) => ({
  type: CAMPAIGNS_ADD_SUCCESS,
  payload: items,
});

export const addCampaignError = (error) => ({
  type: CAMPAIGNS_ADD_ERROR,
  payload: error,
});

export const addCampaignClean = (item) => ({
  type: CAMPAIGNS_ADD_CLEAN,
  payload: item,
});

export const addCampaignCreateType = (item) => ({
  type: CAMPAIGNS_CREATE_TYPE_ADD,
  payload: item,
});

export const clearCampaignOnTypeChange = (item) => ({
  type: CLEAR_CAMPAIGN_ON_TYPE_CHANGE,
  payload: item,
});

export const addCampaignCreateTypeSuccess = (item) => ({
  type: CAMPAIGNS_CREATE_TYPE_ADD_SUCCESS,
  payload: item,
});
export const addCampaignCreate = (item) => ({
  type: CAMPAIGNS_CREATE_ADD,
  payload: item,
});

export const addCampaignCreateSuccess = (item) => ({
  type: CAMPAIGNS_CREATE_ADD_SUCCESS,
  payload: item,
});

export const addCampaignCreateError = (item) => ({
  type: CAMPAIGNS_CREATE_ADD_ERROR,
  payload: item,
});

export const addCampaignCreateClean = (item) => ({
  type: CAMPAIGNS_CREATE_ADD_CLEAN,
  payload: item,
});

export const getSmsCampaignsTemplatesAll = (userId) => ({
  type: SMS_CAMAPAIGNS_TEMPLATES_GET_ALL,
  payload: userId,
});

export const getSmsCampaignsTemplatesAllSuccess = (items) => ({
  type: SMS_CAMAPAIGNS_TEMPLATES_GET_ALL_SUCCESS,
  payload: items,
});

export const deleteSmsCampaignTemplate = (item) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_DELETE,
  payload: item,
});

export const deleteSmsCampaignTemplateSuccess = (items) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_DELETE_SUCCESS,
  payload: items,
});

export const deleteSmsCampaignTemplateError = (error) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_DELETE_ERROR,
  payload: error,
});

export const deleteSmsCampaignTemplateClean = (item) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_DELETE_CLEAN,
  payload: item,
});

export const addSmsCampaignTemplate = (item) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_ADD,
  payload: item,
});

export const addSmsCampaignTemplateSuccess = (items) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_ADD_SUCCESS,
  payload: items,
});

export const addSmsCampaignTemplateError = (error) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_ADD_ERROR,
  payload: error,
});

export const addSmsCampaignTemplateClean = (item) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_ADD_CLEAN,
  payload: item,
});

export const updateSmsCampaignTemplate = (items) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_UPDATE,
  payload: items,
});

export const updateSmsCampaignTemplateSuccess = (error) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_UPDATE_SUCCESS,
  payload: error,
});

export const updateSmsCampaignTemplateError = (error) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_UPDATE_ERROR,
  payload: error,
});

export const updateSmsCampaignTemplateClean = (item) => ({
  type: SMS_CAMAPAIGN_TEMPLATE_UPDATE_CLEAN,
  payload: item,
});

export const testSmsCampaign = (item) => ({
  type: TEST_SMS_CAMPAIGN,
  payload: item,
});

export const testSmsCampaignSuccess = (item) => ({
  type: TEST_SMS_CAMPAIGN_SUCCESS,
  payload: item,
});

export const testSmsCampaignError = (error) => ({
  type: TEST_SMS_CAMPAIGN_ERROR,
  payload: error,
});

export const testSmsCampaignClean = (item) => ({
  type: TEST_SMS_CAMPAIGN_CLEAN,
  payload: item,
});

export const testEmailCampaign = (item) => ({
  type: TEST_EMAIL_CAMPAIGN,
  payload: item,
});

export const testEmailCampaignSuccess = (item) => ({
  type: TEST_EMAIL_CAMPAIGN_SUCCESS,
  payload: item,
});

export const testEmailCampaignError = (error) => ({
  type: TEST_EMAIL_CAMPAIGN_ERROR,
  payload: error,
});

export const testEmailCampaignClean = (item) => ({
  type: TEST_EMAIL_CAMPAIGN_CLEAN,
  payload: item,
});

export const scheduleSmsCampaign = (item) => ({
  type: SCHEDULE_SMS_CAMPAIGN,
  payload: item,
});

export const scheduleSmsCampaignSuccess = (items) => ({
  type: SCHEDULE_SMS_CAMPAIGN_SUCCESS,
  payload: items,
});

export const scheduleSmsCampaignError = (error) => ({
  type: SCHEDULE_SMS_CAMPAIGN_ERROR,
  payload: error,
});
export const scheduleSmsCampaignClean = () => ({
  type: SCHEDULE_SMS_CAMPAIGN_CLEAN,
});

export const getSmsCampaignsTags = () => ({
  type: SMS_CAMAPAIGN_TAGS,
});

export const getSmsCampaignsTagsSuccess = (items) => ({
  type: SMS_CAMAPAIGN_TAGS_SUCCESS,
  payload: items,
});

export const getAllSenderId = () => ({
  type: SMS_CAMAPAIGNS_GET_ALL_SENDER_ID,
});

export const getAllSenderIdSuccess = (items) => ({
  type: SMS_CAMAPAIGNS_GET_ALL_SENDER_ID_SUCCESS,
  payload: items,
});
export const getAllTemplatesBasedOnSenderId = (item) => ({
  type: SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID,
  payload: item,
});

export const getAllTemplatesBasedOnSenderIdSuccess = (items) => ({
  type: SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_SUCCESS,
  payload: items,
});
export const getAllTemplatesBasedOnSenderIdError = (items) => ({
  type: SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_ERROR,
  payload: items,
});
export const getTemplatesMessageBasedOnTemplateId = (item) => ({
  type: SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID,
  payload: item,
});

export const getTemplatesMessageBasedOnTemplateIdSuccess = (items) => ({
  type: SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID_SUCCESS,
  payload: items,
});
export const getTemplatesMessageBasedOnTemplateIdError = (items) => ({
  type: SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID_ERROR,
  payload: items,
});

export const getSearchSmsTemplates = (items) => ({
  type: GET_SMS_SEARCH_TEMPLATES,
  payload: items,
});

export const getSearchSmsTemplatesSuccess = (items) => ({
  type: GET_SMS_SEARCH_TEMPLATES_SUCCESS,
  payload: items,
});

export const generateTinyUrl = (item) => ({
  type: SMS_CONTENT_GENERATE_TINY_URL,
  payload: item,
});

export const generateTinyUrlSuccess = (items) => ({
  type: SMS_CONTENT_GENERATE_TINY_URL_SUCCESS,
  payload: items,
});

export const generateTinyUrlClean = () => ({
  type: SMS_CONTENT_GENERATE_TINY_URL_CLEAN,
});

export const getPersonalizedMsg = (item) => ({
  type: SMS_CONTENT_GENERATE_PERSONALIZED_MSG,
  payload: item,
});

export const getPersonalizedMsgSuccess = (items) => ({
  type: SMS_CONTENT_GENERATE_PERSONALIZED_MSG_SUCCESS,
  payload: items,
});

export const getPersonalizedMsgReset = () => ({
  type: SMS_CONTENT_GENERATE_PERSONALIZED_MSG_RESET,
});

export const setDefaultBtn = (item) => ({
  type: SET_DEFAULT_BTN,
  payload: item,
});

export const smsContentConfigurationApiLIstClean = () => ({
  type: SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID_CLEAN,
});

export const smsCampaignSaveAsDraft = (items) => ({
  type: SMS_CAMPAIGN_SAVE_AS_DRAFT,
  payload: items,
});

export const smsCampaignSaveAsDraftSuccess = (items) => ({
  type: SMS_CAMPAIGN_SAVE_AS_DRAFT_SUCCESS,
  payload: items,
});

export const smsCampaignSaveAsDraftError = (items) => ({
  type: SMS_CAMPAIGN_SAVE_AS_DRAFT_ERROR,
  payload: items,
});

export const smsCampaignSaveAsDraftClean = (items) => ({
  type: SMS_CAMPAIGN_SAVE_AS_DRAFT_CLEAN,
  payload: items,
});

export const updateStepIndex = (items) => ({
  type: SMS_CAMPAIGN_UPDATE_STEP_INDEX,
  payload: items,
});

export const setCampaignName = (items) => ({
  type: SMS_CAMPAIGN_NAME,
  payload: items,
});

export const fetchTemplatesRequest = () => ({
  type: FETCH_TEMPLATES_REQUEST,
});

export const fetchTemplatesSuccess = (templates) => ({
  type: FETCH_TEMPLATES_SUCCESS,
  payload: templates,
});

export const fetchTemplatesFailure = (error) => ({
  type: FETCH_TEMPLATES_FAILURE,
  payload: error,
});

export const fetchEmailTemplatesRequest = (page, perPage) => ({
  type: FETCH_EMAIL_TEMPLATES_REQUEST,
  payload: { page, perPage },
});

export const fetchEmailTemplatesSuccess = (savedTemplates) => ({
  type: FETCH_EMAIL_TEMPLATES_SUCCESS,
  payload: savedTemplates,
});

export const fetchEmailTemplatesFailure = (error) => ({
  type: FETCH_EMAIL_TEMPLATES_FAILURE,
  payload: error,
});

export const getEmailAddress = (channelEmailId) => ({
  type: GET_EMAIL_ADDRESS,
  payload: channelEmailId,
});

export const getEmailAddressSuccess = (items) => ({
  type: GET_EMAIL_ADDRESS_SUCCESS,
  payload: items,
});

export const setSubject = (subject) => ({
  type: SET_SUBJECT,
  payload: subject,
});

export const setPreviewText = (previewText) => ({
  type: SET_PREVIEW_TEXT,
  payload: previewText,
});

export const setEmailConnector = (emailConnector) => ({
  type: SET_EMAIL_CONNECTOR,
  payload: emailConnector,
});

export const setSenderName = (senderName) => ({
  type: SET_SENDER_NAME,
  payload: senderName,
});

export const setFromEmailAddress = (fromEmailAddress) => ({
  type: SET_FROM_EMAIL_ADDRESS,
  payload: fromEmailAddress,
});

export const setReplyToEmailAddress = (replyToEmailAddress) => ({
  type: SET_REPLY_TO_EMAIL_ADDRESS,
  payload: replyToEmailAddress,
});
export const setCC = (cc) => ({
  type: SET_CC,
  payload: cc,
});
export const setBCC = (bcc) => ({
  type: SET_BCC,
  payload: bcc,
});

export const setFormEmailCreation = (formEmailCreation) => ({
  type: SET_FORM_EMAIL_CREATION,
  payload: formEmailCreation,
});

export const setEmailTargetAudience = (audience) => ({
  type: SET_EMAIL_TARGET_AUDIENCE,
  payload: audience,
});
export const resetAddSuccess = () => ({
  type: RESET_SUCCESS,
});

export const addEmailTemplate = (item) => ({
  type: ADD_EMAIL_TEMPLATE,
  payload: item,
});

export const addEmailTemplateSuccess = (items) => ({
  type: ADD_EMAIL_TEMPLATE_SUCCESS,
  payload: items,
});

export const addEmailTemplateFailure = (error) => ({
  type: ADD_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const addEmailTemplateErrorReset = () => ({
  type: ADD_EMAIL_TEMPLATE_ERROR_RESET,
});

export const emailTemplateId = (emailTempId) => ({
  type: EMAIL_TEMPLATE_ID,
  payload: emailTempId,
});
export const getEmailTemplateById = (emailTempId) => ({
  type: GET_EMAIL_TEMPLATE_BY_ID,
  payload: emailTempId,
});
export const cleanSelectedEmailTemplate = () => ({
  type: CLEAN_SELECTED_EMAIL_TEMPLATE,
});

export const getWhatsAppCampaignTemplatesList = (items) => ({
  type: GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST,
  payload: items,
});

export const getWhatsAppCampaignTemplatesListSuccess = (items) => ({
  type: GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST_SUCCESS,
  payload: items,
});

export const getWhatsAppCampaignTemplatesListDetailed = (items) => ({
  type: GET_WHATSAPP_CAMPAIGN_DETAILED_TEMPLATES_LIST,
  payload: items,
});

export const setWhatsAppCampaignTemplateCategory = (item) => ({
  type: SET_WHATSAPP_CAMPAIGN_TEMPLATE_CATEGORY,
  payload: item,
});

// WhatsApp Test Campaign
export const testWhatsAppCampaign = (item) => ({
  type: TEST_WHATSAPP_CAMPAIGN,
  payload: item,
});

export const testWhatsAppCampaignSuccess = (item) => ({
  type: TEST_WHATSAPP_CAMPAIGN_SUCCESS,
  payload: item,
});

export const testWhatsAppCampaignError = (error) => ({
  type: TEST_WHATSAPP_CAMPAIGN_ERROR,
  payload: error,
});

export const testWhatsAppCampaignClean = (item) => ({
  type: TEST_WHATSAPP_CAMPAIGN_CLEAN,
  payload: item,
});

export const setCampaignInboxId = (items) => ({
  type: SET_CAMPAIGN_INBOX_ID,
  payload: items,
});

export const setCampaignChannelId = (items) => ({
  type: SET_CAMPAIGN_CHANNEL_ID,
  payload: items,
});

export const getCampaignInfoById = (item) => ({
  type: GET_CAMPAIGN_INFO_BY_ID,
  payload: item,
});

export const getCampaignInfoByIdSuccess = (item) => ({
  type: GET_CAMPAIGN_INFO_BY_ID_SUCCESS,
  payload: item,
});
