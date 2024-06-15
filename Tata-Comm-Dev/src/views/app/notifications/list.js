import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import ListPageHeading from 'containers/notifications/ListPageHeading';
import ListPageListing from 'containers/notifications/ListPageListing';
import { getNotificationsList } from 'redux/actions';

const pageSizes = [15];

const DataListPages = ({
  history,
  match,
  loadedNotificationsList,
  notificationsList,
  getNotificationsListAction,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(15);

  const [modalOpen, setModalOpen] = useState(false);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [items, setItems] = useState([]);
  const [metaData, setMetaData] = useState({});

  const fetchNotificationsData = () => {
    const params = { currentPage };
    getNotificationsListAction(params);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize]);

  useEffect(() => {
    fetchNotificationsData();
  }, [selectedPageSize, currentPage]);

  useEffect(() => {
    if (loadedNotificationsList && notificationsList.meta) {
      const { meta, payload } = notificationsList;
      const limit = 15;
      const totalPageCount = Math.ceil(meta.count / limit);
      setTotalPage(totalPageCount);
      setItems(payload);
      setTotalItemCount(meta.count);
      setIsLoaded(true);
      setMetaData(meta);
    }
  }, [notificationsList]);

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return !isLoaded ? (
    <div className="loading" />
  ) : (
    <>
      <div className="disable-text-selection1">
        <ListPageHeading
          heading="NOTIFICATIONS_PAGE.HEADER"
          changePageSize={setSelectedPageSize}
          selectedPageSize={selectedPageSize}
          totalItemCount={totalItemCount}
          match={match}
          startIndex={startIndex}
          endIndex={endIndex}
          itemsLength={items ? items.length : 0}
          pageSizes={pageSizes}
          toggleModal={() => setModalOpen(!modalOpen)}
          metaData={metaData}
          refreshPageData={fetchNotificationsData}
        />
        <ListPageListing
          history={history}
          items={items}
          currentPage={currentPage}
          totalPage={totalPage}
          onChangePage={setCurrentPage}
          setModalOpen={setModalOpen}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ notificationsApp }) => {
  const { loadedNotificationsList, notificationsList } = notificationsApp;
  return {
    loadedNotificationsList,
    notificationsList,
  };
};
export default connect(mapStateToProps, {
  getNotificationsListAction: getNotificationsList,
})(DataListPages);
