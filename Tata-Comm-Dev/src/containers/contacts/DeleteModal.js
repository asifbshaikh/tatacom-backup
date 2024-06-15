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
import IntlMessages from 'helpers/IntlMessages';
import { deleteContactItem, deleteContactItemClean } from 'redux/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';

const DeleteModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  reloadList,
  setReloadList,
  deleteContactItemAction,
  deleteContactItemCleanAction,
  onDeleteSuccess,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      deleteContactItemCleanAction({});
    }
  };

  const onDeleteContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    deleteContactItemAction(values);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      closeForm();
      if (setReloadList) {
        setReloadList(reloadList + 1);
      }
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      NotificationManager.success(
        <IntlMessages id="DELETE_CONTACT.API.SUCCESS_MESSAGE" />,
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="DELETE_CONTACT.TITLE" />
      </ModalHeader>

      <Formik initialValues={editFormData} onSubmit={onDeleteContactItem}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <IntlMessages
                id="DELETE_CONTACT.CONFIRM.MESSAGE"
                values={{ contactName: editFormData.name }}
              />

              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="DELETE_CONTACT.CONFIRM.NO" />
              </Button>
              <Button color="primary">
                <IntlMessages id="DELETE_CONTACT.CONFIRM.YES" />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { contactsApp } = state;
  const { successDelete, errorDelete, loadingDelete } = contactsApp;
  return {
    formSuccess: successDelete,
    formError: errorDelete,
    formLoading: loadingDelete,
  };
};
export default connect(mapStateToProps, {
  deleteContactItemAction: deleteContactItem,
  deleteContactItemCleanAction: deleteContactItemClean,
})(DeleteModal);
