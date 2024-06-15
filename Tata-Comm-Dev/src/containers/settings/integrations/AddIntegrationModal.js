/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

import React from 'react';
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
import { addIntegration, addIntegrationClean } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

const AddIntegrationModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  addIntegrationAction,
  addIntegrationCleanAction,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addIntegrationCleanAction({});
    }
  };

  const onAddItem = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      url: values.url,
    };
    if (values.id) {
      newParams.id = values.id;
    }
    addIntegrationAction(newParams);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'INTEGRATION_SETTINGS.WEBHOOK.EDIT.API.SUCCESS_MESSAGE'
        : 'INTEGRATION_SETTINGS.WEBHOOK.ADD.API.SUCCESS_MESSAGE';
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
    id: editFormData.id,
    url: editFormData.url || '',
  };

  const SignupSchema = Yup.object().shape({
    url: Yup.string()
      .min(2, 'Must be min 2 digits')
      .required('This field is required!'),
  });

  return (
    <Modal
      isOpen={modalOpen}
      toggle={closeForm}
      // wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={closeForm}>
        <IntlMessages
          id={
            typeof editFormData.id === 'undefined'
              ? 'INTEGRATION_SETTINGS.WEBHOOK.ADD.TITLE'
              : 'INTEGRATION_SETTINGS.WEBHOOK.EDIT.TITLE'
          }
        />
        {editFormData.id ? ` - ${editFormData.id}` : ''}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onAddItem}
      >
        {({ errors, touched }) => (
          <Form>
            <ModalBody>
              {typeof editFormData.id === 'undefined' && (
                <p>
                  <IntlMessages id="INTEGRATION_SETTINGS.WEBHOOK.ADD.DESC" />
                </p>
              )}
              <FormGroupCoustom
                identifier="url"
                identifierLabel="INTEGRATION_SETTINGS.WEBHOOK.ADD.FORM.END_POINT.LABEL"
                placeholder="INTEGRATION_SETTINGS.WEBHOOK.ADD.FORM.END_POINT.PLACEHOLDER"
                errors={errors}
                touched={touched}
                required={true}
              />
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="INTEGRATION_SETTINGS.WEBHOOK.ADD.CANCEL" />
              </Button>
              <Button color="primary">
                <IntlMessages
                  id={
                    typeof editFormData.id === 'undefined'
                      ? 'INTEGRATION_SETTINGS.WEBHOOK.ADD.FORM.SUBMIT'
                      : 'INTEGRATION_SETTINGS.WEBHOOK.EDIT.FORM.SUBMIT'
                  }
                />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ integrationsApp }) => {
  const { successAdd, errorAdd, loadingAdd } = integrationsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
  };
};
export default connect(mapStateToProps, {
  addIntegrationAction: addIntegration,
  addIntegrationCleanAction: addIntegrationClean,
})(AddIntegrationModal);
