import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { NotificationManager } from 'components/common/react-notifications';
import CommonEnums from 'enums/commonEnums';
import { Form, Formik } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, FormGroup, FormText, Input, Row } from 'reactstrap';
import {
  addMobilePushConfiguration,
  getMobilePushConfiguration,
} from 'redux/settingsChannels/actions';
import * as Yup from 'yup';

const IconUpload = React.lazy(() => import('./iconUpload'));

const serverKeyOptions = [
  {
    id: 'privateKey',
    label: 'CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.PRIVATE_KEY',
    value: CommonEnums.PRIVATE_KEY_FILE,
  },
  {
    id: 'fcmServerKey',
    label: 'CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FCM_SERVER_KEY',
    value: CommonEnums.FCM_SERVER_KEY,
  },
];

const AndroidMobilePushConfig = ({
  formRef,
  intl,
  getMobilePushConfig,
  mobilePushConfiguration,
  addMobilePushConfig,
  addSuccess,
  setFile,
  file,
  failSuccess,
}) => {
  const { messages: messagesIntl } = intl;

  useEffect(() => {
    getMobilePushConfig();
  }, []);

  const androidConfigurationList =
    mobilePushConfiguration?.length > 0
      ? mobilePushConfiguration?.filter(
          (config) => config.platform === CommonEnums.PLATFORM_ANDROID
        )
      : [];
  const privateKeyObj = androidConfigurationList?.filter(
    (config) =>
      config?.configuration?.config_type === CommonEnums.PRIVATE_KEY_FILE
  )[0];
  const fcmServerKeyObj = androidConfigurationList?.filter(
    (config) =>
      config?.configuration?.config_type === CommonEnums.FCM_SERVER_KEY
  )[0];

  let initialValues = {
    id: privateKeyObj
      ? privateKeyObj.id
      : fcmServerKeyObj
      ? fcmServerKeyObj.id
      : '',
    configType: privateKeyObj
      ? CommonEnums.PRIVATE_KEY_FILE
      : fcmServerKeyObj
      ? CommonEnums.FCM_SERVER_KEY
      : CommonEnums.FCM_SERVER_KEY,
    jsonFile: '',
    serverKey: fcmServerKeyObj?.configuration?.server_key
      ? fcmServerKeyObj?.configuration?.server_key
      : '',
    additionalServerKey: fcmServerKeyObj?.configuration?.additional_server_key
      ? fcmServerKeyObj?.configuration?.additional_server_key
      : '',
    packageName: fcmServerKeyObj?.configuration?.package_name
      ? fcmServerKeyObj?.configuration?.package_name
      : '',
  };

  const AndroidSchema = Yup.object().shape({
    id: Yup.number(),
    configType: Yup.string().required(),
    jsonFile: Yup.mixed().when('configType', {
      is: (value) => {
        return value === CommonEnums.PRIVATE_KEY_FILE;
      },
      then: Yup.mixed().required(),
      otherwise: Yup.mixed().notRequired(),
    }),
    serverKey: Yup.string().when('configType', {
      is: (value) => value === CommonEnums.FCM_SERVER_KEY,
      then: Yup.string().required(
        messagesIntl[
          'CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FORM.ERRORS.SERVER_KEY'
        ]
      ),
      otherwise: Yup.string().notRequired(),
    }),
    additionalServerKey: Yup.string().when('configType', {
      is: (value) => value === CommonEnums.FCM_SERVER_KEY,
      then: Yup.string(),
      otherwise: Yup.string().notRequired(),
    }),
    packageName: Yup.string().when('configType', {
      is: (value) => value === CommonEnums.FCM_SERVER_KEY,
      then: Yup.string(),
      otherwise: Yup.string().notRequired(),
    }),
  });

  const handleSubmit = (values) => {
    const data = {
      id: values?.id,
      channel_name: CommonEnums.CHANNEL_NAME_API_MOBILE_PUSH,
      configuration: {
        config_type: values?.configType,
        server_key: values?.serverKey,
        additional_server_key: values?.additionalServerKey,
        package_name: values?.packageName,
      },
      platform: CommonEnums.PLATFORM_ANDROID,
    };
    addMobilePushConfig({ data, file: values.jsonFile });
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
    <div>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={AndroidSchema}
        validateOnMount
        validateOnChange
        validateOnBlur
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isValid }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row className="pl-3 pr-3 mt-3">
              <Colxx xxs="12">
                <h2 color="muted font-weight-bold">
                  <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FCM_AUTHENTICATION" />
                </h2>
              </Colxx>
            </Row>
            <Row className="pl-4 pr-4 ">
              <Colxx xxs="12">
                <FormGroupCoustom
                  noLable
                  type="radioMulti"
                  radioMultiOptions={serverKeyOptions}
                  value={values.configType}
                  onChange={(event) => {
                    setFieldValue('configType', event.target.value);
                  }}
                  identifier="configType"
                  className="mobile-push-radio-btns"
                />
              </Colxx>
            </Row>
            {values?.configType == CommonEnums.PRIVATE_KEY_FILE && (
              <Row className="pl-4 pr-4 mb-2">
                <Colxx xxs="8">
                  <FormGroup className="form-group has-float-label">
                    <FormText color="muted">
                      <i className="iconsminds-file">
                        {' '}
                        <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FILE_TYPE" />
                        <span className="required-star-mark">{`*`}</span>
                      </i>
                      <Input
                        name="jsonFile"
                        type="file"
                        identifier="jsonFile"
                        accept="application/json"
                        onChange={(event) => {
                          setFieldValue(
                            'jsonFile',
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                    </FormText>
                  </FormGroup>
                  {privateKeyObj && (
                    <FormText color="secondary">
                      <i className="iconsminds-file">
                        <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FILE_UPLOADED" />
                      </i>
                    </FormText>
                  )}
                </Colxx>
              </Row>
            )}
            {values?.configType == CommonEnums.FCM_SERVER_KEY && (
              <Row className="pl-4 pr-4">
                <Colxx xxs="8">
                  <FormGroupCoustom
                    type="input"
                    value={values.serverKey}
                    onChange={(event) => {
                      setFieldValue('serverKey', event.target.value);
                    }}
                    identifier="serverKey"
                    className="mobile-push-radio-btns"
                    identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FORM.SERVER_KEY"
                    placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FORM.PLACEHOLDER.SERVER_KEY"
                    required={true}
                  />
                  <FormGroupCoustom
                    type="input"
                    value={values.additionalServerKey}
                    onChange={(event) => {
                      setFieldValue('additionalServerKey', event.target.value);
                    }}
                    identifier="additionalServerKey"
                    className="mobile-push-radio-btns"
                    identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FORM.ADDITIONAL_SERVER_KEY"
                    placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FORM.PLACEHOLDER.ADDITIONAL_SERVER_KEY"
                  />
                  <FormGroupCoustom
                    identifierLabel="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FORM.PACKAGE_NAME"
                    placeholder="CHANNEL_MGMT.MOBILE_CHANNEL.ANDROID.FORM.PLACEHOLDER.PACKAGE_NAME"
                    type="input"
                    value={values.packageName}
                    onChange={(event) => {
                      setFieldValue('packageName', event.target.value);
                    }}
                    identifier="packageName"
                    className="mobile-push-radio-btns"
                  />
                </Colxx>
              </Row>
            )}
            <IconUpload setFile={setFile} file={file} />
            <Button
              color="primary"
              disabled={!isValid}
              type="submit"
              className="float-right"
            >
              <IntlMessages id="pages.submit" />
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { mobilePushConfiguration, addSuccess, failSuccess } = settingsChannels;
  return { mobilePushConfiguration, addSuccess, failSuccess };
};

export default connect(mapStateToProps, {
  getMobilePushConfig: getMobilePushConfiguration,
  addMobilePushConfig: addMobilePushConfiguration,
})(injectIntl(AndroidMobilePushConfig));
