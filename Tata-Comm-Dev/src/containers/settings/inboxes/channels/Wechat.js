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

const Wechat = ({
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
        type: 'wechat',
        app_id: values.app_id,
        app_secret: values.app_secret,
        open_id: values.open_id,
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
    app_id: '',
    app_secret: '',
    open_id: '',
  };

  const SignupSchema = Yup.object().shape({
    channelName: Yup.string().required('This field is required!'),
    app_id: Yup.string().required('This field is required!'),
    app_secret: Yup.string().required('This field is required!'),
    open_id: Yup.string().required('This field is required!'),
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
                  <IntlMessages id="inboxes.wechat.title" />
                </h2>
                <p>
                  <IntlMessages id="inboxes.wechat.desc" />
                </p>
                <FormGroupCoustom
                  identifier="channelName"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.wechat.channel_name.label"
                  placeholder="inboxes.wechat.channel_name.place_holder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="app_id"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.wechat.app_id.label"
                  placeholder="inboxes.wechat.app_id.place_holder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="app_secret"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.wechat.app_secret.label"
                  placeholder="inboxes.wechat.app_secret.place_holder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="open_id"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.wechat.open_id.label"
                  placeholder="inboxes.wechat.open_id.place_holder"
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

// export default Wechat;

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
})(Wechat);
