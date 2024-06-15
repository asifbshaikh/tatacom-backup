/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Row,
  Button,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import Breadcrumb from 'containers/navs/Breadcrumb';

const ListImportUsersHeading = ({
  match,
  heading,
  changePageSize,
  selectedPageSize,
  totalItemCount,
  startIndex,
  endIndex,
  pageSizes,
}) => {
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <div className="text-zero top-right-button-container">
            <div>
              <NavLink
                className="ml-2 text-primary1 active1"
                to={`${adminRoot}/segments/import-users/upload`}
              >
                <Button color="primary" size="lg" className="top-right-button">
                  <IntlMessages id="menu.import-users" />
                </Button>
              </NavLink>
            </div>
            <Button
              data-testid="import-user-display-option"
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
              {totalItemCount > 0 && (
                <div className="pb-2 pt-3 float-md-right">
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
                            data-testid={`import-user-page-size-${index}`}
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
              )}
            </Collapse>
          </div>
          <Breadcrumb match={match} />
        </div>
        <Separator className="mt-5 mb-5" />
      </Colxx>
    </Row>
  );
};

export default React.memo(ListImportUsersHeading);
