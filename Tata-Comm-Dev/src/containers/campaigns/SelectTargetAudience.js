import React from 'react';
import CommonEnums from 'enums/commonEnums';
import TargetAudience from './TargetAudience';
import EmailTargetAudience from './email/EmailTargetAudience';
import { useParams } from 'react-router-dom';

const SelectTargetAudience = ({
  formRef,
  next,
  channelType,
  previous,
  reschedule,
}) => {
  const { campaignID } = useParams();

  return (
    <>
      {channelType === CommonEnums.EMAIL ? (
        <EmailTargetAudience
          formRef={formRef}
          next={next}
          previous={previous}
        />
      ) : (
        <TargetAudience formRef={formRef} next={next} previous={previous} />
      )}
    </>
  );
};

export default SelectTargetAudience;
