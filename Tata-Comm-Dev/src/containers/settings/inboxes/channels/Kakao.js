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
import { onChangeDefault } from 'helpers/TringReactHelper';

const Kakao = ({
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
        type: 'kakao',
        service_id: values.serviceId,
        channel_type: values.channelType,
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
    serviceId: '',
    channelType: 'promotion',
  };

  const SignupSchema = Yup.object().shape({
    channelName: Yup.string().required('This field is required!'),
    serviceId: Yup.string().required('This field is required!'),
    channelType: Yup.string().required('This field is required!'),
  });
  const channelTypes = [
    { id: 'promotion', value: 'inboxes.kakao.promotion' },
    { id: 'transaction', value: 'inboxes.kakao.transaction' },
  ];
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
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row>
              <Colxx xxs="12">
                <h2 className="mb-4 font-weight-bold">
                  <IntlMessages id="inboxes.kakao.title" />
                </h2>
                <p>
                  <IntlMessages id="inboxes.kakao.desc" />
                </p>
                <FormGroupCoustom
                  identifier="channelName"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.kakao.channel_name.label"
                  placeholder="inboxes.kakao.channel_name.place_holder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="channelType"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.kakao.channel_type.label"
                  type="select"
                  options={channelTypes}
                  value={values.channelType}
                  onChange={(event) =>
                    onChangeDefault(event, 'channelType', setFieldValue)
                  }
                  required={true}
                />
                <FormGroupCoustom
                  identifier="serviceId"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.kakao.service_id.label"
                  placeholder="inboxes.kakao.service_id.place_holder"
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
})(Kakao);
