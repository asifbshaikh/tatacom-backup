import React, { useState, useEffect } from 'react';
import DataTableView from 'containers/contacts/DataTableView';
import { UncontrolledPopover, Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import Pagination from 'containers/pages/Pagination';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import PageSizeDropDown from 'containers/dashboards/campaigns/PageSizeDropDown';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import { getDbConnectionList } from 'redux/s3-sftp/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import DeleteDbConnectionModal from './DeleteDbConnectionModal';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

const DBConnectionListing = ({
  dbConnectionList,
  getDbConnectionListAction,
  pagination,
}) => {
  const [modalOpenDelete, setModalOpenDelete] = useState(false);
  const [reloadList, setReloadList] = useState(0);
  const [editFormData, setEditFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const pageSizes = [10, 15, 20];
  const totalPage = Math.ceil(pagination?.total_count / selectedPageSize);

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const param = {
      pageno: currentPage,
      selectedPageSize,
    };
    getDbConnectionListAction(param);
  }, [currentPage, selectedPageSize, reloadList]);

  useEffect(() => {
    if (currentPage > pagination?.total_pages && pagination?.total_count != 0) {
      handlePageChange(pagination?.total_pages);
    }
  }, [pagination?.total_pages]);

  const tableCols = [
    {
      Header: 'S3SFTP.DB_CONNECTION_LIST.LABEL.CONNECTION_NAME',
      accessor: 'name',
      cellClass: 'text-nowrap data-wrap hover-effect',
      Cell: (props) => (
        <>
          <CustomUncontrolledToolTip
            label={props.value}
            target={`tooltip-name-${props.row.id}`}
          />

          <span id={`tooltip-name-${props.row.id}`}>{props.value}</span>
        </>
      ),
    },
    {
      Header: 'S3SFTP.DB_CONNECTION_LIST.LABEL.DATABASE_NAME',
      accessor: 'database',
    },
    {
      Header: 'S3SFTP.DB_CONNECTION_LIST.LABEL.CREATED_AT',
      accessor: 'created_at',
      Cell: (props) => {
        return moment
          .unix(props.value)
          .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT);
      },
    },
    {
      Header: 'S3SFTP.DB_CONNECTION_LIST.LABEL.ACTION',
      accessor: '',
      Cell: function action(props) {
        return (
          <div>
            <button
              type="button"
              id={`PopOver${props.row.id}`}
              onClick={handleOnClick}
              className="simpleButton"
              aria-label="actionBtn"
              data-testid={`actionBtn${props.row.id}`}
            >
              <i className="simple-icon-options-vertical" />
            </button>
            <UncontrolledPopover
              placement="left-start"
              id="listActionPopOver"
              trigger="legacy"
              target={`PopOver${props.row.id}`}
              data-testid={`popover-edit${props.row.id}`}
            >
              <NavLink
                to={{
                  pathname: `${adminRoot}/settings/db-connection-setup/edit`,
                  state: { from: 'edit', id: props.row.id },
                }}
              >
                <button
                  type="button"
                  className="simpleButton"
                  aria-label="editBtn"
                  data-testid={`editBtn${props.row.id}`}
                >
                  <IntlMessages id="S3SFTP.ALL_IMPORTS.ACTION_BUTTON.EDIT" />
                </button>
              </NavLink>
              <button
                type="button"
                className="simpleButton controlledBtn"
                onClick={() => {
                  setModalOpenDelete(true);
                  setEditFormData(props.row);
                }}
                data-testid={`deleteBtn${props.row.id}`}
              >
                <IntlMessages id="S3SFTP.ALL_IMPORTS.ACTION_BUTTON.DELETE" />
              </button>
            </UncontrolledPopover>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <DeleteDbConnectionModal
        modalOpen={modalOpenDelete}
        toggleModal={() => {
          setModalOpenDelete(!modalOpenDelete);
          setEditFormData({});
        }}
        editFormData={editFormData}
        reloadList={reloadList}
        setReloadList={setReloadList}
      />
      <Row>
        <Colxx xxs="12">
          <PageSizeDropDown
            pageSizes={pageSizes}
            handlePageSizeChange={handlePageSizeChange}
            selectedPageSize={selectedPageSize}
            totalItemCount={pagination?.total_count}
            startIndex={startIndex}
            endIndex={endIndex}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </Colxx>
      </Row>
      <Separator className="mt-2 mb-5" />
      {dbConnectionList && (
        <div>
          <DataTableView
            colxxs="14"
            cols={tableCols}
            items={dbConnectionList}
            key="ReactTblConnectionList"
          />
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => handlePageChange(i)}
      />
    </div>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const { pagination, dbConnectionList } = s3sftpApp;
  return { pagination, dbConnectionList };
};

export default connect(mapStateToProps, {
  getDbConnectionListAction: getDbConnectionList,
})(DBConnectionListing);
