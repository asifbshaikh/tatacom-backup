import React from 'react';
import Scheduler from './Scheduler';

const S3SFTPSchedule = ({ formRef, soureType, audienceType, previous }) => {
  return (
    <>
      <Scheduler
        formRef={formRef}
        sourceType={soureType}
        audienceType={audienceType}
        previous={previous}
      />
    </>
  );
};

export default S3SFTPSchedule;
