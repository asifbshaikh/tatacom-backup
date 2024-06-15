/* eslint-disable react/no-array-index-key */
import { COMMA_SEPERATED_FULL_DATE_TIME_FORMAT } from 'constants/appConstant';
import DataTableView from 'containers/contacts/DataTableView';
import { Colxx } from 'components/common/CustomBootstrap';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Row } from 'reactstrap';
import Pagination from 'containers/pages/Pagination';
import { downloadUserReport, updateUserReport } from 'redux/reports/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import IntlMessages from 'helpers/IntlMessages';
import reportsEnums from 'enums/reports/reportsEnums';

const UserReportList = ({
  onChangePage,
  allUsersReport,
  currentPage,
  totalPage,
  updateUsersReport,
  handleUpdateUserReport,
  formSuccess,
  downloadUserReportAction,
  downloadURL,
}) => {
  const [showRerunQueryAlert, setShowRerunQueryAlert] = useState(false);
  const [downloadFile, setDownloadFile] = useState(false);

  const handleDownload = (row) => {
    downloadUserReportAction(row);
    setDownloadFile(true);
  };

  useEffect(() => {
    if (downloadFile) {
      if (downloadURL) {
        const link = document.createElement('a');
        link.href = downloadURL;
        link.click();
      }
    }
  }, [downloadURL, downloadFile]);

  const handleRerunQuery = (row) => {
    updateUsersReport(row);
    setShowRerunQueryAlert(true);
  };

  useEffect(() => {
    if (showRerunQueryAlert) {
      if (formSuccess) {
        NotificationManager.success(
          <IntlMessages id="USER_REPORTS.UPDATE_QUERY_ALERT" />,
          'Success',
          6000,
          null,
          null,
          ''
        );
        handleUpdateUserReport();
      }
    }
  }, [formSuccess, showRerunQueryAlert]);

  const tableCols = useMemo(
    () => [
      {
        Header: 'USER_REPORTS.COLUMN_NAMES.UPDATED_TIME',
        accessor: 'updated_at',
        Cell: (props) => {
          return moment(props.value).format(
            COMMA_SEPERATED_FULL_DATE_TIME_FORMAT
          );
        },
      },
      {
        Header: 'USER_REPORTS.COLUMN_NAMES.FILE_NAME',
        accessor: 'file_name',
      },
      {
        Header: 'USER_REPORTS.COLUMN_NAMES.DESCRIPTION',
        accessor: 'description',
      },
      {
        Header: 'USER_REPORTS.COLUMN_NAMES.STATUS',
        accessor: 'status',
        Cell: (props) => {
          if (props.value === reportsEnums.IN_PROCESS) {
            return reportsEnums.IN_PROCESS_LABEL;
          }
          return props.value.charAt(0).toUpperCase() + props.value.slice(1);
        },
      },
      {
        Header: 'USER_REPORTS.COLUMN_NAMES.ACTION',
        accessor: '',

        Cell: function OrderItems({ row }) {
          return (
            <>
              <Button
                color="theme-3"
                className="icon-button ml-1 edit-button"
                onClick={() => {
                  handleRerunQuery(row);
                }}
              >
                <i className="simple-icon-refresh" />
              </Button>
              {row.status === reportsEnums.FINISHED && (
                <Button
                  color="theme-3"
                  className="icon-button ml-1 edit-button"
                  onClick={() => {
                    handleDownload(row);
                  }}
                >
                  <i className="simple-icon-cloud-download" />
                </Button>
              )}
            </>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <Row>
        <DataTableView
          colxxs="12"
          cols={tableCols}
          items={allUsersReport}
          key="ReactTblUserReportList"
        />
      </Row>
      <Row>
        <Colxx xxs="12">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={(i) => onChangePage(i)}
          />
        </Colxx>
      </Row>
    </>
  );
};

const mapStateToProps = ({ reportsApp }) => {
  const { successAdd, errorAdd, loadingAdd, downloadURL } = reportsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    downloadURL,
  };
};

export default connect(mapStateToProps, {
  updateUsersReport: updateUserReport,
  downloadUserReportAction: downloadUserReport,
})(UserReportList);
