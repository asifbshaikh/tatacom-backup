import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useEffect } from 'react';
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
import { useParams } from 'react-router-dom';
import { rescheduleCampaign } from 'redux/dashboard-campaigns/actions';
import CommonEnums from 'enums/commonEnums';
import {
  checkType,
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
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import ConversationEnums from 'enums/conversations/conversationEnums';
// import SheduleConversionGoals from './SheduleConversionGoals';
// import ScheduleAndGoalsDeliveryControl from './ScheduleAndGoalsDeliveryControl';
import { buttonTypeFlows } from 'helpers/campaignHelper';
import {
  DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY,
  TIME_FORMAT_WITHOUT_DATE,
} from 'constants/appConstant';
import moment_timeZone from 'moment-timezone';

const ScheduleAndGoals = ({
  formRef,
  previous,
  campaignType,
  scheduleCampaign,
  contentConfiguration,
  convertedTinyUrls,
  selectAudience,
  formSuccess,
  formError,
  stepIndex,
  updateStepIndexAction,
  convertedPersonalizedMsg,
  lastExecutedFilterId,
  inboxId,
  formEmailCreation,
  saveAsDraftResponse,
  emailTemplate,
  scheudleAndGoals,
  reschedule,
  campaignInfo,
  rescheduleCampaign,
  channelId,
  channelTypes,
  templateListWADetailedList,
}) => {
  useEffect(() => {
    window.onbeforeunload = () => true;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);
  const { campaignID } = useParams();
  const [showCampaignTimezone, setShowCampaignTimezone] = useState(false);
  const handlePreviousBtnClick = () => {
    updateStepIndexAction(stepIndex - 1);
    previous();
  };

  const history = useHistory();

  const invalidMsg = 'CAMPAIGN.VALIDATION_MESSAGE.DATE_INVALID';
  const dateValidationMsg = 'CAMPAIGN.VALIDATION_MESSAGE.END_DATE_PAST';
  const regexForbigUrls = /\b(?:https?:\/\/|www\.)\S+\b/gi;

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
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
        sendUserTimeZonePassed: '',
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
      atFixedTime: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
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
      bestTimeForUser: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
        sendMessagesBasedOnBestTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
        userBestTimeOutsideTimeWindow:
          ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
        userBestTimeNotAvailable: ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
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
      // ends: '',
      // on: {
      //   endDate: moment(new Date()).format('DD MMMM YYYY'),
      // },
      // after: {
      //   occurrences: '',
      // },
    },
    event_trigger: {
      sendCampaignType: ScheduleAndGoalsEnums.ACTIVE_CONTINOUSLY,
      startDate: moment(new Date()).format(
        DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
      ),
      sendTime: moment(new Date()).format(TIME_FORMAT_WITHOUT_DATE),
      endDate: moment(new Date()).format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
      endTime: moment(new Date()).format(TIME_FORMAT_WITHOUT_DATE),
      trigger_relation: TargetAudienceEnums.AFTER,
      trigger_attr: TargetAudienceEnums.IF_ACTION,
      time_value: TargetAudienceEnums.TIME_VALUE,
      time_multiplier: TargetAudienceEnums.TIME_MULTIPLIER,
    },
    one_time: {
      sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
      sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
      atFixedTime: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
      },

      bestTimeForUser: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
        sendMessagesBasedOnBestTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
        userBestTimeOutsideTimeWindow:
          ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
        userBestTimeNotAvailable: ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
      },
      sendInUserTimeZone: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format(TIME_FORMAT_WITHOUT_DATE),
        sendUserTimeZonePassed: ScheduleAndGoalsEnums.YES_SEND_IT,
      },
    },
  };
  if (scheudleAndGoals || reschedule) {
    // update initial state object
    if (scheudleAndGoals?.campaign_time_zone) {
      if (scheudleAndGoals.campaign_time_zone.split(' ').length > 1) {
        initialValues.campaignTimeZone =
          scheudleAndGoals.campaign_time_zone.split(' ')[1];
      } else {
        initialValues.campaignTimeZone = scheudleAndGoals.campaign_time_zone;
      }
    }
    const campaignEndType = scheudleAndGoals?.occurrences
      ? ScheduleAndGoalsEnums.AFTER
      : scheudleAndGoals?.end_date
      ? ScheduleAndGoalsEnums.ON
      : ScheduleAndGoalsEnums.NEVER;

    const repearOnType =
      scheudleAndGoals?.repeat_on_day_of_week?.length > 0
        ? ScheduleAndGoalsEnums.DAY_OF_WEEK
        : ScheduleAndGoalsEnums.DAY_OF_MONTH;
    switch (campaignType) {
      case 'one_time':
        {
          const atSpefificTime =
            scheudleAndGoals?.schedule_type ===
            ScheduleAndGoalsEnums.AT_SPECIFIC_TIME;
          const updatedValues = {
            sendCampaignType: atSpefificTime
              ? ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
              : ScheduleAndGoalsEnums.IMMEDIATELY,
            sendCampaignTime:
              scheudleAndGoals?.send_campaign_time ??
              ScheduleAndGoalsEnums.AT_FIXED_TIME,
            atFixedTime: {
              startDate:
                atSpefificTime && scheudleAndGoals?.start_date
                  ? moment_timeZone
                      .tz(
                        scheudleAndGoals.start_date,
                        initialValues.campaignTimeZone
                      )
                      ?.format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                  : moment_timeZone
                      .tz(initialValues.campaignTimeZone)
                      ?.format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              sendTime:
                atSpefificTime && scheudleAndGoals?.start_date
                  ? moment_timeZone
                      .tz(
                        scheudleAndGoals.start_date,
                        initialValues.campaignTimeZone
                      )
                      .format(TIME_FORMAT_WITHOUT_DATE)
                  : moment_timeZone
                      .tz(initialValues.campaignTimeZone)
                      .format(TIME_FORMAT_WITHOUT_DATE),
            },
            // not implemented as we are not using it now
            bestTimeForUser: {
              startDate: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              sendTime: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(TIME_FORMAT_WITHOUT_DATE)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(TIME_FORMAT_WITHOUT_DATE),
              sendMessagesBasedOnBestTime: moment().format(
                TIME_FORMAT_WITHOUT_DATE
              ),
              userBestTimeOutsideTimeWindow:
                ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
              userBestTimeNotAvailable:
                ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
            },
            sendInUserTimeZone: {
              startDate: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              sendTime: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(TIME_FORMAT_WITHOUT_DATE)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(TIME_FORMAT_WITHOUT_DATE),
              sendUserTimeZonePassed:
                scheudleAndGoals?.send_if_user_timezone_expired?.toString() ??
                ScheduleAndGoalsEnums.YES_SEND_IT,
            },
          };
          initialValues.one_time = updatedValues;
        }
        break;
      case 'periodic':
        {
          const updatedValues = {
            sendCampaignType:
              scheudleAndGoals?.scheduling_frequency ??
              ScheduleAndGoalsEnums.DAILY,
            sendCampaignTime:
              scheudleAndGoals?.send_campaign_time ??
              ScheduleAndGoalsEnums.AT_FIXED_TIME,
            sendInUserTimeZone: {
              startDate: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              sendTime: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(TIME_FORMAT_WITHOUT_DATE)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(TIME_FORMAT_WITHOUT_DATE),
              sendUserTimeZonePassed:
                scheudleAndGoals?.send_if_user_timezone_expired?.toString() ??
                ScheduleAndGoalsEnums.YES_SEND_IT,
              ends: campaignEndType ?? '',
              on: {
                endDate: scheudleAndGoals?.end_date
                  ? moment_timeZone
                      .tz(
                        scheudleAndGoals.end_date,
                        initialValues.campaignTimeZone
                      )
                      .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                  : moment_timeZone
                      .tz(new Date(), initialValues.campaignTimeZone)
                      .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              },
              after: {
                occurrences: scheudleAndGoals?.occurrences ?? '',
              },
            },
            atFixedTime: {
              startDate: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              sendTime: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(TIME_FORMAT_WITHOUT_DATE)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(TIME_FORMAT_WITHOUT_DATE),
              ends: campaignEndType ?? '',
              on: {
                endDate: scheudleAndGoals?.end_date
                  ? moment_timeZone
                      .tz(
                        scheudleAndGoals.end_date,
                        initialValues.campaignTimeZone
                      )
                      .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                  : moment_timeZone
                      .tz(new Date(), initialValues.campaignTimeZone)
                      .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              },
              after: {
                occurrences: scheudleAndGoals?.occurrences ?? '',
              },
            },
            // not implemented as we are not using it now
            bestTimeForUser: {
              startDate: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              sendTime: scheudleAndGoals?.start_date
                ? moment_timeZone
                    .tz(
                      scheudleAndGoals.start_date,
                      initialValues.campaignTimeZone
                    )
                    .format(TIME_FORMAT_WITHOUT_DATE)
                : moment_timeZone
                    .tz(initialValues.campaignTimeZone)
                    .format(TIME_FORMAT_WITHOUT_DATE),
              sendMessagesBasedOnBestTime: moment_timeZone
                .tz(initialValues.campaignTimeZone)
                .format(TIME_FORMAT_WITHOUT_DATE),
              userBestTimeOutsideTimeWindow:
                ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
              userBestTimeNotAvailable:
                ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
              ends: campaignEndType ?? '',
              on: {
                endDate: scheudleAndGoals?.end_date
                  ? moment_timeZone
                      .tz(
                        scheudleAndGoals.end_date,
                        initialValues.campaignTimeZone
                      )
                      .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
                  : moment_timeZone
                      .tz(new Date(), initialValues.campaignTimeZone)
                      .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              },
              after: {
                occurrences: scheudleAndGoals?.occurrences ?? '',
              },
            },
            repeatEvery: scheudleAndGoals?.repeat_every ?? '',
            repeatOn: repearOnType ?? ScheduleAndGoalsEnums.DAY_OF_MONTH,
            sendUserTimeZonePassed:
              scheudleAndGoals?.send_if_user_timezone_expired?.toString() ?? '',
            daysOfMonth:
              scheudleAndGoals?.repeat_on_day_of_month?.map((item) =>
                parseInt(item)
              ) ?? [],
            daysOfWeek: scheudleAndGoals?.repeat_on_day_of_week ?? [],
          };
          initialValues.periodic = updatedValues;
        }
        break;
      case 'event_trigger':
        {
          // need to be updated while event trigger is implemented
          const updatedValues = {
            sendCampaignType: ScheduleAndGoalsEnums.ACTIVE_CONTINOUSLY,
            startDate: scheudleAndGoals?.start_date
              ? moment_timeZone
                  .tz(
                    scheudleAndGoals.start_date,
                    initialValues.campaignTimeZone
                  )
                  .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
              : moment_timeZone
                  .tz(new Date(), initialValues.campaignTimeZone)
                  .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
            sendTime: scheudleAndGoals?.start_date
              ? moment_timeZone
                  .tz(
                    scheudleAndGoals.start_date,
                    initialValues.campaignTimeZone
                  )
                  .format(TIME_FORMAT_WITHOUT_DATE)
              : moment_timeZone
                  .tz(initialValues.campaignTimeZone)
                  .format(TIME_FORMAT_WITHOUT_DATE),
            endDate: scheudleAndGoals?.end_date
              ? moment_timeZone
                  .tz(scheudleAndGoals.end_date, initialValues.campaignTimeZone)
                  .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY)
              : moment_timeZone
                  .tz(new Date(), initialValues.campaignTimeZone)
                  .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
            endTime: scheudleAndGoals?.end_date
              ? moment_timeZone
                  .tz(scheudleAndGoals.end_date, initialValues.campaignTimeZone)
                  .format(TIME_FORMAT_WITHOUT_DATE)
              : moment_timeZone
                  .tz(new Date(), initialValues.campaignTimeZone)
                  .format(TIME_FORMAT_WITHOUT_DATE),
            trigger_relation: selectAudience?.triggerCriteria?.trigger_relation,
            trigger_attr: selectAudience?.triggerCriteria?.trigger_attr,
            time_value: selectAudience?.triggerCriteria?.time_value,
            time_multiplier: selectAudience?.triggerCriteria?.time_multiplier,
          };
          initialValues.event_trigger = updatedValues;
        }
        break;
      default:
        break;
    }
  }

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
        atFixedTime: Yup.object().when(
          ['sendCampaignTime', 'sendCampaignType'],
          {
            is: (time, type) => {
              return (
                time === ScheduleAndGoalsEnums.AT_FIXED_TIME &&
                type === ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
              );
            },
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
          }
        ),
        sendInUserTimeZone: Yup.object().when('sendCampaignTime', {
          is: ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE,
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
              (sendTime, value) => {
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
          (sendTime, value) => {
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
                value?.parent?.startDate,
                value?.parent?.endDate
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
              (sendTime, value) => {
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
              (sendTime, value) => {
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
    if (campaignID && reschedule) {
      const payloadData = {
        campaign_scheduler: {},
      };
      if (
        values[campaignType].sendCampaignType ===
        ScheduleAndGoalsEnums.IMMEDIATELY
      ) {
        payloadData.campaign_scheduler = {
          campaign_time_zone: `${getCurrentGMTTimeZone(
            values.campaignTimeZone
          )} ${values.campaignTimeZone}`,
          campaign_type: selectAudience.campaignType,
          schedule_type: ScheduleAndGoalsEnums.AS_SOON_AS_POSSIBLE,
          schedule_time:
            moment_timeZone().tz(values?.campaignTimeZone).unix() -
            moment_timeZone().tz(values?.campaignTimeZone).utcOffset() * 60,
          start_date:
            moment_timeZone().tz(values?.campaignTimeZone).unix() -
            moment_timeZone().tz(values?.campaignTimeZone).utcOffset() * 60,
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
        const scheduleDate =
          values[campaignType][getSendType(values)].startDate;
        const endsOn =
          values[campaignType][getSendType(values)].ends ===
          ScheduleAndGoalsEnums.ON
            ? values[campaignType][getSendType(values)].on.endDate
            : '';
        const isAtSpecificTime = Boolean(
          values[campaignType].sendCampaignType ===
            ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
        );

        payloadData.campaign_scheduler = {
          campaign_type: 0,
          schedule_type:
            values[campaignType].sendCampaignType ===
            ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
              ? 'at_specific_time'
              : values.campaignType,
          campaign_time_zone: `${getCurrentGMTTimeZone(
            values.campaignTimeZone
          )} ${values.campaignTimeZone}`,
          send_campaign_time: values[campaignType].sendCampaignTime,
          scheduling_frequency: isAtSpecificTime
            ? ''
            : values[campaignType].sendCampaignType,
          start_date:
            moment_timeZone
              .tz(`${scheduleDate} ${scheduleTime}`, values?.campaignTimeZone)
              .unix() -
            moment_timeZone
              .tz(`${scheduleDate} ${scheduleTime}`, values?.campaignTimeZone)
              .utcOffset() *
              60,
          end_date: endsOn
            ? moment_timeZone
                .tz(`${endsOn} ${scheduleTime}`, values?.campaignTimeZone)
                .unix() -
              moment_timeZone
                .tz(`${endsOn} ${scheduleTime}`, values?.campaignTimeZone)
                .utcOffset() *
                60
            : '',
          repeat_every: values[campaignType].repeatEvery,
          send_if_user_timezone_expired:
            values[campaignType][getSendType(values)].sendUserTimeZonePassed,
          occurrences: isAtSpecificTime
            ? null
            : Number(
                values[campaignType][getSendType(values)].after.occurrences
              ),
          on_best_time:
            values[campaignType][getSendType(values)]
              .userBestTimeOutsideTimeWindow,
          best_time_for_user:
            values[campaignType][getSendType(values)]
              .sendMessagesBasedOnBestTime,
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
        payloadData.campaign_scheduler = {
          campaign_type: selectAudience.campaignType,
          campaign_time_zone: `${getCurrentGMTTimeZone(
            values?.campaignTimeZone
          )} ${values?.campaignTimeZone}`,
          schedule_type:
            selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED
              ? selectAudience.campaignType
              : values[campaignType].sendCampaignType,
          ...(selectAudience.campaignType !==
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            schedule_date: moment(values[campaignType].sendDate).unix(),
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            time_multiplier: selectAudience.triggerCriteria.time_multiplier,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            start_date:
              moment_timeZone
                .tz(
                  `${values[campaignType].startDate} ${values[campaignType].sendTime}`,
                  values?.campaignTimeZone
                )
                .unix() -
              moment_timeZone
                .tz(
                  `${values[campaignType].startDate} ${values[campaignType].sendTime}`,
                  values?.campaignTimeZone
                )
                .utcOffset() *
                60,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            end_date:
              moment_timeZone
                .tz(
                  `${values[campaignType].endDate} ${values[campaignType].endTime}`,
                  values?.campaignTimeZone
                )
                .unix() -
              moment_timeZone
                .tz(
                  `${values[campaignType].endDate} ${values[campaignType].endTime}`,
                  values?.campaignTimeZone
                )
                .utcOffset() *
                60,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            time_value: selectAudience.triggerCriteria.time_value,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED &&
            selectAudience.triggerCriteria.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY && {
              trigger_attr: selectAudience.triggerCriteria.trigger_attr,
            }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED &&
            selectAudience.triggerCriteria.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY && {
              trigger_relation: selectAudience.triggerCriteria.trigger_relation,
            }),
        };
      }
      const payload = {
        filter: 'reschedule',
        id: campaignID,
        payloadData,
      };
      history.push(`${adminRoot}/dashboards/all-campaigns`);
      rescheduleCampaign(payload);
    } else {
      const payload = {
        campaign: {
          type: ScheduleAndGoalsEnums[selectAudience.channelType.toUpperCase()],
          select_audience: selectAudience.audience_type,
          title: selectAudience.campaignName,
          exclude_users: false,
          segment_id: selectAudience.segmentId,
          query_id: selectAudience.queryId,
          selected_contact_attribute: selectAudience.selectedUserAttribute,
          scheduling_type: selectAudience.campaignType,
          inbox_id: inboxId,
          channel_type: channelTypes,
          channel_id: channelId,
          campaign_state: stepIndex,
          campaign_global_control_group_attributes: {
            active: false,
          },
        },
      };

      if (selectAudience.channelType === CommonEnums.EMAIL) {
        payload.campaign.channel_id = parseInt(
          formEmailCreation.emailConnector,
          10
        );
        payload.campaign.scheduling_type = selectAudience.campaignType;
        payload.campaign.campaign_content_type =
          selectAudience.campaignContentType;

        if (emailTemplate && emailTemplate.id) {
          payload.campaign.email_template_id = parseInt(emailTemplate.id, 10);
        }

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
      } else {
        payload.campaign.message = contentConfiguration.actualMessage;
        payload.campaign.template_customized =
          contentConfiguration.templateCustomized;
        payload.campaign.send_campaign_to_the_opted_out_users =
          contentConfiguration.smsOptout;
        if (
          convertedPersonalizedMsg?.personalize_message?.length &&
          contentConfiguration.category === ContentConfigurationEnums.WITH_MEDIA
        ) {
          payload.campaign.personalise_mapping_attribute = {
            ...convertedPersonalizedMsg.personalise_mapping_attribute,
            media_attribute: {
              type: ConversationEnums.HEADER,
              parameters: [
                {
                  type: checkType(contentConfiguration.mediaLink),
                  [checkType(contentConfiguration.mediaLink)]: {
                    link: contentConfiguration.mediaLink,
                  },
                },
              ],
            },
          };
        } else if (convertedPersonalizedMsg?.personalize_message?.length) {
          payload.campaign.personalise_mapping_attribute =
            convertedPersonalizedMsg.personalise_mapping_attribute;
        } else if (
          contentConfiguration.category === ContentConfigurationEnums.WITH_MEDIA
        ) {
          payload.campaign.personalise_mapping_attribute = {
            media_attribute: {
              type: ConversationEnums.HEADER,
              parameters: [
                {
                  type: checkType(contentConfiguration.mediaLink),
                  [checkType(contentConfiguration.mediaLink)]: {
                    link: contentConfiguration.mediaLink,
                  },
                },
              ],
            },
          };
        } else {
          payload.campaign.personalise_mapping_attribute = {};
        }

        if (templateListWADetailedList.length > 0) {
          const m = templateListWADetailedList.find((e) => {
            return e.name === contentConfiguration.templateRecordId;
          });

          if (m) {
            const btnsArray = m.components.find(
              (comp) => comp.type === ContentConfigurationEnums.WHATSAPP_BUTTONS
            );

            const btns = btnsArray ? btnsArray.buttons : [];

            if (btns?.length > 0 && buttonTypeFlows(btns)) {
              payload.campaign.personalise_mapping_attribute = {
                ...payload.campaign.personalise_mapping_attribute,
                flow_button: {
                  type: 'button',
                  sub_type: 'flow',
                  index: '0',
                },
              };
            }
          }
        }
      }

      if (selectAudience.channelType === CommonEnums.SMS) {
        const messageToMatch = contentConfiguration?.message || '';
        const bigUrls = messageToMatch?.match(regexForbigUrls) || '';
        payload.campaign.big_urls = bigUrls;
        payload.campaign.tiny_url = contentConfiguration.tinyUrlConversion;
        payload.campaign.tiny_urls = convertedTinyUrls?.length
          ? convertedTinyUrls.map((url) => url.tinyUrl)
          : [];
        payload.campaign.sender_id = contentConfiguration.smsSender;
        payload.campaign.template_id = contentConfiguration.templateId;
        payload.campaign.template_record_id =
          contentConfiguration.templateRecordId;
        payload.campaign.personalise_mapping_attribute =
          convertedPersonalizedMsg?.personalize_message?.length
            ? convertedPersonalizedMsg.personalise_mapping_attribute
            : {};
      }

      if (selectAudience.channelType === CommonEnums.WHATSAPP) {
        payload.campaign.phone_number = contentConfiguration.smsSender;
        payload.campaign.message = contentConfiguration.templateRecordId;
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
          start_date:
            moment_timeZone.tz(moment(), values?.campaignTimeZone).unix() -
            moment_timeZone.tz(moment(), values?.campaignTimeZone).utcOffset() *
              60,
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
        const scheduleDate =
          values[campaignType][getSendType(values)].startDate;
        const endsOn =
          values[campaignType][getSendType(values)].ends ===
          ScheduleAndGoalsEnums.ON
            ? values[campaignType][getSendType(values)].on.endDate
            : '';
        const isAtSpecificTime = Boolean(
          values[campaignType].sendCampaignType ===
            ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
        );

        payload.campaign_scheduler = {
          campaign_type: 0,
          schedule_type:
            values[campaignType].sendCampaignType ===
            ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
              ? 'at_specific_time'
              : values.campaignType,
          campaign_time_zone: `${getCurrentGMTTimeZone(
            values.campaignTimeZone
          )} ${values.campaignTimeZone}`,
          send_campaign_time: values[campaignType].sendCampaignTime,
          scheduling_frequency: isAtSpecificTime
            ? ''
            : values[campaignType].sendCampaignType,
          start_date:
            moment_timeZone
              .tz(`${scheduleDate} ${scheduleTime}`, values?.campaignTimeZone)
              .unix() -
            moment_timeZone
              .tz(`${scheduleDate} ${scheduleTime}`, values?.campaignTimeZone)
              .utcOffset() *
              60,
          end_date: endsOn
            ? moment_timeZone
                .tz(`${endsOn} ${scheduleTime}`, values?.campaignTimeZone)
                .unix() -
              moment_timeZone
                .tz(`${endsOn} ${scheduleTime}`, values?.campaignTimeZone)
                .utcOffset() *
                60
            : '',
          repeat_every: values[campaignType].repeatEvery,
          send_if_user_timezone_expired:
            values[campaignType][getSendType(values)].sendUserTimeZonePassed,
          occurrences: isAtSpecificTime
            ? null
            : Number(
                values[campaignType][getSendType(values)].after.occurrences
              ),
          on_best_time:
            values[campaignType][getSendType(values)]
              .userBestTimeOutsideTimeWindow,
          best_time_for_user:
            values[campaignType][getSendType(values)]
              .sendMessagesBasedOnBestTime,
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
          campaign_time_zone: `${getCurrentGMTTimeZone(
            values?.campaignTimeZone
          )} ${values?.campaignTimeZone}`,
          schedule_type:
            selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED
              ? selectAudience.campaignType
              : values[campaignType].sendCampaignType,
          ...(selectAudience.campaignType !==
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            schedule_date: moment(values[campaignType].sendDate).unix(),
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            time_multiplier: selectAudience.triggerCriteria.time_multiplier,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            start_date:
              moment_timeZone
                .tz(
                  `${values[campaignType].startDate} ${values[campaignType].sendTime}`,
                  values?.campaignTimeZone
                )
                .unix() -
              moment_timeZone
                .tz(
                  `${values[campaignType].startDate} ${values[campaignType].sendTime}`,
                  values?.campaignTimeZone
                )
                .utcOffset() *
                60,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            end_date:
              moment_timeZone
                .tz(
                  `${values[campaignType].endDate} ${values[campaignType].endTime}`,
                  values?.campaignTimeZone
                )
                .unix() -
              moment_timeZone
                .tz(
                  `${values[campaignType].endDate} ${values[campaignType].endTime}`,
                  values?.campaignTimeZone
                )
                .utcOffset() *
                60,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED && {
            time_value: selectAudience.triggerCriteria.time_value,
          }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED &&
            selectAudience.triggerCriteria.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY && {
              trigger_attr: selectAudience.triggerCriteria.trigger_attr,
            }),
          ...(selectAudience.campaignType ===
            ScheduleAndGoalsEnums.EVENT_TRIGGERED &&
            selectAudience.triggerCriteria.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY && {
              trigger_relation: selectAudience.triggerCriteria.trigger_relation,
            }),
        };
      }
      if (selectAudience?.segmentId) {
        payload.segment = {
          segment_id: selectAudience.segmentId,
        };
      } else if (
        selectAudience?.queryId ||
        selectAudience?.draftSegmentId ||
        lastExecutedFilterId
      ) {
        payload.segment = {
          segment_filter_id:
            selectAudience.queryId ||
            lastExecutedFilterId ||
            selectAudience?.draftSegmentId,
        };
      }
      if (
        selectAudience.campaignType === ScheduleAndGoalsEnums.EVENT_TRIGGERED
      ) {
        payload.included_filters = {
          ...selectAudience.triggerCriteria.included_filters,
        };
      }
      if (
        saveAsDraftResponse?.id ??
        saveAsDraftResponse?.campaign?.id ??
        saveAsDraftResponse?.campaign_info?.id
      ) {
        payload.campaign.id =
          saveAsDraftResponse?.id ??
          saveAsDraftResponse?.campaign?.id ??
          saveAsDraftResponse?.campaign_info?.id ??
          '';
        scheduleCampaign({
          payload,
          id: payload?.campaign?.id,
        });
      } else {
        scheduleCampaign({ payload });
      }
    }
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
              reschedule ? (
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.RESCHEDULE" />
              ) : (
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.PUBLISH" />
              )
            }
            rightBtnLabelDisable={!form.isValid}
            leftBtnLabelDisable={reschedule}
          />
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = ({
  campaignsApp,
  segmentationApp,
  dashboardCampaignsApp,
}) => {
  const {
    createCampaign: { selectAudience, contentConfiguration, scheudleAndGoals },
    successAdd,
    errorAdd,
    stepIndex,
    convertedTinyUrls,
    convertedPersonalizedMsg,
    inboxId,
    formEmailCreation,
    saveAsDraftResponse,
    emailTemplate,
    channelId,
    channelTypes,
    templateListWADetailedList,
  } = campaignsApp;
  const { lastExecutedFilterId } = segmentationApp;
  const { campaignInfo } = dashboardCampaignsApp;

  return {
    selectAudience,
    contentConfiguration,
    scheudleAndGoals,
    stepIndex,
    formSuccess: successAdd,
    formError: errorAdd,
    convertedTinyUrls,
    convertedPersonalizedMsg,
    lastExecutedFilterId,
    inboxId,
    formEmailCreation,
    saveAsDraftResponse,
    emailTemplate,
    campaignInfo,
    channelId,
    channelTypes,
    templateListWADetailedList,
  };
};
export default connect(mapStateToProps, {
  scheduleCampaign: scheduleSmsCampaign,
  updateStepIndexAction: updateStepIndex,
  rescheduleCampaign,
})(ScheduleAndGoals);
