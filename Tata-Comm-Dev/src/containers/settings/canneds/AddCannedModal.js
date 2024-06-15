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
import { addCanned, addCannedClean } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

const AddCannedModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  addCannedAction,
  addCannedCleanAction,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addCannedCleanAction({});
    }
  };

  const onAddItem = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      short_code: values.shortCode,
      content: values.content,
    };
    if (values.id) {
      newParams.id = values.id;
    }
    addCannedAction(newParams);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'CANNED_MGMT.EDIT.API.SUCCESS_MESSAGE'
        : 'CANNED_MGMT.ADD.API.SUCCESS_MESSAGE';
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
    shortCode: editFormData.short_code || '',
    content: editFormData.content || '',
  };

  const SignupSchema = Yup.object().shape({
    shortCode: Yup.string()
      .min(2, 'Must be min 2 digits')
      .required('This field is required!'),
    content: Yup.string().required('This field is required!'),
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
              ? 'CANNED_MGMT.ADD.TITLE'
              : 'CANNED_MGMT.EDIT.TITLE'
          }
        />
        {editFormData.name ? ` - ${editFormData.name}` : ''}
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
                  <IntlMessages id="CANNED_MGMT.ADD.DESC" />
                </p>
              )}
              <FormGroupCoustom
                identifier="shortCode"
                identifierLabel="CANNED_MGMT.ADD.FORM.SHORT_CODE.LABEL"
                placeholder="CANNED_MGMT.ADD.FORM.SHORT_CODE.PLACEHOLDER"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="content"
                type="textarea"
                identifierLabel="CANNED_MGMT.ADD.FORM.CONTENT.LABEL"
                placeholder="CANNED_MGMT.ADD.FORM.CONTENT.PLACEHOLDER"
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
                <IntlMessages id="CANNED_MGMT.ADD.CANCEL_BUTTON_TEXT" />
              </Button>
              <Button color="primary">
                <IntlMessages
                  id={
                    typeof editFormData.id === 'undefined'
                      ? 'CANNED_MGMT.ADD.FORM.SUBMIT'
                      : 'CANNED_MGMT.EDIT.FORM.SUBMIT'
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

const mapStateToProps = ({ cannedsApp }) => {
  const { successAdd, errorAdd, loadingAdd } = cannedsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
  };
};
export default connect(mapStateToProps, {
  addCannedAction: addCanned,
  addCannedCleanAction: addCannedClean,
})(AddCannedModal);
