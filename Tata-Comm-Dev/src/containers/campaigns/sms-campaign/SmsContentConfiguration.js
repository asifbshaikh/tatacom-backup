import React, { useEffect, useState } from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import { Formik, Form } from 'formik';
import {
  addCampaignCreateSuccess,
  getColumnAttributeList,
  getSettingsSMSConnectorList,
} from 'redux/actions';
import { connect } from 'react-redux';
import '../../../assets/css/sass/views/campaign.scss';
import IntlMessages from 'helpers/IntlMessages';
import * as Yup from 'yup';
import {
  getAllTemplatesBasedOnSenderId,
  generateTinyUrl,
  testSmsCampaign,
  testSmsCampaignClean,
  getPersonalizedMsg,
  getPersonalizedMsgReset,
  smsContentConfigurationApiLIstClean,
  getTemplatesMessageBasedOnTemplateId,
  updateStepIndex,
  setDefaultBtn,
  setCampaignInboxId,
  generateTinyUrlClean,
  setCampaignChannelId,
} from 'redux/campaigns/actions';
import { NotificationManager } from 'components/common/react-notifications';
import CommonEnums from 'enums/commonEnums';
import StepperNavigationButtons from '../StepperNavigationButtons';
import TestCampaign from '../TestCampaign';
import ContentConfiguration from '../ContentConfiguration';
import PersonalizeModal from '../PersonalizeModal';

const SmsContentConfiguration = ({
  channelType,
  formRef,
  next,
  previous,
  addContentConfiguration,
  smsSender,
  templateRecordId,
  templateId,
  message,
  actualMessage,
  defaultmessage,
  personalize,
  tinyUrlConversion,
  templateCustomized,
  getTinyUrl,
  colAttributesList,
  getAllTemplateList,
  templateListBasedOnSenderId,
  convertedTinyUrls,
  apiDataClean,
  testCampaign,
  formSuccess,
  formError,
  testCampaignClean,
  getColumnAttributeListAction,
  getPersonalizedMsgAction,
  getPersonalizedMsgResetAction,
  convertedPersonalizedMsg,
  getTemplateMessage,
  stepIndex,
  updateStepIndexAction,
  defaultBtn,
  setDefaultBtnAction,
  getSettingsSMSConnectorListAction,
  tataSMSConnectors,
  setCampaignInboxIdAction,
  setCampaignChannelIdAction,
}) => {
  const initialValues = {
    channelType: channelType ?? '',
    smsSender: smsSender ?? '',
    templateRecordId: templateRecordId ?? '',
    message: message ?? '',
    actualMessage: actualMessage ?? '',
    personalize: personalize ?? false,
    tinyUrlConversion: tinyUrlConversion ?? false,
    templateCustomized: templateCustomized ?? false,
    templateId: templateId ?? '',
    testUserAttribute: 'mobileNumber',
    testUserValue: '',
    personalisedParam: {
      fieldsArray: [],
    },
  };

  const [modalOpen, toggleModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [persoalizeFieldsArray, setPersoalizeFieldsArray] = useState([]);
  const [convertedMsg, setConvertedMsg] = useState('');
  const [formik, setFormik] = useState(true);

  useEffect(() => {
    if (Object.keys(formik).length > 0) {
      formik.setFieldValue('message', defaultmessage);
    }
  }, [defaultmessage]);

  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };
  const phoneRegExp =
    /^(\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1))[- ]?\d{1,14}$/;

  const contentSchema = Yup.object().shape({
    smsSender: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    templateRecordId: Yup.string(),
    message: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    actualMessage: Yup.string(),
    personalize: Yup.boolean(),
    tinyUrlConversion: Yup.boolean(),
    templateId: Yup.string(),
    testUserAttribute: Yup.string(),
    testUserValue: Yup.string().when('testUserAttribute', {
      is: (option) => option === 'mobileNumber',
      then: Yup.string().matches(phoneRegExp, 'Invalid mobile number'),
      otherwise: Yup.string().when('testUserAttribute', {
        is: (option) => option === 'emailId',
        then: Yup.string().email(
          getValidationMessage('CAMPAIGN.VALIDATION.INVALID_EMAIL')
        ),
        otherwise: Yup.string().notRequired(),
      }),
    }),
  });

  useEffect(() => {
    getSettingsSMSConnectorListAction(CommonEnums.TATA_SMSC);
    if (colAttributesList?.length === 0) {
      getColumnAttributeListAction();
    }
    testCampaignClean({});
    return () => {
      testCampaignClean({});
    };
  }, []);
  const getDropDownValuesForSmsSender = () => {
    const list = [];
    if (tataSMSConnectors?.length > 0) {
      list.unshift({
        id: '',
        value: '',
      });
      tataSMSConnectors.forEach((element) => {
        list.push({
          id: element.sender_id,
          value: element.sender_id,
        });
      });
    }
    return list;
  };

  const getDropDownValuesForTemplates = () => {
    const list = [];
    if (templateListBasedOnSenderId?.length > 0) {
      list.unshift({
        id: '',
        value: '',
      });
      templateListBasedOnSenderId.forEach((element) => {
        list.push({
          id: element.template_record_id,
          value: element.template_id,
        });
      });
    }
    return list;
  };

  const handlePreviousBtnClick = () => {
    updateStepIndexAction(stepIndex - 1);
    previous();
  };

  const handleSubmit = (values) => {
    const createCampaign = {
      contentConfiguration: { ...values, actualMessage: convertedMsg },
    };
    addContentConfiguration(createCampaign);
    next();
    updateStepIndexAction(stepIndex + 1);
  };

  const handleOnChangeSmsSender = (event, form) => {
    form.setFieldValue('smsSender', event.target.value, true);
    const senderId = event.target.value;
    const selectedSMSSender = tataSMSConnectors.find(
      (item) => item.sender_id === event.target.value
    );
    setCampaignInboxIdAction(selectedSMSSender?.inbox_id);
    setCampaignChannelIdAction({
      channelId: selectedSMSSender?.channel_id,
      channelType: CommonEnums.TATA_SMSC,
    });
    getAllTemplateList({ senderId });
  };

  const handleOnChangeTemplateID = (event, form) => {
    form.setFieldValue('templateRecordId', event.target.value);
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedOptionId = selectedOption.id;
    form.setFieldValue('templateId', selectedOptionId);
    form.setFieldValue('personalize', false);
    form.setFieldValue('tinyUrlConversion', false);
    getTemplateMessage({
      templateId: event.target.value,
    });
    setFormik(form);
  };

  const cleanTestCampaign = () => {
    testCampaignClean({});
  };

  useEffect(() => {
    // getSenderId();
    cleanTestCampaign();
    return () => {
      apiDataClean();
      cleanTestCampaign();
    };
  }, []);

  if (formSuccess) {
    const successMsg = 'CAMPAIGN.CREATE_CAMPAIGN.TEST.API.SUCCESS_MESSAGE';
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
    cleanTestCampaign();
  }
  useEffect(() => {
    if (formError?.errorMsg) {
      NotificationManager.error(formError.errorMsg, 'Error', 6000, null, null);
      cleanTestCampaign();
    }
  }, [formError]);

  const handleOnChangeUserAttribute = (event, form) => {
    form.setFieldValue('testUserAttribute', event.target.value);
    form.setFieldValue('testUserValue', '');
  };

  useEffect(() => {
    if (smsSender) {
      getAllTemplateList({ senderId: smsSender });
    }
  }, []);

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={contentSchema}
      validateOnBlur
      validateOnChange
      validateOnMount
    >
      {(form) => (
        <Form>
          {modalOpen && (
            <PersonalizeModal
              form={form}
              messageBody={form.values.message}
              colAttributesList={colAttributesList}
              persoalizeFieldsArray={persoalizeFieldsArray}
              modalOpen={modalOpen}
              toggleModal={toggleModal}
              editFormData={editFormData}
              setEditFormData={setEditFormData}
              getPersonalizedMsgAction={getPersonalizedMsgAction}
              channelType={channelType}
            />
          )}
          <ContentConfiguration
            forms={form}
            channelType={channelType}
            getPersonalizedMsgResetAction={getPersonalizedMsgResetAction}
            setConvertedMsg={setConvertedMsg}
            getAllTemplateList={getAllTemplateList}
            toggleModal={toggleModal}
            setPersoalizeFieldsArray={setPersoalizeFieldsArray}
            getTinyUrl={getTinyUrl}
            convertedTinyUrls={convertedTinyUrls}
            convertedPersonalizedMsg={convertedPersonalizedMsg}
            senderLabelType="SMS_SENDER"
            senderType="smsSender"
            getDropDownValuesForSender={getDropDownValuesForSmsSender}
            handleOnChangeSender={handleOnChangeSmsSender}
            getDropDownValuesForTemplates={getDropDownValuesForTemplates}
            handleOnChangeTemplateID={handleOnChangeTemplateID}
            setDefaultBtn={setDefaultBtnAction}
            defaultBtn={defaultBtn}
          />

          <Separator className="mb-5" />

          <TestCampaign
            form={form}
            channelType={channelType}
            handleOnChangeUserAttribute={handleOnChangeUserAttribute}
            testCampaign={testCampaign}
            convertedMsg={convertedMsg}
            convertedPersonalizedMsg={convertedPersonalizedMsg}
          />

          <StepperNavigationButtons
            className="m-2"
            leftBtnLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.PREVIOUS" />
            }
            handleLeftBtnClick={handlePreviousBtnClick}
            rightBtnLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.NEXT" />
            }
            handleRightBtnClick={form.handleSubmit}
            rightBtnLabelDisable={
              !form.isValid && !(Object.keys(form.errors) > 0)
            }
          />
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = ({
  campaignsApp,
  importusersApp,
  settingsChannels,
}) => {
  const {
    createCampaign: { contentConfiguration },
    templateListBasedOnSenderId,
    convertedTinyUrls,
    convertedPersonalizedMsg,
    successAdd,
    errorAdd,
    stepIndex,
    defaultBtn,
  } = campaignsApp;
  const { colAttributesList } = importusersApp;
  const { tataSMSConnectors } = settingsChannels;
  return {
    ...contentConfiguration,
    stepIndex,
    colAttributesList,
    templateListBasedOnSenderId,
    convertedTinyUrls,
    convertedPersonalizedMsg,
    formSuccess: successAdd,
    formError: errorAdd,
    defaultBtn,
    tataSMSConnectors,
  };
};

export default connect(mapStateToProps, {
  addContentConfiguration: addCampaignCreateSuccess,
  getTemplateMessage: getTemplatesMessageBasedOnTemplateId,
  getAllTemplateList: getAllTemplatesBasedOnSenderId,
  getTinyUrl: generateTinyUrl,
  testCampaign: testSmsCampaign,
  testCampaignClean: testSmsCampaignClean,
  getColumnAttributeListAction: getColumnAttributeList,
  getPersonalizedMsgAction: getPersonalizedMsg,
  getPersonalizedMsgResetAction: getPersonalizedMsgReset,
  apiDataClean: smsContentConfigurationApiLIstClean,
  updateStepIndexAction: updateStepIndex,
  setDefaultBtnAction: setDefaultBtn,
  getSettingsSMSConnectorListAction: getSettingsSMSConnectorList,
  setCampaignInboxIdAction: setCampaignInboxId,
  setCampaignChannelIdAction: setCampaignChannelId,
})(SmsContentConfiguration);
