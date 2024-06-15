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
import { onChangeDefault } from 'helpers/TringReactHelper';

const SmtpSettings = ({
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
        smtp_enabled: values.isSMTPEnabled,
        smtp_address: values.address,
        smtp_port: values.port,
        smtp_email: values.email,
        smtp_password: values.password,
        smtp_domain: values.domain,
        smtp_enable_ssl_tls: values.ssl,
        smtp_enable_starttls_auto: values.starttls,
        smtp_openssl_verify_mode: values.openSSLVerifyMode,
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
    isSMTPEnabled:
      typeof editFormData.smtp_enabled === 'undefined'
        ? editFormData.smtp_enabled
        : false,
    address: editFormData.smtp_address || '',
    port: editFormData.smtp_port ? editFormData.smtp_port : '',
    email: editFormData.smtp_email || '',
    password: editFormData.smtp_password || '',
    domain: editFormData.smtp_domain || '',
    starttls: editFormData.smtp_enable_starttls_auto || '',
    ssl: editFormData.smtp_enable_ssl_tls || '',
    openSSLVerifyMode:
      typeof editFormData.smtp_openssl_verify_mode === 'undefined'
        ? editFormData.smtp_openssl_verify_mode
        : 'none',
    encryptionProtocolVal: [],
  };

  const SignupSchema = Yup.object().shape({
    address: Yup.string().when('isSMTPEnabled', {
      is: true,
      then: (schema) => schema.required('This field is required!'), // yup.string().required(),
      otherwise: (schema) => schema.nullable(),
    }),
    port: Yup.string().when('isSMTPEnabled', {
      is: true,
      then: (schema) =>
        schema
          .required('This field is required!')
          .matches(/^[0-9]+$/, 'Must be only digits')
          .min(2, 'Must be min 2 digits'),
      otherwise: (schema) => schema.nullable(),
    }),
    email: Yup.string().when('isSMTPEnabled', {
      is: true,
      then: (schema) =>
        schema.required('This field is required!').email('Invalid email!'),
      otherwise: (schema) => schema.nullable(),
    }),
    password: Yup.string().when('isSMTPEnabled', {
      is: true,
      then: (schema) => schema.required('This field is required!'),
      otherwise: (schema) => schema.nullable(),
    }),
    domain: Yup.string().when('isSMTPEnabled', {
      is: true,
      then: (schema) => schema.required('This field is required!'),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const encryptionProtocols = [
    {
      id: 'ssl',
      // title: 'SSL/TLS',
      // checked: smtp_enable_ssl_tls,
      value: 'ssl',
      label: 'inboxes.smtp.ssl_tls',
    },
    {
      id: 'starttls',
      // title: 'STARTTLS',
      // checked: smtp_enable_starttls_auto,
      value: 'starttls',
      label: 'inboxes.smtp.start_tls',
    },
  ];
  if (editFormData.smtp_enable_ssl_tls) {
    initialValues.encryptionProtocolVal = ['ssl'];
  }
  if (editFormData.smtp_enable_starttls_auto) {
    initialValues.encryptionProtocolVal = ['starttls'];
  }
  const openSSLVerifyModes = [
    { id: 'none', value: 'inboxes.smtp.none' },
    { id: 'peer', value: 'inboxes.smtp.peer' },
    { id: 'client_once', value: 'inboxes.smtp.client_once' },
    { id: 'fail_if_no_peer_cert', value: 'inboxes.smtp.fail_if_no_peer_cert' },
  ];

  return (
    <>
      {/* <Row> */}
      <Colxx xxs="12" className="mt-3">
        <h3>
          <IntlMessages id="inboxes.smtp_nav" />
        </h3>
        <p>
          <IntlMessages id="inboxes.smtp_nav_help" />
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
                    identifier="isSMTPEnabled"
                    errors={errors}
                    touched={touched}
                    // identifierLabel='inboxes.smtp.toggle_availability'
                    help="inboxes.smtp.toggle_help"
                    type="checkboxMulti"
                    noLable
                    radioMultiOptions={[
                      {
                        id: 'imap_enabled',
                        value: 'enabled',
                        label: 'inboxes.smtp.toggle_availability',
                      },
                    ]}
                    onChange={(event) => {
                      setFieldValue(
                        'isSMTPEnabled',
                        event.target.checked,
                        false
                      );
                    }}
                    value={values.isSMTPEnabled ? ['enabled'] : []}
                    required={true}
                  />
                  {values.isSMTPEnabled && (
                    <div>
                      <FormGroupCoustom
                        identifier="address"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.smtp.address.label"
                        placeholder="inboxes.smtp.address.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        type="number"
                        identifier="port"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.smtp.port.label"
                        placeholder="inboxes.smtp.port.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        identifier="email"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.smtp.email.label"
                        placeholder="inboxes.smtp.email.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        type="password"
                        identifier="password"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.smtp.password.label"
                        placeholder="inboxes.smtp.password.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        identifier="domain"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.smtp.domain.label"
                        placeholder="inboxes.smtp.domain.place_holder"
                        required={true}
                      />
                      <FormGroupCoustom
                        identifier="encryptionProtocolVal"
                        errors={errors}
                        touched={touched}
                        type="radioMulti"
                        // noLable
                        identifierLabel="inboxes.smtp.encryption"
                        radioMultiOptions={encryptionProtocols}
                        onChange={(event) => {
                          setFieldValue(
                            'encryptionProtocolVal',
                            [event.target.value],
                            false
                          );
                          if (event.target.value === 'ssl') {
                            setFieldValue('ssl', true, false);
                            setFieldValue('starttls', false, false);
                          } else {
                            setFieldValue('ssl', false, false);
                            setFieldValue('starttls', true, false);
                          }
                        }}
                        value={values.encryptionProtocolVal}
                        required={true}
                      />
                      <FormGroupCoustom
                        identifier="openSSLVerifyMode"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.smtp.open_ssl_verify_mode"
                        type="select"
                        options={openSSLVerifyModes}
                        value={values.openSSLVerifyMode}
                        onChange={(event) =>
                          onChangeDefault(
                            event,
                            'openSSLVerifyMode',
                            setFieldValue
                          )
                        }
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
                    <IntlMessages id="inboxes.smtp.update" />
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

// export default SmtpSettings;

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
})(SmtpSettings);
