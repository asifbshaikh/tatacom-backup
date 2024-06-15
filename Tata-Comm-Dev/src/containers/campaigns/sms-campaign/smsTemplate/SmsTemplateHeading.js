/* eslint-disable react/no-array-index-key */
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import {
  Button,
  Row,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse,
  Input,
} from 'reactstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';

const SmsTemplateHeading = ({
  match,
  heading,
  toggleModal,
  changePageSize,
  selectedPageSize,
  totalItemCount,
  startIndex,
  endIndex,
  pageSizes,
  onSearchKey,
  searchValue,
  setSearchValue,
}) => {
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  return (
    <>
      <Row className="mb-2">
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id={heading} />
            </h1>

            <div className="text-zero top-right-button-container">
              <Button
                color="primary"
                size="lg"
                className="top-right-button"
                onClick={() => toggleModal()}
              >
                <IntlMessages id="SMS_TEMPLATE.CREATE.BUTTON_LABEL" />
              </Button>
            </div>
            <Breadcrumb match={match} />
          </div>

          <div className="search-sm d-inline-block float-md-left mr-1 mb-1 m-2 align-top">
            <Input
              type="text"
              name="keyword"
              id="search"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearchKey(e.target.value);
              }}
              onClick={() => {
                setSearchValue('');
                onSearchKey('');
              }}
            />
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
        </Colxx>
      </Row>
      <Separator className="mb-5" />
    </>
  );
};

export default SmsTemplateHeading;
