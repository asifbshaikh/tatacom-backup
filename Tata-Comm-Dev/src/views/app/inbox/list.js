/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import IntlMessages from 'helpers/IntlMessages';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Row, Modal, ModalBody, Card } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import {
  getConversationsNewww,
  loadMessages,
  deleteMessage,
  setConversationsContactList,
} from 'redux/actions';
import InboxApplicationMenu from 'containers/inbox/InboxApplicationMenu';
import InboxChatHeading from 'components/inbox/InboxChatHeading';
import InboxMessageCard from 'components/inbox/InboxMessageCard';
import SendMessage from 'components/inbox/SendMessage';
import InboxFilterMenu from 'containers/inbox/InboxFilterMenu';
import ConversationEnums from 'enums/conversations/conversationEnums';
import ContactDetails from 'containers/contacts/contactDetails';
import {
  fetchConversationStats,
  fetchConversationStatsMeta,
  getCustomAttributes,
  getCustomFilters,
} from 'redux/inbox/actions';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const ChatApp = ({
  match,
  getConversationsNewwwAction,
  setConversationsContactListAction,
  conversationsNewww,
  loadingConversationsNewww,
  loadMessagesAction,
  messages,
  loadingMessages,
  inboxes,
  selectedConversationId,
  noMoreMessages,
  deleteMessageAction,
  getCustomFiltersActions,
  getCustomAttributesAction,
  converstaionFiltersOptions,
  fetchConversationStat,
  fetchConversationStatsAction,
  fetchConversationStatsMetaAction,
  conversationInboxDeactivated,
}) => {
  const [listingFilterLabel, setListingFilterLabel] = useState({
    labels: [ConversationEnums.ALL],
  });
  const [listingFilterAssigneeType, setListingFilterAssigneeType] = useState(
    ConversationEnums.ME
  );
  const [listingFilterStatus, setListingFilterStatus] = useState(
    ConversationEnums.OPEN
  );
  const [listingFilterInbox, setListingFilterInbox] = useState(null);
  const [listingFilterConversationType, setListingFilterConversationType] =
    useState(null);
  const [listingFilterPage, setListingFilterPage] = useState(1);
  const [listingFilter, setListingFilter] = useState({});
  const [showDetails, setShowDetails] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeMsgTab, setActiveMsgTab] = useState(ConversationEnums.REPLY);
  const [textValue, setTextValue] = useState('');
  const [htmlText, setHtmlText] = useState('');
  const [ccEmails, setccEmails] = useState('');
  const [bccEmails, setBccEmails] = useState('');
  const [ccErrMsg, setccErrMsg] = useState('');
  const [bccErrMsg, setBccErrMsg] = useState('');
  const [showBccBtn, setShowBccBtn] = useState(false);
  const [activeFirstTab, setActiveFirstTab] = useState('reply');
  const [showLoad] = useState(false);
  const scrollBarRef = useRef(null);
  const messageBoxRef = useRef(null);
  const params = useParams();
  const chatContainerRef = useRef(null);
  const [chatSectionHeight, setChatSectionHeight] = useState(0);
  const updateChatSectionHeight = () => {
    if (messageBoxRef?.current && chatContainerRef?.current) {
      const calcHeight =
        chatContainerRef.current.clientHeight -
        messageBoxRef.current.clientHeight;
      setChatSectionHeight(calcHeight);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateChatSectionHeight);
    return () => {
      window.removeEventListener('resize', updateChatSectionHeight);
    };
  }, []);
  useEffect(() => {
    // in case of direct hitting the url, get values from url params
    if (match.params.inboxid && match.params.inboxid !== listingFilterInbox) {
      setListingFilterInbox(parseInt(match.params.inboxid, 10)); // convert to int and set inboxId, if url entered manually
    }
    const labelSelected =
      listingFilterLabel && listingFilterLabel.labels
        ? listingFilterLabel.labels.toString()
        : '';
    if (match.params.labelid && match.params.labelid !== labelSelected) {
      setListingFilterLabel({ labels: [match.params.labelid] });
    }
    if (
      match.params.conversationtype &&
      match.params.conversationtype !== listingFilterConversationType
    ) {
      setListingFilterConversationType(match.params.conversationtype);
    }
  }, []);

  useEffect(() => {
    if (conversationInboxDeactivated) {
      setChatSectionHeight(590);
    }
  }, [conversationInboxDeactivated]);

  useEffect(() => {
    if (fetchConversationStat) {
      fetchConversationStatsMetaAction(listingFilter);
    }
    fetchConversationStatsAction(false);
  }, [fetchConversationStat]);

  useEffect(() => {
    document.body.classList.add('no-footer');
    if (Object.keys(listingFilter).length !== 0 && !params?.filterId) {
      getConversationsNewwwAction(listingFilter);
    } else {
      getCustomFiltersActions({
        filter_type: ConversationEnums.IDENTIFIERS.CONVERSATION,
        type: ConversationEnums.IDENTIFIERS.CONVERSATION_ATTRIBUTE,
        converstaionFiltersOptions,
        id: params?.filterId,
      });
    }
    getCustomAttributesAction({
      type: ConversationEnums.IDENTIFIERS.CONVERSATION_ATTRIBUTE,
    });

    return () => {
      document.body.classList.remove('no-footer');
    };
  }, [listingFilter]);

  useEffect(() => {
    setConversationsContactListAction(conversationsNewww);
  }, [conversationsNewww]);

  useEffect(() => {
    const listingFilterObj = {
      page: listingFilterPage,
      assignee_type: listingFilterAssigneeType,
      labels:
        listingFilterLabel.labels.toString() !== ConversationEnums.ALL
          ? listingFilterLabel.labels
          : undefined,
      status: listingFilterStatus,
      inboxId: listingFilterInbox !== null ? listingFilterInbox : undefined,
      conversation_type:
        listingFilterConversationType !== null
          ? listingFilterConversationType
          : undefined,
    };
    setListingFilter(listingFilterObj);
  }, [
    listingFilterPage,
    listingFilterLabel,
    listingFilterAssigneeType,
    listingFilterStatus,
    listingFilterInbox,
    listingFilterConversationType,
  ]);

  const focusScrollBottom = () => {
    setTimeout(() => {
      if (scrollBarRef.current) {
        scrollBarRef.current._ps.element.scrollTop =
          scrollBarRef.current._ps.contentHeight;
      }
    }, 100);
  };

  useEffect(() => {
    // scroll at first time load of inbox only
    if (typeof messages.payload === 'object' && messages.payload.length <= 20) {
      // focusScrollBottom();
    }
  }, [
    // messages,
    selectedConversationId,
  ]);

  const getConversationsProperty = (keyToMatch, valToMatch, keyToReturn) => {
    let response = '';
    if (
      valToMatch &&
      conversationsNewww &&
      conversationsNewww.payload &&
      conversationsNewww.payload.length
    ) {
      const mainItemInfo = conversationsNewww.payload.find(
        (u) => u[keyToMatch] === parseInt(valToMatch, 10)
      );
      response = keyToReturn ? mainItemInfo?.[keyToReturn] : mainItemInfo;
    }
    return response;
  };
  const getInboxProperty = (keyToMatch, valToMatch, keyToReturn) => {
    let response = valToMatch;
    if (response && inboxes && inboxes.length) {
      const mainChannelInfo = inboxes.find((u) => u[keyToMatch] === valToMatch);
      response = mainChannelInfo?.[keyToReturn];
    }
    return response;
  };

  const getInboxNameByConversationId = (conversationId) => {
    const conversationInboxId = getConversationsProperty(
      'id',
      conversationId,
      'inbox_id'
    );
    if (conversationInboxId) {
      const metaChannelName = getInboxProperty(
        'id',
        conversationInboxId,
        'name'
      );
      return metaChannelName;
    }
    return '';
  };

  const handleConversationClick = (
    { id, messages: oneMessage },
    isLoadMore
  ) => {
    // check if we already have that conversations loaded using conversationid
    // if yes than call
    // "https://engage.digo.link/api/v1/accounts/3/conversations/31(conversationid)/messages?before=227"
    // before = messages[0].id
    // and directly load the messages

    // else call "https://engage.digo.link/api/v1/accounts/3/conversations/31{conversationid}" API and than load messages
    let before =
      typeof oneMessage === 'object' &&
      oneMessage[oneMessage.length - 1] &&
      oneMessage[oneMessage.length - 1].id
        ? parseInt(oneMessage[oneMessage.length - 1].id, 10)
        : '';
    if (typeof before === 'number' && before > 0) {
      before += 1; // firt time load, to include self id record also ie last message
    }
    if (!loadingMessages) {
      loadMessagesAction({ id, before, isLoadMore });
    }
  };
  try {
    const conversationid = parseInt(match.params.conversationid, 10);
    if (
      conversationid &&
      !loadingConversationsNewww &&
      !loadingMessages &&
      conversationsNewww &&
      conversationsNewww.payload &&
      selectedConversationId !== conversationid
    ) {
      const desiredConversation = conversationsNewww.payload.find(
        (u) => u.id === conversationid
      );
      if (desiredConversation && desiredConversation.messages) {
        handleConversationClick(desiredConversation);
      } else if (
        JSON.stringify(listingFilter) !== JSON.stringify({ conversationid })
      ) {
        // call conversations api for this id, and this object will be merged in conversations
        setListingFilter({ conversationid });
      }
    }
    if (
      messages &&
      messages.payload &&
      messages.payload.length &&
      conversationid
    ) {
      if (messages.payload.length <= 20) {
        // scroll to bottom at first time loading
        focusScrollBottom();
      }
    }
  } catch (error) {
    console.warn(error);
  }

  return !showLoad ? (
    <>
      <Modal
        isOpen={showModal}
        size="xl"
        centered={true}
        className="send-message-modal"
      >
        <ModalBody>
          {selectedConversationId && (
            <SendMessage
              setActiveMsgTab={setActiveMsgTab}
              showModal={showModal}
              setShowModal={setShowModal}
              selectedConversationId={selectedConversationId}
              textValue={textValue}
              setTextValue={setTextValue}
              htmlText={htmlText}
              setHtmlText={setHtmlText}
              activeFirstTab={activeFirstTab}
              setActiveFirstTab={setActiveFirstTab}
              selectedConversation={getConversationsProperty(
                'id',
                selectedConversationId
              )}
              ccEmails={ccEmails}
              bccEmails={bccEmails}
              setBccEmails={setBccEmails}
              setccEmails={setccEmails}
              setccErrMsg={setccErrMsg}
              setBccErrMsg={setBccErrMsg}
              showBccBtn={showBccBtn}
              ccErrMsg={ccErrMsg}
              bccErrMsg={bccErrMsg}
              setShowBccBtn={setShowBccBtn}
            />
          )}
        </ModalBody>
      </Modal>
      <Row className="rounded">
        <Colxx xxs="2" className="chat-app-nav">
          <InboxFilterMenu
            listingFilter={listingFilterLabel}
            setListingFilter={setListingFilterLabel}
            listingFilterInbox={listingFilterInbox}
            setListingFilterInbox={setListingFilterInbox}
            listingFilterConversationType={listingFilterConversationType}
            setListingFilterConversationType={setListingFilterConversationType}
            setListingFilterPage={setListingFilterPage}
          />
        </Colxx>
        <Colxx xxs="3">
          <InboxApplicationMenu
            listingFilter={listingFilter}
            listingFilterConversationType={listingFilterConversationType}
            listingFilterInbox={listingFilterInbox}
            activeTab={listingFilterAssigneeType}
            toggleAppMenu={setListingFilterAssigneeType}
            listingFilterStatus={listingFilterStatus}
            setListingFilterStatus={setListingFilterStatus}
            handleConversationClick={handleConversationClick}
            setListingFilterPage={setListingFilterPage}
            setListingFilter={setListingFilterLabel}
            listingFilterPage={listingFilterPage}
          />
        </Colxx>
        <Colxx xxs="7" className=" conversation-menu app-menu-custom ">
          {conversationsNewww?.payload?.length > 0 ? (
            <div>
              {messages && messages.meta && (
                <InboxChatHeading
                  meta={messages.meta}
                  showDetails={showDetails}
                  setShowDetails={setShowDetails}
                  metaChannelName={getInboxNameByConversationId(
                    selectedConversationId
                  )}
                  selectedConversation={getConversationsProperty(
                    'id',
                    selectedConversationId
                  )}
                />
              )}
              <section className="d-flex">
                <Colxx
                  xxs={`${showDetails ? '8' : '12'}`}
                  className="chat-app-nav"
                >
                  <div className="custom">
                    {messages && messages.payload && (
                      <div
                        role="button"
                        tabIndex={0}
                        className={`de-contact-options-item-button ${
                          !showDetails ? 'toggle-btn' : ''
                        }`}
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        {showDetails ? (
                          <i className="simple-icon-arrow-right" />
                        ) : (
                          <i className="simple-icon-arrow-left" />
                        )}
                      </div>
                    )}
                    <div
                      className="d-flex flex-column scrollbar-container chat-scroll-container"
                      ref={chatContainerRef}
                    >
                      <div className="flex-grow-1">
                        {messages && messages.payload ? (
                          <div>
                            <PerfectScrollbar
                              style={{
                                height: chatSectionHeight,
                              }}
                              className="chat-scroll-container"
                              ref={scrollBarRef}
                              options={{
                                suppressScrollX: true,
                                wheelPropagation: false,
                              }}
                              onYReachStart={() => {
                                if (!noMoreMessages) {
                                  handleConversationClick(
                                    {
                                      id: selectedConversationId,
                                      messages: messages.payload,
                                    },
                                    true
                                  );
                                }
                              }}
                            >
                              {messages.payload.map((item) => {
                                return (
                                  <InboxMessageCard
                                    key={`message_item${item.id}${item.inbox_id}`}
                                    item={item}
                                    deleteMessageAction={deleteMessageAction}
                                  />
                                );
                              })}
                              {conversationInboxDeactivated && (
                                <Card className="deactivated-inbox-error">
                                  <p className="mb-0 pt-1 pb-1 text-semi-muted text-center">
                                    <IntlMessages id="CONVERSATION.DEACTIVATED_INBOX_MESSAGE" />
                                  </p>
                                </Card>
                              )}
                            </PerfectScrollbar>
                          </div>
                        ) : (
                          <div className="centered-div">
                            <IntlMessages id="CONVERSATION.SELECT_FROM_LEFT_PANEL" />
                          </div>
                        )}
                      </div>

                      <div className="message-box-1" ref={messageBoxRef}>
                        {!conversationInboxDeactivated &&
                          selectedConversationId &&
                          !showModal && (
                            <SendMessage
                              setActiveMsgTab={setActiveMsgTab}
                              showModal={showModal}
                              setShowModal={setShowModal}
                              selectedConversationId={selectedConversationId}
                              textValue={textValue}
                              setTextValue={setTextValue}
                              htmlText={htmlText}
                              setHtmlText={setHtmlText}
                              activeFirstTab={activeFirstTab}
                              setActiveFirstTab={setActiveFirstTab}
                              selectedConversation={getConversationsProperty(
                                'id',
                                selectedConversationId
                              )}
                              ccEmails={ccEmails}
                              bccEmails={bccEmails}
                              setBccEmails={setBccEmails}
                              setccEmails={setccEmails}
                              setccErrMsg={setccErrMsg}
                              setBccErrMsg={setBccErrMsg}
                              showBccBtn={showBccBtn}
                              ccErrMsg={ccErrMsg}
                              bccErrMsg={bccErrMsg}
                              setShowBccBtn={setShowBccBtn}
                              updateChatSectionHeight={updateChatSectionHeight}
                            />
                          )}
                      </div>
                    </div>
                  </div>
                </Colxx>
                {showDetails && messages && messages.payload ? (
                  <Colxx xxs="4" className="chat-app-nav">
                    <ContactDetails
                      showDetails={showDetails}
                      setShowDetails={setShowDetails}
                      selectedConversation={getConversationsProperty(
                        'id',
                        selectedConversationId
                      )}
                      showConversationAction={true}
                      showConversationInformation={true}
                      showContactAttributes={true}
                      showPreviousConversations={true}
                      showToggleButton={false}
                      showGoToLink={true}
                    ></ContactDetails>
                  </Colxx>
                ) : (
                  loadingMessages && <div className="loading" />
                )}
              </section>
            </div>
          ) : (
            <div className="centered-text">
              <IntlMessages id="CONVERSATION.NO_INBOX_CONVERSATION" />
            </div>
          )}
        </Colxx>
      </Row>
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({ inboxApp }) => {
  const {
    conversations: conversationsNewww,
    loadingConversations: loadingConversationsNewww,
    messages,
    loadingMessages,
    selectedConversationId,
    noMoreMessages,
    inboxes,
    converstaionFiltersOptions,
    fetchConversationStat,
    conversationInboxDeactivated,
  } = inboxApp;

  return {
    conversationsNewww,
    loadingConversationsNewww,
    messages,
    messagesCount: messages && messages.payload && messages.payload.length, // so that when count is updated messages refreshes some bug
    loadingMessages,
    selectedConversationId,
    noMoreMessages,
    inboxes,
    converstaionFiltersOptions,
    fetchConversationStat,
    conversationInboxDeactivated,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getConversationsNewwwAction: getConversationsNewww,
    loadMessagesAction: loadMessages,
    deleteMessageAction: deleteMessage,
    getCustomAttributesAction: getCustomAttributes,
    getCustomFiltersActions: getCustomFilters,
    setConversationsContactListAction: setConversationsContactList,
    fetchConversationStatsAction: fetchConversationStats,
    fetchConversationStatsMetaAction: fetchConversationStatsMeta,
  })(ChatApp)
);
