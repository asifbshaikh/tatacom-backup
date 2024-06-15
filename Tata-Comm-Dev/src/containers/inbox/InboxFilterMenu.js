import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, CardBody, NavItem, Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import LabelsFilter from 'containers/contacts/LabelsFilter';
import IconChannel from 'components/common/IconChannel';

import IntlMessages from 'helpers/IntlMessages';
import {
  applyAdvancedConversationFilters,
  conversationClean,
  getConversationFilters,
  getInbox,
} from 'redux/inbox/actions';
import {
  mapCustomFilters,
  removeEmptyPropertyFilterJson,
} from 'helpers/ConversationFiltersHelper';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getCurrentUserAccount } from 'helpers/Utils';
import CommonEnums from 'enums/commonEnums';

const InboxList = ({ item, active, addFilter }) => {
  return (
    <NavItem className={`mb-1 ${active ? 'active' : ''}`} key={item.id}>
      <NavLink
        to={`${adminRoot}/inbox/list/${item.id}`}
        onClick={() => {
          addFilter('inbox_id', item.id);
        }}
      >
        <IconChannel
          channelName={item.name}
          channelType={item.channel_type}
          phoneNumber={item.phone_number}
        />
        {item.name}
      </NavLink>
    </NavItem>
  );
};

const InboxFilterMenu = ({
  listingFilter,
  setListingFilter,
  listingFilterInbox,
  setListingFilterInbox,
  listingFilterConversationType,
  setListingFilterConversationType,
  inboxes,
  loadedInboxes,
  conversationCleanAction,
  setListingFilterPage,
  folders,
  advancedFiltersConversationFiltersAction,
  converstaionFiltersOptions,
  getConversationFiltersActions,
  getInboxAction,
}) => {
  useEffect(() => {
    getInboxAction();
  }, []);

  const { filterId } = useParams();
  const currentAccountDetails = getCurrentUserAccount();
  const addFilter = (type, val) => {
    const defaultLabels = { labels: 'all' };
    switch (type) {
      case 'labels':
        conversationCleanAction();
        setListingFilter(val);
        setListingFilterConversationType(null);
        setListingFilterInbox(null);
        setListingFilterPage(1);
        break;
      case 'conversation_type':
        conversationCleanAction();
        setListingFilter(defaultLabels);
        setListingFilterConversationType(val);
        setListingFilterInbox(null);
        setListingFilterPage(1);
        break;
      case 'inbox_id':
        conversationCleanAction();
        setListingFilter(defaultLabels);
        setListingFilterConversationType(null);
        setListingFilterInbox(val);
        setListingFilterPage(1);
        break;
      default:
        conversationCleanAction();
        setListingFilter(defaultLabels);
        setListingFilterConversationType(null);
        setListingFilterInbox(null);
        setListingFilterPage(1);
        break;
    }
  };

  const handleAppliedFilter = (value) => {
    const { query, ...rest } = value;
    const converetedJson = mapCustomFilters(
      JSON.parse(JSON.stringify(query.payload)),
      converstaionFiltersOptions
    );
    const data = { filters: [...converetedJson], ...rest };
    getConversationFiltersActions(data);
    const cleanedValues = removeEmptyPropertyFilterJson(query);
    const payload = { filters: [...cleanedValues.payload] };
    advancedFiltersConversationFiltersAction(payload);
  };

  return (
    <Card className="m-0">
      <PerfectScrollbar
        options={{ suppressScrollX: true, wheelPropagation: false }}
      >
        <CardBody
          className="p-3"
          // style={{ height: '385px' }}
          // style={{ minHeight: 'calc(100% - 300px)' }}
        >
          <div className="p-0">
            <ul className="list-unstyled mb-2 nav-effects-custom">
              <NavItem
                className={`mb-1 ${
                  (!listingFilter ||
                    typeof listingFilter.labels !== 'object' ||
                    !listingFilter.labels.length ||
                    listingFilter.labels[0] === 'all') &&
                  !listingFilterInbox &&
                  !listingFilterConversationType
                    ? 'active'
                    : ''
                }`}
              >
                {/* <NavItem className='mb-1'> */}
                <NavLink
                  to={`${adminRoot}/inbox/list`}
                  onClick={() => {
                    // setListingFilterInbox(null)
                    // setListingFilterConversationType(null)
                    addFilter('all', '');
                  }}
                  location={{}}
                >
                  <i className="iconsminds-speach-bubbles mr-1" />
                  <IntlMessages id="inbox.all-conversations" />
                  {/* <span className="float-right">
                                    {loaded && allTodoItems.length}
                                    </span> */}
                </NavLink>
              </NavItem>
              <NavItem
                className={`mb-1 ${
                  listingFilterConversationType === 'mention' ? 'active' : ''
                }`}
              >
                <NavLink
                  to={`${adminRoot}/inbox/list/mention/conversations`}
                  onClick={() => {
                    // setListingFilterInbox(null)
                    addFilter('conversation_type', 'mention');
                    // setListingFilterConversationType('mention')
                  }}
                >
                  <i className="iconsminds-at-sign mr-1" />
                  <IntlMessages id="inbox.all-mentions" />
                  {/* <span className="float-right">
                                    {loaded && allTodoItems.length}
                                    </span> */}
                </NavLink>
              </NavItem>
            </ul>
            {folders.length > 0 && (
              <>
                <p className="text-muted text-small mb-1">
                  <IntlMessages id="FOLDERS.TITLE" />
                </p>
                <ul className="list-unstyled ml-2 mb-1 nav-effects-custom">
                  {folders.map((item) => {
                    return (
                      <NavItem
                        className={`mb-1 ${
                          filterId === item.id.toString() ? 'active' : ''
                        }`}
                        key={item.id}
                      >
                        <NavLink
                          data-testid={`folder_${item.id}`}
                          to={`${adminRoot}/inbox/list/custom_view/${item?.id}`}
                          onClick={() => {
                            handleAppliedFilter(item);
                          }}
                        >
                          {item.name}
                        </NavLink>
                      </NavItem>
                    );
                  })}
                </ul>
              </>
            )}

            <p className="text-muted text-small mb-1">
              <IntlMessages id="todo.categories" />
            </p>
            <ul className="list-unstyled ml-2 mb-1 nav-effects-custom">
              {loadedInboxes &&
                inboxes &&
                inboxes.map((item) => {
                  return (
                    <InboxList
                      item={item}
                      key={item.id}
                      active={listingFilterInbox === item.id}
                      // setListingFilterInbox={setListingFilterInbox}
                      addFilter={addFilter}
                    />
                  );
                })}
            </ul>
            {currentAccountDetails?.role !== CommonEnums.AGENT && (
              <NavLink to={`${adminRoot}/settings/inboxes/new`}>
                <Badge color="primary" pill className="ml-2 mb-1">
                  <i className="iconsminds-add mr-1" />
                  <IntlMessages id="inbox.add-new-inbox-title" />
                </Badge>
              </NavLink>
            )}
            <LabelsFilter
              listingFilter={listingFilter}
              // setListingFilter={setListingFilter}
              setListingFilter={(labels) => {
                addFilter('labels', labels);
              }}
              customLink={({ title }) => {
                if (title === 'all') {
                  return `${adminRoot}/inbox/list`;
                }
                return `${adminRoot}/inbox/list/label/${title}`;
              }}
            />

            <p className="text-muted text-small pb-5" />
          </div>
        </CardBody>
      </PerfectScrollbar>
    </Card>
  );
};

const mapStateToProps = ({ inboxApp }) => {
  const { inboxes, loadedInboxes, folders, converstaionFiltersOptions } =
    inboxApp;

  return {
    inboxes,
    loadedInboxes,
    folders,
    converstaionFiltersOptions,
  };
};
export default connect(mapStateToProps, {
  conversationCleanAction: conversationClean,
  advancedFiltersConversationFiltersAction: applyAdvancedConversationFilters,
  getConversationFiltersActions: getConversationFilters,
  getInboxAction: getInbox,
})(InboxFilterMenu);
