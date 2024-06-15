import React, { useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';

import { Formik, Form } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Colxx } from 'components/common/CustomBootstrap';
import {
  contactNewMessageClean,
  contactNewMssage,
  contactableInboxes,
} from 'redux/contacts/actions';
import * as Yup from 'yup';

const NewMessageModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  contactableInboxesAction,
  contableInboxes,
  contactNewMssageAction,
  currentUser,
  contactId,
  contactNewMessageCleanAction,
}) => {
  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };
  const initialValues = {
    inbox_id: '',
    toConatct: editFormData ? editFormData.name : '',
    content: '',
    mail_subject: '',
  };

  const contentSchema = Yup.object().shape({
    content: Yup.string()
      .trim()
      .required(
        getValidationMessage('NEW_CONVERSATION_CONTACT.FORM.MESSAGE_REQUIRED')
      ),
    inbox_id: Yup.string().required(
      getValidationMessage('NEW_CONVERSATION_CONTACT.FORM.INBOX_REQUIRED')
    ),
    mail_subject: Yup.string()
      .trim()
      .when('inbox_id', {
        is: (option) => getChannelType(option) === 'Channel::Email',
        then: Yup.string().required(
          getValidationMessage('NEW_CONVERSATION_CONTACT.FORM.SUBJECT_REQUIRED')
        ),
        otherwise: Yup.string().notRequired(),
      }),
  });

  const closeForm = (isSuccess) => {
    if (modalOpen) {
      toggleModal(isSuccess);
      contactNewMessageCleanAction();
    }
  };

  useEffect(() => {
    contactableInboxesAction({ id: Number(contactId) });
  }, []);

  const onSubmitNewMessage = (values) => {
    if (formLoading) {
      return false;
    }
    const sourceIdObj = contableInboxes.find(
      (item) => item.id == values.inbox_id
    );
    const postData = {
      inbox_id: Number(values.inbox_id),
      contact_id: Number(contactId),
      source_id: sourceIdObj ? sourceIdObj.source_id : null,
      additional_attributes: { mail_subject: values.mail_subject },
      message: { content: values.content },
      assignee_id: currentUser.account_id,
    };
    contactNewMssageAction(postData);
  };
  if (formSuccess) {
    closeForm('yes');
    NotificationManager.success(
      <IntlMessages id="NEW_CONVERSATION_CONTACT.FORM.SUCCESS" />,
      'Success',
      6000,
      null,
      null,
      ''
    );
  }

  if (formError && formError.errorMsg) {
    NotificationManager.error(
      formError.errorMsg,
      'Error',
      6000,
      null,
      null,
      ''
    );
  }

  const getDropDownValuesForInboxes = () => {
    let list = [];
    if (contableInboxes?.length > 0) {
      list.unshift({
        id: '',
        value: '',
        label: '',
      });
      list = [
        ...list,
        ...contableInboxes?.map((item) => {
          return {
            label: item.name,
            value: item.name,
            channel_type: item.channel_type,
            id: item.id,
          };
        }),
      ];
    }
    return list;
  };

  const getChannelType = (inbox_id) => {
    let filteredItem = contableInboxes.find((item) => item.id == inbox_id);
    return filteredItem ? filteredItem.channel_type : '';
  };

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="contacts.new-conversation-title" />
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSubmitNewMessage}
        validationSchema={contentSchema}
      >
        {({ errors, touched, handleSubmit, values, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <p>
                <IntlMessages id="contacts.new-conversation-msg" />
              </p>
              <Row className="d-flex justify-content-between align-items-center">
                <Colxx xxs="12" md="6">
                  <FormGroupCoustom
                    required
                    identifier="inbox_id"
                    identifierLabel="NEW_CONVERSATION_CONTACT.FORM.INBOX.LABEL"
                    placeholder="NEW_CONVERSATION_CONTACT.FORM.INBOX.PLACEHOLDER"
                    errors={errors}
                    touched={touched}
                    type="select"
                    options={getDropDownValuesForInboxes()}
                    value={values.inbox_id}
                    onChange={(event) => {
                      {
                        setFieldValue('inbox_id', event.target.value);
                      }
                    }}
                  />
                </Colxx>
                <Colxx xxs="12" md="6">
                  <FormGroupCoustom
                    identifier="toConatct"
                    identifierLabel="NEW_CONVERSATION_CONTACT.FORM.TO"
                    placeholder="NEW_CONVERSATION_CONTACT.FORM.TO"
                    errors={errors}
                    touched={touched}
                    disabled
                    value={editFormData.name}
                  />
                </Colxx>
              </Row>
              {getChannelType(values?.inbox_id) === 'Channel::Email' && (
                <FormGroupCoustom
                  required
                  dataTestId="mail_subject"
                  identifierLabel="NEW_CONVERSATION_CONTACT.FORM.SUBJECT"
                  placeholder="NEW_CONVERSATION_CONTACT.FORM.SUBJECT"
                  identifier="mail_subject"
                  className="rounded-3"
                  errors={errors}
                  touched={touched}
                  onChange={(event) => {
                    setFieldValue('mail_subject', event.target.value);
                  }}
                  value={values.mail_subject}
                />
              )}

              <FormGroupCoustom
                required
                identifier="content"
                type="textarea"
                identifierLabel="NEW_CONVERSATION_CONTACT.FORM.MESSAGE.LABEL"
                placeholder="NEW_CONVERSATION_CONTACT.FORM.MESSAGE.PLACEHOLDER"
                errors={errors}
                touched={touched}
                onChange={(event) => {
                  setFieldValue('content', event.target.value);
                }}
                value={values.content}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="pages.cancel" />
              </Button>
              <Button color="primary">
                <span className="label">
                  <IntlMessages id="pages.send-message" />
                </span>
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { contactsApp, authUser } = state;
  const { contableInboxes, successNewMessage, errorNewMessage } = contactsApp;
  const { currentUser } = authUser;

  return {
    contableInboxes,
    currentUser,
    formSuccess: successNewMessage,
    formError: errorNewMessage,
  };
};
export default connect(mapStateToProps, {
  contactableInboxesAction: contactableInboxes,
  contactNewMssageAction: contactNewMssage,
  contactNewMessageCleanAction: contactNewMessageClean,
})(NewMessageModal);
