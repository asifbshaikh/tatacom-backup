import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { Alert } from 'reactstrap';
import * as Yup from 'yup';
import moment from 'moment';
import { Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { scheduleSmsCampaign, updateStepIndex } from 'redux/campaigns/actions';
import { NotificationManager } from 'components/common/react-notifications';
import { adminRoot } from 'constants/defaultValues';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import CommonEnums from 'enums/commonEnums';
import {
  getCurrentGMTTimeZone,
  validateSelectedAndCurrentDateTime,
  validateStartEndDate,
} from 'helpers/campaignHelper';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import ScheduleAndGoalsPeriodic from './ScheduleAndGoalsPeriodic';
import StepperNavigationButtons from '../StepperNavigationButtons';
import ScheduleAndGoalsEventTriggered from './ScheduleAndGoalsEventTriggered';
import ScheduleAndGoalsOneTime from './ScheduleAndGoalsOneTime';
import ScheduleAndGoalsSendCampaignHeader from './ScheduleAndGoalsSendCampaignHeader';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
// import SheduleConversionGoals from './SheduleConversionGoals';
// import ScheduleAndGoalsDeliveryControl from './ScheduleAndGoalsDeliveryControl';

const EmailScheduleAndGoals = ({
  formRef,
  previous,
  campaignType,
  scheduleCampaign,
  selectAudience,
  formSuccess,
  formError,
  stepIndex,
  updateStepIndexAction,
  lastExecutedFilterId,
  formEmailCreation,
  saveAsDraftResponse,
  emailTemplate,
  inboxId,
}) => {
  useEffect(() => {
    window.onbeforeunload = () => true;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const [showCampaignTimezone, setShowCampaignTimezone] = useState(false);
  const handlePreviousBtnClick = () => {
    updateStepIndexAction(stepIndex - 1);
    previous();
  };

  const history = useHistory();
  const invalidMsg = (
    <IntlMessages id="CAMPAIGN.VALIDATION_MESSAGE.DATE_INVALID" />
  );
  const dateValidationMsg = (
    <IntlMessages id="CAMPAIGN.VALIDATION_MESSAGE.END_DATE_PAST" />
  );
  const initialValues = {
    campaignTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    campaignType: campaignType ?? '',
    deliveryControl: {
      ignoreFrequencyCapping: false,
      countFrequencyCapping: false,
      requestLimit: '',
    },
    periodic: {
      sendCampaignType: ScheduleAndGoalsEnums.DAILY,
      sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
      sendInUserTimeZone: {
        startDate: moment().format('DD MMMM YYYY'),
        sendTime: moment().format('LT'),
        sendUserTimeZonePassed: '',
        ends: '',
        on: {
          endDate: moment(new Date()).format('DD MMMM YYYY'),
        },
        after: {
          occurrences: '',
        },
      },
      atFixedTime: {
        startDate: moment().format('DD MMMM YYYY'),
        sendTime: moment().format('LT'),
        ends: '',
        on: {
          endDate: moment(new Date()).format('DD MMMM YYYY'),
        },
        after: {
          occurrences: '',
        },
      },
      bestTimeForUser: {
        startDate: moment().format('DD MMMM YYYY'),
        sendTime: moment().format('LT'),
        sendMessagesBasedOnBestTime: moment().format('LT'),
        userBestTimeOutsideTimeWindow:
          ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
        userBestTimeNotAvailable: ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
        ends: '',
        on: {
          endDate: moment(new Date()).format('DD MMMM YYYY'),
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
      // on: {
      //   endDate: moment(new Date()).format('DD MMMM YYYY'),
      // },
      // after: {
      //   occurrences: '',
      // },
    },
    event_trigger: {
      sendCampaignType: ScheduleAndGoalsEnums.ACTIVE_CONTINOUSLY,
      startDate: moment(new Date()).format('DD MMMM YYYY'),
      sendTime: moment(new Date()).format('LT'),
      endDate: moment(new Date()).format('DD MMMM YYYY'),
      endTime: moment(new Date()).format('LT'),
      trigger_relation: TargetAudienceEnums.AFTER,
      trigger_attr: TargetAudienceEnums.IF_ACTION,
      time_value: TargetAudienceEnums.TIME_VALUE,
      time_multiplier: TargetAudienceEnums.TIME_MULTIPLIER,
    },
    one_time: {
      sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
      sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
      atFixedTime: {
        startDate: moment().format('DD MMMM YYYY'),
        sendTime: moment().format('LT'),
      },

      bestTimeForUser: {
        startDate: moment().format('DD MMMM YYYY'),
        sendTime: moment().format('LT'),
        sendMessagesBasedOnBestTime: moment().format('LT'),
        userBestTimeOutsideTimeWindow:
          ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
        userBestTimeNotAvailable: ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
      },
      sendInUserTimeZone: {
        startDate: moment().format('DD MMMM YYYY'),
        sendTime: moment().format('LT'),
        sendUserTimeZonePassed: ScheduleAndGoalsEnums.YES_SEND_IT,
      },
    },
  };

  const scheduleAndGoalsSchema = Yup.object().shape({
    campaignTimeZone: Yup.string(),
    one_time: Yup.object().when('campaignType', {
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
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendTime
                );
              }
            ),
          }),
          otherwise: Yup.object().notRequired(),
        }),
        sendInUserTimeZone: Yup.object().when('sendCampaignTime', {
          is: ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE,
          then: Yup.object().shape({
            startDate: Yup.string().required(),
            sendTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendTime
                );
              }
            ),
            sendUserTimeZonePassed: Yup.string().required(),
          }),
          otherwise: Yup.object().notRequired(),
        }),
        bestTimeForUser: Yup.object().when('sendCampaignTime', {
          is: ScheduleAndGoalsEnums.BEST_TIME_FOR_USER,
          then: Yup.object().shape({
            startDate: Yup.string().required(),
            sendTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendTime
                );
              }
            ),
            sendMessagesBasedOnBestTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendMessagesBasedOnBestTime
                );
              }
            ),
            userBestTimeOutsideTimeWindow: Yup.string().required(),
            userBestTimeNotAvailable: Yup.string().required(),
          }),
          otherwise: Yup.object().notRequired(),
        }),
      }),
      otherwise: Yup.object().notRequired(),
    }),
    event_trigger: Yup.object().when('campaignType', {
      is: ScheduleAndGoalsEnums.EVENT_TRIGGERED,
      then: Yup.object().shape({
        sendCampaignType: Yup.string().required(),
        startDate: Yup.string().required(),
        sendTime: Yup.string().test(
          'is-invalid',
          invalidMsg,
          (startDate, value) => {
            return validateSelectedAndCurrentDateTime(
              value.parent.startDate,
              value.parent.sendTime
            );
          }
        ),
        endDate: Yup.string()
          .test(
            'start-date-less-than-end-date',
            dateValidationMsg,
            function (endDate, value) {
              return validateStartEndDate(
                value.parent.startDate,
                value.parent.endDate
              );
            }
          )
          .required(),
        endTime: Yup.string().required(),
      }),
      otherwise: Yup.object().notRequired(),
    }),
    periodic: Yup.object().when('campaignType', {
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
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendTime
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
                occurrences: Yup.string().required(),
              }),
              otherwise: Yup.object().notRequired(),
            }),
          }),
          otherwise: Yup.object().notRequired(),
        }),
        sendInUserTimeZone: Yup.object().when('sendCampaignTime', {
          is: ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE,
          then: Yup.object().shape({
            startDate: Yup.string().required(),
            sendTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendTime
                );
              }
            ),
            sendUserTimeZonePassed: Yup.string().required(),
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
                          formRef?.current?.values?.periodic
                            ?.sendInUserTimeZone;
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
                occurrences: Yup.string().required(),
              }),
              otherwise: Yup.object().notRequired(),
            }),
          }),
          otherwise: Yup.object().notRequired(),
        }),
        bestTimeForUser: Yup.object().when('sendCampaignTime', {
          is: ScheduleAndGoalsEnums.BEST_TIME_FOR_USER,
          then: Yup.object().shape({
            startDate: Yup.string().required(),
            sendTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendTime
                );
              }
            ),
            sendMessagesBasedOnBestTime: Yup.string().test(
              'is-invalid',
              invalidMsg,
              (startDate, value) => {
                return validateSelectedAndCurrentDateTime(
                  value.parent.startDate,
                  value.parent.sendMessagesBasedOnBestTime
                );
              }
            ),
            userBestTimeOutsideTimeWindow: Yup.string().required(),
            userBestTimeNotAvailable: Yup.string().required(),
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
                          formRef?.current?.values?.periodic?.bestTimeForUser;
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
                occurrences: Yup.string().required(),
              }),
              otherwise: Yup.object().notRequired(),
            }),
          }),
          otherwise: Yup.object().notRequired(),
        }),
        repeatEvery: Yup.number().required(),
        repeatOn: Yup.string().when('sendCampaignType', {
          is: ScheduleAndGoalsEnums.MONTHLY,
          then: Yup.string().required(),
          otherwise: Yup.string().notRequired(),
        }),
        daysOfWeek: Yup.array().when(['sendCampaignType', 'repeatOn'], {
          is: (weekly, month) =>
            weekly === ScheduleAndGoalsEnums.WEEKLY ||
            month === ScheduleAndGoalsEnums.DAY_OF_WEEK,
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
        // ends: Yup.string().required(),
        // after: Yup.object().when('ends', {
        //   is: ScheduleAndGoalsEnums.AFTER,
        //   then: Yup.object().shape({
        //     occurrences: Yup.string().required(),
        //   }),
        //   otherwise: Yup.object().notRequired(),
        // }),
      }),
      otherwise: Yup.object().notRequired(),
    }),
  });

  const getSendType = (values) => {
    let sendCampaignType = '';
    if (
      values[campaignType].sendCampaignTime ===
      ScheduleAndGoalsEnums.AT_FIXED_TIME
    ) {
      sendCampaignType = ScheduleAndGoalsEnums.OBJECT_KEY_AT_FIXED_TIME;
    } else if (
      values[campaignType].sendCampaignTime ===
      ScheduleAndGoalsEnums.BEST_TIME_FOR_USER
    ) {
      sendCampaignType = ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER;
    } else {
      sendCampaignType =
        ScheduleAndGoalsEnums.OBJECT_KEY_SEND_IN_USER_TIME_ZONE;
    }
    return sendCampaignType;
  };

  const handleSubmit = (values) => {
    const payload = {
      campaign: {
        type: ScheduleAndGoalsEnums[selectAudience.channelType.toUpperCase()],
        title: selectAudience.campaignName,
        select_audience: selectAudience.audience_type,
        campaign_content_type: selectAudience.campaignContentType,
        exclude_users: false,
        segment_id: selectAudience.segmentId,
        query_id: selectAudience.queryId,
        channel_id: parseInt(formEmailCreation.emailConnector, 10),
        selected_contact_attribute: selectAudience.selectedUserAttribute,
        scheduling_type: selectAudience.campaignType,
        inbox_id: inboxId,
        campaign_state: stepIndex,
        campaign_global_control_group_attributes: {
          active: false,
        },
      },
    };
    if (emailTemplate && emailTemplate.id) {
      payload.campaign.email_template_id = parseInt(emailTemplate.id, 10);
    }

    if (selectAudience.channelType === CommonEnums.EMAIL) {
      payload.campaign_detail = {
        subject: formEmailCreation.subject,
        sender_name: formEmailCreation.senderName,
        from_email_address: formEmailCreation.fromEmailAddress,
        reply_to_email_address: formEmailCreation.replyToEmailAddress,
        cc_email_address: formEmailCreation?.cc
          ? formEmailCreation.cc.split(',')
          : [],
        bcc_email_address: formEmailCreation?.bcc
          ? formEmailCreation.bcc.split(',')
          : [],
        channel_email_id: parseInt(formEmailCreation.emailConnector, 10),
      };
    }

    if (
      values[campaignType].sendCampaignType ===
      ScheduleAndGoalsEnums.IMMEDIATELY
    ) {
      payload.campaign_scheduler = {
        campaign_time_zone: `${getCurrentGMTTimeZone(
          values.campaignTimeZone
        )} ${values.campaignTimeZone}`,
        campaign_type: selectAudience.campaignType,
        schedule_type: ScheduleAndGoalsEnums.AS_SOON_AS_POSSIBLE,
        schedule_time: moment().unix(),
      };
    } else if (
      [
        ScheduleAndGoalsEnums.DAILY,
        ScheduleAndGoalsEnums.MONTHLY,
        ScheduleAndGoalsEnums.WEEKLY,
        ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
      ].includes(values[campaignType].sendCampaignType)
    ) {
      const scheduleTime = values[campaignType][getSendType(values)].sendTime;
      const scheduleDate = values[campaignType][getSendType(values)].startDate;
      const enddate =
        values[campaignType][getSendType(values)].ends ===
        ScheduleAndGoalsEnums.ON
          ? values[campaignType][getSendType(values)].on.endDate
          : '';
      const isAtSpecificTime = Boolean(
        values[campaignType].sendCampaignType ===
          ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
      );

      payload.campaign_scheduler = {
        campaign_type: selectAudience.campaignType,
        schedule_type:
          values[campaignType].sendCampaignType ===
          ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
            ? ScheduleAndGoalsEnums.AT_SPECIFIC_TIME
            : values.campaignType,
        campaign_time_zone: `${getCurrentGMTTimeZone(
          values.campaignTimeZone
        )} ${values.campaignTimeZone}`,
        send_campaign_time: values[campaignType].sendCampaignTime,
        scheduling_frequency: isAtSpecificTime
          ? ''
          : values[campaignType].sendCampaignType,
        start_date: moment(`${scheduleDate} ${scheduleTime}`).unix(),
        end_date: enddate ? moment(`${enddate} ${scheduleTime}`).unix() : '',
        repeat_every: values[campaignType].repeatEvery,
        send_if_user_timezone_expired:
          values[campaignType][getSendType(values)].sendUserTimeZonePassed,
        occurrences: isAtSpecificTime
          ? null
          : Number(values[campaignType][getSendType(values)].after.occurrences),
        on_best_time:
          values[campaignType][getSendType(values)]
            .userBestTimeOutsideTimeWindow,
        best_time_for_user:
          values[campaignType][getSendType(values)].sendMessagesBasedOnBestTime,
        alternate_timezone:
          values[campaignType][getSendType(values)].userBestTimeNotAvailable,
        repeat_on_day_of_week: isAtSpecificTime
          ? ''
          : values[campaignType].daysOfWeek,
        repeat_on_day_of_month: isAtSpecificTime
          ? ''
          : values[campaignType].daysOfMonth,
      };
    } else {
      payload.campaign_scheduler = {
        campaign_type: selectAudience.campaignType,
        schedule_type: values[campaignType].sendCampaignType,
        schedule_date: moment(values[campaignType].sendDate).unix(),
      };
    }
    if (selectAudience?.segmentId) {
      payload.segment = {
        segment_id: selectAudience.segmentId,
      };
    } else if (selectAudience?.queryId !== '' || lastExecutedFilterId) {
      payload.segment = {
        segment_filter_id: selectAudience.queryId
          ? selectAudience.queryId
          : lastExecutedFilterId,
      };
    }
    if (saveAsDraftResponse.campaign_info) {
      payload.campaign.id = saveAsDraftResponse.campaign_info?.id;
    }
    scheduleCampaign(payload);
  };

  if (formSuccess) {
    const successMsg = 'CAMPAIGN.CREATE_CAMPAIGN.CREATE.API.SUCCESS_MESSAGE';
    history.push(`${adminRoot}/dashboards/all-campaigns`);
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
  }

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={scheduleAndGoalsSchema}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
    >
      {(form) => (
        <Form>
          {formError && formError.errorMsg && (
            <Alert color="danger" className="rounded">
              {formError.errorMsg}
            </Alert>
          )}
          <ScheduleAndGoalsSendCampaignHeader
            form={form}
            campaignType={campaignType}
            showCampaignTimezone={showCampaignTimezone}
          />
          {campaignType === ScheduleAndGoalsEnums.ONE_TIME && (
            <ScheduleAndGoalsOneTime
              form={form}
              campaignType={campaignType}
              setShowCampaignTimezone={setShowCampaignTimezone}
            />
          )}
          {campaignType === ScheduleAndGoalsEnums.PERIODIC && (
            <ScheduleAndGoalsPeriodic
              form={form}
              campaignType={campaignType}
              setShowCampaignTimezone={setShowCampaignTimezone}
            />
          )}
          {campaignType === ScheduleAndGoalsEnums.EVENT_TRIGGERED && (
            <ScheduleAndGoalsEventTriggered
              form={form}
              campaignType={campaignType}
            />
          )}
          <Separator className="mb-5" />
          {/* <SheduleConversionGoals /> */}
          {/* <Separator />
          <ScheduleAndGoalsDeliveryControl form={form} /> */}

          <StepperNavigationButtons
            className="m-2"
            leftBtnLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.PREVIOUS" />
            }
            handleRightBtnClick={form.handleSubmit}
            handleLeftBtnClick={handlePreviousBtnClick}
            rightBtnLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.PUBLISH" />
            }
            rightBtnLabelDisable={!form.isValid}
          />
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = ({ campaignsApp, segmentationApp }) => {
  const {
    createCampaign: { selectAudience, contentConfiguration, scheudleAndGoals },
    successAdd,
    errorAdd,
    stepIndex,
    formEmailCreation,
    saveAsDraftResponse,
    emailTemplate,
    inboxId,
  } = campaignsApp;
  const { lastExecutedFilterId } = segmentationApp;
  return {
    selectAudience,
    contentConfiguration,
    scheudleAndGoals,
    stepIndex,
    formSuccess: successAdd,
    formError: errorAdd,
    lastExecutedFilterId,
    formEmailCreation,
    saveAsDraftResponse,
    emailTemplate,
    inboxId,
  };
};

export default connect(mapStateToProps, {
  scheduleCampaign: scheduleSmsCampaign,
  updateStepIndexAction: updateStepIndex,
})(EmailScheduleAndGoals);
