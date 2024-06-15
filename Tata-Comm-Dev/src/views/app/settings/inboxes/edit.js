import React, { useState, useEffect } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { connect } from 'react-redux';
import {
  Row,
  Nav,
  NavItem,
  TabPane,
  TabContent,
  Spinner,
  // Alert,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import IntlMessages from 'helpers/IntlMessages';

import { INBOX_TYPES } from 'helpers/TringIconHelper';

import EditInboxSettings from 'containers/settings/inboxes/EditInboxSettings';
import EditInboxAgents from 'containers/settings/inboxes/EditInboxAgents';
import EditBusinessHours from 'containers/settings/inboxes/EditBusinessHours';
import EditPreChatForm from 'containers/settings/inboxes/EditPreChatForm';
import EditConfiguration from 'containers/settings/inboxes/EditConfiguration';

import { getChannel, updateChannelClean } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import { updateInboxClean } from 'redux/channels/actions';

const InboxesNew = ({
  match,
  editFormData,
  getChannelAction,
  updateChannelCleanAction,
  formSuccess,
  updateInboxCleanAction,
}) => {
  useEffect(() => {
    getChannelAction(parseInt(match.params.inboxid, 10));
  }, [match.params.inboxid]);
  const [activeFirstTab, setActiveFirstTab] = useState('settings');

  // let editFormData = {};
  // if (!loadedChannel || editFormData.id !== parseInt(match.params.inboxid, 10)) {
  //     getChannelAction(parseInt(match.params.inboxid, 10));
  // }
  // if (inboxes.length) {
  //     // const editFormDataArr =
  //     [editFormData] = inboxes.filter(item => item.id === parseInt(match.params.inboxid, 10));
  // }

  let allTabs = [
    { tabId: 'settings', label: 'inboxes.edit_settings' },
    { tabId: 'agents', label: 'inboxes.edit_agents' },
    { tabId: 'businesshours', label: 'inboxes.business_hours' },
  ];

  if (formSuccess) {
    NotificationManager.success(
      <IntlMessages id="CREATE_INBOX.LABEL.SUCCESS_MESSAGE" />,
      'Success',
      6000,
      null,
      null
    );
    getChannelAction(parseInt(match.params.inboxid, 10));
    updateInboxCleanAction({});
    updateChannelCleanAction({});
  }

  if (editFormData.channel_type === INBOX_TYPES.WEB) {
    allTabs = [
      ...allTabs,
      {
        tabId: 'preChatForm',
        label: 'inboxes.prechatform',
      },
      {
        tabId: 'configuration',
        label: 'inboxes.configuration',
      },
    ];
  }
  if (
    editFormData.channel_type === INBOX_TYPES.API ||
    editFormData.channel_type === INBOX_TYPES.TWILIO ||
    (editFormData.channel_type === INBOX_TYPES.TATA &&
      editFormData.medium === 'sms') ||
    editFormData.channel_type === INBOX_TYPES.EMAIL ||
    editFormData.channel_type === INBOX_TYPES.VIBER ||
    editFormData.channel_type === INBOX_TYPES.LINE
  ) {
    allTabs = [
      ...allTabs,
      {
        tabId: 'configuration',
        label: 'inboxes.configuration',
      },
    ];
  }
  const PrintTab = ({ tabId, label }) => {
    return (
      <NavItem>
        <NavLink
          to="#"
          location={{}}
          className={`${classnames({
            active: activeFirstTab === tabId,
            'nav-link pt-2 pb-0': true,
          })} `}
          onClick={() => {
            setActiveFirstTab(tabId);
          }}
        >
          <IntlMessages id={label} />
        </NavLink>
      </NavItem>
    );
  };

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="inboxes.edit-heading" match={match} />
          <Separator className="mb-4" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-5">
          <h2 className="mb-3 font-weight-bold">{editFormData.name}</h2>
          <Nav tabs className="card-header-tabs mb-5">
            {allTabs.map((tab) => (
              <PrintTab key={`printttab_${tab.tabId}`} {...tab} />
            ))}
          </Nav>
          {!editFormData.id ? (
            <Spinner color="primary" />
          ) : (
            <TabContent activeTab={activeFirstTab} className="w-100">
              <TabPane tabId="settings">
                {activeFirstTab === 'settings' && (
                  <EditInboxSettings
                    editFormData={editFormData}
                    inboxid={match.params.inboxid}
                  />
                )}
              </TabPane>
              <TabPane tabId="agents">
                {activeFirstTab === 'agents' && (
                  <EditInboxAgents
                    editFormData={editFormData}
                    inboxid={match.params.inboxid}
                  />
                )}
              </TabPane>
              <TabPane tabId="businesshours">
                {activeFirstTab === 'businesshours' && (
                  <EditBusinessHours
                    editFormData={editFormData}
                    inboxid={match.params.inboxid}
                  />
                )}
              </TabPane>
              <TabPane tabId="preChatForm">
                {activeFirstTab === 'preChatForm' && (
                  <EditPreChatForm
                    editFormData={editFormData}
                    inboxid={match.params.inboxid}
                  />
                )}
              </TabPane>
              <TabPane tabId="configuration">
                {activeFirstTab === 'configuration' && (
                  <EditConfiguration
                    editFormData={editFormData}
                    inboxid={match.params.inboxid}
                  />
                )}
              </TabPane>
            </TabContent>
          )}
        </Colxx>
      </Row>
    </>
  );
};

// export default InboxesNew;
const mapStateToProps = ({ channelsApp }) => {
  const { editFormData, loadedChannel, successUpdate, errorUpdate } =
    channelsApp;
  return {
    formSuccess: successUpdate,
    formError: errorUpdate,
    editFormData,
    loadedChannel,
  };
};
export default connect(mapStateToProps, {
  getChannelAction: getChannel,
  updateChannelCleanAction: updateChannelClean,
  updateInboxCleanAction: updateInboxClean,
})(InboxesNew);
