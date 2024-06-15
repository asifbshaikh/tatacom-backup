import React, { useEffect } from 'react';
import {
  Row,
  Card,
  CardTitle,
  // Form,
  // FormGroup,
  // Label,
  // Input,
  Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser, registerUserClean } from 'redux/actions';
import * as Yup from 'yup';

import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Formik, Form } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';
import { loginPageURL, termsURL, privacyURL } from 'constants/defaultValues';
import { injectIntl } from 'react-intl';
import DOMPurify from 'dompurify';
import HTMLReactParser from 'html-react-parser';

const Register = ({
  intl,
  loading,
  error,
  registerUserAction,
  registerUserCleanAction,
  registerUserInfo,
}) => {
  useEffect(() => {
    if (error) {
      NotificationManager.warning(
        error,
        <IntlMessages id="REGISTER.API.ERROR_MESSAGE" />,
        3000,
        null,
        null,
        ''
      );
    } else if (!loading && registerUserInfo === 'success') {
      NotificationManager.success(
        <IntlMessages id="REGISTER.API.SUCCESS_MESSAGE" />,
        'Success',
        3000,
        null,
        null,
        ''
      );
      registerUserCleanAction();
      setTimeout(() => {
        window.location.href = loginPageURL;
      }, 3000);
    }
  }, [error, loading, registerUserInfo]);

  const onUserRegister = (values) => {
    if (!loading) {
      registerUserAction(values);
    }
  };

  const initialValues = {
    fullName: '',
    email: '',
    accountName: '',
    password: '',
    confirmPassword: '',
  };

  const yupObj = {
    fullName: Yup.string()
      .required('This field is required!')
      .min(2, 'Min 2 lenght required'),
    email: Yup.string()
      .required('This field is required!')
      .email('Invalid email!'),
    accountName: Yup.string()
      .required('This field is required!')
      .min(2, 'Min 2 lenght required'),
    password: Yup.string()
      .required('This field is required!')
      .min(6, 'Min 6 lenght required'),
    confirmPassword: Yup.string()
      .required('This field is required!')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  };
  const SignupSchema = Yup.object().shape(yupObj);

  let translated = intl.formatMessage(
    { id: 'REGISTER.TERMS_ACCEPT' }
    // { value: '<strong>Hello</strong>' }
  );
  translated = translated
    .replace('https://www.engage.com/terms', termsURL)
    .replace('https://www.engage.com/privacy-policy', privacyURL);

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
            <p className="white mb-0">
              Please use this form to register. <br />
              If you are a member, please{' '}
              <NavLink to="/user/login" className="white">
                login
              </NavLink>
              .
            </p>
          </div>
          <div className="form-side">
            <NavLink to="/" className="white">
              <span className="logo-single" />
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="REGISTER.TITLE" />
            </CardTitle>

            <Formik
              // validate={validateNewPassword}
              initialValues={initialValues}
              validationSchema={SignupSchema}
              // validateOnMount
              // enableReinitialize
              onSubmit={onUserRegister}
            >
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroupCoustom
                    identifier="fullName"
                    errors={errors}
                    touched={touched}
                    identifierLabel="REGISTER.FULL_NAME.LABEL"
                    placeholder="REGISTER.FULL_NAME.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    type="email"
                    identifier="email"
                    errors={errors}
                    touched={touched}
                    identifierLabel="REGISTER.EMAIL.LABEL"
                    placeholder="REGISTER.EMAIL.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="accountName"
                    errors={errors}
                    touched={touched}
                    identifierLabel="REGISTER.ACCOUNT_NAME.LABEL"
                    placeholder="REGISTER.ACCOUNT_NAME.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    type="password"
                    identifier="password"
                    errors={errors}
                    touched={touched}
                    identifierLabel="LOGIN.PASSWORD.LABEL"
                    placeholder="SET_NEW_PASSWORD.PASSWORD.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    type="password"
                    identifier="confirmPassword"
                    errors={errors}
                    touched={touched}
                    identifierLabel="SET_NEW_PASSWORD.CONFIRM_PASSWORD.LABEL"
                    placeholder="SET_NEW_PASSWORD.CONFIRM_PASSWORD.PLACEHOLDER"
                    required={true}
                  />

                  <div>
                    <p className="accept--terms">
                      <div>
                        {HTMLReactParser(DOMPurify.sanitize(translated))}
                      </div>
                    </p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <NavLink to="/user/login">
                      <IntlMessages id="user.login-title" />
                    </NavLink>
                    <Button
                      color="primary"
                      className={`btn-shadow btn-multiple-state ${
                        loading ? 'show-spinner' : ''
                      }`}
                      size="lg"
                    >
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">
                        <IntlMessages id="REGISTER.SUBMIT" />
                      </span>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
const mapStateToProps = ({ authUser }) => {
  const { registerUserInfo, loading, error } = authUser;
  return { registerUserInfo, loading, error };
};

export default connect(mapStateToProps, {
  registerUserAction: registerUser,
  registerUserCleanAction: registerUserClean,
})(injectIntl(Register));
