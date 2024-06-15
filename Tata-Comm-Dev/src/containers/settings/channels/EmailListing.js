import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import CommonEnums from 'enums/commonEnums';
import classNames from 'classnames';

const tabs = [
  {
    id: '1',
    label: <IntlMessages id="CHANNEL_MGMT.TABS.CONNECTOR_CONFIG" />,
  },
  {
    id: '2',
    label: <IntlMessages id="CHANNEL_MGMT.TABS.GENERAL_SETTINGS" />,
  },
  {
    id: '3',
    label: <IntlMessages id="CHANNEL_MGMT.TABS.FC_AND_DND" />,
  },
  {
    id: '4',
    label: <IntlMessages id="CONTROL GROUPS" />,
  },
];

const ConnectorConfig = React.lazy(() => import('./email/ConnectorConfig'));
const GeneralSettings = React.lazy(() => import('./email/GeneralSettings'));

const FCandDND = React.lazy(() => import('./email/FCandDND'));
const ControlEnable = React.lazy(() =>
  import('views/app/settings/channels/ControlEnable')
);
const EmailListing = () => {
  const [activeTab, setActiveTab] = useState('1');
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h2 className="mb-4 font-weight-bold">
            <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.TITLE" />
          </h2>
          <p>
            <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.DESC" />
          </p>
          <Nav tabs className="card-header-tabs mb-2">
            {tabs.map((item) => (
              <NavItem key={item.id}>
                <NavLink
                  to="#"
                  location={{}}
                  className={`${classNames({
                    active: activeTab === item.id,
                    'nav-link pt-112 pb-012': true,
                  })} `}
                  onClick={() => {
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
      <TabContent activeTab={activeTab} className="w-100">
        {activeTab === '1' ? (
          <TabPane tabId="1">
            <ConnectorConfig channelType={CommonEnums.EMAIL} />
          </TabPane>
        ) : (
          <></>
        )}
        {activeTab === '2' ? (
          <TabPane tabId="2">
            <GeneralSettings channelType={CommonEnums.EMAIL} />
          </TabPane>
        ) : (
          <></>
        )}
        {activeTab === '3' ? (
          <TabPane tabId="3">
            <FCandDND channelType={CommonEnums.EMAIL} />
          </TabPane>
        ) : (
          <></>
        )}
        {activeTab === '4' ? (
          <TabPane tabId="4">
            <ControlEnable />,
          </TabPane>
        ) : (
          <></>
        )}
      </TabContent>
    </>
  );
};
export default EmailListing;
