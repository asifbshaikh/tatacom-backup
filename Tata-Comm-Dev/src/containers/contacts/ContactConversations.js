import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CardBody } from 'reactstrap';
import { getTimeFromTimeStamp } from 'helpers/TringReactHelper';
import { NavLink } from 'react-router-dom';
import IntlMessages from 'helpers/IntlMessages';
import { getConversationsContactItem, getInbox } from 'redux/actions';
import { adminRoot } from 'constants/defaultValues';
import IconChannel from 'components/common/IconChannel';

const ContactConversations = ({
  id,
  conversations,
  loaded,
  getConversationsContactItemAction,
  selectedConversation,
  inboxes,
  getInbox,
}) => {
  const [previousConversations, setPreviousConversations] = useState([]);

  const getInboxProperty = (keyToMatch, valToMatch, keyToReturn) => {
    let response = valToMatch;
    if (response && inboxes && inboxes.length) {
      const mainChannelInfo = inboxes.find((u) => u[keyToMatch] === valToMatch);
      response = mainChannelInfo?.[keyToReturn];
    }
    return response;
  };

  useEffect(() => {
    if (selectedConversation && selectedConversation.id) {
      const filteredConversations = conversations?.filter(
        (item) => item.id !== selectedConversation.id
      );
      setPreviousConversations(filteredConversations);
    } else {
      setPreviousConversations(conversations);
    }
  }, [selectedConversation, conversations]);
  if (!loaded) {
    getConversationsContactItemAction({ id });
  }
  useEffect(() => {
    if (id) {
      getConversationsContactItemAction({ id });
    }
  }, [id, selectedConversation?.id]);

  useEffect(() => {
    if (!inboxes || (Array.isArray(inboxes) && inboxes.length === 0)) {
      getInbox();
    }
  }, []);

  return loaded ? (
    <>
      <CardBody className="pt-3">
        {previousConversations?.length === 0 && (
          <div className="text-center p-2">
            <IntlMessages id="contacts.no_previous_conversations" />
          </div>
        )}
        {previousConversations?.map((data) => {
          const metaChannel = data.meta.channel;
          const metaChannelName = getInboxProperty(
            'channel_type',
            metaChannel,
            'name'
          );
          return (
            <div
              key={data.id}
              className="d-flex flex-row mb-3 pb-3 border-bottom w-100"
            >
              <NavLink
                to={`${adminRoot}/inbox/list/conversations/${data.id}`}
                className="d-flex w-100 flex-column"
              >
                <div className="font-weight-light text-muted mb-1 d-flex align-items-center w-100">
                  <span className="w-40 truncate  d-flex align-items-center">
                    <IconChannel
                      channelName={metaChannelName}
                      channelType={data.meta.channel}
                    />
                    {metaChannelName}
                  </span>
                  {data.meta.assignee && (
                    <span className="pl-2 flex-grow-1 text-right text-truncate">
                      <i className="simple-icon-user mr-1" />
                      {data.meta.assignee.name}
                    </span>
                  )}
                </div>
                <div className="font-weight-medium mb-0 d-flex">
                  <div className="emailname-wrap flex-grow-1">
                    {data.meta.sender.name}
                  </div>
                  <div className="flex-grow-1 min-width-zero text-truncate text-right">
                    {getTimeFromTimeStamp(data.messages[0].created_at)}
                  </div>
                </div>

                <div className="text-muted mb-0 mt-1 text-small d-flex min-width-zero">
                  <span className="mr-1">
                    {data?.messages[0]?.message_type === 1 ? (
                      <i className="iconsminds-to-left" />
                    ) : (
                      <i className="simple-icon-info" />
                    )}{' '}
                  </span>
                  <div className="flex-grow-1 text-truncate">
                    {data.messages[0].content}
                  </div>
                </div>
              </NavLink>
            </div>
          );
        })}
      </CardBody>
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({
  contactsApp: { loadedConversations, conversations },
  inboxApp: { inboxes },
}) => {
  return {
    loaded: loadedConversations,
    conversations,
    inboxes,
  };
};
export default connect(mapStateToProps, {
  getConversationsContactItemAction: getConversationsContactItem,
  getInbox: getInbox,
})(ContactConversations);
