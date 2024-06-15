import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Alert,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import { NotificationManager } from 'components/common/react-notifications';
import { adminRoot } from 'constants/defaultValues';
import ScheduleAndGoalsOneTime from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsOneTime';
import ScheduleAndGoalsPeriodic from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsPeriodic';
import { connect } from 'react-redux';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import {
  validateSelectedAndCurrentDateTime,
  validateStartEndDate,
} from 'helpers/campaignHelper';
import moment from 'moment';
import ScheduleAndGoalsSendCampaignHeader from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsSendCampaignHeader';
import { Colxx } from 'components/common/CustomBootstrap';
import classNames from 'classnames';
import {
  addUpdateS3SFTPImport,
  addUpdateS3SFTPImportErrorCleanUp,
} from 'redux/s3-sftp/actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY } from 'constants/appConstant';
import { getPayloadForAddUpdateDB } from 'helpers/S3SFTPHelper';

const Scheduler = ({
  formRef,
  formError,
  previous,
  sourceType,
  formSuccess,
  selectSource,
  dataBaseFormat,
  schedule,
  addUpdateS3SFTPImportAction,
  addUpdateS3SFTPImportErrorCleanUpAction,
}) => {
  const history = useHistory();

  const initialValues = {
    scheduleType: schedule?.scheduleType ?? ScheduleAndGoalsEnums.ONE_TIME,
    campaignTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sourceType: sourceType ?? '',
    periodic: {
      sendCampaignType: ScheduleAndGoalsEnums.DAILY,
      sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
      atFixedTime: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format('LT'),
        ends: '',
        on: {
          endDate: moment(new Date()).format(
            DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
          ),
        },
        after: {
          occurrences: '',
        },
      },
      repeatEvery: '',
      repeatOn: ScheduleAndGoalsEnums.DAY_OF_MONTH,
      sendUserTimeZonePassed: '',
      daysOfMonth: [],
      daysOfWeek: [],
      ends: '',
    },
    one_time: {
      sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
      sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
      atFixedTime: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format('LT'),
      },
    },
    ...schedule,
  };

  const handleSubmit = (object) => {
    const payload = getPayloadForAddUpdateDB(
      object,
      selectSource,
      dataBaseFormat,
      schedule
    );
    addUpdateS3SFTPImportAction(payload);
  };

  const handlePreviousBtnClick = () => {
    previous();
  };
  const invalidMsg = 'CAMPAIGN.VALIDATION_MESSAGE.DATE_INVALID';
  const dateValidationMsg = 'CAMPAIGN.VALIDATION_MESSAGE.END_DATE_PAST';
  const [showCampaignTimezone, setShowCampaignTimezone] = useState(false);

  const schedulerSchema = Yup.object().shape({
    scheduleType: Yup.string(),
    campaignTimeZone: Yup.string(),
    one_time: Yup.object().when('scheduleType', {
      is: ScheduleAndGoalsEnums.ONE_TIME,
      then: Yup.object().shape({
        sendCampaignType: Yup.string().required(),
        sendCampaignTime: Yup.string().when('sendCampaignType', {
          is: ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
          then: Yup.string().required(),
          otherwise: Yup.string().notRequired(),
        }),
        atFixedTime: Yup.object().when('sendCampaignTime', {
          is: ScheduleAndGoalsEnums.AT_FIXED_TIME,
          then: Yup.object().shape({
            startDate: Yup.string().required(),
            sendTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (sendTime, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendTime
                );
              }
            ),
          }),
          otherwise: Yup.object().notRequired(),
        }),
      }),
      otherwise: Yup.object().notRequired(),
    }),
    periodic: Yup.object().when('scheduleType', {
      is: ScheduleAndGoalsEnums.PERIODIC,
      then: Yup.object().shape({
        sendCampaignType: Yup.string().required(),
        sendCampaignTime: Yup.string().required(),
        atFixedTime: Yup.object().when('sendCampaignTime', {
          is: ScheduleAndGoalsEnums.AT_FIXED_TIME,
          then: Yup.object().shape({
            startDate: Yup.string().required(),
            sendTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (sendTime, value) => {
                return validateSelectedAndCurrentDateTime(
                  value?.parent?.startDate,
                  value?.parent?.sendTime
                );
              }
            ),
            ends: Yup.string().required(),
            on: Yup.object().when('ends', {
              is: ScheduleAndGoalsEnums.ON,
              then: Yup.object().shape({
                endDate: Yup.string()
                  .test(
                    'start-date-less-than-end-date',
                    dateValidationMsg,
                    function (endDate) {
                      if (formRef?.current) {
                        const { startDate } =
                          formRef?.current?.values?.periodic?.atFixedTime;
                        return validateStartEndDate(startDate, endDate);
                      }
                      return true;
                    }
                  )
                  .required(),
              }),
            }),
            after: Yup.object().when('ends', {
              is: ScheduleAndGoalsEnums.AFTER,
              then: Yup.object().shape({
                occurrences: Yup.number().min(1).required(),
              }),
              otherwise: Yup.object().notRequired(),
            }),
          }),
          otherwise: Yup.object().notRequired(),
        }),
        repeatEvery: Yup.number().min(1).required(),
        repeatOn: Yup.string().when('sendCampaignType', {
          is: ScheduleAndGoalsEnums.MONTHLY,
          then: Yup.string().required(),
          otherwise: Yup.string().notRequired(),
        }),
        daysOfWeek: Yup.array().when(['sendCampaignType', 'repeatOn'], {
          is: (weekly, month) =>
            weekly === ScheduleAndGoalsEnums.WEEKLY ||
            (month === ScheduleAndGoalsEnums.DAY_OF_WEEK &&
              weekly !== ScheduleAndGoalsEnums.DAILY),
          then: Yup.array().of(Yup.string()).min(1).required(),
          otherwise: Yup.array().notRequired(),
        }),

        daysOfMonth: Yup.array().when(['sendCampaignType', 'repeatOn'], {
          is: (monthly, month) =>
            monthly === ScheduleAndGoalsEnums.MONTHLY &&
            month === ScheduleAndGoalsEnums.DAY_OF_MONTH,
          then: Yup.array().of(Yup.string()).min(1).required(),
          otherwise: Yup.array().notRequired(),
        }),
      }),
      otherwise: Yup.object().notRequired(),
    }),
  });

  if (formSuccess) {
    const successMsg = schedule?.id
      ? 'S3SFTP.DB_SETTING.MESSAGES.UPDATE_DB_IMPORT'
      : 'S3SFTP.DB_SETTING.MESSAGES.SUCCESS_DB_IMPORT';
    history.push(`${adminRoot}/segments/db-imports/list`);
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
  }
  useEffect(() => {
    if (formError && formError.errors) {
      NotificationManager.error(formError.errors, 'Error', 6000, null, null);
      addUpdateS3SFTPImportErrorCleanUpAction();
    }
  }, [formError]);

  const tabs = [
    {
      id: '1',
      type: 'one_time',
      attribute_model: 'campaign_type_one_type',
      label: <IntlMessages id="S3SFTP.SCHEDULE.ONE_TIME" />,
    },
    {
      id: '2',
      type: 'periodic',
      attribute_model: 'campaign_type_periodic',
      label: <IntlMessages id="S3SFTP.SCHEDULE.PERIODIC" />,
    },
  ];

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={schedulerSchema}
        onSubmit={handleSubmit}
        validateOnMount
        validateOnChange
      >
        {(form) => (
          <Form>
            <Row>
              <Colxx xxs="12">
                <Nav tabs className="card-header-tabs mb-2">
                  {tabs.map((item) => (
                    <NavItem key={item.type}>
                      <NavLink
                        to={`${item.type}`}
                        location={{}}
                        className={`${classNames({
                          active: form.values.scheduleType === item.type,
                          'nav-link pt-112 pb-012': true,
                        })} `}
                        onClick={() => {
                          form.setFieldValue('scheduleType', item.type);
                        }}
                      >
                        {item.label}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </Colxx>
            </Row>
            <Row>
              <TabContent
                activeTab={form.values.scheduleType}
                className="w-100"
              >
                {tabs.map((item) => {
                  return (
                    <div key={item.type}>
                      {form.values.scheduleType === item.type ? (
                        <TabPane tabId={item.type}>
                          <Card>
                            <CardBody>
                              {formError && formError.errorMsg && (
                                <Alert color="danger" className="rounded">
                                  {formError.errorMsg}
                                </Alert>
                              )}
                              <ScheduleAndGoalsSendCampaignHeader
                                form={form}
                                campaignType={item.type}
                                showCampaignTimezone={showCampaignTimezone}
                                moduleName={S3SFTPImportEnums.MODULE_NAME}
                              />
                              {item.type === 'one_time' && (
                                <ScheduleAndGoalsOneTime
                                  form={form}
                                  campaignType={item.type}
                                  setShowCampaignTimezone={
                                    setShowCampaignTimezone
                                  }
                                  moduleName={S3SFTPImportEnums.MODULE_NAME}
                                />
                              )}
                              {item.type === 'periodic' && (
                                <ScheduleAndGoalsPeriodic
                                  form={form}
                                  campaignType={item.type}
                                  setShowCampaignTimezone={
                                    setShowCampaignTimezone
                                  }
                                  moduleName={S3SFTPImportEnums.MODULE_NAME}
                                />
                              )}
                              <StepperNavigationButtons
                                className="m-2"
                                leftBtnLabel={
                                  <IntlMessages id="S3SFTP.BUTTONS.PREVIOUS" />
                                }
                                handleRightBtnClick={form.handleSubmit}
                                handleLeftBtnClick={handlePreviousBtnClick}
                                rightBtnLabel={
                                  <IntlMessages
                                    id={
                                      schedule?.id
                                        ? 'S3SFTP.BUTTONS.UPDATE'
                                        : 'S3SFTP.BUTTONS.PUBLISH'
                                    }
                                  />
                                }
                                rightBtnLabelDisable={!form.isValid}
                              />
                            </CardBody>
                          </Card>
                        </TabPane>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
              </TabContent>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const { selectSource, dataBaseFormat, schedule, formSuccess, errorShowAdd } =
    s3sftpApp;
  return {
    selectSource,
    dataBaseFormat,
    schedule,
    formSuccess,
    formError: errorShowAdd,
  };
};

export default connect(mapStateToProps, {
  addUpdateS3SFTPImportAction: addUpdateS3SFTPImport,
  addUpdateS3SFTPImportErrorCleanUpAction: addUpdateS3SFTPImportErrorCleanUp,
})(Scheduler);
