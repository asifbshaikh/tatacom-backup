import React, { useEffect, useState } from 'react';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import {
  Row,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import * as Yup from 'yup';
import { NotificationManager } from 'components/common/react-notifications';
import CommonEnums from 'enums/commonEnums';
import { addChannelConnector, addChannelConnectorClean } from 'redux/actions';
import {
  editChannelConnector,
  getInboxList,
} from 'redux/settingsChannels/actions';

const requiredMsg = (
  <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.REQUIRED_VALIDATION" />
);

const TataConfigForm = ({
  modalType,
  modalOpen,
  toggleModal,
  formRef,
  formSuccess,
  formError,
  formLoading,
  addChannelWebsiteAction,
  editChannelWebsiteAction,
  addChannelWebsiteCleanAction,
  editRow,
  getInboxListAction,
  allInboxList,
}) => {
  const [disableInbox, setDisableInbox] = useState(false);
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addChannelWebsiteCleanAction();
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
    getInboxListAction({ Channel_type: CommonEnums.TATA_SMSC });
  }, []);

  const onSubmitForm = (values, actions) => {
    const params = {
      channel: {
        medium: values.provider,
        sender_type: values.senderType,
        channel_name: values.senderName.trim(),
        sender_id: values.senderID.trim(),
        auth_token: values.APIKey,
        callback_url: values.callbackURL,
      },
      inbox_id: values.inbox_id,
    };

    if (editRow && editRow !== '') {
      (params.type = CommonEnums.TATA_SMSC),
        editChannelWebsiteAction({ newParams: params, id: editRow.channel_id });
    } else {
      (params.type = CommonEnums.TATA_SMSC), addChannelWebsiteAction(params);
    }

    return false;
  };

  if (modalOpen) {
    if (formSuccess) {
      const saveMessage = <IntlMessages id="CHANNEL_MGMT.CHANNEL.SAVED_MSG" />;
      closeForm();
      NotificationManager.success(saveMessage, 'Success', 6000, null, null, '');
    }
  }

  let initialValues = {
    provider: 'tata',
    senderType: 'promotional',
    senderName: '',
    senderID: '',
    APIKey: '',
    callbackURL: '',
    inbox_id: null,
  };

  if (editRow && editRow !== '') {
    initialValues = {
      provider: editRow.medium,
      senderType: editRow.sender_type,
      senderName: editRow.channel_name,
      senderID: editRow.sender_id,
      APIKey: editRow.auth_token,
      callbackURL: editRow.callback_url,
      inbox_id: editRow.inbox_id,
    };
  }

  useEffect(() => {
    if (editRow?.inbox_id) {
      setDisableInbox(true);
    } else {
      setDisableInbox(false);
    }
  }, [editRow, modalOpen]);

  const SignupSchema = Yup.object().shape({
    senderName: Yup.string().required(requiredMsg),
    senderID: Yup.string().required(requiredMsg),
    APIKey: Yup.string().required(requiredMsg),
    callbackURL: Yup.string(),
    senderType: Yup.string().required(requiredMsg),
  });

  const handleInboxName = (setFieldValue, event) => {
    setFieldValue('inbox_id', event.target.value);
  };

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        {modalType === 'Add' ? (
          <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.ADD_CONFIG_LABEL" />
        ) : (
          <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.EDIT_CONFIG_LABEL" />
        )}
      </ModalHeader>

      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={SignupSchema}
        validateOnMount
        onSubmit={onSubmitForm}
      >
        {({ errors, touched, values, isValid, dirty, setFieldValue }) => (
          <Form className="av-tooltip tooltip-label-right">
            <ModalBody>
              <Row>
                <Colxx xxs="12">
                  <FormGroupCoustom
                    identifier="provider"
                    errors={errors}
                    touched={touched}
                    dataTestId="providerSelect"
                    identifierLabel="inboxes.whatsapp.providers.label"
                    type="select"
                    className="provider-lable"
                    options={[
                      { id: 'tata', value: 'CHANNEL_MGMT.SMS_CHANNEL.TATA' },
                    ]}
                    value={values.provider}
                  />
                  <FormGroupCoustom
                    identifier="senderType"
                    errors={errors}
                    touched={touched}
                    dataTestId="senderType"
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.SENDER_TYPE"
                    type="select"
                    className="provider-lable"
                    options={[
                      {
                        id: 'promotional',
                        value:
                          'CHANNEL_MGMT.SMS_CHANNEL.SENDER_TYPE_SELECT.PROMOTIONAL',
                      },
                      {
                        id: 'transactional',
                        value:
                          'CHANNEL_MGMT.SMS_CHANNEL.SENDER_TYPE_SELECT.TRANSACTIONAL',
                      },
                    ]}
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="senderName"
                    dataTestId="senderName"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.SENDER_NAME"
                    placeholder="CHANNEL_MGMT.SMS_CHANNEL.SENDER_NAME_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="senderID"
                    dataTestId="senderID"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.SENDER_ID"
                    placeholder="CHANNEL_MGMT.SMS_CHANNEL.SENDER_ID_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="APIKey"
                    dataTestId="APIKey"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.API_KEY_LABEL"
                    placeholder="CHANNEL_MGMT.SMS_CHANNEL.API_KEY_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="callbackURL"
                    dataTestId="callbackURL"
                    errors={errors}
                    disabled
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.CALLBACK_URL_LABEL"
                    placeholder="CHANNEL_MGMT.SMS_CHANNEL.CALLBACK_URL_PLACEHOLDER"
                  />
                  <FormGroupCoustom
                    identifier="inbox_id"
                    errors={errors}
                    touched={touched}
                    dataTestId="inbox_id"
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME"
                    placeholder="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME_PLACEHOLDER"
                    type="select"
                    className="provider-lable"
                    disabled={disableInbox}
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
                data-testid="tataSubmitBtn"
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
  const {
    successAdd,
    errorAdd,
    loadingAdd,
    addData,
    connectorList,
    allInboxList,
  } = settingsChannels;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    addData,
    allConnectorList: connectorList,
    allInboxList: allInboxList,
  };
};

export default connect(mapStateToProps, {
  addChannelWebsiteAction: addChannelConnector,
  editChannelWebsiteAction: editChannelConnector,
  addChannelWebsiteCleanAction: addChannelConnectorClean,
  getInboxListAction: getInboxList,
})(TataConfigForm);
