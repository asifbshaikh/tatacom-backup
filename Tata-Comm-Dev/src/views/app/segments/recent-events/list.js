import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getRecentEventList } from 'redux/actions';

const RecentEventsHeading = React.lazy(() =>
  import('../../../../containers/segments/recent-events/RecentEventsHeading')
);

const AllRecentEventList = React.lazy(() =>
  import('../../../../containers/segments/recent-events/AllRecentEventList')
);
const RecentEventList = ({ match, pagination, getRecentEvent, eventList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const pageSizes = [10, 15, 20];
  const totalPageCount = Math.ceil(pagination?.total_count / selectedPageSize);
  useEffect(() => {
    getRecentEvent({ currentPage, selectedPageSize });
  }, [selectedPageSize, currentPage]);

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <RecentEventsHeading
        match={match}
        heading="RECENT_EVENTS.HEADING"
        totalItemCount={pagination?.total_count}
        totalPage={totalPageCount}
        pageSizes={pageSizes}
        changePageSize={handlePageSizeChange}
        selectedPageSize={selectedPageSize}
        startIndex={startIndex}
        endIndex={endIndex}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
      <AllRecentEventList
        eventList={eventList}
        currentPage={currentPage}
        totalPage={totalPageCount}
        onChangePage={handlePageChange}
      />
    </>
  );
};

const mapStateToProps = ({ recentEventApp }) => {
  const { eventList, pagination } = recentEventApp;
  return {
    eventList,
    pagination,
  };
};

export default connect(mapStateToProps, {
  getRecentEvent: getRecentEventList,
})(RecentEventList);
