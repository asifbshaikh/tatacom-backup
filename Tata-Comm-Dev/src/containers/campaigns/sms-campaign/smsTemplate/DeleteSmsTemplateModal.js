import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import {
  deleteSmsCampaignTemplate,
  deleteSmsCampaignTemplateClean,
} from 'redux/campaigns/actions';
import { NotificationManager } from 'components/common/react-notifications';

const DeleteSmsTemplateModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  deleteSmsTemplate,
  deleteSmsTemplateClean,
  editFormData,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      deleteSmsTemplateClean({});
    }
  };

  const onDeleteContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    deleteSmsTemplate(values);
    return false;
  };

  if (modalOpen) {
    if (formSuccess) {
      const successMsg = 'SMS_TEMPLATE_FORM.DELETE.API.SUCCESS_MESSAGE';
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
  if (formError && formError?.errorMsg) {
    NotificationManager.error(formError?.errorMsg, 'Error', 6000, null, null);
  }

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="DELETE_SMS_TEMPLATE.TITLE" />
      </ModalHeader>

      <Formik initialValues={editFormData} onSubmit={onDeleteContactItem}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <IntlMessages id="DELETE_SMS_TEMPLATE.CONFIRM.MESSAGE" />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="DELETE_SMS_TEMPLATE.CONFIRM.NO" />
              </Button>
              <Button color="primary">
                <IntlMessages id="DELETE_SMS_TEMPLATE.CONFIRM.YES" />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const { successDelete, errorDelete, loadingDelete } = campaignsApp;
  return {
    formSuccess: successDelete,
    formError: errorDelete,
    formLoading: loadingDelete,
  };
};

export default connect(mapStateToProps, {
  deleteSmsTemplate: deleteSmsCampaignTemplate,
  deleteSmsTemplateClean: deleteSmsCampaignTemplateClean,
})(DeleteSmsTemplateModal);
