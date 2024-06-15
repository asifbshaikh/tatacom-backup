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
// import { injectIntl } from 'react-intl';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';

import { updateChannel, updateChannelClean } from 'redux/actions';

const ImapSettings = ({
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
        imap_enabled: values.isIMAPEnabled,
        imap_address: values.address,
        imap_port: values.port,
        imap_email: values.email,
        imap_password: values.password,
        imap_enable_ssl: values.isSSLEnabled,
        imap_inbox_synced_at: values.isIMAPEnabled
          ? new Date().toISOString()
          : undefined,
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
    isIMAPEnabled:
      typeof editFormData.imap_enabled === 'undefined'
        ? editFormData.imap_enabled
        : false,
    address: editFormData.imap_address || '',
    port: editFormData.imap_port ? editFormData.imap_port : '',
    email: editFormData.imap_email || '',
    password: editFormData.imap_password || '',
    isSSLEnabled:
      typeof editFormData.imap_enable_ssl === 'undefined'
        ? editFormData.imap_enable_ssl
        : true,
  };

  const SignupSchema = Yup.object().shape({
    address: Yup.string().when('isIMAPEnabled', {
      is: true,
      then: (schema) => schema.required('This field is required!'), // yup.string().required(),
      otherwise: (schema) => schema.nullable(),
    }),
    port: Yup.string().when('isIMAPEnabled', {
      is: true,
      then: (schema) =>
        schema
          .required('This field is required!')
          .matches(/^[0-9]+$/, 'Must be only digits')
          .min(2, 'Must be min 2 digits'),
      otherwise: (schema) => schema.nullable(),
    }),
    email: Yup.string().when('isIMAPEnabled', {
      is: true,
      then: (schema) =>
        schema.required('This field is required!').email('Invalid email!'),
      otherwise: (schema) => schema.nullable(),
    }),
    password: Yup.string().when('isIMAPEnabled', {
      is: true,
      then: (schema) => schema.required('This field is required!'),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  return (
    <>
      {/* <Row> */}
      <Colxx xxs="12" className="mt-3">
        <h3>
          <IntlMessages id="inboxes.imap_nav" />
        </h3>
        <p>
          <IntlMessages id="inboxes.imap_nav_help" />
        </p>
        <Formik
          // innerRef={formRef}
          initialValues={initialValues}
          validationSchema={SignupSchema}
          // validateOnMount
          enableReinitialize
          onSubmit={onSubmitForm}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="av-tooltip tooltip-label-right">
              <Row>
                <Colxx xxs="12">
                  <FormGroupCoustom
                    identifier="isIMAPEnabled"
                    errors={errors}
                    touched={touched}
                    // identifierLabel='inboxes.imap.toggle_availability'
                    help="inboxes.imap.toggle_help"
                    type="checkboxMulti"
                    noLable
                    radioMultiOptions={[
                      {
                        id: 'imap_enabled',
                        value: 'enabled',
                        label: 'inboxes.imap.toggle_availability',
                      },
                    ]}
                    onChange={(event) => {
                      setFieldValue(
                        'isIMAPEnabled',
                        event.target.checked,
                        false
                      );
                    }}
                    value={values.isIMAPEnabled ? ['enabled'] : []}
                    required={true}
                  />
                  {values.isIMAPEnabled && (
                    <div>
                      <FormGroupCoustom
                        identifier="address"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.imap.address.label"
                        placeholder="inboxes.imap.address.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        type="number"
                        identifier="port"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.imap.port.label"
                        placeholder="inboxes.imap.port.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        identifier="email"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.imap.email.label"
                        placeholder="inboxes.imap.email.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        type="password"
                        identifier="password"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.imap.password.label"
                        placeholder="inboxes.imap.password.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        identifier="isSSLEnabled"
                        errors={errors}
                        touched={touched}
                        type="checkboxMulti"
                        noLable
                        radioMultiOptions={[
                          {
                            id: 'ssl_enabled',
                            value: 'enabled',
                            label: 'inboxes.imap.enable_ssl',
                          },
                        ]}
                        onChange={(event) => {
                          setFieldValue(
                            'isSSLEnabled',
                            event.target.checked,
                            false
                          );
                        }}
                        value={values.isSSLEnabled ? ['enabled'] : []}
                        required={true}
                      />
                    </div>
                  )}
                  {formError && formError.errorMsg && (
                    <Alert color="danger" className="rounded">
                      {formError.errorMsg}
                    </Alert>
                  )}
                  <Button color="primary">
                    <IntlMessages id="inboxes.imap.update" />
                  </Button>
                </Colxx>
              </Row>
            </Form>
          )}
        </Formik>
      </Colxx>
      {/* </Row> */}
    </>
  );
};

// export default ImapSettings;

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
})(ImapSettings);
