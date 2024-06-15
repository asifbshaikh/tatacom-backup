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
import { addAttribute, addAttributeClean } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

import {
  ATTRIBUTE_MODELS,
  ATTRIBUTE_TYPES,
  onChangeDefault,
  convertToSlug,
} from 'helpers/TringReactHelper';

const AddAttributeModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  addAttributeAction,
  addAttributeCleanAction,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addAttributeCleanAction({});
    }
  };

  const onAddItem = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      attribute_display_name: values.displayName,
      attribute_description: values.description,
      attribute_values: values.values,
    };
    if (values.id) {
      newParams.id = values.id;
    } else {
      // only for add case, not for edit
      newParams.attribute_model = parseInt(values.attributeModel, 10);
      newParams.attribute_display_type = parseInt(values.attributeType, 10);
      newParams.attribute_key = values.attributeKey;
    }
    addAttributeAction(newParams);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'ATTRIBUTES_MGMT.EDIT.API.SUCCESS_MESSAGE'
        : 'ATTRIBUTES_MGMT.ADD.API.SUCCESS_MESSAGE';
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

  let attributeModel = 0;
  if (editFormData.attribute_model === 'contact_attribute') {
    attributeModel = 1;
  }
  const selectedAttributeType = ATTRIBUTE_TYPES.find(
    (item) => item.option.toLowerCase() === editFormData.attribute_display_type
  );
  const initialValues = {
    id: editFormData.id,
    attributeModel: attributeModel || 0,
    displayName: editFormData.attribute_display_name || '',
    description: editFormData.attribute_description || '',
    attributeType: selectedAttributeType ? selectedAttributeType.id : 0,
    attributeKey: editFormData.attribute_key || '',
    values: editFormData.attribute_values || [],
  };

  const customAttributeSchema = Yup.object().shape({
    displayName: Yup.string()
      .min(1, <IntlMessages id="common.form.validation.required" />)
      .required(<IntlMessages id="common.form.validation.required" />),
    description: Yup.string().required(
      <IntlMessages id="common.form.validation.required" />
    ),
    attributeModel: Yup.string().required(
      <IntlMessages id="common.form.validation.required" />
    ),
    attributeType: Yup.string().required(
      <IntlMessages id="common.form.validation.required" />
    ),
    attributeKey: Yup.string().required(
      <IntlMessages id="common.form.validation.required" />
    ),
    values: Yup.array().when('attributeType', {
      is: (attributeValue) =>
        attributeValue === ATTRIBUTE_TYPES[4]?.id?.toString(),
      then: Yup.array()
        .required(
          <IntlMessages id="common.form.validation.must-have-one-value" />
        )
        .min(
          1,
          <IntlMessages id="common.form.validation.must-have-one-value" />
        ),
      otherwise: Yup.array().notRequired(),
    }),
  });

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages
          id={
            typeof editFormData.id === 'undefined'
              ? 'ATTRIBUTES_MGMT.ADD.TITLE'
              : 'ATTRIBUTES_MGMT.EDIT.TITLE'
          }
        />
        {editFormData.name ? ` - ${editFormData.name}` : ''}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={customAttributeSchema}
        onSubmit={onAddItem}
      >
        {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
          <Form>
            <ModalBody>
              {typeof editFormData.id === 'undefined' && (
                <p>
                  <IntlMessages id="ATTRIBUTES_MGMT.ADD.TITTLE" />
                </p>
              )}
              <FormGroupCoustom
                identifier="attributeModel"
                errors={errors}
                touched={touched}
                identifierLabel="ATTRIBUTES_MGMT.ADD.FORM.MODEL.LABEL"
                type="select"
                options={ATTRIBUTE_MODELS}
                value={values.attributeModel}
                onChange={(event) =>
                  onChangeDefault(event, 'attributeModel', setFieldValue)
                }
                disabled={typeof editFormData.id !== 'undefined'}
                required={true}
              />
              <FormGroupCoustom
                identifier="displayName"
                identifierLabel="ATTRIBUTES_MGMT.ADD.FORM.NAME.LABEL"
                placeholder="ATTRIBUTES_MGMT.ADD.FORM.NAME.PLACEHOLDER"
                errors={errors}
                touched={touched}
                onChange={(event) => {
                  setFieldValue('displayName', event.target.value, false);
                  if (typeof editFormData.id === 'undefined') {
                    setFieldValue(
                      'attributeKey',
                      convertToSlug(event.target.value)
                    );
                  }
                }}
                required={true}
              />
              <FormGroupCoustom
                identifier="attributeKey"
                identifierLabel="ATTRIBUTES_MGMT.ADD.FORM.KEY.LABEL"
                placeholder="ATTRIBUTES_MGMT.ADD.FORM.KEY.PLACEHOLDER"
                errors={errors}
                touched={touched}
                disabled={typeof editFormData.id !== 'undefined'}
                onChange={(event) => {
                  if (typeof editFormData.id === 'undefined') {
                    setFieldValue(
                      'attributeKey',
                      convertToSlug(event.target.value)
                    );
                  }
                }}
                required={true}
              />
              <FormGroupCoustom
                identifier="description"
                type="textarea"
                identifierLabel="ATTRIBUTES_MGMT.ADD.FORM.DESC.LABEL"
                placeholder="ATTRIBUTES_MGMT.ADD.FORM.DESC.PLACEHOLDER"
                value={values.description}
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="attributeType"
                errors={errors}
                touched={touched}
                identifierLabel="ATTRIBUTES_MGMT.ADD.FORM.TYPE.LABEL"
                type="select"
                options={ATTRIBUTE_TYPES}
                value={values.attributeType}
                onChange={(event) =>
                  onChangeDefault(event, 'attributeType', setFieldValue)
                }
                disabled={typeof editFormData.id !== 'undefined'}
                required={true}
              />
              {parseInt(values.attributeType, 10) === 6 && (
                <FormGroupCoustom
                  identifier="values"
                  type="tag"
                  identifierLabel="ATTRIBUTES_MGMT.ADD.FORM.TYPE.LIST.LABEL"
                  placeholder="ATTRIBUTES_MGMT.ADD.FORM.TYPE.LIST.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  onChange={setFieldValue}
                  onBlur={setFieldTouched}
                  value={values.values}
                  disabled={typeof editFormData.id !== 'undefined'}
                  required
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
                <IntlMessages id="ATTRIBUTES_MGMT.ADD.CANCEL_BUTTON_TEXT" />
              </Button>
              <Button color="primary">
                <IntlMessages
                  id={
                    typeof editFormData.id === 'undefined'
                      ? 'ATTRIBUTES_MGMT.ADD.SUBMIT'
                      : 'ATTRIBUTES_MGMT.EDIT.UPDATE_BUTTON_TEXT'
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

const mapStateToProps = ({ attributesApp }) => {
  const { successAdd, errorAdd, loadingAdd } = attributesApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
  };
};
export default connect(mapStateToProps, {
  addAttributeAction: addAttribute,
  addAttributeCleanAction: addAttributeClean,
})(AddAttributeModal);
