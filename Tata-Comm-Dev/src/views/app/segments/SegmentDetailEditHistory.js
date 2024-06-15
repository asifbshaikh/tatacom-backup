/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Button, Card, CardTitle } from 'reactstrap';
import moment from 'moment';
import DataTableView from 'containers/contacts/DataTableView';
import IntlMessages from 'helpers/IntlMessages';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import { connect } from 'react-redux';
import {
  clearEditSegmentData,
  getViewSegData,
  useThisVersion,
} from 'redux/segmentation/actions';
import { NotificationManager } from 'components/common/react-notifications';

const SegmentDetailEditHistory = ({
  segType,
  revHistoryData,
  segId,
  useThisVersionAction,
  formSuccess,
  formError,
  errorMsg,
  clearEditSegmentDataAction,
  getViewSegDataAction,
}) => {
  const [useThisVersionAlert, setUseThisVersionAlert] = useState(false);

  const fileCol = React.useMemo(
    () => [
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.SEGMENT_REVISED_ON',
        accessor: 'edited_time',
        cellClass: 'list-item-heading',
        Cell: (props) => (
          <>
            {props.value
              ? moment
                  .unix(props.value)
                  .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)
              : ''}
          </>
        ),
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.OPERATION',
        accessor: 'operation',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.STATUS_OF_OPERATION',
        accessor: 'status',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.TOTAL_USERS',
        accessor: 'total_users',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.ADDED_USERS',
        accessor: 'added_users',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.REMOVED_USERS',
        accessor: 'removed_users',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.INVALID_USERS',
        accessor: 'invalid_users',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );

  const handleUseThisVersion = (props) => {
    const params = {
      version_id: props.row.version_id,
      segmentId: segId,
    };
    useThisVersionAction(params);
    setUseThisVersionAlert(true);
  };

  useEffect(() => {
    if (useThisVersionAlert) {
      if (formSuccess) {
        NotificationManager.success(
          <IntlMessages id="ALL_SEGMENTS.EDIT_HISTORY.VERSION_SUCCESS_MESSAGE" />,
          'Success',
          6000,
          null,
          null,
          ''
        );
        getViewSegDataAction({ id: segId });
      }
    }
  }, [formSuccess, useThisVersionAlert]);

  if (formError) {
    if (errorMsg) {
      NotificationManager.error(errorMsg, 'Error', 6000, null, null, '');
      clearEditSegmentDataAction({ formError: false });
    }
  }

  const filterCol = React.useMemo(
    () => [
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.SEGMENT_REVISED_ON',
        accessor: 'edited_time',
        cellClass: 'text-muted w-20',
        // eslint-disable-next-line react/display-name
        Cell: (props) => (
          <>
            {moment
              .unix(props.value)
              .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)}
          </>
        ),
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_TYPE.DESCRIPTION',
        accessor: 'description',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.LIST.ACTION',
        accessor: '',
        cellClass: 'text-muted  w-20',
        headerClassName: 'pl-5',
        Cell: (props) => {
          return (
            <>
              {props.row.version_type === SegmentationEnums.CURRENT_VERSION ? (
                <div className="pl-4">
                  <IntlMessages id="ALL_SEGMENTS.EDIT_HISTORY.CURRENT_VERSION" />
                </div>
              ) : (
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    handleUseThisVersion(props);
                  }}
                >
                  <IntlMessages id="ALL_SEGMENTS.EDIT_HISTORY.USE_THIS_VERSION" />
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
      <Card body>
        <CardTitle tag="h2" className="reachabilityTitle">
          <IntlMessages id="ALL_SEGMENTS.LIST.SEGMENT_REVISION" />
        </CardTitle>

        <div>
          <DataTableView
            colxxs="12"
            cols={segType === SegmentationEnums.FILTER ? filterCol : fileCol}
            items={revHistoryData ?? []}
            key="ReactTblAllSegmentList"
          />
        </div>
      </Card>
    </>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const {
    useThisVersionSuccess,
    useThisVersionError,
    useThisVersionErrorMessage,
  } = segmentationApp;
  return {
    formSuccess: useThisVersionSuccess,
    formError: useThisVersionError,
    errorMsg: useThisVersionErrorMessage,
  };
};

export default connect(mapStateToProps, {
  useThisVersionAction: useThisVersion,
  clearEditSegmentDataAction: clearEditSegmentData,
  getViewSegDataAction: getViewSegData,
})(SegmentDetailEditHistory);
