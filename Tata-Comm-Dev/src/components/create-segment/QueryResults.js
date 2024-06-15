import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import IntlMessages from 'helpers/IntlMessages';
import { Table, Button, UncontrolledPopover, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import {
  getQueryList,
  reRunQuery,
  viewQueryDetails,
} from 'redux/segmentation/actions';
import { adminRoot } from 'constants/defaultValues';
import { NotificationManager } from 'components/common/react-notifications';
import SetAlertQueryCompletion from 'views/app/segments/create-segment/widgets/SetAlertQueryCompletion';
import ExportUserPopOver from 'views/app/segments/create-segment/widgets/ExportUserPopOver';
import moment from 'moment';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';
import { FULL_DATE_TIME_FORMAT } from 'constants/appConstant';
import QueryDetails from './QueryDetails';

const ExpandableTable = ({
  listQueryResult,
  getQueryResult,
  loadedSegmentation,
  reRunAction,
  viewQueryDetailsAction,
  reRunDone,
}) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState();
  const [segmentFilterId, setSegmentFilterId] = useState(0);
  const [showExport, setShowExport] = useState(false);

  const history = useHistory();
  const toggleExpandedRow = (rowId) => {
    setExpandedRowId([]);
    const isExpanded = expandedRows.includes(rowId);
    const newExpandedRows = isExpanded
      ? expandedRows.filter((id) => id !== rowId)
      : [rowId];
    setExpandedRows(newExpandedRows);
    setExpandedRowId(rowId);
  };
  const [openActionMenu, setOpenActionMenu] = useState(false);
  useEffect(() => {
    getQueryResult();
  }, []);
  const handleAction = () => {
    setOpenActionMenu(!openActionMenu);
  };
  const reRun = (id) => {
    reRunAction(id);
  };
  if (reRunDone) {
    const successMsg = 'ALL_SEGMENTS.API_SUCCESS_MESSAGE.SEGMEMT_RERUN_SUCCESS';
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
  }
  const createSegment = (id) => {
    history.push(`${adminRoot}/campaigns/create-campaign?queryId=${id}`);
  };

  const setQueryRunAlert = (id) => {
    setShowAlert(true);
    setSelectedQueryId(id);
  };
  const exportSegmentUser = (id) => {
    setSegmentFilterId(id);
    setShowExport(true);
  };

  return (
    <>
      <div>
        <h2 className="query-results">
          <b>
            <IntlMessages id="CREATE_SEGMENT.QUERY_RESULTS" />
          </b>
        </h2>
        <Table>
          <thead>
            <tr>
              <th />
              <th>
                <IntlMessages id="CREATE_SEGMENT.TABLE.QUERY_TIME" />
              </th>
              <th>
                <IntlMessages id="CREATE_SEGMENT.TABLE.DESCRIPTION" />
              </th>
              <th>
                <IntlMessages id="CREATE_SEGMENT.TABLE.SOURCE" />
              </th>
              <th>
                <IntlMessages id="CREATE_SEGMENT.TABLE.USER_COUNT" />
              </th>
              <th>
                <IntlMessages id="CREATE_SEGMENT.TABLE.REACHABLE_USER" />
              </th>
              <th>
                <IntlMessages id="CREATE_SEGMENT.TABLE.ACTION" />
              </th>
            </tr>
          </thead>

          <tbody>
            {listQueryResult?.length ? (
              listQueryResult.map((row) => (
                <React.Fragment key={row.id}>
                  <tr>
                    <td>
                      {row?.sample_users?.length > 0 && (
                        <Button
                          data-testid={`expandBtn_${row.id}`}
                          onClick={() => toggleExpandedRow(row.id)}
                          className="BsChevron-button"
                        >
                          {expandedRows.includes(row.id) ? (
                            <i className="simple-icon-arrow-down" />
                          ) : (
                            <i className="simple-icon-arrow-right" />
                          )}
                        </Button>
                      )}
                    </td>
                    <td>
                      {moment(row.created_at * 1000).format(
                        FULL_DATE_TIME_FORMAT
                      )}
                    </td>
                    <td>{row.description}</td>
                    <td>{row.source}</td>
                    <td>{row?.users_count}</td>
                    {row?.status === SegmentationEnums.DRAFT ? (
                      <td>
                        <Spinner className="query-result-loader"></Spinner>
                      </td>
                    ) : (
                      <td>{row?.reachable_users?.reachable_users_count}</td>
                    )}

                    <td>
                      <button
                        data-testid={row?.id}
                        id={`_${row?.id}`}
                        type="button"
                        className="simpleButton"
                        onClick={handleAction}
                      >
                        <i className="simple-icon-options-vertical mr-2" />
                      </button>
                      {row.status === SegmentationEnums.DRAFT && (
                        <button
                          type="button"
                          data-testid={`draft_${row.id}`}
                          className="simpleButton"
                          onClick={() => setQueryRunAlert(row.id)}
                        >
                          <i className="iconsminds-envelope mr-2" />
                        </button>
                      )}
                      <UncontrolledPopover
                        placement="left-start"
                        target={`_${row.id}`}
                        trigger="focus"
                        id="listActionPopOver"
                      >
                        <button
                          type="button"
                          className="simpleButton"
                          data-testid={`view_${row.id}`}
                          disabled={row?.sample_users?.length < 1}
                          onClick={() => {
                            toggleExpandedRow(row.id);
                            viewQueryDetailsAction(row.id);
                          }}
                        >
                          <IntlMessages id="CREATE_SEGMENT.TABLE_ACTION.VIEW" />
                        </button>
                        <button
                          type="button"
                          data-testid={`export_users_${row.id}`}
                          className="simpleButton"
                          onClick={() => {
                            exportSegmentUser(row?.id);
                          }}
                        >
                          <IntlMessages id="ALL_SEGMENTS.LIST.EXPORT_USERS" />
                        </button>
                        <button
                          type="button"
                          data-testid={`reRun_${row.id}`}
                          className="simpleButton"
                          onClick={() => {
                            reRun(row.id);
                          }}
                        >
                          <IntlMessages id="CREATE_SEGMENT.TABLE_ACTION.RERUN" />
                        </button>
                      </UncontrolledPopover>
                    </td>
                  </tr>
                  {expandedRows.includes(row.id) && (
                    <tr>
                      <td colSpan={12}>
                        <QueryDetails expandedRowId={expandedRowId} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={12}>
                  {loadedSegmentation ? (
                    <span className="segmentationLoading loading" />
                  ) : (
                    'No Data to Show'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {showExport && (
          <ExportUserPopOver
            showExport={showExport}
            segmentFilterId={segmentFilterId}
            setShowExport={setShowExport}
          />
        )}
        {showAlert && (
          <SetAlertQueryCompletion
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            queryId={selectedQueryId}
          />
        )}
      </div>
    </>
  );
};
const mapStateToProps = ({ segmentationApp }) => {
  const { listQueryResult, loadedSegmentation, successReRun } = segmentationApp;
  return { listQueryResult, loadedSegmentation, reRunDone: successReRun };
};
export default connect(mapStateToProps, {
  getQueryResult: getQueryList,
  reRunAction: reRunQuery,
  viewQueryDetailsAction: viewQueryDetails,
})(ExpandableTable);
