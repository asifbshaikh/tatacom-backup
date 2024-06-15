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
  NavLink,
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

const ThreeSixtyDialogWhatsapp = ({
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
        type: 'whatsapp',
        phone_number: values.phoneNumber,
        provider_config: {
          api_key: values.apiKey,
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
    inboxName: '',
    phoneNumber: '',
    apiKey: '',
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
      .required('This Field is required!'),
    apiKey: Yup.string().required('This field is required!'),
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
                  identifierLabel="inboxes.whatsapp.inbox_name.label"
                  placeholder="inboxes.whatsapp.inbox_name.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="phoneNumber"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.whatsapp.phone_number.label"
                  placeholder="inboxes.whatsapp.phone_number.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="apiKey"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.whatsapp.api_key.label"
                  placeholder="inboxes.whatsapp.api_key.placeholder"
                  required={true}
                />
                <p>
                  <NavLink
                    href="https://hub.360dialog.com/lp/whatsapp/L9dj7aPA"
                    target="_blank"
                  >
                    <IntlMessages id="inboxes.whatsapp.api_key.apply_for_access" />
                  </NavLink>
                </p>
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

// export default ThreeSixtyDialogWhatsapp;

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
})(ThreeSixtyDialogWhatsapp);
