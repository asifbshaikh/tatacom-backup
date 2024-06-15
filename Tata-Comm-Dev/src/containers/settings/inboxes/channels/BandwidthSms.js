import React from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';

import {
  Formik,
  Form,
  // Field
} from 'formik';

import {
  // FormGroup,
  // Label,
  Row,
  Button,
  Alert,
  // Card, CardBody
} from 'reactstrap';
// import { injectIntl } from 'react-intl';

import { Colxx } from 'components/common/CustomBootstrap';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';

import {
  // addChannelWebsite,
  // addChannelWebsiteClean,
  addChannel,
  addChannelClean,
} from 'redux/actions';

const BandwidthSms = ({
  // type,
  // fields,
  formRef,
  next,
  setFieldsCoustom,
  formSuccess,
  formError,
  formLoading,
  addData,
  addChannelWebsiteAction,
  addChannelWebsiteCleanAction,
}) => {
  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      formData: false,
      name: values.inboxName,
      channel: {
        type: 'sms',
        phone_number: values.phoneNumber,
        provider_config: {
          api_key: values.apiKey,
          api_secret: values.apiSecret,
          application_id: values.applicationId,
          account_id: values.accountId,
        },
      },
    };
    addChannelWebsiteAction(newParams);
    return false;
  };
  if (formSuccess) {
    NotificationManager.success(
      'Saved successfully',
      'Success',
      6000,
      null,
      null,
      '' // className
    );
    setFieldsCoustom({ inbox_id: addData.id, currentInbox: addData });
    addChannelWebsiteCleanAction({});
    next();
  }
  const initialValues = {
    accountId: '',
    apiKey: '',
    apiSecret: '',
    applicationId: '',
    inboxName: '',
    phoneNumber: '',
  };

  const SignupSchema = Yup.object().shape({
    inboxName: Yup.string().required('This field is required!'),
    phoneNumber: Yup.string()
      .test(
        'Check prefix',
        'Phone number should start with `+` sign.',
        function (val) {
          return val && val.startsWith('+');
        }
      )
      .required('This field is required!'),
    accountId: Yup.string().required('This field is required!'),
    applicationId: Yup.string().required('This field is required!'),
    apiKey: Yup.string().required('This field is required!'),
    apiSecret: Yup.string().required('This field is required!'),
  });
  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={SignupSchema}
        validateOnMount
        // enableReinitialize
        onSubmit={onSubmitForm}
      >
        {({
          errors,
          touched,
          // setFieldValue, values
        }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row>
              <Colxx xxs="12">
                {/* <h5 className="mb-4">
                                    <IntlMessages id="inboxes.website.title" />
                                </h5>
                                <p><IntlMessages id="inboxes.website.desc" /></p> */}
                <FormGroupCoustom
                  identifier="inboxName"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.bandwidth.inbox_name.label"
                  placeholder="inboxes.bandwidth.inbox_name.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="phoneNumber"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.bandwidth.phone_number.label"
                  placeholder="inboxes.bandwidth.phone_number.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="accountId"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.bandwidth.account_id.label"
                  placeholder="inboxes.bandwidth.account_id.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="applicationId"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.bandwidth.application_id.label"
                  placeholder="inboxes.bandwidth.application_id.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="apiKey"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.bandwidth.api_key.label"
                  placeholder="inboxes.bandwidth.api_key.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="apiSecret"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.bandwidth.api_secret.label"
                  placeholder="inboxes.bandwidth.api_secret.placeholder"
                  required={true}
                />
                {formError && formError.errorMsg && (
                  <Alert color="danger" className="rounded">
                    {formError.errorMsg}
                  </Alert>
                )}
                <Button color="primary">
                  <IntlMessages id="pages.submit" />
                </Button>
              </Colxx>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

// export default BandwidthSms;

const mapStateToProps = ({ channelsApp }) => {
  const { successAdd, errorAdd, loadingAdd, addData } = channelsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    addData,
  };
};
export default connect(mapStateToProps, {
  addChannelWebsiteAction: addChannel,
  addChannelWebsiteCleanAction: addChannelClean,
})(BandwidthSms);
