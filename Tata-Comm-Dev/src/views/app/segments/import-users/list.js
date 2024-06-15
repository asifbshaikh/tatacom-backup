import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getImportUserFileList, importUserDataClean } from 'redux/actions';
import ListImportUsersHeading from 'containers/segments/import-users/ListImportUsersHeading';
import ListPastImportUsers from 'containers/segments/import-users/ListPastImportUsers';

const ImportUserUploadList = ({
  match,
  loadedImportUserList,
  getImportUserFileListAction,
  importUserDataCleanAction,
  importList,
  totalCount,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const pageSizes = [10, 15, 20, 25];
  const totalPageCount = Math.ceil(totalCount / selectedPageSize);

  useEffect(() => {
    getImportUserFileListAction({ pageno: currentPage, selectedPageSize });
    importUserDataCleanAction();
  }, [currentPage, selectedPageSize]);

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return !loadedImportUserList ? (
    <div className="loading" />
  ) : (
    <>
      <div className="app-row1">
        <ListImportUsersHeading
          heading="menu.import-users"
          match={match}
          totalItemCount={totalCount}
          pageSizes={pageSizes}
          changePageSize={handlePageSizeChange}
          selectedPageSize={selectedPageSize}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>
      <div>
        <ListPastImportUsers
          items={importList}
          currentPage={currentPage}
          totalPage={totalPageCount}
          onChangePage={handlePageChange}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ importusersApp }) => {
  const {
    importusersList: { importList, totalCount },
    loadedImportUserList,
  } = importusersApp;
  return {
    loadedImportUserList,
    importList,
    totalCount,
  };
};
export default connect(mapStateToProps, {
  getImportUserFileListAction: getImportUserFileList,
  importUserDataCleanAction: importUserDataClean,
})(ImportUserUploadList);
