import React from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { connect } from 'react-redux';
import { Row, Button, Alert } from 'reactstrap';

import {
  Formik,
  Form,
  // Field
} from 'formik';

import { updateProfile, updateProfileClean } from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import * as Yup from 'yup';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { NotificationManager } from 'components/common/react-notifications';

const ChangePassword = ({
  // match,
  // currentUser,
  formError,
  formLoading,
  formSuccess,
  updateProfileAction,
  updateProfileCleanAction,
}) => {
  // useEffect(() => {
  //     getChannelAction();
  // }, [match.params.inboxid])

  const onSubmitForm = (values, { resetForm }) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      current_password: values.currentPassword,
      password: values.password,
      password_confirmation: values.passwordConfirmation,
    };

    updateProfileAction(newParams);
    resetForm();
    return false;
  };
  if (formSuccess) {
    NotificationManager.success(
      <IntlMessages id="PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE_SECTION.API_SUCCESS" />,
      'Success',
      6000,
      null,
      null,
      '' // className
    );
    updateProfileCleanAction({});
  }
  const initialValues = {
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  };

  const yupObj = {
    currentPassword: Yup.string().required('This field is required!'),
    password: Yup.string().required('This field is required!'),
    passwordConfirmation: Yup.string().required('This field is required!'),
  };
  const SignupSchema = Yup.object().shape(yupObj);

  return (
    <Row className="mt-2">
      <Colxx xxs="3">
        <h3>
          <IntlMessages id="PROFILE_SETTINGS.FORM.PASSWORD_SECTION.TITLE" />
        </h3>
        <p>
          <IntlMessages id="PROFILE_SETTINGS.FORM.PASSWORD_SECTION.NOTE" />
        </p>
      </Colxx>
      <Colxx xxs="9">
        {/* <Formik initialValues={initialValues} validationSchema={SignupSchema} enableReinitialize onSubmit={onsendConversation}> */}

        <Formik
          // innerRef={formRef}
          initialValues={initialValues}
          validationSchema={SignupSchema}
          validateOnMount
          // enableReinitialize
          onSubmit={onSubmitForm}
        >
          {({ errors, touched }) => {
            return (
              <Form className="av-tooltip tooltip-label-right">
                <Row>
                  <Colxx xxs="12">
                    <FormGroupCoustom
                      type="password"
                      identifier="currentPassword"
                      errors={errors}
                      touched={touched}
                      identifierLabel="PROFILE_SETTINGS.FORM.CURRENT_PASSWORD.PLACEHOLDER"
                      placeholder="PROFILE_SETTINGS.FORM.CURRENT_PASSWORD.PLACEHOLDER"
                      required={true}
                    />
                    <FormGroupCoustom
                      type="password"
                      identifier="password"
                      errors={errors}
                      touched={touched}
                      identifierLabel="PROFILE_SETTINGS.FORM.PASSWORD.PLACEHOLDER"
                      placeholder="PROFILE_SETTINGS.FORM.PASSWORD.PLACEHOLDER"
                      required={true}
                    />
                    <FormGroupCoustom
                      type="password"
                      identifier="passwordConfirmation"
                      errors={errors}
                      touched={touched}
                      identifierLabel="PROFILE_SETTINGS.FORM.PASSWORD_CONFIRMATION.PLACEHOLDER"
                      placeholder="PROFILE_SETTINGS.FORM.PASSWORD_CONFIRMATION.PLACEHOLDER"
                      required={true}
                    />

                    {formError && formError.errorMsg && (
                      <Alert color="danger" className="rounded">
                        {formError.errorMsg}
                      </Alert>
                    )}
                    <Button color="primary">
                      <IntlMessages id="PROFILE_SETTINGS.FORM.PASSWORD_SECTION.BTN_TEXT" />
                    </Button>
                  </Colxx>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { currentUser, errorUpdate, loadingUpdate, successUpdate } = authUser;
  return {
    currentUser,
    formError: errorUpdate,
    formLoading: loadingUpdate,
    formSuccess: successUpdate,
  };
};
export default connect(mapStateToProps, {
  updateProfileAction: updateProfile,
  updateProfileCleanAction: updateProfileClean,
})(ChangePassword);
