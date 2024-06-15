import React, { useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from 'reactstrap';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import {
  addSmsCampaignTemplate,
  addSmsCampaignTemplateClean,
  getAllSenderId,
  updateSmsCampaignTemplate,
  updateSmsCampaignTemplateClean,
} from 'redux/campaigns/actions';
import { currentAccount, currentUserID } from 'helpers/Utils';

const AddSmsTemplateModal = ({
  modalOpen,
  formLoading,
  toggleModal,
  editFormData,
  viewData,
  addSmsTemplateClean,
  updateSmsTemplateClean,
  updateSmsTemplate,
  addSmsTemplate,
  formSuccess,
  formError,
  senderIdsList,
  getSenderId,
}) => {
  const userID = currentUserID();
  const accountId = currentAccount();

  useEffect(() => {
    getSenderId();
  }, []);

  const closeForm = () => {
    if (modalOpen) {
      addSmsTemplateClean({});
      updateSmsTemplateClean({});
      toggleModal();
    }
  };

  let heading;
  if (viewData) {
    heading = 'SMS_TEMPLATE.VIEW_MODAL_TITLE';
  } else if (typeof editFormData.id === 'undefined') {
    heading = 'SMS_TEMPLATE.ADD_NEW_MODAL_TITLE';
  } else {
    heading = 'SMS_TEMPLATE.EDIT_NEW_MODAL_TITLE';
  }

  const initialValues = {
    name: editFormData.name ?? '',
    description: editFormData.description ?? '',
    sender_id: editFormData.sender_id ?? '',
    template_id: editFormData.template_id ?? '',
    registered_dlt: editFormData.registered_dlt ?? '',
    telemarketer_id: editFormData.telemarketer_id ?? '',
    pe_id: editFormData.pe_id ?? '',
    message: editFormData.message ?? '',
    account_id: editFormData.account_id ?? accountId,
    account_user_id: editFormData.account_user_id ?? userID,
  };
  if (editFormData.id) {
    initialValues.id = editFormData.id;
  }

  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };

  const TemplateSchema = Yup.object().shape({
    name: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    description: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    sender_id: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    template_id: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    registered_dlt: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    telemarketer_id: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    pe_id: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    message: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
  });
  const onAddTemplateItem = (values) => {
    if (formLoading) {
      return false;
    }
    if (editFormData.id) {
      updateSmsTemplate(values);
    } else {
      addSmsTemplate(values);
    }
    return false;
  };

  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'SMS_TEMPLATE_FORM.EDIT.API.SUCCESS_MESSAGE'
        : 'SMS_TEMPLATE_FORM.ADD.API.SUCCESS_MESSAGE';
      closeForm();
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null
      );
    }
  }

  const getDropDownValuesForSmsSender = () => {
    const list = [];
    if (senderIdsList.length > 0) {
      list.unshift({
        id: '',
        value: '',
      });
      senderIdsList.forEach((element) => {
        list.push({
          id: element,
          value: element,
        });
      });
    }
    return list;
  };
  return (
    <Modal
      isOpen={modalOpen}
      data-testid="add-sms-template-modal"
      toggle={closeForm}
      backdrop="static"
    >
      <ModalHeader toggle={closeForm}>
        <IntlMessages id={heading} />
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={TemplateSchema}
        onSubmit={onAddTemplateItem}
      >
        {({ errors, touched, values, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
              <FormGroupCoustom
                identifier="name"
                dataTestId="name-input"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.NAME.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.NAME.PLACEHOLDER"
                errors={errors}
                touched={touched}
                disabled={viewData}
                required={true}
              />
              <FormGroupCoustom
                identifier="description"
                dataTestId="description-input"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.DESCRIPTION.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.DESCRIPTION.PLACEHOLDER"
                disabled={viewData}
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                type="select"
                identifier="sender_id"
                dataTestId="dropdown-values"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.SENDER_ID.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.SENDER_ID.PLACEHOLDER"
                disabled={viewData}
                errors={errors}
                touched={touched}
                value={values.sender_id}
                options={getDropDownValuesForSmsSender()}
                onChange={(event) =>
                  setFieldValue('sender_id', event.target.value)
                }
                required={true}
              />
              <FormGroupCoustom
                identifier="template_id"
                dataTestId="template_id-input"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.TEMPLATE_ID.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.TEMPLATE_ID.PLACEHOLDER"
                disabled={viewData}
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="registered_dlt"
                dataTestId="registered_dlt-input"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.REGISTERED_DLT.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.REGISTERED_DLT.PLACEHOLDER"
                disabled={viewData}
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="telemarketer_id"
                dataTestId="telemarketer_id-input"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.TELEMARKETER_ID.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.TELEMARKETER_ID.PLACEHOLDER"
                disabled={viewData}
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="pe_id"
                dataTestId="pe_id-input"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.PE_ID.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.PE_ID.PLACEHOLDER"
                disabled={viewData}
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="message"
                dataTestId="message-input"
                type="textarea"
                identifierLabel="SMS_TEMPLATE_FORM.FORM.MESSAGE.LABEL"
                placeholder="SMS_TEMPLATE_FORM.FORM.MESSAGE.PLACEHOLDER"
                disabled={viewData}
                errors={errors}
                touched={touched}
                required={true}
                value={values.message}
              />
            </ModalBody>
            {!viewData ? (
              <ModalFooter>
                <Button
                  color="secondary"
                  data-testid="cancel-button"
                  onClick={closeForm}
                >
                  <IntlMessages id="SMS_TEMPLATE_FORM.FORM.CANCEL" />
                </Button>
                <Button color="primary" data-testid="submit-button">
                  <IntlMessages id="SMS_TEMPLATE_FORM.FORM.SUBMIT" />
                </Button>{' '}
              </ModalFooter>
            ) : (
              ''
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const { successAdd, errorAdd, loadingAdd, senderIds } = campaignsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    senderIdsList: senderIds,
  };
};

export default connect(mapStateToProps, {
  addSmsTemplate: addSmsCampaignTemplate,
  addSmsTemplateClean: addSmsCampaignTemplateClean,
  updateSmsTemplate: updateSmsCampaignTemplate,
  updateSmsTemplateClean: updateSmsCampaignTemplateClean,
  getSenderId: getAllSenderId,
})(AddSmsTemplateModal);
