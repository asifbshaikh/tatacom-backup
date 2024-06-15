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
import { NotificationManager } from 'components/common/react-notifications';
import {
  deleteDbConnection,
  deleteDbConnectionClean,
} from 'redux/s3-sftp/actions';

const DeleteDbConnectionModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  reloadList,
  setReloadList,
  deleteDbConnectionAction,
  deleteDbConnectionCleanAction,
  onDeleteSuccess,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      deleteDbConnectionCleanAction({});
    }
  };

  const onDeleteDbConnection = (values) => {
    if (formLoading) {
      return false;
    }
    deleteDbConnectionAction(values);
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
        <IntlMessages id="S3SFTP.DB_CONNECTION_LIST.DELETE_MODAL.API.SUCCESS_MESSAGE" />,
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }

  if (formError && formError.errorMsg) {
    closeForm();
    NotificationManager.error(
      <IntlMessages id="S3SFTP.DB_CONNECTION_LIST.DELETE_MODAL.API.ERROR_MESSAGE" />,
      'Error',
      6000,
      null,
      null,
      ''
    );
  }

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="S3SFTP.DB_CONNECTION_LIST.DELETE_MODAL.MODAL_TITLE" />
      </ModalHeader>

      <Formik initialValues={editFormData} onSubmit={onDeleteDbConnection}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <IntlMessages id="S3SFTP.DB_CONNECTION_LIST.DELETE_MODAL.CONFIRM_MESSAGE" />
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="S3SFTP.DB_CONNECTION_LIST.DELETE_MODAL.DENY_BUTTON" />
              </Button>
              <Button color="primary">
                <IntlMessages id="S3SFTP.DB_CONNECTION_LIST.DELETE_MODAL.CONFIRM_BUTTON" />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const { successDelete, errorDelete, loadingDelete } = s3sftpApp;
  return {
    formSuccess: successDelete,
    formError: errorDelete,
    formLoading: loadingDelete,
  };
};
export default connect(mapStateToProps, {
  deleteDbConnectionAction: deleteDbConnection,
  deleteDbConnectionCleanAction: deleteDbConnectionClean,
})(DeleteDbConnectionModal);
