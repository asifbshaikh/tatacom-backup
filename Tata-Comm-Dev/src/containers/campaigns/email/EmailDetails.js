import { Colxx, Separator } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Formik, Form } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { CustomInput, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
  getEmailAddress,
  setCampaignChannelId,
  setCampaignInboxId,
  setEmailConnector,
  setFormEmailCreation,
  testEmailCampaign,
  testEmailCampaignClean,
} from 'redux/campaigns/actions';
import { connect } from 'react-redux';
import CommonEnums from 'enums/commonEnums';
import { getEmailConnectorList } from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import { NotificationManager } from 'components/common/react-notifications';
import TemplateDragAndDrop from './TemplateDragAndDrop';
import TestCampaign from '../TestCampaign';

const EmailDetails = ({
  formRef,
  getEmailAddressAction,
  emailAddress,
  getConnectorListAction,
  setEmailConnectorAction,
  connectorList,
  setFormEmailCreationAction,
  formEmailCreation,
  formSuccess,
  formError,
  testEmailCampaignAction,
  testEmailCampaignCleanAction,
  selectAudience,
  setCampaignInboxIdAction,
  setIsChoose,
  handleSubmit,
  setCampaignChannelIdAction,
  templatePageChangeRef,
  emailEditorRef,
  setDisableNextButton,
}) => {
  const initialFormValues = {
    subject: '',
    emailConnector: '',
    senderName: '',
    fromEmailAddress: '',
    replyToEmailAddress: '',
    testUserAttribute: CommonEnums.TEST_CAMPAIGN.EMAIL_ID,
    testUserValue: '',
  };
  const [replyCheckBox, setReplyCheckBox] = useState(false);

  const emailConnectorOptions = useMemo(() => {
    const options = connectorList
      ? connectorList.map((item) => {
          return {
            id: item.channel_id,
            value: item.channel_name,
          };
        })
      : [];
    options.unshift({ id: '', value: '' });
    return options;
  }, [connectorList]);

  const emailAddressesList = useMemo(() => {
    const options =
      emailAddress && emailAddress.data && emailAddress.data.email_address
        ? emailAddress.data.email_address.map((item) => {
            return {
              id: item,
              value: item,
            };
          })
        : [];
    options.unshift({ id: '', value: '' });
    return options;
  }, [emailAddress]);

  useEffect(() => {
    if (formEmailCreation && formEmailCreation.emailConnector) {
      getEmailAddressAction(formEmailCreation.emailConnector);
    }
  }, [formEmailCreation.emailConnector]);
  const cleanTestCampaign = () => {
    testEmailCampaignCleanAction({});
  };

  useEffect(() => {
    getConnectorListAction(CommonEnums.EMAIL);
    cleanTestCampaign();
    return () => {
      cleanTestCampaign();
    };
  }, []);
  useEffect(() => {
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
  }, [formSuccess]);

  useEffect(() => {
    if (formError && formError.errorMsg) {
      NotificationManager.error(formError.errorMsg, 'Error', 6000, null, null);
      cleanTestCampaign();
    }
  }, [formError]);

  useEffect(() => {
    if (formEmailCreation.emailConnector) {
      setEmailConnectorAction(formEmailCreation.emailConnector);
    }
  }, [formEmailCreation.emailConnector]);

  // const handleCCButtonClick = () => {
  //   setCCField(true);
  // };
  // const handleBCCButtonClick = () => {
  //   setBCCField(true);
  // };

  // const handleCCDeleteClick = () => {
  //   setCCField(false);
  //   setFormEmailCreation({ cc: '' })
  // };
  // const handleBCCDeleteClick = () => {
  //   setBCCField(false);
  //   setFormEmailCreation({ bcc: '' })
  // };

  const handleEmailCreation = (e) => {
    setFormEmailCreationAction({ [e.target.name]: e.target.value });
    formRef.current.setFieldValue(e.target.name, e.target.value);
    if (e.target.name === 'emailConnector') {
      const selectedEmailSender = connectorList.find(
        (item) => item.channel_id.toString() === e.target.value
      );
      setCampaignInboxIdAction(selectedEmailSender?.inbox_id);
      setCampaignChannelIdAction({
        channelId: selectedEmailSender?.channel_id,
        channelType: CommonEnums.EMAIL,
      });
    }
    if (e.target.name === 'fromEmailAddress' && replyCheckBox === true) {
      setReplyCheckBox(false);
      setFormEmailCreationAction({ replyToEmailAddress: '' });
      formRef.current.setFieldValue('replyToEmailAddress', '');
    }
    if (e.target.name === 'replyToEmailAddress' && replyCheckBox === true) {
      setReplyCheckBox(false);
    }
  };

  const handleReplyToEmailCheckbox = (email) => {
    setReplyCheckBox(!replyCheckBox);
    if (replyCheckBox) {
      setFormEmailCreationAction({ replyToEmailAddress: '' });
      formRef.current.setFieldValue('replyToEmailAddress', '');
    } else {
      setFormEmailCreationAction({ replyToEmailAddress: email });
      formRef.current.setFieldValue('replyToEmailAddress', email);
    }
  };

  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };

  const EmailContentConfigSchema = Yup.object().shape({
    subject: Yup.string().required(),
    emailConnector: Yup.number().required(),
    senderName: Yup.string().required(),
    fromEmailAddress: Yup.string().required(),
    replyToEmailAddress: Yup.string().email(
      getValidationMessage('CAMPAIGN.VALIDATION.INVALID_EMAIL')
    ),
    testUserAttribute: Yup.string(),
    testUserValue: Yup.string().when('testUserAttribute', {
      is: (option) => option === CommonEnums.TEST_CAMPAIGN.EMAIL_ID,
      then: Yup.string().test(
        getValidationMessage('CAMPAIGN.VALIDATION.VALID_EMAIL'),
        getValidationMessage('CAMPAIGN.VALIDATION.INVALID_EMAIL'),
        (value) => {
          if (typeof value === 'string') {
            const emailArray = value.split(',').map((email) => email.trim());
            return emailArray.every((email) =>
              Yup.string().email().isValidSync(email)
            );
          }
          return true;
        }
      ),
      otherwise: Yup.string().notRequired(),
    }),
  });

  useEffect(() => {
    if (formEmailCreation) {
      formRef.current.setValues({
        subject: formEmailCreation.subject ?? '',
        emailConnector: formEmailCreation.emailConnector ?? '',
        senderName: formEmailCreation.senderName ?? '',
        fromEmailAddress: formEmailCreation.fromEmailAddress ?? '',
        replyToEmailAddress: formEmailCreation.replyToEmailAddress ?? '',
        // cc: formEmailCreation.cc || "",
        // bcc: formEmailCreation.bcc || "",
        testUserAttribute: CommonEnums.TEST_CAMPAIGN.EMAIL_ID,
        testUserValue: '',
      });
    }
  }, []);

  const handleOnChangeUserAttribute = (event, form) => {
    form.setFieldValue('testUserAttribute', event.target.value);
    form.setFieldValue('testUserValue', '');
  };

  return (
    <div>
      <div className="email-details">
        <h2 className="font-weight-bold">
          <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.EMAIL_DETAILS" />
        </h2>
      </div>

      <Formik
        innerRef={formRef}
        initialValues={initialFormValues}
        validationSchema={EmailContentConfigSchema}
        validateOnBlur
        validateOnChange
        validateOnMount
        onSubmit={handleSubmit}
      >
        {(form) => {
          if (form && !form.isValid && !(Object.keys(form.errors) > 0)) {
            setDisableNextButton(true);
          } else {
            setDisableNextButton(false);
          }
          return (
            <Form className="av-tooltip">
              <Row>
                <Colxx xxs="12" sm="6">
                  <FormGroupCoustom
                    identifier="subject"
                    dataTestId="subject-input"
                    errors={form.errors}
                    touched={form.touched}
                    identifierLabel="EMAIL_CONTENT_CONFIGURATION.TEXT.SUBJECT"
                    value={form.values.subject}
                    onChange={handleEmailCreation}
                    required={true}
                  />
                </Colxx>
                <Colxx xxs="12" sm="6">
                  <FormGroupCoustom
                    identifier="emailConnector"
                    dataTestId="emailConnector-input"
                    errors={form.errors}
                    touched={form.touched}
                    identifierLabel="EMAIL_CONTENT_CONFIGURATION.TEXT.EMAIL_CONNECTOR"
                    type="select"
                    options={emailConnectorOptions}
                    value={form.values.emailConnector}
                    onChange={handleEmailCreation}
                    required={true}
                  />
                </Colxx>
                <Colxx xxs="12" sm="6">
                  <FormGroupCoustom
                    identifier="senderName"
                    dataTestId="senderName-input"
                    errors={form.errors}
                    touched={form.touched}
                    identifierLabel="EMAIL_CONTENT_CONFIGURATION.TEXT.SENDER_NAME"
                    value={form.values.senderName}
                    onChange={handleEmailCreation}
                    required={true}
                  />
                </Colxx>
                <Colxx xxs="12" sm="6">
                  <FormGroupCoustom
                    identifier="fromEmailAddress"
                    dataTestId="fromEmailAddress-input"
                    errors={form.errors}
                    touched={form.touched}
                    identifierLabel="EMAIL_CONTENT_CONFIGURATION.TEXT.FROM_EMAIL_ADDRESS"
                    type="select"
                    options={emailAddressesList}
                    value={form.values.emailAddress}
                    onChange={handleEmailCreation}
                    required={true}
                  />
                </Colxx>
                <Colxx xxs="12" sm="6">
                  <FormGroupCoustom
                    identifier="replyToEmailAddress"
                    dataTestId="replyToEmailAddressCheckBox"
                    errors={form.errors}
                    touched={form.touched}
                    identifierLabel="EMAIL_CONTENT_CONFIGURATION.TEXT.REPLY_EMAIL_ADDRESS"
                    value={form.values.replyToEmailAddress}
                    onChange={handleEmailCreation}
                  />
                  <CustomInput
                    type="checkbox"
                    id="replyToEmailAddressCheckBox"
                    checked={replyCheckBox}
                    value={form.values.fromEmailAddress}
                    onChange={() => {
                      handleReplyToEmailCheckbox(form.values.fromEmailAddress);
                    }}
                    label={
                      <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.REPLY_EMAIL_ADDRESS_CHECKBOX" />
                    }
                  />
                </Colxx>
              </Row>
              <TemplateDragAndDrop
                setIsChoose={setIsChoose}
                templatePageChangeRef={templatePageChangeRef}
                emailEditorRef={emailEditorRef}
              />
              <Separator className="mb-5" />

              <TestCampaign
                form={form}
                channelType={selectAudience.channelType}
                handleOnChangeUserAttribute={handleOnChangeUserAttribute}
                testEmailCampaignAction={testEmailCampaignAction}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
const mapStateToProps = ({ campaignsApp, settingsChannels }) => {
  const {
    emailAddress,
    formEmailCreation,
    successEmailAdd,
    errorAdd,
    createCampaign: { selectAudience },
  } = campaignsApp;
  const { tataEmailConnectors } = settingsChannels;
  return {
    emailAddress,
    formEmailCreation,
    formSuccess: successEmailAdd,
    formError: errorAdd,
    connectorList: tataEmailConnectors,
    selectAudience,
  };
};

export default connect(mapStateToProps, {
  getEmailAddressAction: getEmailAddress,
  getConnectorListAction: getEmailConnectorList,
  setEmailConnectorAction: setEmailConnector,
  setFormEmailCreationAction: setFormEmailCreation,
  testEmailCampaignAction: testEmailCampaign,
  testEmailCampaignCleanAction: testEmailCampaignClean,
  setCampaignInboxIdAction: setCampaignInboxId,
  setCampaignChannelIdAction: setCampaignChannelId,
})(EmailDetails);
