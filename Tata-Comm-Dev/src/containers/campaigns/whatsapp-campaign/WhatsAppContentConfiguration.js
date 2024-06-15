import React, { useEffect, useState } from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import { Formik, Form } from 'formik';
import {
  addCampaignCreateSuccess,
  getColumnAttributeList,
  getSettingsWhatsAppConnectorList,
} from 'redux/actions';
import { connect } from 'react-redux';
import '../../../assets/css/sass/views/campaign.scss';
import IntlMessages from 'helpers/IntlMessages';
import CommonEnums from 'enums/commonEnums';
import * as Yup from 'yup';
import {
  generateTinyUrl,
  getPersonalizedMsg,
  getPersonalizedMsgReset,
  smsContentConfigurationApiLIstClean,
  getTemplatesMessageBasedOnTemplateId,
  getWhatsAppCampaignTemplatesList,
  setDefaultBtn,
  testWhatsAppCampaign,
  testWhatsAppCampaignClean,
  setCampaignInboxId,
  updateStepIndex,
  setWhatsAppCampaignTemplateCategory,
  setCampaignChannelId,
} from 'redux/campaigns/actions';
import { NotificationManager } from 'components/common/react-notifications';
import { getWhatsAppMessageFormat } from 'helpers/campaignHelper';
import StepperNavigationButtons from '../StepperNavigationButtons';
import PersonalizeModal from '../PersonalizeModal';
import ContentConfiguration from '../ContentConfiguration';
import TestCampaign from '../TestCampaign';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import { injectIntl } from 'react-intl';

const WhatsAppContentConfiguration = ({
  channelType,
  formRef,
  next,
  previous,
  addContentConfiguration,
  smsSender,
  mediaLink,
  templateRecordId,
  templateId,
  message,
  personalize,
  tinyUrlConversion,
  templateCustomized,
  getTinyUrl,
  colAttributesList,
  getAllTemplateList,
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
  tataWhatsAppConnectors,
  getSettingsWAConnectorList,
  getWACampaignTemplatesList,
  templateListWABasedOnConnectorID,
  templateListWADetailedList,
  defaultBtn,
  setDefaultBtnAction,
  setCampaignInboxIdAction,
  stepIndex,
  updateStepIndexAction,
  intl,
  category,
  campaignInfo,
  setWhatsAppCampaignTemplateCategoryAction,
  setCampaignChannelIdAction,
}) => {
  const initialValues = {
    channelType: channelType ?? '',
    smsSender: smsSender ?? '',
    mediaLink: mediaLink ?? '',
    templateRecordId: templateRecordId ?? '',
    category: category ?? '',
    message: message ?? '',
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
  const [msgFormat, setMsgFormat] = useState([]);
  const [actionButtons, setActionButtons] = useState([]);

  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };
  const messages = intl;
  const phoneRegExp =
    /^(\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1))[- ]?\d{1,14}$/;

  const mediaLinkRegExp =
    //eslint-disable-next-line
    /^https:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\/\s]+)*(?:\.pdf|\.jpeg|\.jpg|\.mp4|\.png)$/;

  const contentSchema = Yup.object().shape({
    smsSender: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    templateRecordId: Yup.string(),
    mediaLink: Yup.string().when('category', {
      is: ContentConfigurationEnums.WITH_MEDIA,
      then: Yup.string()
        .required(getValidationMessage('forms.required-message'))
        .matches(
          mediaLinkRegExp,
          'Only accepts .jpeg, .jpg, .png, .pdf and .mp4 format'
        ),
      otherwise: Yup.string().notRequired(),
    }),

    message: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    personalisedParam: Yup.object().shape({
      fieldsArray: Yup.array().of(
        Yup.object().shape({
          isAccepted: Yup.boolean(),
          key: Yup.string(),
          text: Yup.string(),
          type: Yup.string(),
          value: Yup.string().when('key', {
            is: (value) => value && value,
            then: Yup.string().required(),
            otherwise: Yup.string().notRequired(),
          }),
        })
      ),
    }),
    personalize: Yup.boolean().test({
      name: 'checkpersonalise',
      test: function (value, schema) {
        if (schema.parent.message && schema.parent.message.includes('{{')) {
          if (value) {
            return true;
          } else {
            return this.createError({
              message: `Please tick checkbox for personalise`,
              path: schema.path,
            });
          }
        } else {
          return true;
        }
      },
    }),
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
    getSettingsWAConnectorList(CommonEnums.WHATSAPP);
    if (colAttributesList?.length === 0) {
      getColumnAttributeListAction();
    }
    testCampaignClean({});
    return () => {
      testCampaignClean({});
    };
  }, []);

  useEffect(() => {
    if (campaignInfo?.campaign) {
      getWACampaignTemplatesList({
        connectorId: campaignInfo?.campaign?.channel_info?.id,
      });
      const withOrWithoutMedia = campaignInfo?.campaign
        ?.personalise_mapping_attribute?.media_attribute
        ? ContentConfigurationEnums.WITH_MEDIA
        : ContentConfigurationEnums.WITHOUT_MEDIA;
      const mediaLink =
        campaignInfo?.campaign?.personalise_mapping_attribute?.media_attribute
          ?.parameters[0]?.image.link ?? '';

      getDropDownValuesForWASender();
      formRef.current.setFieldValue(
        'templateRecordId',
        campaignInfo?.campaign?.message
      );
      formRef.current.setFieldValue('category', withOrWithoutMedia);
      formRef.current.setFieldValue('mediaLink', mediaLink);
      if (templateListWADetailedList.length > 0) {
        const m = templateListWADetailedList.find((e) => {
          return e.name === campaignInfo?.campaign?.message;
        });

        if (m) {
          if (
            campaignInfo?.campaign?.personalise_mapping_attribute?.custom_params
          ) {
            formRef.current.setFieldValue('personalize', true);
          } else {
            formRef.current.setFieldValue('personalize', false);
          }
          const btnsArray = m.components.find(
            (comp) => comp.type === ContentConfigurationEnums.WHATSAPP_BUTTONS
          );
          setMsgFormat(m.components);
          setActionButtons(btnsArray ? btnsArray.buttons : []);
          formRef.current.setFieldValue(
            'message',
            getWhatsAppMessageFormat(m.components)
          );
        }
      }
    }
  }, [templateListWADetailedList.length]);

  const getDropDownValuesForWASender = () => {
    const list = [];
    if (tataWhatsAppConnectors?.length > 0) {
      list.unshift({
        id: '',
        value: '',
      });
      tataWhatsAppConnectors.forEach((element) => {
        list.push({
          id: element.phone_number,
          value: element.phone_number,
        });
      });
    }
    return list;
  };

  const handleOnChangeSmsSender = (event, form) => {
    form.setFieldValue('smsSender', event.target.value, true);
    const selectedWhatsAppSender = tataWhatsAppConnectors.find(
      (item) => item.phone_number === event.target.value
    );
    setCampaignInboxIdAction(selectedWhatsAppSender?.inbox_id);
    setCampaignChannelIdAction({
      channelId: selectedWhatsAppSender?.channel_id,
      channelType: CommonEnums.WHATSAPP,
    });
    getWACampaignTemplatesList({
      connectorId: selectedWhatsAppSender?.channel_id,
    });
  };

  const handleOnChangeTemplateID = (event, form) => {
    form.setFieldValue('templateRecordId', event.value);
    form.setFieldValue('category', event.category);
    setWhatsAppCampaignTemplateCategoryAction(event.category);
    if (templateListWADetailedList.length > 0) {
      const m = templateListWADetailedList.find((e) => {
        return e.name === event.value;
      });

      if (m) {
        form.setFieldValue('personalize', false);
        const btnsArray = m.components.find(
          (comp) => comp.type === ContentConfigurationEnums.WHATSAPP_BUTTONS
        );
        setMsgFormat(m.components);
        setActionButtons(btnsArray ? btnsArray.buttons : []);
        form.setFieldValue('message', getWhatsAppMessageFormat(m.components));
      }
    }
  };

  const cleanTestCampaign = () => {
    testCampaignClean({});
  };

  useEffect(() => {
    cleanTestCampaign();
    return () => {
      apiDataClean();
      cleanTestCampaign();
    };
  }, []);

  const handlePreviousBtnClick = () => {
    updateStepIndexAction(stepIndex - 1);
    previous();
  };

  const handleSubmit = (values) => {
    const createCampaign = {
      contentConfiguration: { ...values },
    };
    addContentConfiguration(createCampaign);
    next();
    updateStepIndexAction(stepIndex + 1);
  };

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

  if (formError.errorMsg) {
    NotificationManager.error(formError.errorMsg, 'Error', 6000, null, null);
    cleanTestCampaign();
  }

  const handleOnChangeUserAttribute = (event, form) => {
    form.setFieldValue('testUserAttribute', event.target.value);
    form.setFieldValue('testUserValue', '');
  };

  const handleOnChangeMediaLink = (event, form) => {
    form.setFieldValue('mediaLink', event.target.value);
  };

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
            senderLabelType="WHATSAPP_SENDER"
            senderType="smsSender"
            getDropDownValuesForSender={getDropDownValuesForWASender}
            handleOnChangeMediaLink={handleOnChangeMediaLink}
            handleOnChangeSender={handleOnChangeSmsSender}
            getDropDownValuesForTemplates={templateListWABasedOnConnectorID}
            handleOnChangeTemplateID={handleOnChangeTemplateID}
            setDefaultBtn={setDefaultBtnAction}
            defaultBtn={defaultBtn}
            msgFormat={msgFormat}
            getWAActionButton={actionButtons}
            campaignInfo={campaignInfo}
            previewMessage={form.values.message}
          />

          <Separator className="mb-5" />

          <TestCampaign
            form={form}
            channelType={channelType}
            handleOnChangeUserAttribute={handleOnChangeUserAttribute}
            testCampaign={testCampaign}
            convertedMsg={convertedMsg}
            convertedPersonalizedMsg={convertedPersonalizedMsg}
            getWAActionButton={actionButtons}
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
    convertedTinyUrls,
    convertedPersonalizedMsg,
    successTestWAAdd,
    errorTestWAAdd,
    templateListWABasedOnConnectorID,
    templateListWADetailedList,
    defaultBtn,
    stepIndex,
    campaignInfo,
  } = campaignsApp;
  const { colAttributesList } = importusersApp;
  const { tataWhatsAppConnectors } = settingsChannels;
  return {
    ...contentConfiguration,
    colAttributesList,
    convertedTinyUrls,
    convertedPersonalizedMsg,
    formSuccess: successTestWAAdd,
    formError: errorTestWAAdd,
    tataWhatsAppConnectors,
    templateListWABasedOnConnectorID,
    templateListWADetailedList,
    defaultBtn,
    stepIndex,
    campaignInfo,
  };
};

export default connect(mapStateToProps, {
  addContentConfiguration: addCampaignCreateSuccess,
  getTemplateMessage: getTemplatesMessageBasedOnTemplateId,
  getTinyUrl: generateTinyUrl,
  testCampaign: testWhatsAppCampaign,
  testCampaignClean: testWhatsAppCampaignClean,
  getColumnAttributeListAction: getColumnAttributeList,
  getPersonalizedMsgAction: getPersonalizedMsg,
  getPersonalizedMsgResetAction: getPersonalizedMsgReset,
  apiDataClean: smsContentConfigurationApiLIstClean,
  getSettingsWAConnectorList: getSettingsWhatsAppConnectorList,
  getWACampaignTemplatesList: getWhatsAppCampaignTemplatesList,
  setDefaultBtnAction: setDefaultBtn,
  setCampaignInboxIdAction: setCampaignInboxId,
  updateStepIndexAction: updateStepIndex,
  setCampaignChannelIdAction: setCampaignChannelId,
  setWhatsAppCampaignTemplateCategoryAction:
    setWhatsAppCampaignTemplateCategory,
})(injectIntl(WhatsAppContentConfiguration));
