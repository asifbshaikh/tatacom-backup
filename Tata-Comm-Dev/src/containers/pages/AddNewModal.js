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
  Label,
  FormText,
  FormGroup,
  // Form,
  InputGroupAddon,
  Alert,
} from 'reactstrap';

import { Formik, Form, Field } from 'formik';
// import Select from 'react-select';
// import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';

// import { loginUser } from 'redux/actions';
import { addContactItem } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';

const FormGroupCoustom = ({
  identifier,
  identifierLabel,
  identifierIP,
  errors,
  touched,
  type,
  help,
  value,
  prepend,
}) => {
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
    // `{has-float-label`
    <FormGroup
      className={`form-group ${
        !prepend ? 'has-float-label' : 'mb3 input-group'
      }`}
    >
      {!prepend && (
        <Label>
          <IntlMessages id={identifierLabel} />
        </Label>
      )}
      {/* {prepend && (<div className="input-group-prepend"><span className="input-group-text">{prepend}</span></div>)} */}
      {prepend && (
        <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>
      )}

      {/* <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                <Input placeholder={messages['user.username']} />
              </InputGroup> */}
      <Field
        className="form-control"
        name={identifierIP}
        // validate={true}
        {...extraParams}
      />
      {help && (
        <FormText color="muted">
          <IntlMessages id="contacts.phone_msg" />
        </FormText>
      )}
      {errors[identifierIP] && touched[identifierIP] && (
        <div className="invalid-feedback d-block">{errors[identifierIP]}</div>
      )}
    </FormGroup>
  );
};

const AddNewModal = ({
  modalOpen,
  toggleModal,
  categories,
  editFormData,
  reloadList,
  setReloadList,
  formResponse,
  setFormResponse,
  addContactItemAction,
}) => {
  const loading = false;

  const onAddContactItem = (values) => {
    const payload = {
      ...values,
      // reactSelect: values.reactSelect.map((t) => t.value),
    };
    setTimeout(() => {});
    if (!loading) {
      setFormResponse({});
      const resp = addContactItemAction(values);
      if (typeof resp === 'object' && resp.type === 'ADD_CONTACT_ITEM') {
        // toggleModal();
        // setReloadList(reloadList+1)
      }
    }
  };
  if (modalOpen) {
    if (formResponse.success) {
      toggleModal();
      setReloadList(reloadList + 1);
      NotificationManager.success(
        'Saved successfully',
        'Success',
        6000,
        null,
        null,
        '' // className
      );
    }
  }

  const initialValues = {
    name: typeof editFormData.name !== 'undefined' ? editFormData.name : '',
    email: typeof editFormData.email !== 'undefined' ? editFormData.email : '',
    phone_number:
      typeof editFormData.phone_number !== 'undefined'
        ? editFormData.phone_number
        : '',
    bio:
      editFormData.additional_attributes &&
      editFormData.additional_attributes.description
        ? editFormData.additional_attributes.description
        : '',
    company_name:
      editFormData.additional_attributes &&
      editFormData.additional_attributes.company_name
        ? editFormData.additional_attributes.company_name
        : '',
    facebook:
      editFormData.additional_attributes &&
      editFormData.additional_attributes.social_profiles &&
      editFormData.additional_attributes.social_profiles.facebook
        ? editFormData.additional_attributes.social_profiles.facebook
        : '',
    twitter:
      editFormData.additional_attributes &&
      editFormData.additional_attributes.social_profiles &&
      editFormData.additional_attributes.social_profiles.twitter
        ? editFormData.additional_attributes.social_profiles.twitter
        : '',
    linkedin:
      editFormData.additional_attributes &&
      editFormData.additional_attributes.social_profiles &&
      editFormData.additional_attributes.social_profiles.linkedin
        ? editFormData.additional_attributes.social_profiles.linkedin
        : '',
    github:
      editFormData.additional_attributes &&
      editFormData.additional_attributes.social_profiles &&
      editFormData.additional_attributes.social_profiles.github
        ? editFormData.additional_attributes.social_profiles.github
        : '',
  };
  if (typeof editFormData.id !== 'undefined') {
    initialValues.id = editFormData.id;
  }
  // const validatePhoneForE164 = (phoneNumber) => {
  //   const regEx = /^\+[1-9]\d{10,14}$/;
  //   // const e164 = /^\+[1-9]\d{1,14}$/;
  //   return regEx.test(phoneNumber);
  // };
  Yup.addMethod(Yup.string, 'isValidSocial', function (errorMessage) {
    return this.test(`validate-social`, errorMessage, function (value) {
      const { path, createError } = this;
      return (
        !value ||
        /^([^?/]+)/.test(value) ||
        createError({
          path,
          message: errorMessage
            ? errorMessage
            : 'Type path only (excluding domain name eg: profile/username)',
        })
      );
    });
  });

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!'),
    email: Yup.string()
      .email('Invalid Email address')
      .required('Email is required!'),
    bio: Yup.string().required('Bio is required!'),
    phone_number: Yup.string()
      .matches(/^\+[1-9]\d{10,14}$/, 'Phone Number not in correct format')
      .required('Phone Number is required!'),
    company_name: Yup.string().required('Company is required!'),
    facebook: Yup.string().isValidSocial(),
    twitter: Yup.string().isValidSocial(),
    linkedin: Yup.string().isValidSocial(),
    github: Yup.string().isValidSocial(),
    // facebook: Yup.string().nullable()
    // .matches(/^([^?/]+)/, 'Type path only (excluding domain name eg: profile/username)'),
    // .matches(/^([^?/]+)/, 'Type path only (excluding domain name eg: profile/username)'),
    // .test(
    //     'facebook',
    //     'Type string after site base URL only',
    //     socialValidate
    //   )
    //       yup
    // .string()
    // .trim()
    // .matches(/[abcdefghijklmnopqrstuvwxyz]+/ , 'Is not in correct format')
    // .required();
    // email: Yup.string()
    //   .email('Invalid email address')
    //   .required('Email is required!'),
    // select: Yup.string().required('A select option is required!'),
    // reactSelect: Yup.array()
    //   .min(3, 'Pick at least 3 tags')
    //   .of(
    //     Yup.object().shape({
    //       label: Yup.string().required(),
    //       value: Yup.string().required(),
    //     })
    //   ),
    // checkboxSingle: Yup.bool().oneOf([true], 'Must agree to something'),
    // checkboxCustomSingle: Yup.bool().oneOf([true], 'Must agree to something'),
    // checkboxGroup: Yup.array()
    //   .min(2, 'Pick at least 2 tags')
    //   .required('At least one checkbox is required'),

    // customCheckGroup: Yup.array()
    //   .min(2, 'Pick at least 2 tags')
    //   .required('At least one checkbox is required'),

    // radioGroup: Yup.string().required('A radio option is required'),
    // customRadioGroup: Yup.string().required('A radio option is required'),
    // tags: Yup.array()
    //   .min(3, 'Pick at least 3 tags')
    //   .required('At least one checkbox is required'),
    // switch: Yup.bool().oneOf([true], 'Must agree to something'),
    // date: Yup.date().nullable().required('Date required'),
  });

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages
          id={
            typeof editFormData.id === 'undefined'
              ? 'contacts.add-new-modal-title'
              : 'contacts.edit-new-modal-title'
          }
        />
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onAddContactItem}
      >
        {/* {({ errors, touched }) => ( */}
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroupCoustom
                identifier="name"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="email"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="bio"
                errors={errors}
                touched={touched}
                type="textarea"
                required={true}
              />
              <FormGroupCoustom
                identifier="phone_number"
                errors={errors}
                touched={touched}
                help="contacts.phone_msg"
                required={true}
              />
              <FormGroupCoustom
                identifier="company_name"
                errors={errors}
                touched={touched}
                required={true}
              />

              <Label>
                <IntlMessages id="contacts.social_profiles" />
              </Label>
              <FormGroupCoustom
                identifier="facebook"
                prepend="https://facebook.com/"
                errors={errors}
                touched={touched}
              />
              <FormGroupCoustom
                identifier="twitter"
                prepend="https://twitter.com/"
                errors={errors}
                touched={touched}
              />
              <FormGroupCoustom
                identifier="linkedin"
                prepend="https://linkedin.com/"
                errors={errors}
                touched={touched}
              />
              <FormGroupCoustom
                identifier="github"
                prepend="https://github.com/"
                errors={errors}
                touched={touched}
              />

              {/* <FormGroup className="form-group has-float-label">
                <Label>
                  <IntlMessages id="user.newemail" />
                </Label>
                <Field
                  className="form-control"
                  name="newemail"
                />
                {errors.newemail && touched.newemail && (
                  <div className="invalid-feedback d-block">
                    {errors.newemail}
                  </div>
                )}
              </FormGroup> */}

              {/* <Label>
                <IntlMessages id="contacts.name" />
              </Label>
              <Field name="name" type="text" /> */}
              {/* <Label>
                <IntlMessages id="contacts.email" />
              </Label>
              <Field name="email" type="text" /> */}
              {/* 
              <Label className="mt-4">
                <IntlMessages id="contacts.bio" />
              </Label>
              <Field name="bio" type="textarea" /> */}

              {/* 
              <Label>
                <IntlMessages id="contacts.phone_number" />
              </Label>
              <Input value={editFormData.phone_number ? editFormData.phone_number: ''} />
              <FormText color="muted">
                <IntlMessages id="contacts.phone_msg" />
              </FormText>

              <Label>
                <IntlMessages id="contacts.name" />
              </Label>
              <Input 
                value={editFormData.additional_attributes && editFormData.additional_attributes.company_name ? editFormData.additional_attributes.company_name: ''}
                />

              
              <Label>
                <IntlMessages id="contacts.social_profiles" />
              </Label>
              <FormGroup className="form-group has-float-label">
                <Label>
                https://facebook.com/
                </Label>
                <Input
                  className="form-control"
                  name="facebook"
                  value={editFormData.additional_attributes && editFormData.additional_attributes.facebook ? editFormData.additional_attributes.facebook: ''}
                />
              </FormGroup>
              <FormGroup className="form-group has-float-label">
                <Label>
                https://twitter.com/
                </Label>
                <Input
                  className="form-control"
                  name="twitter"
                  value={editFormData.additional_attributes && editFormData.additional_attributes.twitter ? editFormData.additional_attributes.twitter: ''}
                />
              </FormGroup>
              <FormGroup className="form-group has-float-label">
                <Label>
                https://linkedin.com/
                </Label>
                <Input
                  className="form-control"
                  name="linkedin"
                  value={editFormData.additional_attributes && editFormData.additional_attributes.linkedin ? editFormData.additional_attributes.linkedin: ''}
                />
              </FormGroup>
              <FormGroup className="form-group has-float-label">
                <Label>
                https://github.com/
                </Label>
                <Input
                  className="form-control"
                  name="github"
                  value={editFormData.additional_attributes && editFormData.additional_attributes.github ? editFormData.additional_attributes.github: ''}
                />
              </FormGroup>
                          */}
              {/* <Label className="mt-4">
                <IntlMessages id="pages.category" />
              </Label>
              <Select
                components={{ Input: CustomSelectInput }}
                className="react-select"
                classNamePrefix="react-select"
                name="form-field-name"
                options={categories}
              />
              <Label className="mt-4">
                <IntlMessages id="pages.status" />
              </Label>
              <CustomInput
                type="radio"
                id="exCustomRadio"
                name="customRadio"
                label="ON HOLD"
              />
              <CustomInput
                type="radio"
                id="exCustomRadio2"
                name="customRadio"
                label="PROCESSED"
              /> */}
              {formResponse.error && formResponse.error.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formResponse.error.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={toggleModal}>
                <IntlMessages id="pages.cancel" />
              </Button>
              <Button color="primary">
                <IntlMessages id="pages.submit" />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

// export default AddNewModal;

const mapStateToProps = (state, props) => {
  const { contactsApp } = state;
  if (contactsApp.error.errorMsg || contactsApp.success) {
    props.setFormResponse(contactsApp);
  }
  const { allTodoItems, todoItems, error } = contactsApp;
  return { allTodoItems, todoItems, error };
};
export default connect(mapStateToProps, {
  addContactItemAction: addContactItem,
})(AddNewModal);
