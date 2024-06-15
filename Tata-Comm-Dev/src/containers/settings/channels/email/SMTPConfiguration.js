import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Alert,
  ModalFooter,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Colxx } from 'components/common/CustomBootstrap';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import {
  addEmailConnector,
  addEmailConnectorClean,
  editEmailConnector,
} from 'redux/actions';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import { getInboxList } from 'redux/settingsChannels/actions';
import CommonEnums from 'enums/commonEnums';

const SMTPConfiguration = ({
  formRef,
  modalOpen,
  toggleModal,
  editRow,
  modalType,
  formSuccess,
  formError,
  formLoading,
  addConnectorAction,
  editConnectorAction,
  addConnectorCleanAction,
  getInboxListAction,
  allInboxList,
}) => {
  const [disableInbox, setDisableInbox] = useState(false);
  let initialValues = {
    smtp_address: '',
    email_api_key: '',
    email_api_url: '',
    inbox_id: null,
  };

  if (editRow && editRow !== '') {
    initialValues = {
      smtp_address: editRow.channel_name,
      email_api_key: editRow.email_api_key,
      email_api_url: editRow.email_api_url,
      inbox_id: editRow.inbox_id,
    };
  }

  const ConnectorConfigSchema = Yup.object().shape({
    smtp_address: Yup.string().required(ContentConfigurationEnums.CONNECTOR),
    email_api_key: Yup.string().required(ContentConfigurationEnums.API_KEY),
    email_api_url: Yup.string().required(ContentConfigurationEnums.API_URL),
  });

  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addConnectorCleanAction();
    }
  };

  const getDropDownValues = () => {
    const arr = [{ id: '', value: 'CHANNEL_MGMT.CHANNEL.NO_INBOX' }];
    if (allInboxList) {
      allInboxList.map((data) => {
        if (data.channel_id) {
          return arr.push({
            id: data.id,
            value: data.name,
            disabled: true,
          });
        }
        return arr.push({
          id: data.id,
          value: data.name,
          disabled: false,
        });
      });
    }
    return arr;
  };

  useEffect(() => {
    getInboxListAction({ Channel_type: CommonEnums.EMAIL });
  }, []);

  if (modalOpen) {
    if (formSuccess) {
      closeForm();
      NotificationManager.success(
        'Saved successfully',
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }

  useEffect(() => {
    if (editRow?.inbox_id) {
      setDisableInbox(true);
    } else {
      setDisableInbox(false);
    }
  }, [editRow, modalOpen]);

  const onSubmitForm = (values) => {
    const params = {
      channel: {
        channel_name: values.smtp_address.trim(),
        email_api_key: values.email_api_key,
        email_api_url: values.email_api_url,
      },
      type: CommonEnums.EMAIL,
      inbox_id: values.inbox_id,
    };

    if (params.channel.smtp_auth_enable === 'false') {
      params.channel.smtp_email = '';
      params.channel.smtp_password = '';
    }

    if (editRow && editRow !== '') {
      params.channel.id = editRow.channel_id;
      editConnectorAction(params);
    } else {
      addConnectorAction(params);
    }

    return false;
  };

  const handleInboxName = (setFieldValue, event) => {
    setFieldValue('inbox_id', event.target.value);
  };

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        {modalType === 'Add' ? (
          <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.ADD_CONFIG_LABEL" />
        ) : (
          <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.EDIT_CONFIG_LABEL" />
        )}
      </ModalHeader>

      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={ConnectorConfigSchema}
        validateOnMount
        validateOnChange
        onSubmit={onSubmitForm}
      >
        {({ errors, touched, isValid, dirty, handleSubmit, setFieldValue }) => (
          <Form
            onSubmit={handleSubmit}
            className="av-tooltip tooltip-label-right"
          >
            <ModalBody>
              <Row>
                <Colxx xxs="12">
                  <FormGroupCoustom
                    identifier="smtp_address"
                    errors={errors}
                    touched={touched}
                    dataTestId="smtpAddress"
                    identifierLabel="CHANNEL_MGMT.EMAIL_CHANNEL.SMTP_HOSTNAME.LABEL"
                    placeholder="CHANNEL_MGMT.EMAIL_CHANNEL.SMTP_HOSTNAME.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="email_api_key"
                    errors={errors}
                    touched={touched}
                    dataTestId="apiKey"
                    identifierLabel="CHANNEL_MGMT.EMAIL_CHANNEL.API_KEY.LABEL"
                    placeholder="CHANNEL_MGMT.EMAIL_CHANNEL.API_KEY.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="email_api_url"
                    errors={errors}
                    touched={touched}
                    dataTestId="emailApiUrl"
                    identifierLabel="CHANNEL_MGMT.EMAIL_CHANNEL.API_URL.LABEL"
                    placeholder="CHANNEL_MGMT.EMAIL_CHANNEL.API_URL.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="inbox_id"
                    errors={errors}
                    touched={touched}
                    dataTestId="inbox_id"
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME"
                    placeholder="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME_PLACEHOLDER"
                    type="select"
                    disabled={disableInbox}
                    className="provider-lable"
                    options={getDropDownValues()}
                    onChange={(event) => handleInboxName(setFieldValue, event)}
                  />
                  {formError && formError.errorMsg && (
                    <Alert color="danger" className="rounded">
                      {formError.errorMsg}
                    </Alert>
                  )}
                </Colxx>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                dataTestId="smtpSubmitBtn"
                disabled={!isValid || !dirty}
              >
                <IntlMessages id="pages.submit" />
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { successEmailConnector, errorAdd, loadingAdd, allInboxList } =
    settingsChannels;
  return {
    formSuccess: successEmailConnector,
    formError: errorAdd,
    formLoading: loadingAdd,
    allInboxList: allInboxList,
  };
};

export default connect(mapStateToProps, {
  addConnectorAction: addEmailConnector,
  addConnectorCleanAction: addEmailConnectorClean,
  editConnectorAction: editEmailConnector,
  getInboxListAction: getInboxList,
})(SMTPConfiguration);
