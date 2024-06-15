import React, { useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form } from 'formik';
import {
  Row,
  Button,
  Label,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
} from 'reactstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import * as Yup from 'yup';
import { Colxx } from 'components/common/CustomBootstrap';
import Switch from 'rc-switch';
import {
  addFreqCappingConfig,
  addFreqCappingConfigClean,
  getSettingsFCList,
} from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import { connect } from 'react-redux';
import CommonEnums from 'enums/commonEnums';

const daysOptions = [
  { value: '1', id: '1' },
  { value: '2', id: '2' },
  { value: '3', id: '3' },
];

const refreshOptions = [
  { value: 'CHANNEL_MGMT.SMS_CHANNEL.APP_TIMEZONE', id: 'app_timezone' },
  { value: 'CHANNEL_MGMT.SMS_CHANNEL.USER_TIMEZONE', id: 'user_timezone' },
];

const requiredMsg = (
  <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.REQUIRED_VALIDATION" />
);

const minEmailCount = (
  <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.MIN_EMAIL_COUNT" />
);

const FrequencyCapping = ({
  formSuccess,
  formError,
  formLoading,
  addChannelWebsiteAction,
  addFConfigCleanAction,
  getFCList,
  fcList,
  channelType,
  connectorDropDownData,
}) => {
  let isEdit = false;
  const [connectorVal, setConnectorVal] = useState('');

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const params = {
      fc_dnd_setting: {
        fc_enabled: values.toggleFC,
        max_message: values.emailCount,
        no_of_days: values.daysCount,
        refresh_timezone: values.fcTimezone,
        fc_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    if (channelType === CommonEnums.SMS) {
      params.channel_type = CommonEnums.TATA_SMSC;
    } else {
      params.channel_type = channelType;
    }

    if (fcList && Object.keys(fcList).length !== 0) {
      addChannelWebsiteAction({ newParams: params, id: fcList.channel_id });
    }

    return false;
  };

  if (formSuccess) {
    const saveMessage = <IntlMessages id="CHANNEL_MGMT.CHANNEL.SAVED_MSG" />;
    NotificationManager.success(saveMessage, 'Success', 6000, null, null, '');
    addFConfigCleanAction();
  }

  if (formError && formError.errorMsg) {
    NotificationManager.error(
      formError.errorMsg,
      'Error',
      6000,
      null,
      null,
      '' // className
    );
    addFConfigCleanAction();
  }

  let initialValues = {};
  if (fcList && Object.keys(fcList).length !== 0) {
    isEdit = true;
    initialValues = {
      toggleFC: fcList.fc_enabled,
      emailCount: fcList.max_message ?? '',
      daysCount: fcList.no_of_days ?? '1',
      fcTimezone: fcList.refresh_timezone ?? 'app_timezone',
    };
  } else {
    isEdit = false;
    initialValues = {
      toggleFC: false,
      emailCount: 1,
      daysCount: '1',
      fcTimezone: 'app_timezone',
    };
  }

  const SignupSchema = Yup.object().shape({
    toggleFC: Yup.boolean().required(requiredMsg),
    emailCount: Yup.number().when('toggleFC', {
      is: true,
      then: Yup.number().moreThan(0, minEmailCount).required(requiredMsg),
      otherwise: Yup.number().notRequired(),
    }),
    daysCount: Yup.string().when('toggleFC', {
      is: true,
      then: Yup.string().required(requiredMsg),
      otherwise: Yup.string().notRequired(),
    }),
    fcTimezone: Yup.string().when('toggleFC', {
      is: true,
      then: Yup.string().required(requiredMsg),
      otherwise: Yup.string().notRequired(),
    }),
  });

  return (
    <>
      <br />
      <Card className="white-card">
        <CardBody>
          <CardHeader>
            <CardTitle>
              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.FREQUENCY_CAPPING" />
            </CardTitle>
          </CardHeader>
          <Formik
            initialValues={initialValues}
            validateOnMount
            onSubmit={onSubmitForm}
            validationSchema={SignupSchema}
            setFieldValue
            enableReinitialize
          >
            {({ errors, touched, setFieldValue, values, isValid, dirty }) => (
              <Form className="av-tooltip tooltip-label-right">
                <Row>
                  <Colxx xxs="12">
                    <Colxx xxs="4">
                      <FormGroupCoustom
                        identifier="connectorSelect"
                        errors={errors}
                        touched={touched}
                        identifierLabel="CHANNEL_MGMT.CHANNEL.SELECT_CONNECTOR"
                        type="select"
                        className="provider-lable"
                        options={connectorDropDownData}
                        dataTestId="connectorDropdown"
                        onChange={(event) => {
                          if (channelType === CommonEnums.SMS) {
                            const params = {
                              id: event.target.value,
                              channelType: CommonEnums.TATA_SMSC,
                            };
                            getFCList(params);
                          } else {
                            const params = {
                              id: event.target.value,
                              channelType: channelType,
                            };
                            getFCList(params);
                          }
                          setConnectorVal(event.target.value);
                        }}
                      />
                    </Colxx>
                  </Colxx>
                </Row>

                {connectorVal && (
                  <Row className="mt-3">
                    <Colxx xxs="12">
                      <Colxx xxs="12" style={{ display: 'flex' }}>
                        <Switch
                          identifier="toggleFC"
                          data-testid="toggleFC"
                          errors={errors}
                          touched={touched}
                          className="custom-switch custom-switch-primary-inverse"
                          onChange={(e) => setFieldValue('toggleFC', e)}
                          checked={values.toggleFC}
                        />
                        <Label className="switch-btn-lable">
                          <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.FREQUENCY_CAPPING_LABEL" />
                        </Label>
                      </Colxx>

                      {values.toggleFC === true ? (
                        <>
                          <Colxx xxs="12" className="mt-3">
                            <p className="note-style">
                              <IntlMessages
                                id={`CHANNEL_MGMT.${channelType.toUpperCase()}_CHANNEL.FREQUENCY_CAPPING_NOTE`}
                              />{' '}
                            </p>
                          </Colxx>

                          <Colxx
                            xxs="12"
                            className="mt-4"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Label>
                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.FC_CRIETERIA_1" />
                            </Label>

                            <span className="pl-2 pr-2">
                              <FormGroupCoustom
                                identifier="emailCount"
                                name="emailCount"
                                type="number"
                                dataTestId="emailCount"
                                minNumberValue="0"
                                errors={errors}
                                touched={touched}
                                noLable
                              />
                            </span>

                            <Label>
                              <IntlMessages
                                id={`CHANNEL_MGMT.${channelType.toUpperCase()}_CHANNEL.FC_CRIETERIA_2`}
                              />
                            </Label>

                            <span
                              className="pl-2 pr-2"
                              style={{ width: '100px' }}
                            >
                              <FormGroupCoustom
                                id="Selection"
                                identifier="daysCount"
                                name="daysCount"
                                dataTestId="daysCountSelect"
                                errors={errors}
                                touched={touched}
                                options={daysOptions}
                                type="select"
                                noLable
                              />
                            </span>
                            <Label>
                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.FC_CRIETERIA_3" />
                            </Label>
                          </Colxx>

                          <Colxx xxs="12" className="mt-4 allign-center">
                            <Label>
                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.FC_REFRESH_TEXT" />
                            </Label>
                            <span
                              className="pl-2 pr-2"
                              style={{ width: '200px' }}
                            >
                              <FormGroupCoustom
                                id="fcTimezone"
                                type="select"
                                identifier="fcTimezone"
                                name="fcTimezone"
                                errors={errors}
                                touched={touched}
                                options={refreshOptions}
                                noLable
                              />
                            </span>
                          </Colxx>
                        </>
                      ) : (
                        <></>
                      )}

                      <Colxx xxs="12" className="mt-4 allign-right">
                        <Button
                          color="primary"
                          data-testid="updateBtn"
                          disabled={!isValid || !dirty}
                        >
                          {isEdit ? (
                            <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.UPDATE" />
                          ) : (
                            <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.SAVE" />
                          )}
                        </Button>
                      </Colxx>
                    </Colxx>
                  </Row>
                )}
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { successFCAdd, errorFCAdd, loadingFCAdd, freqCappingList } =
    settingsChannels;
  return {
    formSuccess: successFCAdd,
    formError: errorFCAdd,
    formLoading: loadingFCAdd,
    fcList: freqCappingList,
  };
};

export default connect(mapStateToProps, {
  addChannelWebsiteAction: addFreqCappingConfig,
  addFConfigCleanAction: addFreqCappingConfigClean,
  getFCList: getSettingsFCList,
})(FrequencyCapping);
