import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import React from 'react';
import { Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import moment from 'moment';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import {
  getSendCampaignTimeValue,
  getSendCampaignTimeValueBasedOnEvent,
} from 'helpers/campaignHelper';
import ScheduleAndGoalsDateAndTime from './ScheduleAndGoalsDateAndTime';
// import ScheduleAndGoalsBestTimeForUser from './ScheduleAndGoalsBestTimeForUser';
import SendInUserTimeZone from '../SendInUserTimeZone';
import { oneTimeRadioLists } from '../../../data/createCampaignData';
import FlowsEnums from 'enums/campaigns/flowsEnums';

const ScheduleAndGoalsOneTime = ({
  form,
  campaignType,
  setShowCampaignTimezone,
  moduleName,
}) => {
  const { values } = form;
  const setFiledValues = (event) => {
    form.setFieldValue(`${campaignType}.sendCampaignTime`, event.target.value);
    if (
      getSendCampaignTimeValueBasedOnEvent(event.target.value) ===
      ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER
    ) {
      form.setFieldValue(
        `${campaignType}.${ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER}.sendMessagesBasedOnBestTime`,
        moment().format('LT')
      );
    }
    form.setFieldValue(
      `${campaignType}.${getSendCampaignTimeValueBasedOnEvent(
        event.target.value
      )}.sendTime`,
      moment().format('LT')
    );
  };
  if (
    values.one_time.sendCampaignTime ===
      ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE ||
    values.one_time.sendCampaignTime ===
      ScheduleAndGoalsEnums.BEST_TIME_FOR_USER
  ) {
    setShowCampaignTimezone(true);
  } else {
    setShowCampaignTimezone(false);
  }

  const getImmediatelyLabel = (moduleName) => {
    switch (moduleName) {
      case S3SFTPImportEnums.MODULE_NAME:
        return (
          <IntlMessages id="S3SFTP.SCHEDULE.LABEL.START_DB_IMPORT_IMMEDIATELY" />
        );
      case FlowsEnums.MODULE_NAME:
        return (
          <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ENTER_IMMEDIATELY_LABEL" />
        );
      default:
        return (
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_MESSAGE_IMMEDIATELY" />
        );
    }
  };

  const getSpecificTimeLabel = (moduleName) => {
    switch (moduleName) {
      case S3SFTPImportEnums.MODULE_NAME:
        return (
          <IntlMessages id="S3SFTP.SCHEDULE.LABEL.DB_IMPORT_WILL_NEXT_START_ON" />
        );
      case FlowsEnums.MODULE_NAME:
        return (
          <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ENTER_SPECIFIC_TIME_LABEL" />
        );
      default:
        return (
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.CAMPAIGN_WILL_NEXT_SEND_ON" />
        );
    }
  };

  return (
    <>
      {values[campaignType].sendCampaignType ===
        ScheduleAndGoalsEnums.IMMEDIATELY && (
        <div className="d-flex align-items-center justify-content-center p-5">
          <h6 className="message-popup font-weight-bold">
            {getImmediatelyLabel(moduleName)}
          </h6>
        </div>
      )}
      {values[campaignType].sendCampaignType ===
        ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME && (
        <div className="schedule-goals-one-time">
          {' '}
          {moduleName === S3SFTPImportEnums.MODULE_NAME ||
          moduleName === FlowsEnums.MODULE_NAME ? (
            ''
          ) : (
            <Row className="p-3">
              <Colxx xxs="12">
                <FormGroupCoustom
                  noLable
                  type="radioMulti"
                  radioMultiOptions={oneTimeRadioLists}
                  className="one-time-radio-btns"
                  value={form.values[campaignType].sendCampaignTime}
                  identifier={`${campaignType}.sendCampaignTime`}
                  onChange={(event) => {
                    setFiledValues(event);
                  }}
                />
              </Colxx>
            </Row>
          )}
          <ScheduleAndGoalsDateAndTime
            className="p-3"
            form={form}
            leftFieldID={`${campaignType}.${getSendCampaignTimeValue(
              form,
              campaignType
            )}.startDate`}
            leftFieldLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE" />
            }
            leftFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE"
            rightFieldId={`${campaignType}.${getSendCampaignTimeValue(
              form,
              campaignType
            )}.sendTime`}
            rightFieldLabel={
              moduleName === S3SFTPImportEnums.MODULE_NAME ||
              moduleName === FlowsEnums.MODULE_NAME ? (
                <IntlMessages id="S3SFTP.SCHEDULE.LABEL.START_TIME" />
              ) : (
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME" />
              )
            }
            rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME"
          />
          {form.values[campaignType].sendCampaignTime ===
            ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE && (
            <SendInUserTimeZone form={form} campaignType={campaignType} />
          )}
          {/* {form.values[campaignType].sendCampaignTime ===
            ScheduleAndGoalsEnums.BEST_TIME_FOR_USER && (
            <>
              <ScheduleAndGoalsDateAndTime
                className="p-3"
                form={form}
                rightFieldId={`${campaignType}.${getSendCampaignTimeValue(
                  form,
                  campaignType
                )}.sendMessagesBasedOnBestTime`}
                rightFieldLabel={
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_MESSAGE_BASED_ON_BEST_TIME" />
                }
                rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_MESSAGE_BASED_ON_BEST_TIME"
              />
              <ScheduleAndGoalsBestTimeForUser
                form={form}
                campaignType={campaignType}
              />
            </>
          )} */}
          <Row className="text-center mt-5">
            {form.values[campaignType].sendCampaignTime ===
              ScheduleAndGoalsEnums.AT_FIXED_TIME &&
              values[campaignType][getSendCampaignTimeValue(form, campaignType)]
                .startDate &&
              values[campaignType][getSendCampaignTimeValue(form, campaignType)]
                .sendTime && (
                <Colxx xxs="12">
                  <h6 className="message-popup font-weight-bold">
                    {getSpecificTimeLabel(moduleName)}{' '}
                    {
                      values[campaignType][
                        getSendCampaignTimeValue(form, campaignType)
                      ].startDate
                    }{' '}
                    {
                      values[campaignType][
                        getSendCampaignTimeValue(form, campaignType)
                      ].sendTime
                    }
                  </h6>
                </Colxx>
              )}
          </Row>
        </div>
      )}
    </>
  );
};

export default ScheduleAndGoalsOneTime;
