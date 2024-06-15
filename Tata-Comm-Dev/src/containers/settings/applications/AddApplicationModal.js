/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

import React, { useEffect } from 'react';
import {
  // CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Input,
  // Label,
  // Form,
  Alert,
} from 'reactstrap';

import {
  Formik,
  Form,
  // Field
} from 'formik';
// import Select from 'react-select';
// import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';

// import { loginUser } from 'redux/actions';
import { addApplication, addApplicationClean, getInbox } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { onChangeDefault } from 'helpers/TringReactHelper';

const AddApplicationModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  editFormData,
  addApplicationAction,
  addApplicationCleanAction,
  isHookTypeInbox,
  integration,
  inboxes,
  getInboxAction,
}) => {
  useEffect(() => {
    getInboxAction();
  }, []);
  if (!integration.id) {
    return false;
  }

  const isIntegrationDialogflow = () => {
    return integration.id === 'dialogflow';
  };
  const connectedDialogflowInboxIds = () => {
    if (!isIntegrationDialogflow()) {
      return [];
    }
    return integration.hooks.map((hook) => hook.inbox?.id);
  };
  const allInboxes = () => {
    return inboxes
      .filter((inbox) => {
        if (!isIntegrationDialogflow()) {
          return true;
        }
        return !connectedDialogflowInboxIds().includes(inbox.id);
      })
      .map((inbox) => ({ label: inbox.name, value: inbox.id }));
  };
  console.warn(allInboxes());
  const formItems = () => {
    return integration ? integration.settings_form_schema : [];
  };
  const buildHookPayload = (values) => {
    const hookPayload = {
      app_id: integration.id,
      settings: {},
    };

    hookPayload.settings = Object.keys(values).reduce((acc, key) => {
      if (key !== 'inbox') {
        acc[key] = values[key];
      }
      return acc;
    }, {});

    formItems().forEach((item) => {
      try {
        if (item.validation.includes('JSON')) {
          hookPayload.settings[item.name] = JSON.parse(
            hookPayload.settings[item.name]
          );
        }
      } catch (error) {
        console.warn(error);
      }
    });

    if (isHookTypeInbox() && values.inbox) {
      hookPayload.inbox_id = values.inbox;
    }

    return hookPayload;
  };

  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addApplicationCleanAction({});
    }
  };

  const onAddItem = (values) => {
    // if (formLoading) {
    //   return false;
    // }
    const newParams = buildHookPayload(values);
    addApplicationAction(newParams);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'APPLICATION_MGMT.EDIT.API.SUCCESS_MESSAGE'
        : 'APPLICATION_MGMT.ADD.API.SUCCESS_MESSAGE';
      closeForm();
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        '' // className
      );
    }
  }

  const initialValues = {
    inbox: '',
  };

  const SignupSchemaObj = {};
  formItems().map((formItem) => {
    initialValues[formItem.name] = '';
    const validations = formItem.validation;
    if (validations === 'required') {
      SignupSchemaObj[formItem.name] = Yup.string().required(
        'This field is required!'
      );
    } else if (
      validations === 'required|JSON' ||
      validations === 'JSON|required'
    ) {
      SignupSchemaObj[formItem.name] = Yup.object().required(
        formItem['validation-messages'].required
      );
      // .json(formItem["validation-messages"].JSON);
    }
    return '';
  });
  const SignupSchema = Yup.object().shape(SignupSchemaObj);

  return (
    <Modal
      isOpen={modalOpen}
      toggle={closeForm}
      // wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={closeForm}>
        {/* <IntlMessages id={integration.name} /> */}
        {integration.name}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        enableReinitialize
        onSubmit={onAddItem}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <ModalBody>
              {/* <p><IntlMessages id={integration.desc} /></p> */}
              {integration.desc}
              {formItems().map((formItem) => {
                return (
                  <FormGroupCoustom
                    key={`formelem_${formItem.name}`}
                    identifier={formItem.name}
                    identifierLabel={formItem.label}
                    type={formItem.type}
                    errors={errors}
                    touched={touched}
                    required={true}
                  />
                );
              })}
              {isHookTypeInbox && (
                <FormGroupCoustom
                  identifier="inbox"
                  errors={errors}
                  touched={touched}
                  identifierLabel="INTEGRATION_APPS.ADD.FORM.INBOX.LABEL"
                  type="select"
                  options={inboxes.map((inbox) => {
                    return { id: inbox.id, value: inbox.name };
                  })}
                  value={values.inbox}
                  onChange={(event) =>
                    onChangeDefault(event, 'inbox', setFieldValue)
                  }
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
                <IntlMessages id="INTEGRATION_APPS.ADD.FORM.CANCEL" />
              </Button>
              <Button color="primary">
                <IntlMessages id="INTEGRATION_APPS.ADD.FORM.SUBMIT" />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ applicationsApp, inboxApp }) => {
  const { successAdd, errorAdd, loadingAdd } = applicationsApp;
  const { inboxes } = inboxApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    inboxes,
  };
};
export default connect(mapStateToProps, {
  addApplicationAction: addApplication,
  addApplicationCleanAction: addApplicationClean,
  getInboxAction: getInbox,
})(AddApplicationModal);
