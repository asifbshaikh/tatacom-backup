/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse,
} from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from '../navs/Breadcrumb';
import { useDispatch } from 'react-redux';
import { updateNotificationReadStatus } from 'redux/notifications/actions';

const ListPageHeading = ({
  changePageSize,
  selectedPageSize,
  totalItemCount,
  match,
  startIndex,
  endIndex,
  pageSizes,
  heading,
  metaData,
  refreshPageData,
}) => {
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>

          <div className="text-zero top-right-button-container">
            {metaData && metaData.unread_count ? (
              <Button
                color="primary"
                size="lg"
                className="top-right-button"
                onClick={() => {
                  dispatch(
                    updateNotificationReadStatus({
                      markAllDone: true,
                      callBack: () => {
                        refreshPageData();
                      },
                    })
                  );
                }}
              >
                <IntlMessages id="NOTIFICATIONS_PAGE.MARK_ALL_DONE" />
              </Button>
            ) : null}
          </div>
          <Breadcrumb match={match} />
        </div>

        <div className="mb-2">
          <Button
            color="empty"
            className="pt-0 pl-0 d-inline-block d-md-none"
            onClick={() => setDisplayOptionsIsOpen(!displayOptionsIsOpen)}
          >
            <IntlMessages id="pages.display-options" />{' '}
            <i className="simple-icon-arrow-down align-middle" />
          </Button>
          <Collapse
            isOpen={displayOptionsIsOpen}
            className="d-md-block"
            id="displayOptions"
          >
            <div className="float-md-right pt-1">
              <span className="text-muted text-small mr-1">
                <IntlMessages id="pages.viewing" />
                {startIndex + 1}-
                {totalItemCount >= endIndex ? endIndex : totalItemCount}
                {` | `}
                <IntlMessages id="pages.total" />
                {totalItemCount}
              </span>
              <UncontrolledDropdown className="d-inline-block">
                <DropdownToggle caret color="outline-dark" size="xs">
                  {selectedPageSize}
                </DropdownToggle>
                <DropdownMenu right>
                  {pageSizes.map((size, index) => {
                    return (
                      <DropdownItem
                        key={index}
                        onClick={() => changePageSize(size)}
                      >
                        {size}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </Collapse>
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default ListPageHeading;
