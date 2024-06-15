import React, { useState } from 'react';
import {
  Row,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { adminRoot } from 'constants/defaultValues';
import Breadcrumb from 'containers/navs/Breadcrumb';
import PageSizeDropDown from 'containers/dashboards/campaigns/PageSizeDropDown';

const ListS3SFTPImportsHeading = ({
  match,
  heading,
  pageSizes,
  changePageSize,
  selectedPageSize,
  totalItemCount,
  startIndex,
  endIndex,
  handlePageChange,
  searchValue,
  currentPage,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id={heading} />
            </h1>
            <div className="text-zero top-right-button-container">
              <Dropdown
                data-testid="onDropDownToggle"
                isOpen={dropdownOpen}
                toggle={toggle}
              >
                <DropdownToggle caret color="primary addSegmentDropDown">
                  <i className="simple-icon-plus icon" />{' '}
                  <IntlMessages id="S3SFTP.ALL_IMPORTS.BUTTON.S3SFTP_IMPORT" />
                </DropdownToggle>
                <DropdownMenu className="menu">
                  <DropdownItem
                    className="pl-4 text-primary1 active1"
                    tag="a"
                    href={`${adminRoot}/segments/db-imports/upload/audience`}
                  >
                    <i className="simple-icon-people mr-2" />
                    <IntlMessages id="S3SFTP.ALL_IMPORTS.BUTTON.AUDIENCE" />
                  </DropdownItem>
                  <DropdownItem
                    className="pl-4 text-primary1 active1"
                    tag="a"
                    href={`${adminRoot}/segments/db-imports/upload/event`}
                  >
                    <i className="simple-icon-event mr-2" />
                    <IntlMessages id="S3SFTP.ALL_IMPORTS.BUTTON.EVENT" />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <Breadcrumb match={match} />
          </div>
          <div className="d-inline-block float-md-right mr-1 mb-1 m-2 align-top">
            <PageSizeDropDown
              pageSizes={pageSizes}
              handlePageSizeChange={changePageSize}
              selectedPageSize={selectedPageSize}
              totalItemCount={totalItemCount}
              startIndex={startIndex}
              endIndex={endIndex}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </Colxx>
      </Row>
      <Separator className="mb-3" />
    </>
  );
};

export default React.memo(ListS3SFTPImportsHeading);
