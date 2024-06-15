/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  Row,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse,
} from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { getUserReports } from 'redux/actions';
import { getSearchUserReports } from 'redux/reports/actions';
import { connect } from 'react-redux';
import UserReportList from './UserReportList';

const UserReportsHeading = ({
  match,
  headingLabel,
  getAllUserReports,
  getAllSearchUserReports,
  allUsersReport,
  totalCount,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const pageSizes = [10, 15];
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const totalPageCount = Math.ceil(totalCount / selectedPageSize);
  const timeoutHandler = useRef(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };

  const searchUserReport = (searchQuery) => {
    if (timeoutHandler.current) {
      clearTimeout(timeoutHandler.current);
    }
    timeoutHandler.current = setTimeout(() => {
      if (searchQuery) {
        getAllSearchUserReports({
          searchWord: searchQuery.trim(),
          page: currentPage,
          selectedPageSize,
        });
      } else {
        getAllUserReports({ page: currentPage, selectedPageSize });
      }
    }, 1000);
  };
  useEffect(() => {
    if (searchValue) {
      searchUserReport(searchValue);
    } else {
      getAllUserReports({ page: currentPage, selectedPageSize });
    }
  }, [currentPage, selectedPageSize]);

  const handleUpdateUserReport = () => {
    getAllUserReports({ page: currentPage, selectedPageSize });
  };

  return (
    <>
      <Row className="mb-2">
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id={headingLabel} />
            </h1>
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
                searchUserReport(e.target.value);
              }}
              onClick={() => {
                setSearchValue('');
                searchUserReport('');
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
      <Separator className="mb-2" />
      <UserReportList
        allUsersReport={allUsersReport}
        onChangePage={handlePageChange}
        currentPage={currentPage}
        totalPage={totalPageCount}
        handleUpdateUserReport={handleUpdateUserReport}
      />
    </>
  );
};

const mapStateToProps = ({ reportsApp }) => {
  const {
    loadedUserReports,
    userReportsList: { allUsersReport, totalCount },
  } = reportsApp;
  return { loadedUserReports, allUsersReport, totalCount };
};

export default connect(mapStateToProps, {
  getAllUserReports: getUserReports,
  getAllSearchUserReports: getSearchUserReports,
})(UserReportsHeading);
