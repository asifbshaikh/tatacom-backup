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
      channel: {
        type: values.type,
        bot_token: values.botToken,
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
    type: 'telegram',
    botToken: '',
  };

  const SignupSchema = Yup.object().shape({
    botToken: Yup.string().required('Bot Token is required!'),
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
                  <IntlMessages id="inboxes.telegram_channel.title" />
                </h2>
                <p>
                  <IntlMessages id="inboxes.telegram_channel.desc" />
                </p>
                <FormGroupCoustom
                  identifier="botToken"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.telegram_channel.bot_token_label"
                  placeholder="inboxes.telegram_channel.bot_token_placeholder"
                  help="inboxes.telegram_channel.bot_token_help"
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
