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

const Telegram = ({
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
  // const [greetingMessageVisible, setGreetingMessageVisible] = useState(false);

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      formData: false,
      name: values.name,
      channel: {
        type: values.type,
        webhook_url: values.webhookUrl,
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
  // if (fields.inbox_id) {
  //     NotificationManager.success(
  //         'Saved successfully',
  //         'Success',
  //         6000,
  //         null,
  //         null,
  //         '', // className
  //     );
  //     next();
  // }
  const initialValues = {
    type: 'api',
    name: '',
    webhookUrl: '',
  };
  // const re = /((https?):\/\/)(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?(.*)$/;

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!'),
    webhookUrl: Yup.string()
      .matches(/(http|https):\/\/(.*)/, 'Valid http(s) URL only')
      // .test("Check prefix", "Valid http(s) URL only", function (val) {
      //     return val && val.startsWith('http');
      // })
      .required('webhookUrl is required!'),
  });
  return (
    <>
      {/* <Formik initialValues={initialValues} validationSchema={SignupSchema} enableReinitialize onSubmit={onsendConversation}> */}

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
                  <IntlMessages id="inboxes.api_channel.title" />
                </h2>
                <p>
                  <IntlMessages id="inboxes.api_channel.desc" />
                </p>
                <FormGroupCoustom
                  identifier="name"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.api_channel.channel_name_label"
                  placeholder="inboxes.api_channel.channel_name_placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="webhookUrl"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.api_channel.webhook_url_label"
                  placeholder="inboxes.api_channel.webhook_url_placeholder"
                  help="inboxes.api_channel.webhook_url_help"
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

// export default Telegram;

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
  // addChannelWebsiteAction: addChannelWebsite,
  // addChannelWebsiteCleanAction: addChannelWebsiteClean,
  addChannelWebsiteAction: addChannel,
  addChannelWebsiteCleanAction: addChannelClean,
})(Telegram);
