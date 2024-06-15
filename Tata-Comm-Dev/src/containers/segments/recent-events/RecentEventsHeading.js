import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { Row } from 'reactstrap';
import PageSizeDropDown from 'containers/dashboards/campaigns/PageSizeDropDown';

const RecentEventsHeading = ({
  match,
  pageSizes,
  changePageSize,
  selectedPageSize,
  totalItemCount,
  startIndex,
  endIndex,
  handlePageChange,
  currentPage,
  heading,
}) => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <Breadcrumb match={match} />
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
        </Colxx>
      </Row>
      <Separator className="mb-3" />
    </>
  );
};

export default RecentEventsHeading;
