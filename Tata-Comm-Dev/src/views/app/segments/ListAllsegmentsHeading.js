/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Button,
  Collapse,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { adminRoot } from 'constants/defaultValues';

const ListAllsegmentsHeading = ({
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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <>
      <Row className="segmentHeader">
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id={heading} />
            </h1>
            <div className="text-zero top-right-button-container">
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret color="primary addSegmentDropDown ml-5">
                  <i className="simple-icon-plus icon" />{' '}
                  <IntlMessages id="ALL_SEGMENTS.LIST.SEGMENTS" />
                </DropdownToggle>
                <DropdownMenu className="menu">
                  <DropdownItem
                    className="pl-4 text-primary1 active1"
                    tag="a"
                    href={`${adminRoot}/segments/create-segment`}
                  >
                    <i className="simple-icon-people mr-2" />
                    <IntlMessages id="ALL_SEGMENTS.LIST.FILTER_SEGMENT" />
                  </DropdownItem>
                  <DropdownItem
                    className="pl-4 text-primary1 active1"
                    tag="a"
                    href={`${adminRoot}/segments/import-users`}
                  >
                    <i className="simple-icon-cloud-upload mr-2" />
                    <IntlMessages id="ALL_SEGMENTS.LIST.FILE_SEGMENT" />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <div>
                <Button
                  color="empty"
                  className="pt-0 pl-0 d-inline-block d-md-none"
                  onClick={() => setDisplayOptionsIsOpen(!displayOptionsIsOpen)}
                >
                  <IntlMessages id="pages.display-options" />
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
            </div>
            <Breadcrumb match={match} />
          </div>
        </Colxx>
      </Row>
      <Separator className="mb-3" />
    </>
  );
};

export default ListAllsegmentsHeading;
