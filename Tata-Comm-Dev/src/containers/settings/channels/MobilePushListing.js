import React from 'react';
import IntlMessages from 'helpers/IntlMessages';
import ChannelTabListing from './ChannelTabListing';
import { useState } from 'react';
import CommonEnums from 'enums/commonEnums';

const AndroidMobilePushConfig = React.lazy(() =>
  import('./mobile-push/AndroidMobilePushConfig')
);
const IosMobilePushConfig = React.lazy(() =>
  import('./mobile-push/IosMobilePushConfig')
);
const ControlEnable = React.lazy(() =>
  import('views/app/settings/channels/ControlEnable')
);

const MobilePushListing = () => {
  const [activeTab, setActiveTab] = useState(3);
  const [file, setFile] = useState(null);

  const tabs = [
    {
      id: 3,
      attribute_model: 'andriod',
      label: <IntlMessages id="CHANNEL_MGMT.TABS.MOBILE_PUSH.ANDRIOD" />,
      element: (
        <AndroidMobilePushConfig
          channelType={CommonEnums.MOBILE}
          setFile={setFile}
          file={file}
        />
      ),
    },
    {
      id: 4,
      attribute_model: 'ios',
      label: <IntlMessages id="CHANNEL_MGMT.TABS.MOBILE_PUSH.IOS" />,
      element: (
        <IosMobilePushConfig
          channelType={CommonEnums.MOBILE}
          setFile={setFile}
          file={file}
        />
      ),
    },
    {
      id: 5,
      attribute_model: 'control_groups',
      label: <IntlMessages id="CONTROL GROUPS" />,
      element: <ControlEnable />,
    },
  ];

  return (
    <div className="app-row1">
      <ChannelTabListing
        title="settings-channel.mobile.title"
        description="settings-channel.mobile.desc"
        tabs={tabs}
        activeTab={activeTab}
        hanldeActiveTab={setActiveTab}
      />
    </div>
  );
};
export default MobilePushListing;
