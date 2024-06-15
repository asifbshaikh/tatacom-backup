import React, { useEffect } from 'react';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form } from 'formik';
import { Alert, Button, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { addInbox, addInboxClean, getConnector } from 'redux/channels/actions';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { NotificationManager } from 'components/common/react-notifications';
import CommonEnums from 'enums/commonEnums';
import { injectIntl } from 'react-intl';

const Whatsapp = ({
  next,
  formSuccess,
  setFieldsCoustom,
  addInboxAction,
  addInboxCleanAction,
  addData,
  connectorList,
  getConnectorActon,
  formError,
  intl,
}) => {
  const initialValues = {
    channelName: '',
    whatsapp_connector: '',
  };

  const { messages } = intl;
  const getTranslatedFormFieldRequiredMessage = (message) => {
    return messages[message];
  };

  useEffect(() => {
    getConnectorActon(CommonEnums.WHATSAPP);
    addInboxCleanAction();
  }, []);

  const getDropDownValues = () => {
    const arr = [{ id: '', value: 'CREATE_INBOX.LABEL.NO_CHANNEL' }];
    if (connectorList) {
      connectorList.map((data) => {
        if (data.inbox_id) {
          return arr.push({
            id: data.channel_id,
            value: data.channel_name,
            disabled: true,
          });
        }
        return arr.push({
          id: data.channel_id,
          value: data.channel_name,
          disabled: false,
        });
      });
    }
    return arr;
  };

  const inboxNameRegex = /^[^*%]*$/;
  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };

  const SignupSchema = Yup.object().shape({
    channelName: Yup.string()
      .matches(
        inboxNameRegex,
        getTranslatedFormFieldRequiredMessage(
          'CREATE_INBOX.LABEL.INBOX_NAME_VALIDATION'
        )
      )
      .required(getFieldRequiredMessage('forms.required-message')),
  });

  const onSubmitForm = (values) => {
    const newParams = {
      name: values.channelName.trim(),
      channel_id: values.whatsapp_connector,
      channel_type: CommonEnums.WHATSAPP,
    };
    addInboxAction(newParams);
    return false;
  };

  if (formSuccess) {
    NotificationManager.success(
      <IntlMessages id="CREATE_INBOX.LABEL.SUCCESS_MESSAGE" />,
      'Success',
      6000,
      null,
      null,
      ''
    );
    setFieldsCoustom({ inbox_id: addData.id, currentInbox: addData });
    addInboxCleanAction();
    next();
  }

  const handleChannelName = (setFieldValue, event) => {
    setFieldValue('whatsapp_connector', event.target.value);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validateOnMount
        validationSchema={SignupSchema}
        onSubmit={onSubmitForm}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row>
              <Colxx xxs="12" md="6">
                <h2 className="mb-4 font-weight-bold">
                  <IntlMessages id="inboxes.whatsapp.title" />
                </h2>
                <p>
                  <IntlMessages id="inboxes.whatsapp.desc" />
                </p>
                <FormGroupCoustom
                  identifier="channelName"
                  errors={errors}
                  touched={touched}
                  identifierLabel="inboxes.twilio.channel_name.label"
                  placeholder="inboxes.twilio.channel_name.placeholder"
                  required={true}
                />
                <FormGroupCoustom
                  identifier="whatsapp_connector"
                  errors={errors}
                  touched={touched}
                  dataTestId="whatsapp_connector"
                  identifierLabel="CREATE_INBOX.LABEL.CHANNEL_CONNECTOR"
                  type="select"
                  className="provider-lable"
                  options={getDropDownValues()}
                  onChange={(event) => handleChannelName(setFieldValue, event)}
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
  const { successAdd, errorAdd, loadingAdd, addData, connectorList } =
    channelsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    addData,
    connectorList,
  };
};
export default connect(mapStateToProps, {
  addInboxAction: addInbox,
  addInboxCleanAction: addInboxClean,
  getConnectorActon: getConnector,
})(injectIntl(Whatsapp));
