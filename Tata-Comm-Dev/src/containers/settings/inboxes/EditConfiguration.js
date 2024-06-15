import React from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';

import { INBOX_TYPES } from 'helpers/TringIconHelper';

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
// import { injectIntl } from 'react-intl';

import { NavLink } from 'react-router-dom';

// import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';

import { updateChannel, updateChannelClean } from 'redux/actions';

import ImapSettings from './ImapSettings';
import SmtpSettings from './SmtpSettings';

const EditConfiguration = ({
  // inboxid,
  // fields,
  // formRef, next,
  // setFieldsCoustom,
  formSuccess,
  formError,
  formLoading,
  // addData,
  editFormData,
  updateChannelAction,
  updateChannelCleanAction,
}) => {
  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      id: values.currentInboxId,
      formData: false,
      channel: {
        hmac_mandatory: values.hmacMandatory,
      },
    };

    updateChannelAction(newParams);
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
    updateChannelCleanAction({});
  }

  const initialValues = {
    currentInboxId: editFormData.id,
    hmacMandatory: editFormData.hmac_mandatory,
  };

  return (
    <>
      <Row>
        {/* <Colxx xxs="3">
                    <h3><IntlMessages id="inboxes.prechatform_nav" /></h3>
                    <p><IntlMessages id="inboxes.prechatform_nav_help" /></p>
                </Colxx> */}
        <Colxx xxs="12">
          <Formik
            // innerRef={formRef}
            initialValues={initialValues}
            // validationSchema={SignupSchema}
            // validateOnMount
            enableReinitialize
            onSubmit={onSubmitForm}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="av-tooltip tooltip-label-right">
                <Row>
                  <Colxx xxs="12">
                    {(editFormData.channel_type === INBOX_TYPES.TWILIO ||
                      (editFormData.channel_type === INBOX_TYPES.TATA &&
                        editFormData.medium === 'sms') ||
                      editFormData.channel_type === INBOX_TYPES.VIBER ||
                      editFormData.channel_type === INBOX_TYPES.LINE) &&
                      editFormData.callback_webhook_url && (
                        <div>
                          <h2 className="font-weight-bold">
                            <IntlMessages id="inboxes.callback_webhook_url_nav" />
                          </h2>
                          <p>
                            {editFormData.channel_type ===
                              INBOX_TYPES.TWILIO && (
                              <IntlMessages id="inboxes.callback_webhook_url_help_twilio" />
                            )}
                            {editFormData.channel_type === INBOX_TYPES.TATA && (
                              <IntlMessages id="inboxes.callback_webhook_url_help_tata" />
                            )}
                            {editFormData.channel_type ===
                              INBOX_TYPES.VIBER && (
                              <IntlMessages id="inboxes.callback_webhook_url_help_viber" />
                            )}
                            {editFormData.channel_type === INBOX_TYPES.LINE && (
                              <IntlMessages id="inboxes.callback_webhook_url_help_line" />
                            )}
                          </p>
                          <div className="directContent">
                            <div className="position-absolute  pt-1 pl-2 l-0">
                              <NavLink
                                className="p-0"
                                href="#"
                                to={{}}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    editFormData.callback_webhook_url
                                  );
                                }}
                              >
                                <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                              </NavLink>
                            </div>
                            <code className="pl-5">
                              {editFormData.callback_webhook_url}
                            </code>
                          </div>
                        </div>
                      )}
                    {editFormData.channel_type === INBOX_TYPES.WEB &&
                      editFormData.web_widget_script && (
                        <div>
                          <h2 className="font-weight-bold">
                            <IntlMessages id="inboxes.configuration_code_nav" />
                          </h2>
                          <p>
                            <IntlMessages id="inboxes.configuration_code_nav_help" />
                          </p>
                          <div className="directContent">
                            <div className="position-absolute  pt-1 pl-2 l-0">
                              <NavLink
                                className="p-0"
                                href="#"
                                to={{}}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    editFormData.web_widget_script
                                  );
                                }}
                              >
                                <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                              </NavLink>
                            </div>
                            <code className="pl-5">
                              {editFormData.web_widget_script}
                            </code>
                          </div>
                        </div>
                      )}
                    {editFormData.channel_type === INBOX_TYPES.WEB &&
                      editFormData.hmac_token && (
                        <div>
                          <h2 className="font-weight-bold">
                            <IntlMessages id="inboxes.hmac_verification_code_nav" />
                          </h2>
                          <p>
                            <IntlMessages id="inboxes.hmac_verification_code_nav_help" />
                          </p>
                          <div className="directContent">
                            <div className="position-absolute  pt-1 pl-2 l-0">
                              <NavLink
                                className="p-0"
                                href="#"
                                to={{}}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    editFormData.hmac_token
                                  );
                                }}
                              >
                                <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                              </NavLink>
                            </div>
                            <code className="pl-5">
                              {editFormData.hmac_token}
                            </code>
                          </div>
                        </div>
                      )}
                    {editFormData.channel_type === INBOX_TYPES.WEB && (
                      <div className="mt-3">
                        <h2 className="font-weight-bold">
                          <IntlMessages id="inboxes.hmac_mandatory_verification_nav" />
                        </h2>
                        <p>
                          <IntlMessages id="inboxes.hmac_mandatory_verification_nav_help" />
                        </p>
                        <FormGroupCoustom
                          identifier="hmacMandatory"
                          errors={errors}
                          touched={touched}
                          type="checkboxMulti"
                          noLable
                          radioMultiOptions={[
                            {
                              id: 'hmac_enabled',
                              value: 'enabled',
                              label: 'inboxes.hmac_mandatory_label',
                            },
                          ]}
                          onChange={(event) => {
                            setFieldValue(
                              'hmacMandatory',
                              event.target.checked,
                              false
                            );
                          }}
                          value={values.hmacMandatory ? ['enabled'] : []}
                        />
                      </div>
                    )}
                    {editFormData.channel_type === INBOX_TYPES.API &&
                      editFormData.inbox_identifier && (
                        <div>
                          <h2 className="font-weight-bold">
                            <IntlMessages id="inboxes.inbox_identifier_nav" />
                          </h2>
                          <p>
                            <IntlMessages id="inboxes.inbox_identifier_help" />
                          </p>
                          <div className="directContent">
                            <div className="position-absolute  pt-1 pl-2 l-0">
                              <NavLink
                                className="p-0"
                                href="#"
                                to={{}}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    editFormData.inbox_identifier
                                  );
                                }}
                              >
                                <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                              </NavLink>
                            </div>
                            <code className="pl-5">
                              {editFormData.inbox_identifier}
                            </code>
                          </div>
                        </div>
                      )}
                    {editFormData.channel_type === INBOX_TYPES.EMAIL &&
                      editFormData.forward_to_email && (
                        <div>
                          <h2 className="font-weight-bold">
                            <IntlMessages id="inboxes.forward_to_email_nav" />
                          </h2>
                          <p>
                            <IntlMessages id="inboxes.forward_to_email_help" />
                          </p>
                          <div className="directContent">
                            <div className="position-absolute  pt-1 pl-2 l-0">
                              <NavLink
                                className="p-0"
                                href="#"
                                to={{}}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    editFormData.forward_to_email
                                  );
                                }}
                              >
                                <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                              </NavLink>
                            </div>
                            <code className="pl-5">
                              {editFormData.forward_to_email}
                            </code>
                          </div>
                        </div>
                      )}
                    {formError && formError.errorMsg && (
                      <Alert color="danger" className="rounded">
                        {formError.errorMsg}
                      </Alert>
                    )}
                    <Button color="primary" className="mt-3">
                      <IntlMessages id="pages.submit" />
                    </Button>
                  </Colxx>
                </Row>
              </Form>
            )}
          </Formik>
        </Colxx>

        {editFormData.channel_type === INBOX_TYPES.EMAIL && (
          <>
            <ImapSettings editFormData={editFormData} />
            <SmtpSettings editFormData={editFormData} />
          </>
        )}
      </Row>
    </>
  );
};

// export default EditConfiguration;

const mapStateToProps = ({ channelsApp }) => {
  const { successUpdate, errorUpdate, loadingUpdate } = channelsApp;
  return {
    formSuccess: successUpdate,
    formError: errorUpdate,
    formLoading: loadingUpdate,
  };
};
export default connect(mapStateToProps, {
  updateChannelAction: updateChannel,
  updateChannelCleanAction: updateChannelClean,
})(EditConfiguration);
