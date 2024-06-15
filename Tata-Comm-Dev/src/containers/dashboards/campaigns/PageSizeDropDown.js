import React, { useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import {
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse,
} from 'reactstrap';

const PageSizeDropDown = ({
  handlePageSizeChange,
  selectedPageSize,
  totalItemCount,
  startIndex,
  endIndex,
  pageSizes,
  handlePageChange,
  currentPage,
}) => {
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  return (
    <div className="mb-2">
      <Button
        color="empty"
        className="pt-0 pl-0 d-inline-block d-md-none"
        onClick={() => setDisplayOptionsIsOpen(!displayOptionsIsOpen)}
      >
        <IntlMessages id="pages.display-options" />{' '}
        <i className="simple-icon-arrow-down align-middle" />
      </Button>
      <Collapse isOpen className="d-md-block" id="displayOptions">
        <div className="float-md-right pt-1">
          <span className="text-muted text-small mr-1">
            <IntlMessages id="pages.viewing" />
            {totalItemCount === 0 && handlePageChange(currentPage)}
            {totalItemCount === 0 ? totalItemCount : startIndex + 1}-
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
                    key={`${size}_${index.toString()}`}
                    onClick={() => handlePageSizeChange(size)}
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
  );
};

export default PageSizeDropDown;
