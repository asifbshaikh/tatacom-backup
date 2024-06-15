/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Alert,
  FormGroup,
} from 'reactstrap';

import { Formik, Form } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import {
  addContactItem,
  addContactItemClean,
  getCountryDropdownList,
} from 'redux/actions';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import moment from 'moment';
import { genderOptions } from 'data/common';
import { injectIntl } from 'react-intl';
import Datetime from 'react-datetime';
import {
  DATE_FORMAT_WITHOUT_TIME,
  DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY,
} from 'constants/appConstant';
import CommonEnums from 'enums/commonEnums';

const AddNewModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  reloadList,
  setReloadList,
  addContactItemAction,
  addContactItemCleanAction,
  onSaveSuccess,
  countryListData,
  getCountryList,
  intl,
}) => {
  let countryListOptions = [];
  const { messages } = intl;
  const [dob, setDob] = useState(
    editFormData?.birth_date
      ? moment(editFormData.birth_date).format(DATE_FORMAT_WITHOUT_TIME)
      : ''
  );
  if (countryListData && countryListData.length > 0) {
    countryListOptions = countryListData.map((item) => {
      return {
        id: item.country_code,
        value: item.name,
      };
    });
    countryListOptions.unshift({ id: '', value: '' });
  }

  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addContactItemCleanAction({});
    }
  };

  const onAddContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    values.birth_date = dob;
    addContactItemAction(values);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      closeForm();
      if (setReloadList) {
        setReloadList(reloadList + 1);
      }
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      NotificationManager.success(
        <IntlMessages id="CONTACT_FORM.SUCCESS_MESSAGE" />,
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }
  const initialValues = {
    name: editFormData?.name ? editFormData.name : '',
    first_name: editFormData?.first_name ? editFormData.first_name : '',
    middle_name: editFormData?.middle_name ? editFormData.middle_name : '',
    last_name: editFormData.last_name ? editFormData.last_name : '',
    email: editFormData.email ? editFormData.email : '',
    phone_number: editFormData?.phone_number ? editFormData.phone_number : '',
    bio: editFormData?.additional_attributes?.bio
      ? editFormData.additional_attributes.bio
      : '',
    company_name: editFormData?.additional_attributes?.company_name
      ? editFormData.additional_attributes.company_name
      : '',
    gender: editFormData?.gender ? editFormData.gender : '',
    city: editFormData.city ? editFormData.city : '',
    address: editFormData.address ? editFormData.address : '',
    country: editFormData.country ? editFormData.country : '',
    birth_date: editFormData?.birth_date
      ? moment(editFormData.birth_date).format(
          DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
        )
      : '',
    facebook: editFormData?.additional_attributes?.social_profiles?.facebook
      ? editFormData.additional_attributes.social_profiles.facebook
      : '',
    twitter: editFormData?.additional_attributes?.social_profiles?.twitter
      ? editFormData.additional_attributes.social_profiles.twitter
      : '',
    linkedin: editFormData?.additional_attributes?.social_profiles?.linkedin
      ? editFormData.additional_attributes.social_profiles.linkedin
      : '',
    github: editFormData?.additional_attributes?.social_profiles?.github
      ? editFormData.additional_attributes.social_profiles.github
      : '',
  };
  if (editFormData && editFormData.id) {
    initialValues.id = editFormData.id;
  }
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

  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z ]*$/, messages['CONTACT_FORM.VALIDATION.NAME'])
      .max(50),
    first_name: Yup.string()
      .matches(/^[A-Za-z ]*$/, messages['CONTACT_FORM.VALIDATION.FIRST_NAME'])
      .max(50),
    middle_name: Yup.string()
      .matches(/^[A-Za-z ]*$/, messages['CONTACT_FORM.VALIDATION.MIDDLE_NAME'])
      .max(50),
    last_name: Yup.string()
      .matches(/^[A-Za-z ]*$/, messages['CONTACT_FORM.VALIDATION.LAST_NAME'])
      .max(50),
    email: Yup.string()
      .email(messages['CONTACT_FORM.VALIDATION.EMAIL'])
      .required(getFieldRequiredMessage('forms.required-message')),
    phone_number: Yup.string()
      .matches(
        /^\+[1-9]\d{10,14}$/,
        messages['CONTACT_FORM.VALIDATION.PHONE_NUMBER']
      )
      .required(getFieldRequiredMessage('forms.required-message')),
    city: Yup.string()
      .matches(/^[a-zA-Z0-9]*$/, messages['CONTACT_FORM.VALIDATION.CITY'])
      .max(50),
    address: Yup.string().max(100),
    birth_date: Yup.date().max(
      new Date(),
      messages['CONTACT_FORM.VALIDATION.BIRTH_DATE']
    ),
    facebook: Yup.string().isValidSocial(),
    twitter: Yup.string().isValidSocial(),
    linkedin: Yup.string().isValidSocial(),
    github: Yup.string().isValidSocial(),
  });

  useEffect(() => {
    getCountryList();
  }, []);

  return (
    <Modal
      isOpen={modalOpen}
      toggle={closeForm}
      wrapClassName="modal-right de-contact-modal"
      backdrop="static"
    >
      <ModalHeader toggle={closeForm}>
        <div>
          <IntlMessages
            id={
              typeof editFormData.id === 'undefined'
                ? 'contacts.add-new-modal-title'
                : 'contacts.edit-new-modal-title'
            }
          />
        </div>
        <small className="form-text">
          <IntlMessages id="contacts.info-text-modal-title" />
        </small>
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onAddContactItem}
      >
        {({ errors, touched, handleSubmit, setFieldValue, values }) => {
          return (
            <Form onSubmit={handleSubmit} className="content-wrapper">
              <ModalBody className="pb-4">
                <FormGroupCoustom
                  identifier="name"
                  identifierLabel="CONTACT_FORM.FORM.NAME.LABEL"
                  placeholder="CONTACT_FORM.FORM.NAME.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="first_name"
                  identifierLabel="CONTACT_FORM.FORM.FIRST_NAME.LABEL"
                  placeholder="CONTACT_FORM.FORM.FIRST_NAME.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="middle_name"
                  identifierLabel="CONTACT_FORM.FORM.MIDDLE_NAME.LABEL"
                  placeholder="CONTACT_FORM.FORM.MIDDLE_NAME.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="last_name"
                  identifierLabel="CONTACT_FORM.FORM.LAST_NAME.LABEL"
                  placeholder="CONTACT_FORM.FORM.LAST_NAME.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="email"
                  identifierLabel="CONTACT_FORM.FORM.EMAIL_ADDRESS.LABEL"
                  placeholder="CONTACT_FORM.FORM.EMAIL_ADDRESS.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
                <FormGroupCoustom
                  identifier="phone_number"
                  help="contacts.phone_msg"
                  identifierLabel="CONTACT_FORM.FORM.PHONE_NUMBER.LABEL"
                  placeholder="CONTACT_FORM.FORM.PHONE_NUMBER.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
                <FormGroupCoustom
                  identifier="company_name"
                  identifierLabel="CONTACT_FORM.FORM.COMPANY_NAME.LABEL"
                  placeholder="CONTACT_FORM.FORM.COMPANY_NAME.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="gender"
                  identifierLabel="CONTACT_FORM.FORM.GENDER.LABEL"
                  placeholder="CONTACT_FORM.FORM.GENDER.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  type="select"
                  options={genderOptions}
                />
                <FormGroupCoustom
                  identifier="city"
                  identifierLabel="CONTACT_FORM.FORM.CITY.LABEL"
                  placeholder="CONTACT_FORM.FORM.CITY.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="address"
                  identifierLabel="CONTACT_FORM.FORM.ADDRESS.LABEL"
                  placeholder="CONTACT_FORM.FORM.ADDRESS.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="country"
                  identifierLabel="CONTACT_FORM.FORM.COUNTRY.LABEL"
                  placeholder="CONTACT_FORM.FORM.COUNTRY.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  type="select"
                  options={countryListOptions}
                />
                <FormGroup className="has-float-label">
                  <Label for="birth_date">
                    <IntlMessages id="CONTACT_FORM.FORM.DATE_OF_BIRTH.LABEL" />
                  </Label>
                  <Datetime
                    id="birth_date"
                    identifier="birth_date"
                    dateFormat={DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY}
                    initialValue={
                      initialValues?.birth_date
                        ? moment(initialValues.birth_date).format(
                            DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
                          )
                        : ''
                    }
                    timeFormat={false}
                    onChange={(date) => {
                      if (moment(date).format() === 'Invalid date') {
                        setFieldValue('birth_date', '');
                        setDob('');
                      } else {
                        setDob(moment(date).format(DATE_FORMAT_WITHOUT_TIME));
                        const data = moment(date).format(
                          DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
                        );
                        setFieldValue('birth_date', data);
                      }
                    }}
                    closeOnSelect
                  />
                  {errors?.birth_date && (
                    <div className="invalid-feedback d-block w-30">
                      <span>
                        <IntlMessages id="CONTACT_FORM.VALIDATION.BIRTH_DATE" />
                      </span>
                    </div>
                  )}
                </FormGroup>
                <FormGroupCoustom
                  identifier="bio"
                  type="textarea"
                  value={values.bio}
                  identifierLabel="CONTACT_FORM.FORM.BIO.LABEL"
                  placeholder="CONTACT_FORM.FORM.BIO.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <Label>
                  <IntlMessages id="CONTACTS_PAGE.LIST.TABLE_HEADER.SOCIAL_PROFILES" />
                </Label>
                <FormGroupCoustom
                  identifier="facebook"
                  prepend="https://facebook.com/"
                  identifierLabel="CONTACT_FORM.FORM.SOCIAL_PROFILES.FACEBOOK.LABEL"
                  placeholder="CONTACT_FORM.FORM.SOCIAL_PROFILES.FACEBOOK.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="twitter"
                  prepend="https://twitter.com/"
                  identifierLabel="CONTACT_FORM.FORM.SOCIAL_PROFILES.TWITTER.LABEL"
                  placeholder="CONTACT_FORM.FORM.SOCIAL_PROFILES.TWITTER.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="linkedin"
                  prepend="https://linkedin.com/"
                  identifierLabel="CONTACT_FORM.FORM.SOCIAL_PROFILES.LINKEDIN.LABEL"
                  placeholder="CONTACT_FORM.FORM.SOCIAL_PROFILES.LINKEDIN.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                <FormGroupCoustom
                  identifier="github"
                  prepend="https://github.com/"
                  identifierLabel="CONTACT_FORM.FORM.SOCIAL_PROFILES.GITHUB.LABEL"
                  placeholder="CONTACT_FORM.FORM.SOCIAL_PROFILES.GITHUB.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                />
                {formError && formError.errorMsg && (
                  <Alert color="danger" className="rounded">
                    {formError.errorMsg.includes(CommonEnums.EMAIL_LABEL)
                      ? formError.errorMsg.replaceAll(
                          CommonEnums.EMAIL_LABEL,
                          ''
                        )
                      : formError.errorMsg}
                  </Alert>
                )}
              </ModalBody>
              <ModalFooter className="drawer-custom-style">
                <Button color="secondary" outline onClick={closeForm}>
                  <IntlMessages id="CONTACT_FORM.FORM.CANCEL" />
                </Button>
                <Button color="primary">
                  <IntlMessages id="CONTACT_FORM.FORM.SUBMIT" />
                </Button>{' '}
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { contactsApp, settingsChannels } = state;
  const { successAdd, errorAdd, loadingAdd } = contactsApp;
  const { countryList } = settingsChannels;

  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    countryListData: countryList,
  };
};
export default connect(mapStateToProps, {
  addContactItemAction: addContactItem,
  addContactItemCleanAction: addContactItemClean,
  getCountryList: getCountryDropdownList,
})(injectIntl(AddNewModal));
