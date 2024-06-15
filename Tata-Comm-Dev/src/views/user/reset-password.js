import React, { useEffect } from 'react';
import { Row, Card, CardTitle, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { resetPassword, resetPasswordClean } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import * as Yup from 'yup';
import { loginPageURL } from 'constants/defaultValues';

// const validateNewPassword = (values) => {
//   const { newPassword, newPasswordAgain } = values;
//   const errors = {};
//   if (newPasswordAgain && newPassword !== newPasswordAgain) {
//     errors.newPasswordAgain = 'Please check your new password';
//   }
//   return errors;
// };

const ResetPassword = ({
  location,
  history,
  loading,
  error,
  resetPasswordAction,
  resetPasswordCleanAction,
  newPwdSuccessStatus,
}) => {
  // const [newPassword] = useState('');
  // const [newPasswordAgain] = useState('');

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
    } else if (!loading && newPwdSuccessStatus === 'success') {
      NotificationManager.success(
        'Please login with your new password.',
        'Reset Password Success',
        3000,
        null,
        null,
        ''
      );
      resetPasswordCleanAction();
      setTimeout(() => {
        window.location.href = loginPageURL;
      }, 3000);
    }
  }, [error, loading, newPwdSuccessStatus]);

  const onResetPassword = (values) => {
    if (!loading) {
      const params = new URLSearchParams(location.search);
      const oobCode = params.get('reset_password_token');
      if (oobCode) {
        if (values.password !== '') {
          resetPasswordAction({
            password: values.password,
            confirmPassword: values.confirmPassword,
            // newPassword: values.password,
            // resetPasswordCode: oobCode,
            resetPasswordToken: oobCode,
            history,
          });
        }
      } else {
        NotificationManager.warning(
          'Please check your email url.',
          'Reset Password Error',
          3000,
          null,
          null,
          ''
        );
      }
    }
  };

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const yupObj = {
    password: Yup.string()
      .required('This field is required!')
      .min(6, 'Min 6 lenght required'),
    confirmPassword: Yup.string()
      .required('This field is required!')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  };
  const SignupSchema = Yup.object().shape(yupObj);

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
              <IntlMessages id="SET_NEW_PASSWORD.TITLE" />
            </CardTitle>

            <Formik
              // validate={validateNewPassword}
              initialValues={initialValues}
              validationSchema={SignupSchema}
              validateOnMount
              enableReinitialize
              onSubmit={onResetPassword}
            >
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
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
                  {/* <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.new-password-again" />
                    </Label>
                    <Field
                      className="form-control"
                      name="newPasswordAgain"
                      type="password"
                    />
                    {errors.newPasswordAgain && touched.newPasswordAgain && (
                      <div className="invalid-feedback d-block">
                        {errors.newPasswordAgain}
                      </div>
                    )}
                  </FormGroup> */}

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
                        <IntlMessages id="SET_NEW_PASSWORD.SUBMIT" />
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
  const { newPwdSuccessStatus, resetPasswordCode, loading, error } = authUser;
  return { newPwdSuccessStatus, resetPasswordCode, loading, error };
};

export default connect(mapStateToProps, {
  resetPasswordAction: resetPassword,
  resetPasswordCleanAction: resetPasswordClean,
})(ResetPassword);
