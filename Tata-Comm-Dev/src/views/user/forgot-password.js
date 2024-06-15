import React, { useEffect } from 'react';
import { Row, Card, CardTitle, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import * as Yup from 'yup';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { forgotPassword, forgotPasswordClean } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';

const ForgotPassword = ({
  history,
  forgotUserMail,
  loading,
  error,
  forgotPasswordAction,
  forgotPasswordCleanAction,
}) => {
  const onSubmitForm = (values) => {
    forgotPasswordAction(values, history);
    return false;
  };
  const initialValues = {
    email: '',
  };

  const yupObj = {
    email: Yup.string()
      .required('This field is required!')
      .email('Invalid email!'),
  };
  const SignupSchema = Yup.object().shape(yupObj);

  useEffect(() => {
    if (error) {
      NotificationManager.warning(
        error,
        'Forgot Password Error',
        3000,
        null,
        null,
        ''
      );
    } else if (!loading && forgotUserMail)
      NotificationManager.success(
        <IntlMessages id="RESET_PASSWORD.API.SUCCESS_MESSAGE" />,
        'Forgot Password Success',
        3000,
        null,
        null,
        ''
      );
    forgotPasswordCleanAction();
  }, [error, forgotUserMail, loading]);

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
            <p className="white mb-0">
              Please use your e-mail to reset your password. <br />
              If you are not a member, please{' '}
              <NavLink to="/user/register" className="white">
                register
              </NavLink>
              .
            </p>
          </div>
          <div className="form-side">
            <NavLink to="/" className="white">
              <span className="logo-single" />
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="RESET_PASSWORD.TITLE" />
            </CardTitle>

            <Formik
              initialValues={initialValues}
              onSubmit={onSubmitForm}
              validationSchema={SignupSchema}
            >
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroupCoustom
                    identifier="email"
                    errors={errors}
                    touched={touched}
                    identifierLabel="RESET_PASSWORD.EMAIL.LABEL"
                    placeholder="RESET_PASSWORD.EMAIL.PLACEHOLDER"
                    required={true}
                  />

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
                        <IntlMessages id="RESET_PASSWORD.SUBMIT" />
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
  const { forgotUserMail, loading, error } = authUser;
  return {
    forgotUserMail,
    loading,
    error,
  };
};

export default connect(mapStateToProps, {
  forgotPasswordAction: forgotPassword,
  forgotPasswordCleanAction: forgotPasswordClean,
})(ForgotPassword);
