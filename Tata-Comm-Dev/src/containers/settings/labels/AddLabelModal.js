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
import { addLabel, addLabelClean } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
// import { onChangeDefault } from 'helpers/TringReactHelper';

const AddLabelModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  addLabelAction,
  addLabelCleanAction,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addLabelCleanAction({});
    }
  };

  const onAddItem = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      color: values.color,
      description: values.description,
      title: values.title,
      show_on_sidebar: values.showOnSidebar,
    };
    if (values.id) {
      newParams.id = values.id;
    }
    addLabelAction(newParams);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'LABEL_MGMT.EDIT.API.SUCCESS_MESSAGE'
        : 'LABEL_MGMT.ADD.API.SUCCESS_MESSAGE';
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
    color: editFormData.color || '#000',
    description: editFormData.description || '',
    title: editFormData.title || '',
    showOnSidebar:
      typeof editFormData.show_on_sidebar !== 'undefined'
        ? editFormData.show_on_sidebar
        : true,
  };

  const SignupSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Must be min 2 digits')
      .required('This field is required!'),
    description: Yup.string().required('This field is required!'),
    color: Yup.string().required('This field is required!'),
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
              ? 'LABEL_MGMT.ADD.TITLE'
              : 'LABEL_MGMT.EDIT.TITLE'
          }
        />
        {editFormData.title ? ` - ${editFormData.title}` : ''}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onAddItem}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <ModalBody>
              {typeof editFormData.id === 'undefined' && (
                <p>
                  <IntlMessages id="LABEL_MGMT.ADD.DESC" />
                </p>
              )}
              <FormGroupCoustom
                dataTestId="labelName"
                identifier="title"
                identifierLabel="LABEL_MGMT.FORM.NAME.LABEL"
                placeholder="LABEL_MGMT.FORM.NAME.PLACEHOLDER"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                dataTestId="labelDescription"
                identifier="description"
                identifierLabel="LABEL_MGMT.FORM.DESCRIPTION.LABEL"
                placeholder="LABEL_MGMT.FORM.DESCRIPTION.PLACEHOLDER"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="color"
                identifierLabel="LABEL_MGMT.FORM.COLOR.LABEL"
                className="label-color-picker"
                type="color"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="showOnSidebar"
                errors={errors}
                touched={touched}
                type="checkboxMulti"
                noLable
                radioMultiOptions={[
                  {
                    id: 'showsidebar_enabled',
                    value: 'enabled',
                    label: 'LABEL_MGMT.FORM.SHOW_ON_SIDEBAR.LABEL',
                  },
                ]}
                onChange={(event) => {
                  setFieldValue('showOnSidebar', event.target.checked, false);
                }}
                value={values.showOnSidebar ? ['enabled'] : []}
              />
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="LABEL_MGMT.FORM.CANCEL" />
              </Button>
              <Button color="primary">
                <IntlMessages
                  id={
                    typeof editFormData.id === 'undefined'
                      ? 'LABEL_MGMT.FORM.CREATE'
                      : 'LABEL_MGMT.FORM.EDIT'
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

const mapStateToProps = ({ labelsApp }) => {
  const { successAdd, errorAdd, loadingAdd } = labelsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
  };
};
export default connect(mapStateToProps, {
  addLabelAction: addLabel,
  addLabelCleanAction: addLabelClean,
})(AddLabelModal);
