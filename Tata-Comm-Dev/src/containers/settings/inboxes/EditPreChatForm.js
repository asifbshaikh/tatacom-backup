import React from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';

import { onChangeDefault } from 'helpers/TringReactHelper';

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

// import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';

import { updateChannel, updateChannelClean } from 'redux/actions';

const Website = ({
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
        pre_chat_form_enabled: values.preChatFormEnabled,
        pre_chat_form_options: {
          pre_chat_message: values.preChatMessage,
          require_email: values.requireEmail,
        },
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

  const { pre_chat_message: preChatMessage, require_email: requireEmail } =
    editFormData.pre_chat_form_options || {};
  const initialValues = {
    currentInboxId: editFormData.id,
    preChatFormEnabled: editFormData.pre_chat_form_enabled,
    preChatMessage,
    requireEmail,
  };

  return (
    <>
      <Row>
        <Colxx xxs="3">
          <h3>
            <IntlMessages id="inboxes.prechatform_nav" />
          </h3>
          <p>
            <IntlMessages id="inboxes.prechatform_nav_help" />
          </p>
        </Colxx>
        <Colxx xxs="9">
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
                    <FormGroupCoustom
                      identifier="preChatFormEnabled"
                      errors={errors}
                      touched={touched}
                      identifierLabel="inboxes.pre_chat_form_enable_label"
                      type="select"
                      options={[
                        { id: true, value: 'inboxes.pre_chat_form_enabled' },
                        { id: false, value: 'inboxes.pre_chat_form_disabled' },
                      ]}
                      value={values.preChatFormEnabled}
                      onChange={(event) =>
                        onChangeDefault(
                          event,
                          'csatSurveyEnabled',
                          setFieldValue
                        )
                      }
                      required={true}
                    />
                    <FormGroupCoustom
                      identifier="preChatMessage"
                      errors={errors}
                      touched={touched}
                      identifierLabel="inboxes.pre_chat_message_label"
                      placeholder="inboxes.pre_chat_message_placeholder"
                      type="textarea"
                      value={values.preChatMessage}
                      required={true}
                    />
                    <FormGroupCoustom
                      identifier="requireEmail"
                      errors={errors}
                      touched={touched}
                      type="checkboxMulti"
                      noLable
                      radioMultiOptions={[
                        {
                          id: 'reqemail_enabled',
                          value: 'enabled',
                          label: 'inboxes.require_email',
                        },
                      ]}
                      onChange={(event) => {
                        setFieldValue(
                          'requireEmail',
                          event.target.checked,
                          false
                        );
                      }}
                      value={values.requireEmail ? ['enabled'] : []}
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
        </Colxx>
      </Row>
    </>
  );
};

// export default Website;

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
})(Website);
