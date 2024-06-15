import React from 'react';
import CommonEnums from 'enums/commonEnums';
import SmsContentConfiguration from './sms-campaign/SmsContentConfiguration';
import WhatsAppContentConfiguration from './whatsapp-campaign/WhatsAppContentConfiguration';
import EmailContentConfiguration from './email/EmailContentConfiguration';
import { useParams } from 'react-router-dom';

const ContentCampaign = ({
  formRef,
  next,
  channelType,
  previous,
  reschedule,
}) => {
  const { campaignID } = useParams();

  return (
    <>
      {channelType === CommonEnums.SMS && (
        <SmsContentConfiguration
          channelType={channelType}
          formRef={formRef}
          next={next}
          previous={previous}
        />
      )}
      {channelType === CommonEnums.WHATSAPP && (
        <WhatsAppContentConfiguration
          channelType={channelType}
          formRef={formRef}
          next={next}
          previous={previous}
        />
      )}
      {channelType === CommonEnums.EMAIL && (
        <EmailContentConfiguration
          formRef={formRef}
          next={next}
          previous={previous}
        />
      )}
      {(channelType === CommonEnums.PUSH ||
        channelType === CommonEnums.INAPP) && (
        <SmsContentConfiguration
          formRef={formRef}
          next={next}
          previous={previous}
        />
      )}
    </>
  );
};

export default ContentCampaign;
