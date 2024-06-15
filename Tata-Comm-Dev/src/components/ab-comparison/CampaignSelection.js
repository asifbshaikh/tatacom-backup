import IntlMessages from 'helpers/IntlMessages';
import Select from 'react-select';
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import CommonEnums from 'enums/commonEnums';

const CampaignSelection = ({
  intl,
  heading,
  setFilterCampaignList,
  campaigns,
  getCampaign,
  campaign,
  channelValue,
  setChannelValue,
  sectionTitle,
  onCampaignSearch,
  campaignQuery,
  onScrollBottom,
}) => {
  const { messages } = intl;

  const allChannels = [
    // {
    //   label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.PUSH_CAMPAIGN'],
    //   value: CommonEnums.PUSH,
    // },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.EMAIL_CAMPAIGN'],
      value: CommonEnums.EMAIL,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.SMS_CAMPAIGN'],
      value: CommonEnums.SMS,
    },
    // {
    //   label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.IN_APP_CAMPAIGN'],
    //   value: CommonEnums.INAPP,
    // },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.WHATSAPP_CAMPAIGN'],
      value: CommonEnums.WHATSAPP,
    },
  ];
  const [campaignValue, setCampaignValue] = useState(campaign);
  const campaignsList = campaigns.map((campaigns) => {
    return {
      label: campaigns.title,
      value: campaigns.id,
    };
  });

  const OnChannelChange = (event, type) => {
    setChannelValue(event);
    setFilterCampaignList(event, type);
    setCampaignValue('');
  };
  const getCampaignDetails = (event) => {
    if (event?.value) {
      getCampaign(event.value, messages[heading]);
    } else {
      getCampaign('', messages[heading]);
    }
    setCampaignValue(event);
  };
  const onInputChange = (text) => {
    onCampaignSearch(text);
  };

  return (
    <div className="pt-2">
      <h4>
        <b>
          <IntlMessages id={sectionTitle} />
        </b>
      </h4>
      <Select
        className="custom-attribute-list react-select"
        classNamePrefix="react-select"
        dataTestID="abChannelSelect"
        options={allChannels}
        placeholder={
          <IntlMessages id="DASHBOARD.AB_COMPARISON.SELECT_CHANNEL" />
        }
        onChange={OnChannelChange}
        value={channelValue}
      />
      <Select
        className="custom-attribute-list react-select"
        classNamePrefix="react-select"
        dataTestID="abCampaignSelect"
        options={campaignsList}
        placeholder={<IntlMessages id={heading} />}
        onChange={getCampaignDetails}
        value={campaignValue}
        onInputChange={onInputChange}
        inputValue={campaignQuery}
        onMenuScrollToBottom={onScrollBottom}
      />
    </div>
  );
};

export default injectIntl(CampaignSelection);
