import React, { useEffect } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Form, Formik } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import Switch from 'rc-switch';
import { injectIntl } from 'react-intl';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import CommonEnums from 'enums/commonEnums';
import {
  addMobilePushConfiguration,
  getMobilePushConfiguration,
} from 'redux/settingsChannels/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';

const IconUpload = React.lazy(() => import('./iconUpload'));

const APNSOptions = [
  {
    id: CommonEnums.APNS_AUTHENTICATION_KEY,
    label: 'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.APNS_AUTHENTICATION_KEY',
    value: CommonEnums.APNS_AUTHENTICATION_KEY,
  },
  {
    id: CommonEnums.APNS_PROVIDER_CERTIFICATE,
    label: 'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.APNS_PROVIDER_CERTIFICATE',
    value: CommonEnums.APNS_PROVIDER_CERTIFICATE,
  },
];
const IosMobilePushConfig = ({
  formRef,
  intl,
  setFile,
  file,
  getMobilePushConfig,
  mobilePushConfiguration,
  addMobilePushConfig,
  addSuccess,
  failSuccess,
}) => {
  const { messages: messagesIntl } = intl;
  useEffect(() => {
    getMobilePushConfig();
  }, []);

  const iOSConfigurationList =
    mobilePushConfiguration?.length > 0
      ? mobilePushConfiguration?.filter(
          (config) => config.platform === CommonEnums.PLATFORM_IOS
        )
      : [];
  const apnsProviderObj = iOSConfigurationList?.filter(
    (config) =>
      config?.configuration?.config_type ===
      CommonEnums.APNS_PROVIDER_CERTIFICATE
  )[0];

  const apnsAuthObj = iOSConfigurationList?.filter(
    (config) =>
      config?.configuration?.config_type === CommonEnums.APNS_AUTHENTICATION_KEY
  )[0];

  let initialValuesIOSAuthentication = {
    id: apnsAuthObj
      ? apnsAuthObj.id
      : apnsProviderObj
      ? apnsProviderObj.id
      : '',
    configType: apnsAuthObj
      ? CommonEnums.APNS_AUTHENTICATION_KEY
      : apnsProviderObj
      ? CommonEnums.APNS_PROVIDER_CERTIFICATE
      : CommonEnums.APNS_PROVIDER_CERTIFICATE,
    apnsAuthFile: '',
    teamId: apnsAuthObj?.configuration?.team_id ?? '',
    keyId: apnsAuthObj?.configuration?.key_id ?? '',
    bundleId: apnsAuthObj?.configuration?.bundle_id ?? '',
    bundleIdForIPad: apnsAuthObj?.configuration?.bundel_id_for_ipad ?? '',
    showIosImpressions: false,
    iPhoneCertificatePwd:
      apnsProviderObj?.configuration?.iphone_cert_password ?? '',
    iPhoneCertificate: '',
    iPadCertificatePwd:
      apnsProviderObj?.configuration?.ipad_cert_password ?? '',
    iPadCertificate: '',
  };

  const iOSAuthenticationSchema = Yup.object().shape({
    id: Yup.number(),
    configType: Yup.string().required(),
    apnsAuthFile: Yup.mixed().when('configType', {
      is: (value) => {
        return value === CommonEnums.APNS_AUTHENTICATION_KEY;
      },
      then: Yup.mixed().required(
        messagesIntl[
          'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.ERROR_MESSAGES.KEY_FILE'
        ]
      ),
      otherwise: Yup.mixed().notRequired(),
    }),
    teamId: Yup.string().when('configType', {
      is: (value) => {
        return value === CommonEnums.APNS_AUTHENTICATION_KEY;
      },
      then: Yup.string().required(
        messagesIntl[
          'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.ERROR_MESSAGES.TEAM_ID'
        ]
      ),
      otherwise: Yup.string().notRequired(),
    }),
    keyId: Yup.string().when('configType', {
      is: (value) => {
        return value === CommonEnums.APNS_AUTHENTICATION_KEY;
      },
      then: Yup.string().required(
        messagesIntl[
          'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.ERROR_MESSAGES.KEY_ID'
        ]
      ),
      otherwise: Yup.string().notRequired(),
    }),
    bundleId: Yup.string().when('configType', {
      is: (value) => {
        return value === CommonEnums.APNS_AUTHENTICATION_KEY;
      },
      then: Yup.string().required(
        messagesIntl[
          'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.ERROR_MESSAGES.BUNDLE_ID'
        ]
      ),
      otherwise: Yup.string().notRequired(),
    }),
    bundleIdForIPad: Yup.string().when('configType', {
      is: (value) => {
        return value === CommonEnums.APNS_AUTHENTICATION_KEY;
      },
      then: Yup.string(),
      otherwise: Yup.string().notRequired(),
    }),
    showIosImpressions: Yup.boolean().required(),
    iPhoneCertificate: Yup.mixed().when('configType', {
      is: (value) => {
        return value === CommonEnums.APNS_PROVIDER_CERTIFICATE;
      },
      then: Yup.mixed().required(
        messagesIntl[
          'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.ERROR_MESSAGES.I_PHONE_CERTIFICATE'
        ]
      ),
      otherwise: Yup.mixed().notRequired(),
    }),
    iPhoneCertificatePwd: Yup.string().when('iPhoneCertificate', {
      is: (value) => {
        return value ? true : false;
      },
      then: Yup.string().required(
        messagesIntl[
          'CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.ERROR_MESSAGES.I_PHONE_CERTIFICATE_PWD'
        ]
      ),
      otherwise: Yup.string().notRequired(),
    }),
    iPadCertificate: Yup.mixed(),
    iPadCertificatePwd: Yup.string().when('iPadCertificate', {
      is: (value) => {
        return value ? true : false;
      },
      then: Yup.string().required(),
      otherwise: Yup.string().notRequired(),
    }),
  });
  const handleSubmit = (values) => {
    const data = {
      id: values?.id,
      channel_name: CommonEnums.CHANNEL_NAME_API_MOBILE_PUSH,
      configuration: {
        config_type: values?.configType,
        team_id: values?.teamId,
        key_id: values?.keyId,
        bundle_id: values?.bundleId,
        iphone_cert_password: values?.iPhoneCertificatePwd,
        ipad_cert_password: values?.iPadCertificatePwd,
        ipad_cert_file_name: values?.iPadCertificate,
      },
      platform: CommonEnums.PLATFORM_IOS,
    };
    addMobilePushConfig({
      data,
      file:
        values?.config_type === CommonEnums.APNS_PROVIDER_CERTIFICATE
          ? values.apnsAuthFile
          : values.iPhoneCertificate,
    });
  };
  if (addSuccess) {
    const successMsg =
      'CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.NOTIFICATION_ALERT_ADDED';
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      CommonEnums.SUCCESS,
      6000,
      null,
      null
    );
  }

  if (failSuccess) {
    NotificationManager.success(
      failSuccess,
      CommonEnums.ERROR,
      6000,
      null,
      null
    );
  }

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValuesIOSAuthentication}
      validationSchema={iOSAuthenticationSchema}
      validateOnMount
      validateOnChange
      validateOnBlur
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched, isValid }) => (
        <Form className="av-tooltip tooltip-label-right">
          <Row className="pl-3 pr-3 mt-3">
            <Colxx xxs="12">
              <h2 color="muted font-weight-bold">
                <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.IOS_AUTHENTICATION" />
              </h2>
            </Colxx>
          </Row>
          <Row className="pl-4 pr-4 ">
            <Colxx xxs="12">
              <FormGroupCoustom
                noLable
                type="radioMulti"
                radioMultiOptions={APNSOptions}
                value={values.configType}
                onChange={(event) => {
                  setFieldValue('configType', event.target.value);
                }}
                identifier="configType"
                className="mobile-push-radio-btns"
              />
            </Colxx>
          </Row>

          {values?.configType == CommonEnums.APNS_AUTHENTICATION_KEY && (
            <Row className="pl-4 pr-4">
              <Colxx xxs="8">
                <FormGroup className="form-group has-float-label">
                  <FormText color="muted">
                    <i className="iconsminds-file">
                      {' '}
                      <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FILE_TYPE" />
                      <span className="required-star-mark">{`*`}</span>
                    </i>
                    <Input
                      name="import_file"
                      type="file"
                      identifier="apnsAuthFile"
                      accept="application/pkcs8"
                      onChange={(event) => {
                        setFieldValue(
                          'apnsAuthFile',
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                  </FormText>
                </FormGroup>
                <FormGroupCoustom
                  type="input"
                  value={values.teamId}
                  onChange={(event) => {
                    setFieldValue('teamId', event.target.value);
                  }}
                  identifier="teamId"
                  className="mobile-push-radio-btns"
                  identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.TEAM_ID"
                  placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PLACEHOLDER.TEAM_ID"
                  required={true}
                />
                <FormGroupCoustom
                  type="input"
                  value={values.keyId}
                  onChange={(event) => {
                    setFieldValue('keyId', event.target.value);
                  }}
                  identifier="keyId"
                  className="mobile-push-radio-btns"
                  identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.KEY_ID"
                  placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PLACEHOLDER.KEY_ID"
                  required={true}
                />
                <FormGroupCoustom
                  identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.BUNDLE_ID"
                  placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PLACEHOLDER.BUNDLE_ID"
                  type="input"
                  value={values.bundleId}
                  onChange={(event) => {
                    setFieldValue('bundleId', event.target.value);
                  }}
                  identifier="bundleId"
                  className="mobile-push-radio-btns"
                  required={true}
                />
                <FormGroupCoustom
                  identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.BUNDLE_ID_FOR_IPAD"
                  placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PLACEHOLDER.BUNDLE_ID_FOR_IPAD"
                  type="input"
                  value={values.bundleIdForIPad}
                  onChange={(event) => {
                    setFieldValue('bundleIdForIPad', event.target.value);
                  }}
                  identifier="bundleIdForIPad"
                  className="mobile-push-radio-btns"
                />
              </Colxx>
            </Row>
          )}

          {values?.configType == CommonEnums.APNS_PROVIDER_CERTIFICATE && (
            <Row className="pl-4 pr-4">
              <Colxx xxs="8">
                <Card className="white-card">
                  <CardBody>
                    <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.IPHONE_CERTIFICATE" />
                    <FormGroup className="form-group has-float-label">
                      <FormText color="muted">
                        <i className="iconsminds-file">
                          {' '}
                          <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.IPHONE_CERTIFICATE_FILE_TYPE" />
                          <span className="required-star-mark">{`*`}</span>
                        </i>
                        <Input
                          name="import_file"
                          type="file"
                          accept="application/pkcs8"
                          onChange={(event) => {
                            setFieldValue(
                              'iPhoneCertificate',
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </FormText>
                      <FormGroupCoustom
                        identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PASSWORD"
                        placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PLACEHOLDER.PASSWORD"
                        type="password"
                        value={values.iPhoneCertificatePwd}
                        onChange={(event) => {
                          setFieldValue(
                            'iPhoneCertificatePwd',
                            event.target.value
                          );
                        }}
                        identifier="iPhoneCertificatePwd"
                        className="mobile-push-radio-btns mt-4"
                        required={true}
                      />
                    </FormGroup>
                  </CardBody>
                </Card>
                <Card className="white-card mt-4 mb-4">
                  <CardBody>
                    <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.IPAD_CERTIFICATE" />
                    <FormGroup className="form-group has-float-label">
                      <FormText color="muted">
                        <i className="iconsminds-file">
                          {' '}
                          <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.IPAD_CERTIFICATE_FILE_TYPE" />
                        </i>
                        <Input
                          name="import_file"
                          type="file"
                          accept="application/pkcs8"
                          onChange={(event) => {
                            setFieldValue(
                              'iPadCertificate',
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </FormText>
                      <FormGroupCoustom
                        identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PASSWORD"
                        placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.PLACEHOLDER.PASSWORD"
                        type="password"
                        value={values.iPadCertificatePwd}
                        onChange={(event) => {
                          setFieldValue(
                            'iPadCertificatePwd',
                            event.target.value
                          );
                        }}
                        identifier="iPadCertificatePwd"
                        className="mobile-push-radio-btns mt-4"
                      />
                    </FormGroup>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          )}

          <Colxx xxs="12" style={{ display: 'flex' }}>
            <Label className="switch-btn-lable">
              <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.FORM.SHOW_IOS_IMPRESSIONS" />
            </Label>
            <Switch
              identifier="showIosImpressions"
              data-testid="showIosImpressions"
              errors={errors}
              touched={touched}
              className="custom-switch custom-switch-primary-inverse ml-4 mt-1"
              onChange={(e) => setFieldValue('showIosImpressions', e)}
              checked={values.showIosImpressions}
            />
          </Colxx>
          <FormText color="muted" className="pl-4">
            <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.IOS.SHOW_IOS_IMPRESSION_TEXT" />
          </FormText>
          <br></br>
          <IconUpload setFile={setFile} file={file} />
          <Button
            color="primary"
            className="float-right"
            type="submit"
            disabled={!isValid}
          >
            <IntlMessages id="pages.submit" />
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { mobilePushConfiguration, addSuccess, failSuccess } = settingsChannels;
  return { mobilePushConfiguration, addSuccess, failSuccess };
};

export default connect(mapStateToProps, {
  getMobilePushConfig: getMobilePushConfiguration,
  addMobilePushConfig: addMobilePushConfiguration,
})(injectIntl(IosMobilePushConfig));
