import React, { useState } from 'react';
import classNames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { NavLink } from 'react-router-dom';
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import ChannelsHeading from 'containers/settings/channels/ChannelsHeading';
import EmailListing from 'containers/settings/channels/EmailListing';
import WhatsAppListing from 'containers/settings/channels/WhatsAppListing';
import WebPushListing from 'containers/settings/channels/WebPushListing';

const SMSListing = React.lazy(() =>
  import('../../../../containers/settings/channels/SMSListing')
);
const MobilePushListing = React.lazy(() =>
  import('../../../../containers/settings/channels/MobilePushListing')
);

const tabs = [
  {
    id: '1',
    type: 'sms',
    attribute_model: 'sms_attribute',
    label: <IntlMessages id="CHANNEL_MGMT.CHANNEL.SMS" />,
    element: <SMSListing />,
  },
  {
    id: '2',
    type: 'email',
    attribute_model: 'email_attribute',
    label: <IntlMessages id="CHANNEL_MGMT.CHANNEL.EMAIL" />,
    element: <EmailListing />,
  },
  {
    id: '3',
    type: 'whatsapp',
    attribute_model: 'whatsapp_attribute',
    label: <IntlMessages id="CHANNEL_MGMT.CHANNEL.WHATSAPP" />,
    element: <WhatsAppListing />,
  },
  {
    id: '4',
    type: 'mobile',
    attribute_model: 'mobile_attribute',
    label: <IntlMessages id="CHANNEL_MGMT.CHANNEL.MOBILEPUSH" />,
    element: <MobilePushListing />,
  },
  {
    id: '5',
    type: 'webpush',
    attribute_model: 'webpush_attribute',
    label: <IntlMessages id="CHANNEL_MGMT.CHANNEL.WEBPUSH" />,
    element: <WebPushListing />,
  },
];

const ChannelList = (props) => {
  const tabId = (val) => {
    return tabs.filter((element) => element.type === val)[0];
  };
  const { type } = props.match.params;

  const [activeTab, setActiveTab] = useState(tabId(type).id ?? '1');

  const setTypeAndNavigate = () => {
    // history.push(`/list/${channelType}`);
  };

  return (
    <>
      <div className="app-row1 channels-config">
        <ChannelsHeading heading="CHANNEL_MGMT.HEADER" match={props.match} />
        <Row>
          <Colxx xxs="12">
            <Nav
              tabs
              className="card-header-tabs mb-2"
              data-testid="channelList"
            >
              {tabs.map((item) => (
                <NavItem key={item.id}>
                  <NavLink
                    to={`${item.type}`}
                    location={{}}
                    className={`${classNames({
                      active: activeTab === item.id,
                      'nav-link pt-112 pb-012': true,
                    })} `}
                    onClick={() => {
                      setTypeAndNavigate(item.type);
                      setActiveTab(item.id);
                    }}
                  >
                    {item.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Colxx>
        </Row>
        <Row>
          <TabContent activeTab={activeTab} className="w-100">
            {tabs.map((item) => {
              return (
                <div key={item.id}>
                  {activeTab === item.id ? (
                    <TabPane tabId={item.id}>
                      <Card>
                        <CardBody>{item.element}</CardBody>
                      </Card>
                    </TabPane>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </TabContent>
        </Row>
      </div>
    </>
  );
};

export default ChannelList;
