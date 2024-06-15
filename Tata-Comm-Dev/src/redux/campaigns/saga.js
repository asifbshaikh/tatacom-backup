import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNewV3,
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';
import { userCountFilterSegmentReset } from 'redux/segmentation/actions';
import CommonEnums from 'enums/commonEnums';
import {
  CAMPAIGNS_GET,
  CAMPAIGNS_DELETE,
  CAMPAIGNS_ADD,
  CAMPAIGNS_CREATE_TYPE_ADD,
  SMS_CAMAPAIGNS_TEMPLATES_GET_ALL,
  SMS_CAMAPAIGN_TEMPLATE_DELETE,
  SMS_CAMAPAIGN_TEMPLATE_ADD,
  SMS_CAMAPAIGN_TEMPLATE_UPDATE,
  SMS_CAMAPAIGNS_GET_ALL_SENDER_ID,
  SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID,
  SCHEDULE_SMS_CAMPAIGN,
  SMS_CAMAPAIGN_TAGS,
  SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID,
  SMS_CONTENT_GENERATE_TINY_URL,
  SMS_CONTENT_GENERATE_PERSONALIZED_MSG,
  TEST_SMS_CAMPAIGN,
  TEST_EMAIL_CAMPAIGN,
  GET_SMS_SEARCH_TEMPLATES,
  SMS_CAMPAIGN_SAVE_AS_DRAFT,
  FETCH_TEMPLATES_REQUEST,
  FETCH_EMAIL_TEMPLATES_REQUEST,
  GET_EMAIL_ADDRESS,
  ADD_EMAIL_TEMPLATE,
  GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST,
  TEST_WHATSAPP_CAMPAIGN,
  GET_CAMPAIGN_INFO_BY_ID,
  GET_EMAIL_TEMPLATE_BY_ID,
} from 'redux/constants';

import {
  getCampaignsSuccess,
  deleteCampaignSuccess,
  deleteCampaignError,
  addCampaignSuccess,
  addCampaignError,
  addCampaignCreateTypeSuccess,
  addSmsCampaignTemplateError,
  getSmsCampaignsTemplatesAllSuccess,
  deleteSmsCampaignTemplateSuccess,
  deleteSmsCampaignTemplateError,
  addSmsCampaignTemplateSuccess,
  updateSmsCampaignTemplateSuccess,
  updateSmsCampaignTemplateError,
  getAllSenderIdSuccess,
  getAllTemplatesBasedOnSenderIdError,
  getAllTemplatesBasedOnSenderIdSuccess,
  scheduleSmsCampaignSuccess,
  scheduleSmsCampaignError,
  getSmsCampaignsTagsSuccess,
  getTemplatesMessageBasedOnTemplateIdSuccess,
  getTemplatesMessageBasedOnTemplateIdError,
  generateTinyUrlSuccess,
  testSmsCampaignSuccess,
  testSmsCampaignError,
  testEmailCampaignSuccess,
  testEmailCampaignError,
  getPersonalizedMsgSuccess,
  getSearchSmsTemplatesSuccess,
  smsCampaignSaveAsDraftSuccess,
  smsCampaignSaveAsDraftError,
  fetchTemplatesSuccess,
  fetchTemplatesFailure,
  fetchEmailTemplatesSuccess,
  fetchEmailTemplatesFailure,
  getEmailAddressSuccess,
  addEmailTemplateSuccess,
  addEmailTemplateFailure,
  smsCampaignSaveAsDraftClean,
  getWhatsAppCampaignTemplatesListSuccess,
  getWhatsAppCampaignTemplatesListDetailed,
  testWhatsAppCampaignSuccess,
  testWhatsAppCampaignError,
  getCampaignInfoByIdSuccess,
} from './actions';

const getCampaignsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}campaigns`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCampaigns({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCampaignsAsync, payload);
    yield put(getCampaignsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteCampaignRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}campaigns/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteCampaign({ payload }) {
  try {
    const response = yield call(deleteCampaignRequest, payload);
    yield put(deleteCampaignSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteCampaignError(errorMsg));
  }
}

const addCampaignRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  const itemIdStr = postData.id ? `/${postData.id}` : '';
  return axios[method](`${apiUrlNew()}campaigns${itemIdStr}`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addCampaign({ payload }) {
  try {
    const response = yield call(addCampaignRequest, payload);
    yield put(addCampaignSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addCampaignError(errorMsg));
  }
}

function* addCampaignCreateType({ payload }) {
  yield put(addCampaignCreateTypeSuccess(payload));
}

const getSmsTemplatesAsync = async ({ page, selectedPageSize }) => {
  const method = 'get';
  const res = await axios[method](
    `${apiUrlNewV3()}templates?page=${page}&per_page=${selectedPageSize}`,
    {
      headers: getHeaders(),
    }
  );
  return res.data;
};

const getAllSenderIdAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}channels/fetch_all_sender_id`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data.sender_id;
  });
};

function* getAllSmsTemplates({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getSmsTemplatesAsync, payload);
    yield put(getSmsCampaignsTemplatesAllSuccess({ response, payload }));
  } catch (error) {
    commonRequestException(error);
  }
}

const searchSmsTemplatesRequest = async ({
  searchWord,
  page,
  selectedPageSize,
}) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}templates/search_template?search_term=${searchWord}&page=${page}&per_page=${selectedPageSize}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getSmsSearchTemplates({ payload }) {
  try {
    const response = yield call(searchSmsTemplatesRequest, payload);
    yield put(getSearchSmsTemplatesSuccess({ response, payload }));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteSMSTemplateRequest = async (template) => {
  const method = 'delete';
  return axios[method](`${apiUrlNewV3()}templates/${template.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteSmsTemplate({ payload }) {
  try {
    const response = yield call(deleteSMSTemplateRequest, payload);
    yield put(deleteSmsCampaignTemplateSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteSmsCampaignTemplateError(errorMsg));
  }
}

const addOrUpdateSmsTemplateRequest = async (template) => {
  const method = template.id ? `patch` : 'post';
  const itemIdStr = template.id ? `/${template.id}` : '';
  return axios[method](`${apiUrlNewV3()}templates${itemIdStr}`, template, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addSmsTemplateRequest({ payload }) {
  try {
    const response = yield call(addOrUpdateSmsTemplateRequest, payload);
    yield put(addSmsCampaignTemplateSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addSmsCampaignTemplateError(errorMsg));
  }
}
function* updateSmsTemplate({ payload }) {
  try {
    const response = yield call(addOrUpdateSmsTemplateRequest, payload);
    yield put(updateSmsCampaignTemplateSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateSmsCampaignTemplateError(errorMsg));
  }
}

const getCampaignTagsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}campaign_tags`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data.campaign_tags;
  });
};

function* getSmsCampaignsTags() {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getCampaignTagsAsync);
    yield put(getSmsCampaignsTagsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

function* getAllSenderId() {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getAllSenderIdAsync);
    yield put(getAllSenderIdSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getAllTemplateBasedOnSenderIdRequest = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}templates/get_template_id_by_sender_id`,
    { sender_id: payload.senderId },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getAllTemplateBasedOnSenderId({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getAllTemplateBasedOnSenderIdRequest, payload);
    yield put(getAllTemplatesBasedOnSenderIdSuccess(response));
  } catch (error) {
    getAllTemplatesBasedOnSenderIdError(error);
  }
}
const getTemplateBasedOnTemplateIdRequest = async (payload) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}templates/${payload.templateId}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getTemplateBasedOnTemplateId({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getTemplateBasedOnTemplateIdRequest, payload);
    yield put(getTemplatesMessageBasedOnTemplateIdSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(getTemplatesMessageBasedOnTemplateIdError(errorMsg));
  }
}

const scheduleSmsCampaignRequest = async ({ payload, id, actionType }) => {
  const method = id ? 'put' : 'post';
  const query = id
    ? `campaigns/${id}/${actionType ?? 'publish'}`
    : 'campaigns/publish';
  return axios[method](`${apiUrlNewV3()}${query}`, payload, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* scheduleSmsCampaign({ payload }) {
  try {
    const response = yield call(scheduleSmsCampaignRequest, payload);
    yield put(scheduleSmsCampaignSuccess({ response }));
    yield put(userCountFilterSegmentReset());
    yield put(smsCampaignSaveAsDraftClean());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(scheduleSmsCampaignError(errorMsg));
    yield put(smsCampaignSaveAsDraftClean());
  }
}

const generateTinyUrlRequest = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}generate`,
    {
      url: payload,
    },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* generateTinyUrl({ payload }) {
  try {
    const response = yield call(generateTinyUrlRequest, payload);
    yield put(
      generateTinyUrlSuccess({
        initialURL: payload,
        tinyUrl: response.shorturl,
      })
    );
  } catch (error) {
    commonRequestException(error);
  }
}

const getPersonalizedMsgRequest = async ({ payload, channelType }) => {
  const method = 'post';
  let mappingObj = {};
  payload.mapping.forEach((field) => {
    mappingObj = { ...mappingObj, [field.key]: field.value };
  });

  const res = await axios[method](
    `${apiUrlNewV3()}campaigns/personalize_message`,
    {
      message: payload.message,
      mapping:
        channelType === CommonEnums.SMS
          ? mappingObj
          : { custom_params: payload.mapping },
      campaign_channel_type: channelType,
    },
    {
      headers: getHeaders(),
    }
  );
  return {
    existing_msg: payload.message,
    personalize_message: res.data.data.personalize_message,
    personalise_mapping_attribute: res.data.data.personalise_mapping_attribute,
  };
};

function* getPersonalizedMsg({ payload }) {
  try {
    const response = yield call(getPersonalizedMsgRequest, payload);
    yield put(
      getPersonalizedMsgSuccess({
        personalizedMsg: response,
      })
    );
  } catch (error) {
    commonRequestException(error);
  }
}

const testSmsCampaignRequest = async (testData) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}campaigns/test_sms_message_via_tatasms`,
    testData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* smsTestCampaign({ payload }) {
  try {
    const response = yield call(testSmsCampaignRequest, payload);
    yield put(testSmsCampaignSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(testSmsCampaignError(errorMsg));
  }
}

const testEmailCampaignRequest = async (testData) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}campaigns/test_campaign_via_tataemail`,
    testData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* emailTestCampaign({ payload }) {
  try {
    const response = yield call(testEmailCampaignRequest, payload);
    yield put(testEmailCampaignSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(testEmailCampaignError(errorMsg));
  }
}

const userCountFilterRequest = async (filters) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNewV3()}segments/get_user_count_by_filter`,
    filters,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

const smsCampaignSaveAsDraftRequest = async ({ payload, id }) => {
  const method = id ? 'put' : 'post';
  const query = id ? `campaigns/${id}/draft` : 'campaigns/draft';
  return axios[method](`${apiUrlNewV3()}${query}`, payload, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* smsCampaignSaveAsDraft({ payload }) {
  try {
    let segmentIdResponse = '';
    if (!payload?.payload?.segment?.segment_filter_id) {
      segmentIdResponse = yield call(
        userCountFilterRequest,
        payload.payload.segment_filters
      );
    }
    if (segmentIdResponse) {
      (payload.payload.segment.segment_filter_id =
        segmentIdResponse.segment_filter.id),
        delete payload.payload.segment_filters;
    }
    const response = yield call(smsCampaignSaveAsDraftRequest, payload);
    yield put(smsCampaignSaveAsDraftSuccess({ response, payload }));
    yield put(smsCampaignSaveAsDraftClean());
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(smsCampaignSaveAsDraftError(errorMsg));
    yield put(smsCampaignSaveAsDraftClean());
  }
}

const fetchTemplatesAsync = async () => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}email_templates/get_predefined_templates`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data.email_templates;
  });
};

function* fetchTemplatesSaga({ payload }) {
  try {
    const response = yield call(fetchTemplatesAsync, payload);
    yield put(fetchTemplatesSuccess(response));
  } catch (error) {
    yield put(fetchTemplatesFailure(error));
  }
}

const fetchEmailTemplatesAPI = async (page, perPage) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}email_templates?page=${page}&per_page=${perPage}`,
    {
      headers: getHeaders(),
    }
  )
    .then((response) => response)
    .catch((error) => ({ error }));
};

function* fetchEmailTemplates(action) {
  const { page, perPage } = action.payload;
  const response = yield call(fetchEmailTemplatesAPI, page, perPage);
  if (!response.error) {
    yield put(fetchEmailTemplatesSuccess(response.data));
  } else {
    yield put(fetchEmailTemplatesFailure(response.error));
  }
}

const getEmailRequest = async (channelEmailId) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}email_general_settings/${channelEmailId}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getEmailAddress({ payload }) {
  try {
    const response = yield call(getEmailRequest, payload);
    yield put(getEmailAddressSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addNewTemplateAsync = async (formData) => {
  const method = formData.id ? 'put' : 'post';
  const endPoint = formData.id
    ? `email_templates/${formData.id}`
    : 'email_templates';
  return axios[method](`${apiUrlNewV3()}${endPoint}`, formData, {
    headers: getHeaders(),
  }).then((response) => {
    return response.data;
  });
};

function* addNewTemplate({ payload }) {
  try {
    const response = yield call(addNewTemplateAsync, payload);
    yield put(addEmailTemplateSuccess(response?.email_template || response));
  } catch (error) {
    if (error?.response?.data && Array.isArray(error.response.data)) {
      yield put(
        addEmailTemplateFailure({
          error: error.response.data,
          payload: payload,
        })
      );
    } else {
      const apiError = commonRequestException(error);
      yield put(
        addEmailTemplateFailure({
          error: [apiError.errorMsg],
          payload: payload,
        })
      );
    }
  }
}

const fetchEmailTemplateByIdApi = async (emailTemplateId) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}email_templates/${emailTemplateId}`, {
    headers: getHeaders(),
  })
    .then((response) => response)
    .catch((error) => ({ error }));
};

function* fetchEmailTemplateById({ payload }) {
  try {
    const response = yield call(fetchEmailTemplateByIdApi, payload);
    yield put(addEmailTemplateSuccess(response?.data?.email_template));
  } catch (error) {
    if (error?.response?.data && Array.isArray(error.response.data)) {
      yield put(addEmailTemplateFailure(error.response.data));
    } else {
      commonRequestException(error);
    }
  }
}

// WhatsApp Template API call

const getWATemplatesListAsync = async (payload) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNewV3()}channels/${payload.connectorId}/whatsapp_templates`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getWhatsAppCampaignTemplatesList({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getWATemplatesListAsync, payload);
    yield put(getWhatsAppCampaignTemplatesListSuccess(response, payload));
    yield put(getWhatsAppCampaignTemplatesListDetailed(response, payload));
  } catch (error) {
    commonRequestException(error);
  }
}

//  WhatsApp Test Campaign API

const testWhatsAppCampaignRequest = async (testData) => {
  const method = 'post';
  return axios[method](`${apiUrlNewV3()}campaigns/whatsapp/test`, testData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* whatsAppTestCampaign({ payload }) {
  try {
    const response = yield call(testWhatsAppCampaignRequest, payload);
    yield put(testWhatsAppCampaignSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(testWhatsAppCampaignError(errorMsg));
  }
}

const getCampaignInfoRequest = async (payload) => {
  let query = '';
  if (payload?.type === 'Info') {
    query = `/${payload.campaignID}`;
  }
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}campaigns${query}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCampaignInfoData({ payload }) {
  try {
    const response = yield call(getCampaignInfoRequest, payload);
    yield put(getCampaignInfoByIdSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

export function* watchGetCampaigns() {
  yield takeEvery(CAMPAIGNS_GET, getCampaigns);
  yield takeEvery(CAMPAIGNS_DELETE, deleteCampaign);
  yield takeEvery(CAMPAIGNS_ADD, addCampaign);
  yield takeEvery(CAMPAIGNS_CREATE_TYPE_ADD, addCampaignCreateType);
  yield takeEvery(SMS_CAMAPAIGNS_TEMPLATES_GET_ALL, getAllSmsTemplates);
  yield takeEvery(SMS_CAMAPAIGN_TEMPLATE_DELETE, deleteSmsTemplate);
  yield takeEvery(SMS_CAMAPAIGN_TEMPLATE_ADD, addSmsTemplateRequest);
  yield takeEvery(SMS_CAMAPAIGN_TEMPLATE_UPDATE, updateSmsTemplate);
  yield takeEvery(SMS_CAMAPAIGN_TAGS, getSmsCampaignsTags);
  yield takeEvery(SMS_CAMAPAIGNS_GET_ALL_SENDER_ID, getAllSenderId);
  yield takeEvery(
    SMS_CAMAPAIGNS_GET_ALL_TEMPLATES_BASED_SENDER_ID,
    getAllTemplateBasedOnSenderId
  );
  yield takeEvery(SCHEDULE_SMS_CAMPAIGN, scheduleSmsCampaign);
  yield takeEvery(
    SMS_CAMAPAIGNS_GET_TEMPLATES_MESSAGE_BY_TEMPLATE_ID,
    getTemplateBasedOnTemplateId
  );
  yield takeEvery(SMS_CONTENT_GENERATE_TINY_URL, generateTinyUrl);
  yield takeEvery(SMS_CONTENT_GENERATE_PERSONALIZED_MSG, getPersonalizedMsg);
  yield takeEvery(TEST_SMS_CAMPAIGN, smsTestCampaign);
  yield takeEvery(TEST_EMAIL_CAMPAIGN, emailTestCampaign);
  yield takeEvery(GET_SMS_SEARCH_TEMPLATES, getSmsSearchTemplates);
  yield takeEvery(SMS_CAMPAIGN_SAVE_AS_DRAFT, smsCampaignSaveAsDraft);
  yield takeEvery(FETCH_TEMPLATES_REQUEST, fetchTemplatesSaga);
  yield takeEvery(FETCH_EMAIL_TEMPLATES_REQUEST, fetchEmailTemplates);
  yield takeEvery(GET_EMAIL_ADDRESS, getEmailAddress);
  yield takeEvery(ADD_EMAIL_TEMPLATE, addNewTemplate);
  yield takeEvery(
    GET_WHATSAPP_CAMPAIGN_TEMPLATES_LIST,
    getWhatsAppCampaignTemplatesList
  );
  yield takeEvery(TEST_WHATSAPP_CAMPAIGN, whatsAppTestCampaign);
  yield takeEvery(GET_CAMPAIGN_INFO_BY_ID, getCampaignInfoData);
  yield takeEvery(GET_EMAIL_TEMPLATE_BY_ID, fetchEmailTemplateById);
}

export default function* rootSaga() {
  yield all([fork(watchGetCampaigns)]);
}
