import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import {
  deleteDbConnection,
  deleteDbConnectionClean,
  deleteImport,
  cleanDeleteImportError,
} from 'redux/s3-sftp/actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import CommonEnums from 'enums/commonEnums';

const DeleteDbImportModal = ({
  intl,
  deleteImportAction,
  id,
  successImportDeleteAdd,
  errorImportDeleteAdd,
  modalOpen,
  toggleModal,
  cleanDeleteImportErrorAction,
}) => {
  const history = useHistory();
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
    }
  };

  const handleDeny = () => {
    closeForm();
  };

  const handleSubmit = () => {
    closeForm();
    deleteImportAction(id);
  };

  useEffect(() => {
    if (successImportDeleteAdd?.message) {
      NotificationManager.success(
        successImportDeleteAdd.message,
        CommonEnums.SUCCESS,
        6000,
        null,
        null,
        ''
      );
      history.push(`${adminRoot}/segments/db-imports/list`);
      cleanDeleteImportErrorAction();
    }
  }, [successImportDeleteAdd]);

  useEffect(() => {
    cleanDeleteImportErrorAction();
  }, []);

  useEffect(() => {
    if (
      (errorImportDeleteAdd && errorImportDeleteAdd.errors) ||
      (errorImportDeleteAdd && errorImportDeleteAdd.errorMsg)
    ) {
      const error =
        errorImportDeleteAdd.errors || errorImportDeleteAdd.errorMsg;
      NotificationManager.error(error, CommonEnums.ERROR, 6000, null, null, '');
      cleanDeleteImportErrorAction();
    }
  }, [errorImportDeleteAdd]);

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.DELETE_MODAL.MODAL_TITLE" />
      </ModalHeader>

      <ModalBody>
        <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.DELETE_MODAL.CONFIRM_MESSAGE" />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={handleDeny}>
          <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.DELETE_MODAL.DENY_BUTTON" />
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.DELETE_MODAL.CONFIRM_BUTTON" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const { errorImportDeleteAdd, successImportDeleteAdd } = s3sftpApp;
  return {
    errorImportDeleteAdd,
    successImportDeleteAdd,
  };
};
export default connect(mapStateToProps, {
  deleteImportAction: deleteImport,
  cleanDeleteImportErrorAction: cleanDeleteImportError,
})(DeleteDbImportModal);
