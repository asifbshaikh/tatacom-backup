import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import ListS3SFTPImportsHeading from 'containers/segments/s3-sftp-imports/ListS3SFTPImportsHeading';
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { connect } from 'react-redux';
import { getImportSchedulerList } from 'redux/actions';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import { getImportSchedulerById } from 'redux/s3-sftp/actions';

const AllS3SFTPList = React.lazy(() =>
  import('containers/segments/s3-sftp-imports/AllS3SFTPList')
);

const S3SFTPUploadList = ({
  match,
  pagination,
  importScheduler,
  getImportSchedulerAction,
  getImportSchedulerByIdAction,
  successImportDeleteAdd,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const pageSizes = [10, 15, 20];
  const totalPageCount = Math.ceil(pagination?.total_count / selectedPageSize);

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > pagination?.total_pages && pagination?.total_count != 0) {
      handlePageChange(pagination?.total_pages);
    }
  }, [pagination?.total_pages]);

  const tabs = [
    {
      id: '1',
      type: S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE,
      attribute_model: 'audience_attribute',
      label: <IntlMessages id="S3SFTP.ALL_IMPORTS.TAB.AUDIENCE" />,
      element: (
        <AllS3SFTPList
          item={importScheduler}
          currentPage={currentPage}
          totalPage={totalPageCount}
          onChangePage={handlePageChange}
          getImportSchedulerByIdAction={getImportSchedulerByIdAction}
          type={S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE}
        />
      ),
    },
    {
      id: '2',
      type: S3SFTPImportEnums.IMPORT_TYPE.EVENT,
      attribute_model: 'event_attribute',
      label: <IntlMessages id="S3SFTP.ALL_IMPORTS.TAB.EVENTS" />,
      element: (
        <AllS3SFTPList
          item={importScheduler}
          currentPage={currentPage}
          totalPage={totalPageCount}
          onChangePage={handlePageChange}
          getImportSchedulerByIdAction={getImportSchedulerByIdAction}
          type={S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE}
        />
      ),
    },
  ];

  const tabId = (val) => {
    return tabs.filter((element) => element.type === val)[0];
  };
  const [activeTab, setActiveTab] = useState(tabId.id ?? '1');

  const onClickActiveTabHandle = (id) => {
    let param = {};
    if (id === '1') {
      param = {
        pageno: currentPage,
        selectedPageSize,
        import_type: S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE,
      };
    } else {
      param = {
        pageno: currentPage,
        selectedPageSize,
        import_type: S3SFTPImportEnums.IMPORT_TYPE.EVENT,
      };
    }
    getImportSchedulerAction(param);
    setActiveTab(id);
  };

  useEffect(() => {
    let param = {
      pageno: currentPage,
      selectedPageSize,
      import_type: S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE,
    };
    getImportSchedulerAction(param);
  }, [currentPage, selectedPageSize]);

  useEffect(() => {
    if (successImportDeleteAdd?.message) {
      let param = {
        pageno: currentPage,
        selectedPageSize,
        import_type:
          activeTab === '1'
            ? S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE
            : S3SFTPImportEnums.IMPORT_TYPE.EVENT,
      };
      getImportSchedulerAction(param);
    }
  }, [successImportDeleteAdd]);

  return (
    <>
      <div className="app-row1 channels-config">
        <ListS3SFTPImportsHeading
          heading="menu.db-imports"
          match={match}
          totalItemCount={pagination?.total_count}
          pageSizes={pageSizes}
          changePageSize={handlePageSizeChange}
          selectedPageSize={selectedPageSize}
          startIndex={startIndex}
          endIndex={endIndex}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
        />
        <Row>
          <Colxx xxs="12">
            <Nav tabs className="card-header-tabs mb-2">
              {tabs.map((item) => (
                <NavItem key={item.id}>
                  <NavLink
                    to={`${item.type}`}
                    location={{}}
                    className={`${classNames({
                      active: activeTab === item.id,
                      'nav-link pt-112 pb-012': true,
                    })} `}
                    onClick={() => {
                      onClickActiveTabHandle(item.id);
                    }}
                  >
                    {item.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Colxx>
        </Row>
        <Row>
          <TabContent activeTab={activeTab} className="w-100">
            {tabs.map((item) => {
              return (
                <div key={item.id}>
                  {activeTab === item.id ? (
                    <TabPane tabId={item.id}>{item.element}</TabPane>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </TabContent>
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const { pagination, importScheduler, successImportDeleteAdd } = s3sftpApp;
  return { pagination, importScheduler, successImportDeleteAdd };
};

export default connect(mapStateToProps, {
  getImportSchedulerAction: getImportSchedulerList,
  getImportSchedulerByIdAction: getImportSchedulerById,
})(S3SFTPUploadList);
