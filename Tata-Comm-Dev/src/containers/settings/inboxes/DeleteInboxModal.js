/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

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
import IntlMessages, { intlDirectMessage } from 'helpers/IntlMessages';

import { deleteInbox, deleteInboxClean } from 'redux/actions';
import { connect } from 'react-redux';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

const DeleteInboxModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  deleteInboxAction,
  deleteInboxCleanAction,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      deleteInboxCleanAction({});
    }
  };
  let initialValues = {
    inboxName: '',
    editFormData: editFormData,
  };

  const onDeleteContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    deleteInboxAction(values.editFormData);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      closeForm();
      // setReloadList(reloadList + 1);
      NotificationManager.success(
        'Deleted successfully',
        'Success',
        6000,
        null,
        null,
        '' // className
      );
    }
  }

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="inboxes.delete-modal-title" />
      </ModalHeader>

      <Formik initialValues={initialValues} onSubmit={onDeleteContactItem}>
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <IntlMessages id="inboxes.delete_confirm" /> {editFormData.name} ?
              <FormGroupCoustom
                className="mt-3"
                identifier="inboxName"
                errors={errors}
                touched={touched}
                identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME"
                customPlaceholder={intlDirectMessage(
                  {
                    id: 'CREATE_INBOX.PLACEHOLDER.INBOX_DELETE',
                  },
                  {
                    inboxName: editFormData.name,
                  }
                )}
              />
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                outline
                onClick={closeForm}
                className="text-truncate btn-mw-200"
              >
                <IntlMessages
                  id="pages.keep-inbox"
                  values={{ inboxName: editFormData.name }}
                />
              </Button>
              <Button
                color="primary"
                disabled={editFormData.name === values.inboxName ? false : true}
                className="text-truncate btn-mw-200"
              >
                <IntlMessages
                  id="pages.delete-inbox"
                  values={{ inboxName: editFormData.name }}
                />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ inboxApp }) => {
  const { successDeleteInbox, errorDeleteInbox, loadingDeleteInbox } = inboxApp;
  return {
    formSuccess: successDeleteInbox,
    formError: errorDeleteInbox,
    formLoading: loadingDeleteInbox,
  };
};
export default connect(mapStateToProps, {
  deleteInboxAction: deleteInbox,
  deleteInboxCleanAction: deleteInboxClean,
})(DeleteInboxModal);
