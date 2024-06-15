import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getInbox } from 'redux/actions';
import ListInboxesHeading from 'containers/settings/inboxes/ListInboxesHeading';
import DeleteInboxModal from 'containers/settings/inboxes/DeleteInboxModal';
import { Separator } from 'components/common/CustomBootstrap';
import ListInboxesListing from 'containers/settings/inboxes/ListInboxesListing';
import { getAllInboxes } from 'redux/inbox/actions';

const InboxesList = ({
  match,
  inboxes,
  loadedInboxes,
  getAllInboxesAction,
  inboxTotalCount,
  totalPages,
}) => {
  const [modalOpenDelete, setModalOpenDelete] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const pageSizes = [10, 15, 20];
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const totalPageCount = Math.ceil(inboxTotalCount / selectedPageSize);

  if (!loadedInboxes && !inboxes.length) {
    getAllInboxesAction();
  }

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages && inboxTotalCount != 0) {
      handlePageChange(totalPages);
    }
  }, [totalPages]);

  useEffect(() => {
    getAllInboxesAction({ page: currentPage, selectedPageSize });
  }, [currentPage, selectedPageSize]);

  return !loadedInboxes ? (
    <div className="loading" />
  ) : (
    <>
      <div className="app-row1">
        <ListInboxesHeading
          heading="menu.settings_inboxes_list"
          match={match}
          pageSizes={pageSizes}
          startIndex={startIndex}
          endIndex={endIndex}
          handlePageSizeChange={handlePageSizeChange}
          selectedPageSize={selectedPageSize}
          totalCount={inboxTotalCount}
        />
        <Separator className="mt-2 mb-5" />
        <DeleteInboxModal
          modalOpen={modalOpenDelete}
          toggleModal={() => {
            setModalOpenDelete(!modalOpenDelete);
            setEditFormData({}); // reset edit form
          }}
          editFormData={editFormData}
        />
        <ListInboxesListing
          items={inboxes}
          loadedItems={loadedInboxes}
          setEditFormData={setEditFormData}
          setModalOpenDelete={setModalOpenDelete}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPageCount={totalPageCount}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ inboxApp }) => {
  const { inboxes, loadedInboxes, inboxTotalCount, totalPages } = inboxApp;
  return {
    inboxes,
    loadedInboxes,
    inboxTotalCount,
    totalPages,
  };
};
export default connect(mapStateToProps, {
  getAllInboxesAction: getAllInboxes,
})(InboxesList);
