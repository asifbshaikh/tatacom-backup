import React, { useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import ConnectorConfig from './ConnectorConfig';
// import SMSGeneralConfig from './sms/SMSGeneralConfig';
// import SubscriptionKeywordsConfig from './sms/SubscriptionKeywordsConfig';
import FrequencyCappingAndDnD from './sms/FrequencyCappingAndDnD';
import ChannelTabListing from './ChannelTabListing';
import ControlEnable from 'views/app/settings/channels/ControlEnable';
import CommonEnums from 'enums/commonEnums';

const tabs = [
  {
    id: 1,
    attribute_model: 'connector_config',
    label: <IntlMessages id="CHANNEL_MGMT.TABS.CONNECTOR_CONFIG" />,
    element: <ConnectorConfig channelType="sms" />,
  },

  // maintaing as story gets approved we have to enable this menu

  // {
  //     id: 2,
  //     attribute_model: 'sms_general',
  //     label: <IntlMessages id='CHANNEL_MGMT.TABS.SMS_GENERAL' />,
  //     element: <SMSGeneralConfig />
  // },
  // {
  //     id: 3,
  //     attribute_model: 'subscription_kewords',
  //     label: <IntlMessages id='CHANNEL_MGMT.TABS.SUBSCRIPTION_KEWORDS' />,
  //     element: <SubscriptionKeywordsConfig />
  // },

  {
    id: 4,
    attribute_model: 'fc_dnd',
    label: <IntlMessages id="CHANNEL_MGMT.TABS.FC_AND_DND" />,
    element: <FrequencyCappingAndDnD channelType={CommonEnums.SMS} />,
  },
  {
    id: 5,
    attribute_model: 'control_groups',
    label: <IntlMessages id="CONTROL GROUPS" />,
    element: <ControlEnable />,
  },
];

const SMSListing = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="app-row1">
      <ChannelTabListing
        title="inboxes.sms.title"
        description="inboxes.sms.desc"
        tabs={tabs}
        activeTab={activeTab}
        hanldeActiveTab={setActiveTab}
      />
    </div>
  );
};

export default React.memo(SMSListing);
