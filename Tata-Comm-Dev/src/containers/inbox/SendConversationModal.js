/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

import React, { useState } from 'react';
import {
  // CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Input,
  //   Label,
  //   FormText,
  //   FormGroup,
  // Form,
  //   InputGroupAddon,
  Alert,
} from 'reactstrap';

import {
  Formik,
  Form,
  //   Field
} from 'formik';
// import Select from 'react-select';
// import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';

// import { loginUser } from 'redux/actions';
import { sendConversation, sendConversationClean } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

/*
const FormGroupCoustom = ({ identifier, identifierLabel, identifierIP, errors, touched, type, help, value, prepend }) => {
  if (!identifierLabel) {
    identifierLabel = `contacts.${identifier}`;
  }
  if (!identifierIP) {
    identifierIP = identifier;
  }
  const extraParams = {};
  if (value) {
    extraParams.value = value;
  }
  if (type) {
    extraParams.type = type;
    if (type === 'textarea') {
      extraParams.as = type;
    }
  }
  return (
    <FormGroup className={`form-group ${!prepend ? 'has-float-label' : 'mb3 input-group'}`}>
      {!prepend && (<Label>
        <IntlMessages id={identifierLabel} />
      </Label>)}
      {prepend && (<InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>)}

      <Field
        className="form-control"
        name={identifierIP}
        // validate={true}
        {...extraParams}
      />
      {help && (
        <FormText color="muted">
          <IntlMessages id={help} />
        </FormText>
      )}
      {errors[identifierIP] && touched[identifierIP] && (
        <div className="invalid-feedback d-block">
          {errors[identifierIP]}
        </div>
      )}
    </FormGroup>
  );
}
*/

const SendConversationModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  sendConversationAction,
  sendConversationCleanAction,
  selectedConversation,
}) => {
  const [emailFieldVisible, setEmailFieldVisible] = useState(false);

  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      sendConversationCleanAction({});
      if (emailFieldVisible) {
        setEmailFieldVisible(false);
      }
    }
  };

  const onsendConversation = (values) => {
    if (formLoading) {
      return false;
    }
    const { conversationId, selectedType, otherEmailAddressEmail } = values;
    const postData = { conversationId, email: '' };
    switch (selectedType) {
      case 'other_email_address':
        postData.email = otherEmailAddressEmail;
        break;
      case 'contact':
        postData.email = selectedConversation.meta.sender.email;
        break;
      case 'assignee':
        postData.email = selectedConversation.meta.assignee.email;
        break;
      default:
        break;
    }
    sendConversationAction(postData);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      NotificationManager.success(
        'Saved successfully',
        'Success',
        6000,
        null,
        null,
        '' // className
      );
      closeForm();
    }
  }

  const initialValues = {
    conversationId: selectedConversation?.id,
    selectedType: '',
    otherEmailAddressEmail: '',
  };

  const SignupSchema = Yup.object().shape({
    selectedType: Yup.string().required('Type is required!'),
    otherEmailAddressEmail: Yup.string()
      .when('selectedType', {
        is: 'other_email_address',
        then: (schema) => schema.required('Email is required!'), // yup.string().required(),
        otherwise: (schema) => schema.nullable(),
      })
      .email('Invalid Email address'),
  });

  return (
    <Modal
      isOpen={modalOpen}
      toggle={closeForm}
      // wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="inbox.send-conversations-title" />
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        enableReinitialize
        onSubmit={onsendConversation}
      >
        {({ errors, touched, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <p>
                <IntlMessages id="inbox.send_conversation_msg" />
              </p>
              <FormGroupCoustom
                className="custom-radio custom-control"
                identifier="selectedType"
                errors={errors}
                touched={touched}
                type="radioMulti"
                noLable
                radioMultiOptions={[
                  ...(selectedConversation.meta &&
                  selectedConversation.meta.sender?.email
                    ? [
                        {
                          id: 'contact',
                          value: 'contact',
                          label: 'inbox.send_to_contact',
                        },
                      ]
                    : []),
                  ...(selectedConversation.meta &&
                  selectedConversation.meta.assignee?.email
                    ? [
                        {
                          id: 'assignee',
                          value: 'assignee',
                          label: 'inbox.send_to_assignee',
                        },
                      ]
                    : []),
                  {
                    id: 'other_email_address',
                    value: 'other_email_address',
                    label: 'inbox.other_email_address',
                  },
                ]}
                onChange={(event) => {
                  setEmailFieldVisible(
                    event.target.value === 'other_email_address'
                  );
                  setFieldValue('selectedType', event.target.value, false);
                }}
              />
              {emailFieldVisible && (
                <FormGroupCoustom
                  dataTestId="otherEmailAddressEmail"
                  identifier="otherEmailAddressEmail"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inbox.other_email_address_email"
                  required={true}
                />
              )}

              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="pages.cancel" />
              </Button>
              <Button color="primary">
                <IntlMessages id="pages.submit" />
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ inboxApp }) => {
  const {
    successSendConversation,
    errorSendConversation,
    loadingSendConversation,
  } = inboxApp;
  return {
    formSuccess: successSendConversation,
    formError: errorSendConversation,
    formLoading: loadingSendConversation,
  };
};
export default connect(mapStateToProps, {
  sendConversationAction: sendConversation,
  sendConversationCleanAction: sendConversationClean,
})(SendConversationModal);
