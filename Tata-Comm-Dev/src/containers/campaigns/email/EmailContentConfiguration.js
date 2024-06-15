import React, { useRef, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { resetAddSuccess, updateStepIndex } from 'redux/campaigns/actions';
import IntlMessages from 'helpers/IntlMessages';
import DragAndDropEditor from './DragAndDropEditor';
import StepperNavigationButtons from '../StepperNavigationButtons';

const EmailContentConfiguration = ({
  formRef,
  next,
  previous,
  resetAddSuccessAction,
  updateStepIndexAction,
  stepIndex,
  emailTemplate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disableNextButton, setDisableNextButton] = useState(true);
  const templatePageChangeRef = useRef(null);
  const emailEditorRef = useRef(null);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const handleSubmit = () => {
    resetAddSuccessAction();
    if (emailTemplate && emailTemplate.id) {
      emailEditorRef?.current?.editor?.exportHtml((data) => {
        const { html } = data;
        if (html !== emailTemplate.body) {
          openModal();
        } else {
          updateStepIndexAction(stepIndex + 1);
          next();
        }
      });
    } else {
      openModal();
    }
  };
  const handlePreviousBtnClick = () => {
    updateStepIndexAction(stepIndex - 1);
    previous();
  };

  return (
    <>
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader>
          <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.TEMPLATE_NOT_SAVE" />
        </ModalHeader>
        <ModalBody>
          <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.TEMPLATE_ALERT" />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setIsModalOpen(false)}>
            <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.OK" />
          </Button>
        </ModalFooter>
      </Modal>
      <DragAndDropEditor
        formRef={formRef}
        handleSubmit={handleSubmit}
        templatePageChangeRef={templatePageChangeRef}
        emailEditorRef={emailEditorRef}
        setDisableNextButton={setDisableNextButton}
      />
      <StepperNavigationButtons
        className="m-2"
        leftBtnLabel={
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.BUTTON.PREVIOUS" />
        }
        handleLeftBtnClick={handlePreviousBtnClick}
        rightBtnLabel={
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.BUTTON.NEXT" />
        }
        handleRightBtnClick={handleSubmit}
        rightBtnLabelDisable={disableNextButton}
      />
    </>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const { stepIndex, emailTemplate } = campaignsApp;
  return {
    stepIndex,
    emailTemplate,
  };
};

export default connect(mapStateToProps, {
  resetAddSuccessAction: resetAddSuccess,
  updateStepIndexAction: updateStepIndex,
})(EmailContentConfiguration);
