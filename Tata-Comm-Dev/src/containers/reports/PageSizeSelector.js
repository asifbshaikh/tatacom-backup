import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import {
  Button,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

const PageSizeSelector = ({
  handlePageSizeChange,
  selectedPageSize,
  startIndex,
  endIndex,
  pageSizes,
  totalCount,
}) => {
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);

  return (
    <Row>
      <Colxx xxs="12">
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
            <div className="ml-3 pt-1">
              <span className="text-muted text-small mr-1">
                <IntlMessages id="pages.viewing" />
                {startIndex + 1}-
                {totalCount >= endIndex ? endIndex : totalCount}
                {` | `}
                <IntlMessages id="pages.total" />
                {totalCount}
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
      </Colxx>
    </Row>
  );
};

export default PageSizeSelector;
