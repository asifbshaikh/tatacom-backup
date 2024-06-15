import React, { useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form, FieldArray } from 'formik';
import {
  Row,
  Button,
  Label,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  FormGroup,
  Input,
} from 'reactstrap';
import Select from 'react-select';
import * as Yup from 'yup';
import { Colxx } from 'components/common/CustomBootstrap';
import Switch from 'rc-switch';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { NotificationManager } from 'components/common/react-notifications';
import { connect } from 'react-redux';
import Datetime from 'react-datetime';
import {
  addDnDConfig,
  addDnDConfigClean,
  getSettingsDnDList,
} from 'redux/actions';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {
  reactSelectDaysStyles,
  reactSelectWeekDaysList,
} from '../settingChannelsData';
import CommonEnums from 'enums/commonEnums';
import moment_timeZone from 'moment-timezone';

const multiOptionForOrderQuoted = [
  {
    id: 'sendMostRecent',
    value: 'last_in_first_out',
    label: 'CHANNEL_MGMT.SMS_CHANNEL.ORDER_QUOTED_MSG.RADIO_LABEL_1',
  },
  {
    id: 'sendleastRecent',
    value: 'first_in_first_out',
    label: 'CHANNEL_MGMT.SMS_CHANNEL.ORDER_QUOTED_MSG.RADIO_LABEL_2',
  },
];

const multiOptionFordDnDPeriod = [
  {
    id: 'discardMsg',
    value: 'false',
    label: 'CHANNEL_MGMT.SMS_CHANNEL.MSG_DND_PERIOD.RADIO_LABEL_1',
  },
  {
    id: 'saveMsg',
    value: 'true',
    label: 'CHANNEL_MGMT.SMS_CHANNEL.MSG_DND_PERIOD.RADIO_LABEL_2',
  },
];

const requiredMsg = (
  <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.REQUIRED_VALIDATION" />
);

const DoNoDisturb = ({
  DnDFormSuccess,
  DnDFormError,
  dndFormLoading,
  addDnDChannelWebsiteAction,
  addDnDConfigCleanAction,
  channelType,
  getDnDList,
  dndList,
  connectorDropDownData,
  countryList,
}) => {
  const [dndConnectorVal, setDnDConnectorVal] = useState('');
  let newRowIdx = '';

  const multiOptionForSaveNSend = [
    {
      id: 'sendAll',
      value: 'send_all',
      label: 'CHANNEL_MGMT.SMS_CHANNEL.SAVE_SEND_CRITERIA.RADIO_LABEL_1',
    },
    {
      id: 'sendOneFromCampaign',
      value: 'send_one_each',
      label: 'CHANNEL_MGMT.SMS_CHANNEL.SAVE_SEND_CRITERIA.RADIO_LABEL_2',
    },
    {
      id: 'sendOneFromSMS',
      value: 'send_across',
      label: `CHANNEL_MGMT.${channelType.toUpperCase()}_CHANNEL.SAVE_SEND_CRITERIA.RADIO_LABEL_3`,
    },
  ];

  let isDnDEdit = false;
  const getConvertedTimeValue = (val, code) => {
    let countryCode = moment_timeZone.tz.zonesForCountry(code);
    let locale = moment_timeZone.tz.guess();
    if (!countryCode) {
      countryCode = locale;
    }
    var utcCutoff = moment_timeZone.utc(val);
    var convertedCutoff = utcCutoff
      .clone()
      .tz(countryCode[countryCode?.length - 1]);
    return convertedCutoff;
  };

  const intitalValuesFromResponse = (dndList) => {
    let res = [];
    for (let i = 0; i < dndList.length; i++) {
      res.push({
        country_code: dndList[i].country_code,
        start_time: moment_timeZone.tz(
          dndList[i].start_time,
          moment_timeZone.tz.zonesForCountry(dndList[i]?.country_code)[0]
        ),
        end_time: moment_timeZone.tz(
          dndList[i].end_time,
          moment_timeZone.tz.zonesForCountry(dndList[i]?.country_code)[0]
        ),
        week_days: dndList[i].week_days,
      });
    }
    return res;
  };

  const onSubmitDnDForm = (values) => {
    if (dndFormLoading) {
      return false;
    }
    const params = {
      fc_dnd_setting: {
        ...values,
        allow_in_dnd_period: values.allow_in_dnd_period === 'true',
        control_queue: values.control_queue === 'true',
      },
    };
    for (
      let i = 0;
      i < params.fc_dnd_setting.fc_dnd_setting_countries.length;
      i++
    ) {
      params.fc_dnd_setting.fc_dnd_setting_countries[i].start_time =
        getConvertedTimeValue(
          params?.fc_dnd_setting?.fc_dnd_setting_countries[i]?.start_time,
          params?.fc_dnd_setting?.fc_dnd_setting_countries[i]?.country_code
        );
      params.fc_dnd_setting.fc_dnd_setting_countries[i].end_time =
        getConvertedTimeValue(
          params?.fc_dnd_setting?.fc_dnd_setting_countries[i]?.end_time,
          params?.fc_dnd_setting?.fc_dnd_setting_countries[i]?.country_code
        );
    }
    if (channelType === CommonEnums.SMS) {
      params.channel_type = CommonEnums.TATA_SMSC;
    } else {
      params.channel_type = channelType;
    }

    if (dndList && Object.keys(dndList).length !== 0) {
      addDnDChannelWebsiteAction({ newParams: params, id: dndList.channel_id });
    }
    return false;
  };

  let initialValues = {};
  if (dndList && Object.keys(dndList).length !== 0) {
    isDnDEdit = true;
    initialValues = {
      dnd_enabled: dndList.dnd_enabled,
      allow_in_dnd_period:
        typeof dndList?.allow_in_dnd_period === 'boolean'
          ? dndList?.allow_in_dnd_period?.toString()
          : 'false',
      save_and_send_criteria: dndList.save_and_send_criteria,
      message_queue: dndList.message_queue,
      control_queue:
        typeof dndList.control_queue === 'boolean'
          ? dndList.control_queue?.toString()
          : 'false',
      control_queue_gap: dndList.control_queue_gap ?? '',
      fc_dnd_setting_countries:
        dndList.fc_dnd_setting_countries?.length > 0
          ? intitalValuesFromResponse(dndList.fc_dnd_setting_countries)
          : [
              {
                country_code: '',
                start_time: moment(),
                end_time: moment(),
                week_days: [],
              },
            ],
    };
  } else {
    isDnDEdit = false;
    initialValues = {
      dnd_enabled: false,
      allow_in_dnd_period: '',
      save_and_send_criteria: '',
      message_queue: '',
      control_queue: '',
      control_queue_gap: '',
      fc_dnd_setting_countries: [
        {
          country_code: '',
          start_time: moment(),
          end_time: moment(),
          week_days: [],
        },
      ],
    };
  }

  if (DnDFormSuccess) {
    const saveMessage = <IntlMessages id="CHANNEL_MGMT.CHANNEL.SAVED_MSG" />;
    NotificationManager.success(saveMessage, 'Success', 6000, null, null, '');
    addDnDConfigCleanAction();
  }

  if (DnDFormError && DnDFormError.errorMsg) {
    NotificationManager.error(
      DnDFormError.errorMsg,
      'Error',
      6000,
      null,
      null,
      '' // className
    );
    addDnDConfigCleanAction();
  }

  const SignupSchema = Yup.object().shape({
    dnd_enabled: Yup.boolean().required(requiredMsg),
    allow_in_dnd_period: Yup.mixed().when('dnd_enabled', {
      is: true,
      then: Yup.mixed().required(requiredMsg),
      otherwise: Yup.mixed().notRequired(),
    }),
    save_and_send_criteria: Yup.mixed().when(
      ['allow_in_dnd_period', 'dnd_enabled'],
      {
        is: (val1, val2) => val1 === 'true' && val2 === true,
        then: Yup.mixed().required(requiredMsg),
        otherwise: Yup.mixed().notRequired(),
      }
    ),
    message_queue: Yup.mixed().when(['allow_in_dnd_period', 'dnd_enabled'], {
      is: (val1, val2) => val1 === 'true' && val2 === true,
      then: Yup.mixed().required(requiredMsg),
      otherwise: Yup.mixed().notRequired(),
    }),
    control_queue: Yup.mixed().when(['allow_in_dnd_period', 'dnd_enabled'], {
      is: (val1, val2) => val1 === 'true' && val2 === true,
      then: Yup.mixed().required(requiredMsg),
      otherwise: Yup.mixed().notRequired(),
    }),
    control_queue_gap: Yup.number().when(['control_queue', 'dnd_enabled'], {
      is: (val1, val2) => val1 === 'true' && val2 === true,
      then: Yup.number().required(requiredMsg),
      otherwise: Yup.number().notRequired(),
    }),

    fc_dnd_setting_countries: Yup.array().when('dnd_enabled', {
      is: true,
      then: Yup.array()
        .of(
          Yup.object().shape({
            country_code: Yup.string().required(requiredMsg),
            week_days: Yup.array().min(1, requiredMsg),
            start_time: Yup.date().required(),
            end_time: Yup.date().min(Yup.ref('start_time')).required(),
          })
        )
        .min(1, requiredMsg),
      otherwise: Yup.array().notRequired(),
    }),
  });

  const handleAddBtnClick = (setFieldValue, values, index) => {
    const pos = index + 1;
    newRowIdx = pos;

    const data = [...values.fc_dnd_setting_countries];
    data.splice(pos, 0, {
      country_code: '',
      start_time: moment(),
      end_time: moment(),
      week_days: [],
    });
    setFieldValue('fc_dnd_setting_countries', data);
  };

  const handleDeleteBtnClick = (setFieldValue, values, index) => {
    const data = [...values.fc_dnd_setting_countries];
    data.splice(index, 1);
    setFieldValue('fc_dnd_setting_countries', data);
  };

  const handleEditBtnClick = (setFieldValue, values, index) => {
    newRowIdx = index;
    const data = [...values.fc_dnd_setting_countries];
    setFieldValue('fc_dnd_setting_countries', data);
  };

  const getMultiselectValues = (values) => {
    return values.map((item) => {
      return { label: item.slice(0, 3), value: item };
    });
  };

  return (
    <>
      <br />
      <Card className="white-card">
        <CardBody>
          <CardHeader>
            <CardTitle>
              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.DO_NOT_DISTURB" />
            </CardTitle>
          </CardHeader>
          <Formik
            initialValues={initialValues}
            validateOnMount
            validateOnChange
            validateOnBlur
            onSubmit={onSubmitDnDForm}
            validationSchema={SignupSchema}
            enableReinitialize
          >
            {({ errors, touched, setFieldValue, values, isValid, dirty }) => (
              <Form className="av-tooltip ">
                <Row>
                  <Colxx xxs="12">
                    <Colxx xxs="4">
                      <FormGroupCoustom
                        identifier="dndConnectorSelect"
                        errors={errors}
                        touched={touched}
                        identifierLabel="CHANNEL_MGMT.CHANNEL.SELECT_CONNECTOR"
                        type="select"
                        className="provider-lable"
                        dataTestId="connectorSelect"
                        options={connectorDropDownData}
                        onChange={(event) => {
                          if (channelType === CommonEnums.SMS) {
                            const params = {
                              id: event.target.value,
                              channelType: CommonEnums.TATA_SMSC,
                            };
                            getDnDList(params);
                          } else {
                            const params = {
                              id: event.target.value,
                              channelType: channelType,
                            };
                            getDnDList(params);
                          }
                          setDnDConnectorVal(event.target.value);
                        }}
                      />
                    </Colxx>
                  </Colxx>
                  <br />
                </Row>

                {dndConnectorVal && (
                  <Row className="mt-3">
                    <Colxx xxs="12">
                      {dndFormLoading ? (
                        <div className="loading dnd-loader" />
                      ) : (
                        <>
                          <Colxx xxs="12" style={{ display: 'flex' }}>
                            <Switch
                              className="custom-switch custom-switch-primary-inverse"
                              identifier="dnd_enabled"
                              errors={errors}
                              touched={touched}
                              onChange={(e) => setFieldValue('dnd_enabled', e)}
                              checked={values.dnd_enabled}
                            />
                            <Label className="switch-btn-lable">
                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.DND_LABEL" />
                            </Label>

                            <Label className="ml-4">
                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.SET_DND_PERIOD.TIMEZONE_NOTE" />
                            </Label>
                          </Colxx>
                          {values.dnd_enabled === true ? (
                            <>
                              <Colxx xxs="12" className="mt-3 allign-center">
                                <Label>
                                  <p className="note-style">
                                    {' '}
                                    <IntlMessages
                                      id={`CHANNEL_MGMT.${channelType.toUpperCase()}_CHANNEL.DND_NOTE`}
                                    />
                                  </p>
                                </Label>
                              </Colxx>

                              <FieldArray
                                name="fc_dnd_setting_countries"
                                className="filter-by-users"
                              >
                                {() =>
                                  values.fc_dnd_setting_countries.map(
                                    (data, index) => {
                                      return (
                                        <Colxx
                                          key={`${
                                            data.country_code
                                          }_${index.toString()}`}
                                          xxs="12"
                                          className="mb-3 allign-center"
                                        >
                                          <Colxx xxs="2">
                                            <FormGroupCoustom
                                              identifier={`fc_dnd_setting_countries.${index}.country_code`}
                                              errors={errors}
                                              touched={touched}
                                              identifierLabel="CHANNEL_MGMT.CHANNEL.COUNTRY_DROPDOWN"
                                              type="select"
                                              className="provider-lable"
                                              disabled={
                                                newRowIdx === index
                                                  ? null
                                                  : true
                                              }
                                              options={countryList}
                                            />
                                          </Colxx>

                                          <Colxx xxs="5 mb-4 d-flex justify-content-center pt-2">
                                            <div className="d-flex dnd-day-of-week has-float-label">
                                              <Label>
                                                <IntlMessages id="CHANNEL_MGMT.CHANNEL.SELECT_DAYS" />
                                              </Label>
                                              <Select
                                                identifier={`fc_dnd_setting_countries.${index}.week_days`}
                                                isMulti
                                                errors={errors}
                                                touched={touched}
                                                options={
                                                  reactSelectWeekDaysList
                                                }
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                isDisabled={
                                                  newRowIdx === index
                                                    ? null
                                                    : true
                                                }
                                                defaultValue={getMultiselectValues(
                                                  values
                                                    .fc_dnd_setting_countries[
                                                    index
                                                  ].week_days
                                                )}
                                                onChange={(options) =>
                                                  setFieldValue(
                                                    `fc_dnd_setting_countries.${index}.week_days`,
                                                    options.map((obj) => {
                                                      return obj.value;
                                                    })
                                                  )
                                                }
                                                styles={{
                                                  ...reactSelectDaysStyles,
                                                }}
                                              />
                                            </div>
                                          </Colxx>
                                          <Colxx xxs="2">
                                            <FormGroup className="has-float-label">
                                              <Label for={`startTime${index}`}>
                                                <IntlMessages id="CHANNEL_MGMT.CHANNEL.START_TIME" />
                                              </Label>
                                              <Datetime
                                                id={`startTime${index}`}
                                                identifier={`fc_dnd_setting_countries.${index}.start_time`}
                                                dateFormat={false}
                                                timeFormat="HH:mm"
                                                inputProps={
                                                  newRowIdx === index
                                                    ? {}
                                                    : {
                                                        disabled: true,
                                                      }
                                                }
                                                onChange={(val) => {
                                                  setFieldValue(
                                                    `fc_dnd_setting_countries.${index}.start_time`,
                                                    val
                                                  );
                                                }}
                                                value={
                                                  values
                                                    ?.fc_dnd_setting_countries[
                                                    index
                                                  ]?.country_code
                                                    ? moment_timeZone.tz(
                                                        values
                                                          .fc_dnd_setting_countries[
                                                          index
                                                        ].start_time,
                                                        moment_timeZone.tz.zonesForCountry(
                                                          values
                                                            ?.fc_dnd_setting_countries[
                                                            index
                                                          ]?.country_code
                                                        )[0]
                                                      )
                                                    : moment(
                                                        values
                                                          .fc_dnd_setting_countries[
                                                          index
                                                        ].start_time
                                                      )
                                                }
                                              />
                                            </FormGroup>
                                          </Colxx>

                                          <Colxx xxs="2">
                                            <FormGroup className="has-float-label">
                                              <Label for={`endTime${index}`}>
                                                <IntlMessages id="CHANNEL_MGMT.CHANNEL.END_TIME" />
                                              </Label>
                                              <Datetime
                                                id={`endTime${index}`}
                                                identifier={`fc_dnd_setting_countries.${index}.end_time`}
                                                touched={touched}
                                                inputProps={
                                                  newRowIdx === index
                                                    ? {}
                                                    : {
                                                        disabled: true,
                                                      }
                                                }
                                                dateFormat={false}
                                                timeFormat="HH:mm"
                                                onChange={(val) => {
                                                  setFieldValue(
                                                    `fc_dnd_setting_countries.${index}.end_time`,
                                                    val
                                                  );
                                                }}
                                                value={
                                                  values
                                                    ?.fc_dnd_setting_countries[
                                                    index
                                                  ]?.country_code
                                                    ? moment_timeZone.tz(
                                                        values
                                                          .fc_dnd_setting_countries[
                                                          index
                                                        ].end_time,
                                                        moment_timeZone.tz.zonesForCountry(
                                                          values
                                                            ?.fc_dnd_setting_countries[
                                                            index
                                                          ]?.country_code
                                                        )[0]
                                                      )
                                                    : moment(
                                                        values
                                                          .fc_dnd_setting_countries[
                                                          index
                                                        ].end_time
                                                      )
                                                }
                                              />
                                              {errors &&
                                                errors
                                                  ?.fc_dnd_setting_countries?.[
                                                  index
                                                ]?.end_time && (
                                                  <div className="invalid-feedback d-block w-30">
                                                    <span>
                                                      <IntlMessages id="CHANNEL_MGMT.CHANNEL.END_TIME_ERROR_MESSAGE" />
                                                    </span>
                                                  </div>
                                                )}
                                            </FormGroup>
                                          </Colxx>

                                          <Colxx xxs="2 mb-2">
                                            <span
                                              className="plus-button-style"
                                              role="button"
                                              tabIndex={0}
                                              data-testid="addBtnIcon"
                                              onClick={() =>
                                                handleAddBtnClick(
                                                  setFieldValue,
                                                  values,
                                                  index
                                                )
                                              }
                                              onKeyDown={() => false}
                                            >
                                              <i className="simple-icon-plus btn-group-icon" />
                                            </span>

                                            <span
                                              className="plus-button-style ml-2"
                                              role="button"
                                              tabIndex={0}
                                              data-testid="editIcon"
                                              onClick={() =>
                                                handleEditBtnClick(
                                                  setFieldValue,
                                                  values,
                                                  index
                                                )
                                              }
                                              onKeyDown={() => false}
                                            >
                                              <i className="simple-icon-pencil btn-group-icon" />
                                            </span>

                                            {values.fc_dnd_setting_countries
                                              ?.length > 1 && (
                                              <span
                                                className="plus-button-style ml-2"
                                                role="button"
                                                tabIndex={0}
                                                data-testid="deleteIcon"
                                                onClick={() =>
                                                  handleDeleteBtnClick(
                                                    setFieldValue,
                                                    values,
                                                    index
                                                  )
                                                }
                                                onKeyDown={() => false}
                                              >
                                                <i className="simple-icon-trash btn-group-icon" />
                                              </span>
                                            )}
                                          </Colxx>
                                        </Colxx>
                                      );
                                    }
                                  )
                                }
                              </FieldArray>

                              <Colxx xxs="12">
                                <FormGroupCoustom
                                  identifier="allow_in_dnd_period"
                                  errors={errors}
                                  touched={touched}
                                  identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.MSG_DND_PERIOD_LABEL"
                                  type="radioMulti"
                                  onChange={(event) => {
                                    setFieldValue(
                                      'allow_in_dnd_period',
                                      event.target.value
                                    );
                                  }}
                                  radioMultiOptions={multiOptionFordDnDPeriod}
                                  value={values.allow_in_dnd_period}
                                />
                                {values.allow_in_dnd_period === 'true' && (
                                  <div>
                                    <FormGroupCoustom
                                      identifier="save_and_send_criteria"
                                      errors={errors}
                                      touched={touched}
                                      identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.SAVE_SEND_CRITERIA_LABEL"
                                      type="radioMulti"
                                      onChange={(event) => {
                                        setFieldValue(
                                          'save_and_send_criteria',
                                          event.target.value
                                        );
                                      }}
                                      radioMultiOptions={
                                        multiOptionForSaveNSend
                                      }
                                      value={values.save_and_send_criteria}
                                    />

                                    <FormGroupCoustom
                                      identifier="message_queue"
                                      errors={errors}
                                      touched={touched}
                                      identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.ORDER_QUOTED_MSG_LABEL"
                                      type="radioMulti"
                                      onChange={(event) => {
                                        setFieldValue(
                                          'message_queue',
                                          event.target.value
                                        );
                                      }}
                                      radioMultiOptions={
                                        multiOptionForOrderQuoted
                                      }
                                      value={values.message_queue}
                                    />

                                    <FormGroup>
                                      <Label>
                                        <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.CONTROL_QUEQED_MSG_LABLE" />
                                      </Label>
                                      <FormGroup className="mb-0">
                                        <Label>
                                          <div className="custom-radio custom-control">
                                            <Input
                                              type="radio"
                                              className="custom-control-input"
                                              name="control_queue"
                                              checked={
                                                values.control_queue === 'false'
                                              }
                                              value="false"
                                              identifier="control_queue"
                                              onClick={(event) => {
                                                setFieldValue(
                                                  'control_queue',
                                                  event.target.value
                                                );
                                              }}
                                              onChange={(e) => {
                                                console.log(e);
                                              }}
                                            />
                                            <div className="custom-control-label">
                                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.CONTROL_QUEQED_MSG.RADIO_LABEL_1" />
                                            </div>
                                          </div>
                                        </Label>
                                      </FormGroup>
                                      <FormGroup>
                                        <Label>
                                          <div className="custom-radio custom-control d-flex">
                                            <Input
                                              type="radio"
                                              className="custom-control-input"
                                              name="control_queue"
                                              checked={
                                                values.control_queue === 'true'
                                              }
                                              value="true"
                                              identifier="control_queue"
                                              onClick={(event) => {
                                                setFieldValue(
                                                  'control_queue',
                                                  event.target.value
                                                );
                                              }}
                                              onChange={(e) => {
                                                console.log(e);
                                              }}
                                            />
                                            <div className="custom-control-label d-flex">
                                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.CONTROL_QUEQED_MSG.RADIO_LABEL_2A" />
                                              <FormGroupCoustom
                                                identifier="control_queue_gap"
                                                name="minutes"
                                                dataTestId="control_queue_gap"
                                                errors={errors}
                                                onChange={(event) => {
                                                  setFieldValue(
                                                    'control_queue_gap',
                                                    event.target.value
                                                  );
                                                }}
                                                value={values.control_queue_gap}
                                                touched={touched}
                                                noLable
                                                className="pl-1 pr-1"
                                                disabled={
                                                  values.control_queue !==
                                                  'true'
                                                }
                                                type="number"
                                                minNumberValue="0"
                                              />
                                              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.CONTROL_QUEQED_MSG.RADIO_LABEL_2B" />
                                            </div>
                                          </div>
                                        </Label>
                                      </FormGroup>
                                    </FormGroup>
                                  </div>
                                )}
                              </Colxx>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}

                      <Colxx xxs="12" className="mt-4 allign-right">
                        <Button
                          color="primary"
                          data-testid="updateDnDBtn"
                          disabled={!isValid || !dirty || dndFormLoading}
                        >
                          {isDnDEdit ? (
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
  const { successDnDAdd, errorDnDAdd, loadingDnDAdd, doNotDistList } =
    settingsChannels;
  return {
    DnDFormSuccess: successDnDAdd,
    DnDFormError: errorDnDAdd,
    dndFormLoading: loadingDnDAdd,
    dndList: doNotDistList,
  };
};

export default connect(mapStateToProps, {
  addDnDChannelWebsiteAction: addDnDConfig,
  addDnDConfigCleanAction: addDnDConfigClean,
  getDnDList: getSettingsDnDList,
})(DoNoDisturb);
