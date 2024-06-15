import React from 'react';
import IntlMessages from 'helpers/IntlMessages';
import ScheduleAndGoalsDateAndTime from './ScheduleAndGoalsDateAndTime';

const ScheduleAndGoalsEventTriggered = ({ form, campaignType }) => {
  return (
    <>
      <ScheduleAndGoalsDateAndTime
        className="mb-3 p-3"
        form={form}
        leftFieldID={`${campaignType}.startDate`}
        leftFieldLabel={
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE" />
        }
        leftFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE"
        rightFieldId={`${campaignType}.sendTime`}
        rightFieldLabel={
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME" />
        }
        rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME"
      />
      <ScheduleAndGoalsDateAndTime
        className="mt-3 p-3"
        form={form}
        leftFieldID={`${campaignType}.endDate`}
        leftFieldLabel={
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_DATE" />
        }
        leftFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_DATE"
        rightFieldId={`${campaignType}.endTime`}
        rightFieldLabel={
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_TIME" />
        }
        rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_TIME"
      />
    </>
  );
};

export default ScheduleAndGoalsEventTriggered;
