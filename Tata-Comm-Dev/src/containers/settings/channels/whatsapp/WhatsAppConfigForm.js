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
import {
  addWhatsAppChannelConnector,
  addWhatsAppChannelConnectorClean,
  editWhatsAppChannelConnector,
} from 'redux/actions';
import CommonEnums from 'enums/commonEnums';
import { getInboxList } from 'redux/settingsChannels/actions';

const requiredMsg = (
  <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.REQUIRED_VALIDATION" />
);

const WhatsAppConfigForm = ({
  modalType,
  modalOpen,
  toggleModal,
  formRef,
  formSuccess,
  formError,
  formLoading,
  addWhatsAppChannelConnectorAction,
  editWAConnectorAction,
  addWhatsAppChannelConnectorCleanAction,
  editRow,
  getInboxListAction,
  allInboxList,
}) => {
  const [disableInbox, setDisableInbox] = useState(false);
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addWhatsAppChannelConnectorCleanAction();
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
    getInboxListAction({ Channel_type: CommonEnums.WHATSAPP });
  }, []);

  const onSubmitForm = (values, actions) => {
    actions.resetForm();
    const params = {
      channel: {
        provider: values.provider,
        phone_number: values.phoneNumber,
        provider_config: {
          phone_number_id: values.phoneNumberId,
          api_key: values.apiKey,
          waba_id: values.wabaId,
          auth_key: values.authKey,
        },
      },
    };

    if (editRow && editRow !== '') {
      params.type = CommonEnums.TATA_WHATSAPP;
      params.inbox_id = values.inbox_id;
      params.channel.channel_name = values.name;
      editWAConnectorAction({ newParams: params, id: editRow.channel_id });
    } else {
      params.type = CommonEnums.TATA_WHATSAPP;
      params.inbox_id = values.inbox_id;
      params.channel.channel_name = values.name.trim();
      addWhatsAppChannelConnectorAction(params);
    }
    return false;
  };

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

  let initialValues = {
    provider: 'TATA Communications',
    name: '',
    phoneNumber: '',
    phoneNumberId: '',
    apiKey: '',
    wabaId: '',
    authKey: '',
    inbox_id: null,
  };

  if (editRow && editRow !== '') {
    initialValues = {
      provider: editRow?.provider || '',
      name: editRow?.channel_name || '',
      phoneNumber: editRow?.phone_number || '',
      phoneNumberId: editRow?.provider_config?.phone_number_id || '',
      apiKey: editRow?.provider_config?.api_key || '',
      wabaId: editRow?.provider_config?.waba_id || '',
      authKey: editRow?.provider_config?.auth_key || '',
      inbox_id: editRow?.inbox_id || '',
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
    phoneNumberId: Yup.string().required(requiredMsg),
    apiKey: Yup.string().required(requiredMsg),
    wabaId: Yup.string().required(requiredMsg),
    authKey: Yup.string().required(requiredMsg),
    phoneNumber: Yup.string().required(requiredMsg),
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
                      {
                        id: 'tata',
                        value:
                          'CHANNEL_MGMT.WHATSAPP_CHANNEL.TATA_COMMUNICATIONS',
                      },
                    ]}
                    value={values.provider}
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="name"
                    errors={errors}
                    touched={touched}
                    dataTestId="name"
                    identifierLabel="CHANNEL_MGMT.WHATSAPP_CHANNEL.CHANNEL_NAME"
                    placeholder="CHANNEL_MGMT.WHATSAPP_CHANNEL.CHANNEL_NAME_PLACEHOLDER"
                  />
                  <FormGroupCoustom
                    identifier="phoneNumber"
                    dataTestId="phoneNumber"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.WHATSAPP_CHANNEL.PHONE_NUMBER"
                    placeholder="CHANNEL_MGMT.WHATSAPP_CHANNEL.PHONE_NUMBER_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="phoneNumberId"
                    dataTestId="phoneNumberId"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.WHATSAPP_CHANNEL.PHONE_NUMBER_ID"
                    placeholder="CHANNEL_MGMT.WHATSAPP_CHANNEL.PHONE_NUMBER_ID_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="apiKey"
                    dataTestId="apiKey"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.WHATSAPP_CHANNEL.API_TOKEN"
                    placeholder="CHANNEL_MGMT.WHATSAPP_CHANNEL.API_TOKEN_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="wabaId"
                    dataTestId="wabaId"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.WHATSAPP_CHANNEL.WABA_ID"
                    placeholder="CHANNEL_MGMT.WHATSAPP_CHANNEL.WABA_ID_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="authKey"
                    dataTestId="authKey"
                    errors={errors}
                    touched={touched}
                    identifierLabel="CHANNEL_MGMT.WHATSAPP_CHANNEL.AUTH_KEY"
                    placeholder="CHANNEL_MGMT.WHATSAPP_CHANNEL.AUTH_KEY_PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="inbox_id"
                    errors={errors}
                    touched={touched}
                    dataTestId="inbox_id"
                    identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME"
                    placeholder="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME_PLACEHOLDER"
                    disabled={disableInbox}
                    type="select"
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
  const { successWAAdd, errorWAAdd, loadingWAAdd, allInboxList } =
    settingsChannels;
  return {
    formSuccess: successWAAdd,
    formError: errorWAAdd,
    formLoading: loadingWAAdd,
    allInboxList: allInboxList,
  };
};

export default connect(mapStateToProps, {
  addWhatsAppChannelConnectorAction: addWhatsAppChannelConnector,
  addWhatsAppChannelConnectorCleanAction: addWhatsAppChannelConnectorClean,
  editWAConnectorAction: editWhatsAppChannelConnector,
  getInboxListAction: getInboxList,
})(WhatsAppConfigForm);
