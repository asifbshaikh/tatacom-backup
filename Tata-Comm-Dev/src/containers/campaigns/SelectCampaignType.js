import React from 'react';
// import CommonEnums from 'enums/commonEnums';
import CampaignType from './CampaignType';
import { useParams } from 'react-router-dom';

const SelectCampaignType = ({
  previous,
  formRef,
  next,
  channelType,
  reschedule,
}) => {
  const { campaignID } = useParams();

  return (
    <>
      <CampaignType
        formRef={formRef}
        next={next}
        previous={previous}
        channelType={channelType}
      />
    </>
  );
};

export default SelectCampaignType;
