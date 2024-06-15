import { NotificationManager } from 'components/common/react-notifications';
import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const SaveAndDeleteModal = ({
  header,
  children,
  disableLeftBtn = false,
  disableRightBtn = false,
  leftHandleOnClick,
  leftBtnLabel = 'CONVERSATION_FILTERS.BUTTONS.SAVE_FILTER',
  rightHandleOnClick,
  rightBtnLabel = 'CONVERSATION_FILTERS.BUTTONS.CANCEL',
  filterIsOpen,
  inputToggle,
  formSuccess,
  formError,
  successMsg,
}) => {
  if (formSuccess) {
    inputToggle();
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
  }

  if (formError && formError.error) {
    NotificationManager.error(formError?.errorMsg, 'Error', 6000, null, null);
  }

  return (
    <Modal
      isOpen={filterIsOpen}
      toggle={inputToggle}
      size="md"
      centered={true}
      style={{ boxShadow: 'none' }}
    >
      <ModalHeader toggle={inputToggle}>{header}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button
          type="button"
          color="secondary"
          onClick={rightHandleOnClick}
          disabled={disableRightBtn}
        >
          <IntlMessages id={rightBtnLabel} />
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={leftHandleOnClick}
          disabled={disableLeftBtn}
        >
          <IntlMessages id={leftBtnLabel} />
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SaveAndDeleteModal;
