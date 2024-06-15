import React, { useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import ChannelTabListing from './ChannelTabListing';
import ConnectorConfig from './ConnectorConfig';
import WhatsAppFCAndDND from './whatsapp/WhatsAppFCAndDND';
import ControlEnable from 'views/app/settings/channels/ControlEnable';

const tabs = [
  {
    id: 10,
    attribute_model: 'connector_config',
    label: <IntlMessages id="CHANNEL_MGMT.TABS.CONNECTOR_CONFIG" />,
    element: <ConnectorConfig channelType="whatsapp" />,
  },
  {
    id: 11,
    attribute_model: 'fc_dnd',
    label: <IntlMessages id="CHANNEL_MGMT.TABS.FC_AND_DND" />,
    element: <WhatsAppFCAndDND channelType="whatsapp" />,
  },
  {
    id: 12,
    attribute_model: 'control_groups',
    label: <IntlMessages id="CONTROL GROUPS" />,
    element: <ControlEnable />,
  },
];

const WhatsAppListing = () => {
  const [activeTab, setActiveTab] = useState(10);
  return (
    <>
      <div className="app-row1">
        <ChannelTabListing
          title="inboxes.whatsapp.title"
          description="inboxes.whatsapp.desc"
          tabs={tabs}
          activeTab={activeTab}
          hanldeActiveTab={setActiveTab}
        />
      </div>
    </>
  );
};

export default React.memo(WhatsAppListing);
