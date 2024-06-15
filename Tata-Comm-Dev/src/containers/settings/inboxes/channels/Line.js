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

import { Colxx } from 'components/common/CustomBootstrap';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';

import { addChannel, addChannelClean } from 'redux/actions';

const Line = ({
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
      name: values.channelName,
      channel: {
        type: 'line',
        line_channel_id: values.lineChannelId,
        line_channel_secret: values.lineChannelSecret,
        line_channel_token: values.lineChannelToken,
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
    channelName: '',
    lineChannelId: '',
    lineChannelSecret: '',
    lineChannelToken: '',
  };

  const SignupSchema = Yup.object().shape({
    channelName: Yup.string().required('This field is required!'),
    lineChannelId: Yup.string().required('This field is required!'),
    lineChannelSecret: Yup.string().required('This field is required!'),
    lineChannelToken: Yup.string().required('This field is required!'),
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
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row>
              <Colxx xxs="12">
                <h2 className="mb-4 font-weight-bold">
                  <IntlMessages id="inboxes.line.title" />
                </h2>
                <p>
                  <IntlMessages id="inboxes.line.desc" />
                </p>
                <FormGroupCoustom
                  identifier="channelName"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.line.channel_name.label"
                  placeholder="inboxes.line.channel_name.place_holder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="lineChannelId"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.line.line_channel_id.label"
                  placeholder="inboxes.line.line_channel_id.place_holder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="lineChannelSecret"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.line.line_channel_secret.label"
                  placeholder="inboxes.line.line_channel_secret.place_holder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="lineChannelToken"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.line.line_channel_token.label"
                  placeholder="inboxes.line.line_channel_token.place_holder"
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

// export default Line;

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
})(Line);
