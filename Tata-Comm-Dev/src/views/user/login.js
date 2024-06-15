import React, { useState, useEffect } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';

import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { loginUser } from 'redux/actions';
import { setCurrentUser } from 'helpers/Utils';
import { injectIntl } from 'react-intl';

const validatePassword = (value) => {
  let error;
  if (!value) {
    error = 'Please enter your password';
  } else if (value.length < 4) {
    error = 'Value must be longer than 3 characters';
  }
  return error;
};

const validateEmail = (value) => {
  let error;
  if (!value) {
    error = 'Please enter your email address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = 'Invalid email address';
  }
  return error;
};

const Login = ({
  history,
  loading,
  error,
  loginUserAction,
  intl,
  logoutSuccess,
}) => {
  const [email] = useState('');
  const [password] = useState('');

  useEffect(() => {
    setCurrentUser();
  }, []);

  useEffect(() => {
    if (error) {
      NotificationManager.warning(
        <IntlMessages id={error} />,
        'Login Error',
        3000,
        null,
        null,
        ''
      );
    }
  }, [error]);

  useEffect(() => {
    if (logoutSuccess) {
      NotificationManager.success(
        <IntlMessages id={'LOGIN.LOGOUT_SUCCESSFUL'} />,
        'Success',
        3000,
        null,
        null,
        ''
      );
    }
  }, [logoutSuccess]);

  const onUserLogin = (values) => {
    if (!loading) {
      if (values.email !== '' && values.password !== '') {
        loginUserAction(values, history);
      }
    }
  };

  const initialValues = { email, password };
  const showSignupLink = () => {
    return true;
  };

  const { messages } = intl;

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            {/* <p className="text-white h2">MAGIC IS IN THE DETAILS</p> */}
            <p className="white mb-0 login-card-text">
              Please use your credentials to login.
              <br />
              If you are not a member, please{' '}
              <NavLink to="/user/register" className="white">
                <IntlMessages id="LOGIN.CREATE_NEW_ACCOUNT" />
              </NavLink>
              .
            </p>
          </div>
          <div className="form-side">
            <span className="logo-single" />
            <CardTitle className="mb-4">
              <IntlMessages id="LOGIN.TITLE" />
            </CardTitle>

            <Formik initialValues={initialValues} onSubmit={onUserLogin}>
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="LOGIN.EMAIL.LABEL" />
                    </Label>
                    <Field
                      className="form-control"
                      name="email"
                      validate={validateEmail}
                      placeholder={messages['LOGIN.EMAIL.PLACEHOLDER']}
                    />
                    {errors.email && touched.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="LOGIN.PASSWORD.LABEL" />
                    </Label>
                    <Field
                      className="form-control"
                      type="password"
                      name="password"
                      validate={validatePassword}
                      autoComplete="on"
                      placeholder={messages['LOGIN.PASSWORD.PLACEHOLDER']}
                    />
                    {errors.password && touched.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <NavLink to="/user/forgot-password">
                      <IntlMessages id="LOGIN.FORGOT_PASSWORD" />
                    </NavLink>
                    {showSignupLink() && (
                      <NavLink to="/user/register">
                        <IntlMessages id="LOGIN.CREATE_NEW_ACCOUNT" />
                      </NavLink>
                    )}
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
                        <IntlMessages id="LOGIN.SUBMIT" />
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
  const { loading, error, logoutSuccess } = authUser;
  return { loading, error, logoutSuccess };
};

export default connect(mapStateToProps, {
  loginUserAction: loginUser,
})(injectIntl(Login));
