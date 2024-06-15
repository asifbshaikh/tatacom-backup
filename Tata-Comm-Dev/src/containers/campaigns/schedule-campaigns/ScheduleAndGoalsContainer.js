import React from 'react';
import CommonEnums from 'enums/commonEnums';
import ScheduleAndGoals from './ScheduleAndGoals';

const ScheduleAndGoalsContainer = ({
  formRef,
  campaignType,
  previous,
  reschedule,
}) => {
  return (
    <>
      <ScheduleAndGoals
        formRef={formRef}
        campaignType={campaignType}
        previous={previous}
        reschedule={reschedule}
      />
    </>
  );
};

export default ScheduleAndGoalsContainer;
