import React, { useEffect, useState } from 'react';
import EmailEditor from 'react-email-editor';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { addEmailTemplate, cleanSelectedEmailTemplate } from 'redux/actions';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import { NotificationManager } from 'components/common/react-notifications';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import { downloadHTMLTemplate } from 'helpers/Utils';
import { Formik, Form } from 'formik';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  addEmailTemplateErrorReset,
  getEmailTemplateById,
} from 'redux/campaigns/actions';
import HorizontalScrollbar from './HorizontalScrollbar';

const TemplateDragAndDrop = ({
  addEmailTemplateAction,
  emailTemplate,
  addEmailTemplateErrorResetAction,
  setIsChoose,
  fetchEmailTemplateById,
  resetSelectedTemplateData,
  templatePageChangeRef,
  emailEditorRef,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangeTemplateModalOpen, setChangeTemplateModalOpen] =
    useState(false);
  const templateNameRegex = /^[^*%]*$/;

  const templateSaveTypeOptions = [
    {
      id: ContentConfigurationEnums.TEMPLATE_UPDATE,
      value: ContentConfigurationEnums.TEMPLATE_UPDATE,
      label: (
        <IntlMessages
          id="EMAIL_CONTENT_CONFIGURATION.TEXT.SAVE_TEMPLATE_RADIO.UPDATE_TEMPLATE"
          values={{ templateName: emailTemplate?.name }}
        />
      ),
    },
    {
      id: ContentConfigurationEnums.SAVE_AS_NEW_TEMPLATE,
      value: ContentConfigurationEnums.SAVE_AS_NEW_TEMPLATE,
      label: (
        <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.SAVE_TEMPLATE_RADIO.NEW_TEMPLATE" />
      ),
    },
  ];

  const getTranslatedFormFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const saveTemplateSchema = Yup.object().shape({
    templateName: Yup.string().when('template_save_type', {
      is: (type) => {
        if (
          !emailTemplate?.id ||
          (emailTemplate?.id &&
            type === ContentConfigurationEnums.SAVE_AS_NEW_TEMPLATE)
        ) {
          return true;
        } else {
          return false;
        }
      },
      then: Yup.string()
        .trim()
        .matches(
          templateNameRegex,
          getTranslatedFormFieldRequiredMessage(
            'EMAIL_CONTENT_CONFIGURATION.ERROR_HANDLING.TEMPLATE_NAME_VALIDATION_ERROR'
          )
        )
        .required(
          getTranslatedFormFieldRequiredMessage(
            'EMAIL_CONTENT_CONFIGURATION.ERROR_HANDLING.TEMPLATE_NAME_REQUIRED'
          )
        ),
      otherwise: Yup.string().notRequired(),
    }),
  });
  const handleSaveTemplate = (values) => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { html, design } = data;
      const templatePayload = {
        [ContentConfigurationEnums.BODY]: html,
        [ContentConfigurationEnums.DESIGN]: design,
      };
      if (
        emailTemplate?.id &&
        values.template_save_type === ContentConfigurationEnums.TEMPLATE_UPDATE
      ) {
        templatePayload.id = emailTemplate?.id;
        templatePayload[ContentConfigurationEnums.NAME] = emailTemplate?.name;
        addEmailTemplateAction(templatePayload);
      } else {
        templatePayload[ContentConfigurationEnums.NAME] = values.templateName;
        addEmailTemplateAction(templatePayload);
      }
    });
  };
  const toggleChangeTemplateModal = () => {
    setChangeTemplateModalOpen(!isChangeTemplateModalOpen);
  };

  const handleChangeTemplateConfirmation = () => {
    setIsChoose(false);
    resetSelectedTemplateData();
    toggleChangeTemplateModal();
    if (templatePageChangeRef.current) {
      templatePageChangeRef.current();
    }
  };

  useEffect(() => {
    if (
      emailTemplate?.success === false &&
      Array.isArray(emailTemplate.error) &&
      emailTemplate.error.length > 0
    ) {
      NotificationManager.error(emailTemplate.error[0], 'error', 6000);
    }
    if (emailTemplate?.success === true) {
      setModalOpen(false);
    }
  }, [emailTemplate]);

  useEffect(() => {
    if (emailTemplate?.id && !emailTemplate.body) {
      fetchEmailTemplateById(emailTemplate.id);
    }
  }, []);

  useEffect(() => {
    if (modalOpen === false) {
      addEmailTemplateErrorResetAction();
    }
  }, [modalOpen]);

  const downloadTemplate = () => {
    if (emailEditorRef.current && emailEditorRef.current.editor) {
      emailEditorRef.current.editor.exportHtml((data) => {
        const { html } = data;
        downloadHTMLTemplate(html);
      });
    } else {
      setErrorMessage(
        <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.ERROR_HANDLING.EDITOR_VALIDATION" />
      );
    }
  };

  const onLoad = () => {
    if (emailEditorRef.current) {
      if (emailTemplate && emailTemplate.design) {
        try {
          emailEditorRef.current.editor.loadDesign(emailTemplate.design);
        } catch (error) {
          console.warn(error);
        }
      }
    }
  };

  useEffect(() => {
    if (
      emailEditorRef.current &&
      emailEditorRef.current.editor &&
      emailTemplate &&
      emailTemplate.id
    ) {
      onLoad();
    }
  }, [emailTemplate?.design]);

  return (
    <div>
      <Container fluid>
        <Row>
          <Col className="d-flex justify-content-end py-4">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret className="custom-dropdown-button">
                <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.TEMPLATE_ACTIONS" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={toggleChangeTemplateModal}>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CHANGE_TEMPLATE" />
                </DropdownItem>
                <DropdownItem onClick={toggleModal}>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.SAVE_TEMPLATE" />
                </DropdownItem>
                <DropdownItem onClick={() => downloadTemplate()}>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.DOWNLOAD" />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        <Modal
          isOpen={isChangeTemplateModalOpen}
          toggle={toggleChangeTemplateModal}
        >
          <ModalHeader toggle={toggleChangeTemplateModal}>
            <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.CHANGE_TEMPLATE" />
          </ModalHeader>
          <ModalBody>
            <p>
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.DISCARD_TEMPLATE_CHANGES" />
            </p>
            <p>
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.TEMPLATE_CHANGE_BODY" />
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleChangeTemplateModal}>
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CANCEL" />
            </Button>
            <Button color="primary" onClick={handleChangeTemplateConfirmation}>
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CONFIRM" />
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <Formik
            onSubmit={handleSaveTemplate}
            validationSchema={saveTemplateSchema}
            initialValues={{
              template_save_type: ContentConfigurationEnums.TEMPLATE_UPDATE,
              templateName: '',
            }}
          >
            {({ handleSubmit, errors, touched, setFieldValue, values }) => (
              <Form onSubmit={handleSubmit}>
                <ModalHeader toggle={toggleModal}>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.SAVE_TEMPLATE" />
                </ModalHeader>
                <ModalBody>
                  {emailTemplate?.id ? (
                    <>
                      <div>
                        <p>
                          <span className="required-star-mark">* </span>
                          <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.SAVE_TEMPLATE_HELP_TEXT" />
                        </p>
                      </div>
                      <FormGroupCoustom
                        identifier="template_save_type"
                        errors={errors}
                        touched={touched}
                        noLable
                        type="radioMulti"
                        onChange={(event) => {
                          setFieldValue(
                            'template_save_type',
                            event.target.value
                          );
                        }}
                        radioMultiOptions={templateSaveTypeOptions}
                        value={values.template_save_type}
                      />
                    </>
                  ) : null}
                  {values.template_save_type ===
                    ContentConfigurationEnums.SAVE_AS_NEW_TEMPLATE ||
                  !emailTemplate.id ? (
                    <FormGroupCoustom
                      identifier="templateName"
                      identifierLabel="EMAIL_CONTENT_CONFIGURATION.TEXT.TEMPLATE_NAME_PLACEHOLDER"
                      placeholder="EMAIL_CONTENT_CONFIGURATION.TEXT.TEMPLATE_NAME_PLACEHOLDER"
                      errors={errors}
                      touched={touched}
                      required
                    />
                  ) : null}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={handleSubmit}>
                    {emailTemplate?.id &&
                    values.template_save_type ===
                      ContentConfigurationEnums.TEMPLATE_UPDATE ? (
                      <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.UPDATE" />
                    ) : (
                      <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.SAVE" />
                    )}
                  </Button>{' '}
                  <Button color="secondary" onClick={toggleModal}>
                    <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CANCEL" />
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>
        <HorizontalScrollbar>
          <div>
            <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
          </div>
        </HorizontalScrollbar>
      </Container>
      <div id="email-editor-container" />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const { emailTemplate } = campaignsApp;
  return {
    emailTemplate,
  };
};

export default connect(mapStateToProps, {
  addEmailTemplateAction: addEmailTemplate,
  addEmailTemplateErrorResetAction: addEmailTemplateErrorReset,
  fetchEmailTemplateById: getEmailTemplateById,
  resetSelectedTemplateData: cleanSelectedEmailTemplate,
})(TemplateDragAndDrop);
