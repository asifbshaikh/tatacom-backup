import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Nav, CardHeader, NavItem, Row, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import IntlMessages from 'helpers/IntlMessages';
import ApplicationMenu from 'components/common/ApplicationMenu';
import HTMLReactParser from 'html-react-parser';
import { getTimeFromTimeStamp } from 'helpers/TringReactHelper';
import * as Yup from 'yup';
import {
  changeConversation,
  createConversation,
  getConversationSearchList,
  getConversationSearchListSuccess,
  searchContact,
} from 'redux/actions';
import Thumbnail from 'components/common/Thumbnail';
import IconChannel from 'components/common/IconChannel';
import {
  conversationClean,
  getConversationsNewww,
  messageClean,
} from 'redux/inbox/actions';
import { injectIntl } from 'react-intl';
import SaveAndDeleteModal from './SaveAndDeleteModal';
import ConversationNestedFilterModal from './ConversationNestedFilterModal';
import {
  applyAdvancedConversationFiltersCleanUp,
  deleteCustomFilters,
  getConversationFilters,
  saveAdvancedConversationFilters,
} from 'redux/inbox/actions';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Form, Formik } from 'formik';
import { removeEmptyPropertyFilterJson } from 'helpers/ConversationFiltersHelper';
import ConversationEnums from 'enums/conversations/conversationEnums';
import { UncontrolledTooltip } from 'reactstrap/lib';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { htmlAndConsecutiveRegex } from 'constants/appConstant';
import { getContent } from 'helpers/Utils';

const allTabs = [
  {
    tabMessageId: 'inbox.me',
    tabId: 'me',
    countId: 'mine_count',
  },
  {
    tabMessageId: 'inbox.unassigned',
    tabId: 'unassigned',
    countId: 'unassigned_count',
  },
  {
    tabMessageId: 'inbox.all',
    tabId: 'all',
    countId: 'all_count',
  },
];

const chatListStatus = {
  open: {
    TEXT: 'Open',
  },
  resolved: {
    TEXT: 'Resolved',
  },
  pending: {
    TEXT: 'Pending',
  },
  snoozed: {
    TEXT: 'Snoozed',
  },
  all: {
    TEXT: 'All',
  },
};

const InboxApplicationMenu = ({
  activeTab,
  toggleAppMenu,
  listingFilter,
  listingFilterConversationType,
  listingFilterInbox,
  listingFilterStatus,
  setListingFilterStatus,
  conversations,
  currentUser,
  conversationsNewww,
  inboxes,
  selectedConversationId,
  changeConversationAction,
  createConversationAction,
  searchContactAction,
  handleConversationClick,
  listingFilterPage,
  setListingFilterPage,
  conversationCleanAction,
  converstaionFiltersOptions,
  conversationFilters,
  getConversationFiltersActions,
  saveAdvancedConversationFiltersActions,
  deleteCustomFiltersActions,
  deleteCustomFiltersSuccess,
  deleteCustomFiltersError,
  customFiltersCleanUp,
  savedCustomFilters,
  errorCustomFilter,
  conversationSearchList,
  getConversationSearchListAction,
  getConversationSearchListSuccessAction,
  getConversationsNewwwAction,
  intl,
  loadingConversations,
  messageCleanAction,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage] = useState(1);
  const timeoutHandler = useRef(null);
  const { messages } = intl;
  const { conversationid } = useParams();
  const history = useHistory();

  const isCustomViewRoute = history.location.pathname.includes(
    ConversationEnums.CUSTOM_VIEW
  );

  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deleteFilterModal, setDeleteFilterModal] = useState(false);
  const searchRef = useRef(null);
  const [searchResult, setSearchResult] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResult(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchConversation = (searchQuery) => {
    if (timeoutHandler.current) {
      clearTimeout(timeoutHandler.current);
    }
    timeoutHandler.current = setTimeout(() => {
      if (searchQuery) {
        getConversationSearchListAction({
          searchWord: searchQuery.trim(),
          page: currentPage,
        });
      }
    }, 1000);
  };

  useEffect(() => {
    if (searchValue.length) {
      searchConversation(searchValue);
    } else {
      getConversationSearchListSuccessAction([]);
      customFiltersCleanUp();
    }
  }, [searchValue]);

  const toggleMenu = (tab) => {
    if (activeTab !== tab) {
      toggleAppMenu(tab);
    }
    if (tab === 'messages') {
      // handleSearchContact('');
    }
  };

  useEffect(() => {
    return () => {
      conversationCleanAction();
    };
  }, []);

  const HeaderMenu = () => {
    return allTabs.map((myTab, index) => {
      return (
        <NavItem
          className={`text-center ${index === 1 ? 'w-40' : 'w-30'}`}
          key={myTab.tabId}
        >
          <NavLink
            to="#"
            location={{}}
            className={classnames({
              active: activeTab === myTab.tabId,
              'nav-link': true,
              'custom-style': true,
            })}
            onClick={() => {
              conversationCleanAction();
              setListingFilterPage(1);
              toggleAppMenu(myTab.tabId);
            }}
          >
            <IntlMessages id={myTab.tabMessageId} />
            {conversationsNewww &&
              conversationsNewww.meta &&
              conversationsNewww.meta[myTab.countId] !== 'undefined' && (
                <span> ({conversationsNewww.meta[myTab.countId]})</span>
              )}
          </NavLink>
        </NavItem>
      );
    });
  };
  const listingTab = allTabs.find((tab) => {
    return tab?.tabId === activeTab ? tab.countId : undefined;
  });

  const handleContactClick = (userId) => {
    if (activeTab !== 'messages') {
      toggleAppMenu('messages');
      searchContactAction('');
    }

    const conversation = conversations.find(
      (x) => x.users.includes(currentUser.id) && x.users.includes(userId)
    );
    if (conversation) {
      changeConversationAction(userId);
    } else {
      createConversationAction(currentUser.id, userId, conversations);
      changeConversationAction(userId);
    }
  };
  console.warn(handleContactClick);

  const getInboxProperty = (keyToMatch, valToMatch, keyToReturn) => {
    let response = valToMatch;
    if (response && inboxes && inboxes.length) {
      const mainChannelInfo = inboxes.find((u) => u[keyToMatch] === valToMatch);
      response = mainChannelInfo && mainChannelInfo[keyToReturn];
    }
    return response;
  };

  const toggleSaveModal = (form) => {
    customFiltersCleanUp();
    setSaveFilterModal(!saveFilterModal);
    form.setFieldValue('name', '');
    if (saveFilterModal) {
      history.push(
        `${adminRoot}/inbox/list/custom_view/${conversationFilters?.id}`
      );
    }
  };
  const toggleDeleteModal = () => {
    customFiltersCleanUp();
    setDeleteFilterModal(!deleteFilterModal);
    if (deleteFilterModal) {
      if (conversationFilters?.id) {
        history.push(
          `${adminRoot}/inbox/list/custom_view/${conversationFilters?.id}`
        );
      } else {
        getConversationsNewwwAction({
          assignee_type: ConversationEnums.ME,
          conversation_type: undefined,
          inboxId: undefined,
          labels: undefined,
          page: 1,
          status: ConversationEnums.OPEN,
        });
        history.push(`${adminRoot}/inbox/list`);
      }
    }
  };

  const getHeading = () => {
    if (listingFilterConversationType) {
      return <IntlMessages id="inbox.all-mentions" />;
    }
    if (listingFilterInbox) {
      const metaChannelName = getInboxProperty(
        'id',
        listingFilterInbox,
        'name'
      );
      return metaChannelName;
    }
    if (
      listingFilter &&
      typeof listingFilter.labels === 'object' &&
      listingFilter.labels[0] !== 'all'
    ) {
      return `#${listingFilter.labels[0]}`;
    }
    return <IntlMessages id="inbox.conversation_heading" />;
  };

  const saveFilterSchema = Yup.object().shape({
    name: Yup.string().required(),
  });

  const handleSaveFilter = (values) => {
    const payload = removeEmptyPropertyFilterJson(
      JSON.parse(JSON.stringify(conversationFilters.filters))
    );
    saveAdvancedConversationFiltersActions({ ...values, query: { payload } });
  };

  const handleOnConfirmDeleteBtn = () => {
    deleteCustomFiltersActions({
      id: conversationFilters?.id,
      filter_type: ConversationEnums.IDENTIFIERS.CONVERSATION,
    });
  };

  const renderToolTip = (id, text, placement = 'left') => {
    return (
      <UncontrolledTooltip
        placement={placement}
        target={id}
        popperClassName="border-1"
      >
        <small>
          <IntlMessages id={text} />
        </small>
      </UncontrolledTooltip>
    );
  };

  const renderMessageContent = (content) => {
    let contentWithoutHTMLTags = content
      ?.replace(htmlAndConsecutiveRegex, ' ')
      .trim();
    return contentWithoutHTMLTags;
  };

  return (
    <section className="conversation-menu app-menu-custom custom-converations">
      <ApplicationMenu>
        <CardHeader className="px-0 pb-0">
          {!conversationFilters?.filters?.length > 0 && (
            <Nav tabs className="card-header-tabs custom ml-0 mr-0">
              <HeaderMenu
              // conversationMeta={conversationsNewww ? conversationsNewww.meta : {}} activeTab={activeTab}
              />
            </Nav>
          )}

          <div className="mt-3 search-sm">
            <Input
              type="text"
              name="keyword"
              id="search"
              placeholder={messages['CONVERSATION.SEARCH.PLACEHOLDER']}
              value={searchValue}
              onFocus={() => {
                setSearchResult(true);
              }}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>
          {searchResult ? (
            <div className="search-conversation" ref={searchRef}>
              {searchValue.length ? (
                <div className="height-conversation">
                  {conversationSearchList?.payload?.length ? (
                    <section className="mb-2 font-weight-bold">
                      <IntlMessages id="CONVERSATION.SEARCH.RESULT_TITLE" />
                      {conversationSearchList?.meta?.all_count && (
                        <span className="sub-block-title">
                          {conversationSearchList?.meta?.all_count}
                        </span>
                      )}
                    </section>
                  ) : null}
                  <PerfectScrollbar
                    options={{ suppressScrollX: true, wheelPropagation: false }}
                    className="perfectScrollbar-height"
                  >
                    {conversationSearchList?.payload?.length ? (
                      conversationSearchList?.payload.map((data, index) => (
                        <>
                          <NavLink
                            className="w-100"
                            data-testid={`searchResult_recieved_${index}`}
                            key={index}
                            to={
                              isCustomViewRoute
                                ? `${adminRoot}/inbox/list/custom_view/${conversationFilters?.id}/conversations/${data.id}`
                                : `${adminRoot}/inbox/list/conversations/${data.id}`
                            }
                            location={{}}
                            onClick={() => {
                              setSearchValue('');
                              handleConversationClick(data);
                              setSearchResult(false);
                            }}
                          >
                            <section className="result-header">
                              <div className="conversation-block">
                                <div className="svg-icon"></div>
                                <div className="conversation">
                                  <div className="d-flex">
                                    <div className="sub-block-title font-weight-bold">
                                      {data.contact.name}
                                    </div>
                                  </div>
                                  <div className="inbox-name">
                                    {data.inbox.name}
                                  </div>
                                </div>
                              </div>
                              <div className="timestamp">
                                {getTimeFromTimeStamp(data.created_at)}
                              </div>
                            </section>
                          </NavLink>

                          {data?.messages.map((eachConversation, index) => (
                            <NavLink
                              data-testid={`searchResult_sent_${index}`}
                              className="w-100"
                              key={index}
                              to={
                                isCustomViewRoute
                                  ? `${adminRoot}/inbox/list/custom_view/${conversationFilters?.id}/conversations/${data.id}`
                                  : `${adminRoot}/inbox/list/conversations/${data.id}`
                              }
                              location={{}}
                              onClick={() => {
                                setSearchValue('');
                                handleConversationClick(data);
                                setSearchResult(false);
                              }}
                            >
                              <div className="result-cover-header ml-3">
                                <div className="conversation-block">
                                  <div className="conversation">
                                    <div className="d-flex">
                                      <div className="sub-block-title font-weight-bold">
                                        {eachConversation.sender_name}
                                      </div>
                                    </div>
                                    <pre className="inbox-name">
                                      {renderMessageContent(
                                        eachConversation.content
                                      )}
                                      {getContent(
                                        eachConversation.content,
                                        HTMLReactParser
                                      )}
                                    </pre>
                                  </div>
                                </div>
                                <div className="timestamp">
                                  {getTimeFromTimeStamp(
                                    eachConversation.created_at
                                  )}
                                </div>
                              </div>
                            </NavLink>
                          ))}
                        </>
                      ))
                    ) : (
                      <>
                        <div className="font-weight-bold">
                          {' '}
                          <IntlMessages id="CONVERSATION.SEARCH.RESULT_TITLE" />
                        </div>{' '}
                        <div className="text-center">
                          <IntlMessages id="CONVERSATION.SEARCH.NO_MATCHING_RESULTS" />
                        </div>
                      </>
                    )}
                  </PerfectScrollbar>
                </div>
              ) : (
                <>
                  <div className="font-weight-bold">
                    {' '}
                    <IntlMessages id="CONVERSATION.SEARCH.RESULT_TITLE" />
                  </div>
                </>
              )}
            </div>
          ) : null}
        </CardHeader>
        <div
          className={`d-flex pl-3 pr-2 mt-3 flex-wrap ${
            conversationFilters?.name ||
            conversationFilters?.filters?.length > 0
              ? 'justify-content-between p-2'
              : ''
          }`}
        >
          <div className="pr-2 font-weight-bold">
            {isCustomViewRoute ? conversationFilters?.name : getHeading()}
          </div>
          {conversationFilters?.name && isCustomViewRoute ? (
            <>
              <span
                id="delete_filter"
                data-testid="delete_filter"
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={() => setDeleteFilterModal(true)}
                className="float-right c-pointer"
                style={{ width: '10%' }}
              >
                <i className="pl-2 simple-icon-trash" />
              </span>

              {renderToolTip(
                'delete_filter',
                'CONVERSATION_FILTERS.TOOLTIP.DELETE_FILTER',
                'right'
              )}
            </>
          ) : (
            <div className="float-right">
              {conversationFilters?.filters?.length > 0 ? (
                <>
                  <span
                    id="save_filter"
                    data-testid="save_filter"
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {}}
                    onClick={() => setSaveFilterModal(true)}
                    style={{ width: '10%' }}
                    className="c-pointer"
                  >
                    <i className="pl-2 iconsminds-disk" />
                  </span>

                  {renderToolTip(
                    'save_filter',
                    'CONVERSATION_FILTERS.TOOLTIP.SAVE_FILTER'
                  )}
                  <span
                    id="clear_filters"
                    data-testid="clear_filters"
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {}}
                    onClick={() => {
                      getConversationFiltersActions({ filters: [] });
                      conversationCleanAction();
                      getConversationsNewwwAction({
                        assignee_type: activeTab,
                        conversation_type: undefined,
                        inboxId: undefined,
                        labels: undefined,
                        page: 1,
                        status: listingFilterStatus,
                      });
                      messageCleanAction();
                      history.push(`${adminRoot}/inbox/list/conversations`);
                    }}
                    className="c-pointer"
                    style={{ width: '10%' }}
                  >
                    <i className="pl-2 iconsminds-close" />
                  </span>
                  {renderToolTip(
                    'clear_filters',
                    'CONVERSATION_FILTERS.TOOLTIP.CLEAR_FILTERS',
                    'top'
                  )}
                </>
              ) : (
                <select
                  type="select"
                  onChange={(e) => {
                    conversationCleanAction();
                    setListingFilterStatus(e.target.value);
                    setListingFilterPage(1);
                  }}
                >
                  {Object.keys(chatListStatus).map(function (key) {
                    return (
                      <option
                        value={key}
                        key={`conversationFilterOption_${key}`}
                        selected={listingFilterStatus === key}
                      >
                        {chatListStatus[key].TEXT}
                      </option>
                    );
                  })}
                </select>
              )}
              <span
                id="filter_conversations"
                data-testid="filter_conversations"
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={() => setFilterIsOpen(true)}
                style={{ width: '10%' }}
                className="c-pointer"
              >
                <i className="pl-2 iconsminds-filter-2" />
              </span>

              {renderToolTip(
                'filter_conversations',
                'CONVERSATION_FILTERS.TOOLTIP.FILTER_CONVERSATIONS',
                'right'
              )}
            </div>
          )}
        </div>
        <PerfectScrollbar
          style={{ height: '95%' }}
          options={{ suppressScrollX: true, wheelPropagation: false }}
        >
          <div className="pt-2 pr-3 pl-3 pb-5">
            {conversationsNewww &&
              conversationsNewww?.payload &&
              conversationsNewww?.payload.map((data, index) => {
                if (data.donotshowinlisting) {
                  return false; // do not show, just for single conversation load purpose
                }
                const metaChannel = data.meta?.channel;
                const metaChannelName = getInboxProperty(
                  'channel_type',
                  metaChannel,
                  'name'
                );
                return (
                  <div
                    key={data.id}
                    className={`d-flex flex-row border-bottom pb-2 mb-2 w-100 ${
                      selectedConversationId === data.id
                        ? 'p-1 bg-semi-muted'
                        : ''
                    }`}
                  >
                    <NavLink
                      className="w-100"
                      data-testid={`conversationList_${index}`}
                      to={
                        isCustomViewRoute
                          ? `${adminRoot}/inbox/list/custom_view/${conversationFilters?.id}/conversations/${data.id}`
                          : `${adminRoot}/inbox/list/conversations/${data.id}`
                      }
                      location={{}}
                      onClick={() => {
                        handleConversationClick(data);
                      }}
                    >
                      <div className="d-flex w-100">
                        <Thumbnail
                          source={data.meta.sender.thumbnail}
                          name={
                            data.meta.sender.name
                              ? data.meta.sender.name
                              : data.meta.sender.email
                          }
                        />
                        <div className="flex-grow-1 min-width-zero">
                          <div className="d-flex flex-column w-100">
                            <div className="font-weight-light text-muted mb-1 d-flex w-100">
                              <span className="w-40 truncate">
                                <IconChannel
                                  channelName={metaChannelName}
                                  channelType={data.meta.channel}
                                />
                                {metaChannelName}
                              </span>
                              {data.meta.assignee && (
                                <span className="flex-grow-1 text-truncate text-right">
                                  <i className="simple-icon-user mr-1" />
                                  {data.meta.assignee.name}
                                </span>
                              )}
                            </div>

                            <div
                              className="pr-2"
                              title={
                                data.meta.sender.name ?? data.meta.sender.email
                              }
                            >
                              <div
                                className={`truncate time-wrap ${
                                  conversationid &&
                                  parseInt(conversationid) == data.id
                                    ? 'text-primary'
                                    : ''
                                }`}
                              >
                                <span className="font-weight-bold truncate">
                                  {data.meta.sender.name
                                    ? data.meta.sender.name
                                    : data.meta.sender.email}
                                </span>
                                {data.messages?.length > 0 && (
                                  <span className="float-right custom-message">
                                    {getTimeFromTimeStamp(
                                      data.messages?.[
                                        data?.messages?.length - 1
                                      ]?.created_at
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-semi-muted my-1 text-small">
                              <div className="d-flex">
                                <span className="mr-1">
                                  {data?.messages?.[data?.messages?.length - 1]
                                    ?.message_type === 1 ? (
                                    <i className="iconsminds-to-left" />
                                  ) : (
                                    <i className="simple-icon-info" />
                                  )}
                                </span>{' '}
                                <div className="flex-grow-1 text-truncate">
                                  {data?.messages?.length > 0 &&
                                    (renderMessageContent(
                                      data?.messages?.[
                                        data?.messages?.length - 1
                                      ]?.content
                                    ),
                                    getContent(
                                      data?.messages?.[
                                        data?.messages?.length - 1
                                      ]?.content,
                                      HTMLReactParser
                                    ))}
                                </div>
                                {data.unread_count > 0 && (
                                  <span className="messages-unread-count">
                                    {data.unread_count}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                );
              })}
            {loadingConversations ? (
              <div className="text-center">
                <div className="conversation-loader" />
              </div>
            ) : (
              <>
                {conversationsNewww?.payload?.length > 0 ? (
                  <div>
                    {conversationsNewww?.payload?.length <
                    conversationsNewww?.meta?.[listingTab.countId] ? (
                      <span
                        className="d-flex justify-content-center create-event"
                        role="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setListingFilterPage(listingFilterPage + 1);
                        }}
                        tabIndex="0"
                      >
                        {conversationsNewww?.payload?.length <
                          conversationsNewww?.meta?.[listingTab.countId] && (
                          <IntlMessages id="CONVERSATION.LOAD_CONVERSATION" />
                        )}
                      </span>
                    ) : (
                      <span className="d-flex justify-content-center disable">
                        <IntlMessages id="CONVERSATION.LOAD_CONVERSATION_SUCCESS" />
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="d-flex justify-content-center">
                    <IntlMessages id="CONVERSATION.NO_ACTIVE_CONVERSATION" />
                  </span>
                )}
              </>
            )}
          </div>
        </PerfectScrollbar>
        <Formik
          validateOnMount
          validateOnBlur
          validateOnChange
          onSubmit={handleSaveFilter}
          initialValues={{ name: '', filter_type: 0 }}
          validationSchema={saveFilterSchema}
        >
          {(form) => (
            <SaveAndDeleteModal
              filterIsOpen={saveFilterModal}
              header={
                <IntlMessages id="CONVERSATION_FILTERS.HEADERS.SAVE_FILTER" />
              }
              disableLeftBtn={!form.isValid}
              inputToggle={() => toggleSaveModal(form)}
              leftHandleOnClick={form.handleSubmit}
              rightHandleOnClick={() => toggleSaveModal(form)}
              formSuccess={savedCustomFilters}
              formError={errorCustomFilter}
              successMsg={
                'CONVERSATION_FILTERS.MESSAGES.FOLDER_CREATED_SUCCESS'
              }
            >
              <Form>
                <FormGroupCoustom
                  dataTestId="converstionFilterName"
                  identifierLabel={
                    'CONVERSATION_FILTERS.LABELS.NAME_THIS_FILTER'
                  }
                  placeholder={
                    'CONVERSATION_FILTERS.LABELS.ENTER_A_NAME_FOR_THIS_FILTER'
                  }
                  identifier={'name'}
                  errors={form.errors}
                  touched={form.touched}
                />
              </Form>
            </SaveAndDeleteModal>
          )}
        </Formik>
        <SaveAndDeleteModal
          filterIsOpen={deleteFilterModal}
          header={
            <IntlMessages id="CONVERSATION_FILTERS.HEADERS.CONFIRM_DELETION" />
          }
          inputToggle={toggleDeleteModal}
          leftHandleOnClick={handleOnConfirmDeleteBtn}
          leftBtnLabel={'CONVERSATION_FILTERS.BUTTONS.YES_DELETE'}
          rightHandleOnClick={toggleDeleteModal}
          rightBtnLabel={'CONVERSATION_FILTERS.BUTTONS.NO_KEEP_IT'}
          formSuccess={deleteCustomFiltersSuccess}
          formError={deleteCustomFiltersError}
          successMsg={'CONVERSATION_FILTERS.MESSAGES.FOLDER_DELETED_SUCCESS'}
        >
          <div className="d-flex align-items center">
            <IntlMessages
              id={'CONVERSATION_FILTERS.LABELS.DELETE_MODAL_LABEL'}
            />
            <span className="ml-1">
              <strong>{conversationFilters?.name}</strong> ?
            </span>
          </div>
        </SaveAndDeleteModal>
      </ApplicationMenu>

      {filterIsOpen && (
        <>
          <Row noGutters>
            <ConversationNestedFilterModal
              filterIsOpen={filterIsOpen}
              setFilterIsOpen={setFilterIsOpen}
              converstaionFiltersOptions={converstaionFiltersOptions}
            />
          </Row>
        </>
      )}
    </section>
  );
};

const mapStateToProps = ({ chatApp, inboxApp, contactsApp }) => {
  const { contacts, allContacts, conversations, loadingContacts, currentUser } =
    chatApp;

  const {
    conversations: conversationsNewww,
    loadingConversations,
    inboxes,
    selectedConversationId,
    converstaionFiltersOptions,
    conversationFilters,
    deleteCustomFiltersSuccess,
    deleteCustomFiltersError,
    savedCustomFilters,
    errorCustomFilter,
  } = inboxApp;

  const { conversationSearchList } = contactsApp;
  return {
    contacts,
    allContacts,
    conversations,
    loadingConversations,
    loadingContacts,
    currentUser,
    deleteCustomFiltersSuccess,
    deleteCustomFiltersError,
    conversationsNewww,
    inboxes,
    selectedConversationId,
    converstaionFiltersOptions,
    conversationFilters,
    savedCustomFilters,
    errorCustomFilter,
    conversationSearchList,
  };
};
export default connect(mapStateToProps, {
  changeConversationAction: changeConversation,
  createConversationAction: createConversation,
  searchContactAction: searchContact,
  conversationCleanAction: conversationClean,
  getConversationFiltersActions: getConversationFilters,
  saveAdvancedConversationFiltersActions: saveAdvancedConversationFilters,
  deleteCustomFiltersActions: deleteCustomFilters,
  customFiltersCleanUp: applyAdvancedConversationFiltersCleanUp,
  getConversationSearchListAction: getConversationSearchList,
  getConversationSearchListSuccessAction: getConversationSearchListSuccess,
  getConversationsNewwwAction: getConversationsNewww,
  messageCleanAction: messageClean,
})(injectIntl(InboxApplicationMenu));
