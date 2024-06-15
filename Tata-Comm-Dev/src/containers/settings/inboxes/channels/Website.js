import React from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { onChangeDefault } from 'helpers/TringReactHelper';
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

const Website = ({
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
      name: values.inboxName,
      greeting_enabled: values.greetingEnabled,
      greeting_message: values.greetingMessage,
      channel: {
        type: values.type,
        website_url: values.channelWebsiteUrl,
        widget_color: values.channelWidgetColor,
        welcome_title: values.channelWelcomeTitle,
        welcome_tagline: values.channelWelcomeTagline,
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
    type: 'web_widget',
    inboxName: '',
    channelWebsiteUrl: '',
    channelWidgetColor: '',
    channelWelcomeTitle: '',
    channelWelcomeTagline: '',
    greetingEnabled: false,
    selectedType: '',
    greetingMessage: '',
  };
  // const onSubmitForm = (a, b, c) => {
  // }

  const SignupSchema = Yup.object().shape({
    inboxName: Yup.string().required('Inbox name is required!'),
    channelWebsiteUrl: Yup.string().required('Website URL is required!'),
    channelWidgetColor: Yup.string().required('Color is required!'),
    channelWelcomeTitle: Yup.string().required('Welcome Title is required!'),
    channelWelcomeTagline: Yup.string().required(
      'Welcome Tagline is required!'
    ),
    greetingEnabled: Yup.string().required('Option is required!'),
    greetingMessage: Yup.string().when('greetingEnabled', {
      is: true,
      then: (schema) => schema.required('Greeting Message is required!'), // yup.string().required(),
      otherwise: (schema) => schema.nullable(),
    }),
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
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row>
              <Colxx xxs="12">
                <h2 className="mb-4 font-weight-bold">
                  <IntlMessages id="inboxes.website.title" />
                </h2>
                <p>
                  <IntlMessages id="inboxes.website.desc" />
                </p>
                <FormGroupCoustom
                  identifier="inboxName"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.website.website_name"
                  placeholder="inboxes.website.website_name_placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="channelWebsiteUrl"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.website.website_domain"
                  placeholder="inboxes.website.website_domain_placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="channelWidgetColor"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.website.widget_color"
                  placeholder="inboxes.website.widget_color_placeholder"
                  help="contacts.color_msg"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="channelWelcomeTitle"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.website.channel_welcome_title"
                  placeholder="inboxes.website.channel_welcome_title_placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="channelWelcomeTagline"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.website.channel_welcome_tagline"
                  placeholder="inboxes.website.channel_welcome_tagline_placeholder"
                  required={true}
                />
                {/* <FormGroupCoustom
                                    identifier='greetingEnabled'
                                    errors={errors}
                                    touched={touched}
                                    identifierLabel='inboxes.website.channel_greeting_toggle'
                                    help='inboxes.website.channel_greeting_toggle_help'
                                    type='radioMulti'
                                    noLable
                                    radioMultiOptions={[
                                        {
                                            id: 'greeting_enabled',
                                            value: 'enabled',
                                            label: 'inboxes.website.channel_greeting_toggle_enabled',
                                        },
                                        {
                                            id: 'greeting_disabled',
                                            value: 'disabled',
                                            label: 'inboxes.website.channel_greeting_toggle_disabled',
                                        },
                                    ]}
                                    onChange={(event) => {
                                        setGreetingMessageVisible(event.target.value === 'enabled')
                                        setFieldValue('greetingEnabled', event.target.value, false);
                                    }}
                                /> */}
                <FormGroupCoustom
                  identifier="greetingEnabled"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.website.channel_greeting_toggle"
                  help="inboxes.website.channel_greeting_toggle_help"
                  type="select"
                  options={[
                    {
                      id: true,
                      value: 'inboxes.website.greeting_enabled_enabled',
                    },
                    {
                      id: false,
                      value: 'inboxes.website.greeting_enabled_disabled',
                    },
                  ]}
                  value={values.greetingEnabled}
                  onChange={(event) =>
                    onChangeDefault(event, 'greetingEnabled', setFieldValue)
                  }
                  required={true}
                />
                {values.greetingEnabled && (
                  <FormGroupCoustom
                    type="textarea"
                    identifier="greetingMessage"
                    errors={errors}
                    touched={touched}
                    identifierLabel="inboxes.website.channel_greeting_message"
                    placeholder="inboxes.website.channel_greeting_message_placeholder"
                    required={true}
                  />
                )}
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

// export default Website;

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
})(Website);
