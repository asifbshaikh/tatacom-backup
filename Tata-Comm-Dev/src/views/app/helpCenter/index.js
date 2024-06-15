import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import HelpCenterForm from './HelpCenterForm';
import IntlMessages from 'helpers/IntlMessages';
import { NotificationManager } from 'components/common/react-notifications';
import { connect } from 'react-redux';
import { emailSuccess } from 'redux/dashboard-campaigns/actions';
import { injectIntl } from 'react-intl';

const HelpCenter = ({
  formRef,
  match,
  emailSuccess,
  emailSuccessAction,
  intl,
}) => {
  const targetUsersInitialValues = {
    emailID: '',
    addtionalEmails: '',
    subject: '',
    description: '',
    product: '',
    priority: '',
  };
  const handleSubmit = (values) => {
    if (emailSuccess.message) {
      const successMsg = 'HELP_CENTER.SUCCESS_MSG';
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null
      );
      emailSuccessAction('');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, [emailSuccess]);
  const { messages } = intl;
  const makeSchema = Yup.object().shape({
    emailID: Yup.string().test(
      messages['HELP_CENTER.VALIDATION.VALID_EMAIL'],
      messages['HELP_CENTER.VALIDATION.INVALID_EMAIL'],
      (value) => {
        if (value) {
          if (typeof value === 'string') {
            const emailArray = value.split(',').map((email) => email.trim());
            return emailArray.every((email) =>
              Yup.string().email().isValidSync(email)
            );
          }
          return false;
        }
        return true;
      }
    ),
    addtionalEmails: Yup.string().test(
      messages['HELP_CENTER.VALIDATION.VALID_EMAIL'],
      messages['HELP_CENTER.VALIDATION.INVALID_EMAIL'],
      (value) => {
        if (value) {
          if (typeof value === 'string') {
            const emailArray = value.split(',').map((email) => email.trim());
            return emailArray.every((email) =>
              Yup.string().email().isValidSync(email)
            );
          }
          return false;
        }
        return true;
      }
    ),
    subject: Yup.string().required(messages['HELP_CENTER.VALIDATION.SUBJECT']),
    description: Yup.string().required(
      messages['HELP_CENTER.VALIDATION.DESCRIPTION']
    ),
    product: Yup.string().required(messages['HELP_CENTER.VALIDATION.PRODUCT']),
    priority: Yup.string().required(
      messages['HELP_CENTER.VALIDATION.PRIORITY']
    ),
  });

  return (
    <div className="mt-2">
      <Formik
        innerRef={formRef}
        initialValues={targetUsersInitialValues}
        onSubmit={handleSubmit}
        validationSchema={makeSchema}
        validateOnBlur
        validateOnChange
        validateOnMount
        enableReinitialize
      >
        {(form) => (
          <Form>
            <HelpCenterForm form={form} match={match} />
          </Form>
        )}
      </Formik>
    </div>
  );
};
const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const { emailSuccess } = dashboardCampaignsApp;
  return {
    emailSuccess,
  };
};
const mapActionsToProps = {
  emailSuccessAction: emailSuccess,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(injectIntl(HelpCenter));
