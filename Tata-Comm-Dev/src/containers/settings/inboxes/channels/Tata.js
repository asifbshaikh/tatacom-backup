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

const Tata = ({
  type,
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
      tata_channel: {
        name: values.channelName,
        medium: values.medium,
        app_id: values.appId,
        ss_key: values.ssKey,
        phone_number: values.phoneNumber,
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
    appId: '',
    ssKey: '',
    medium: type,
    channelName: '',
    phoneNumber: '',
  };

  const SignupSchema = Yup.object().shape({
    channelName: Yup.string().required('This field is required!'),
    phoneNumber: Yup.string()
      // .test("Check prefix", "Phone number should start with `+` sign.", function (val) {
      //     return val && val.startsWith('+');
      // })
      .required('This field is required!'),
    appId: Yup.string().required('This field is required!'),
    ssKey: Yup.string().required('This field is required!'),
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
                  identifier="channelName"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.tata.channel_name.label"
                  placeholder="inboxes.tata.channel_name.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="phoneNumber"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.tata.phone_number.label"
                  placeholder="inboxes.tata.phone_number.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="appId"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.tata.app_id.label"
                  placeholder="inboxes.tata.app_id.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="ssKey"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.tata.ss_key.label"
                  placeholder="inboxes.tata.ss_key.placeholder"
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

// export default Tata;

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
})(Tata);
