import React, { useEffect, useMemo, useState } from 'react';
import { Row, Card } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import DataTableView from 'containers/contacts/DataTableView';
import { getOverviewDetails } from 'redux/actions';
import { connect } from 'react-redux';
import Thumbnail from 'components/common/Thumbnail';
import { CSAT_RATINGS, getTimeFromTimeStamp } from 'helpers/TringReactHelper';
import { adminRoot } from 'constants/defaultValues';
import { UncontrolledTooltip } from 'reactstrap/lib';
import PageSizeSelector from './PageSizeSelector';
import Pagination from 'containers/pages/Pagination';
import CSATReport from './CSATReport';
import reportsEnums from 'enums/reports/reportsEnums';
import CommonEnums from 'enums/commonEnums';
import IntlMessages from 'helpers/IntlMessages';

const CSATdata = ({
  overview,
  overviewDetails,
  handlePageSizeChange,
  selectedPageSize,
  startIndex,
  endIndex,
  pageSizes,
  totalCount,
  currentPage,
  handlePageChange,
  totalPageCount,
  selectedAgentDetails,
}) => {
  const [overviewDetailsData, setOverviewDetailsData] = useState([]);
  const isNoDataAvailable = overviewDetailsData.length === 0;

  useEffect(() => {
    const isNoAgentSelected =
      !selectedAgentDetails || selectedAgentDetails.length === 0;

    const filteredOverviewDetails = isNoAgentSelected
      ? overviewDetails
      : overviewDetails.filter((data) =>
          selectedAgentDetails.some(
            (agent) => agent.label === data?.assigned_agent?.name
          )
        );

    const mappedOverviewDetailsData = filteredOverviewDetails.map((data) => {
      return {
        name: data?.contact?.name,
        agent_name: data?.assigned_agent?.name,
        rating: data?.rating,
        feedback_message: data?.feedback_message,
        created_at: data?.created_at,
        contact_thumbnail: data?.contact?.thumbnail,
        assigned_agent_thumbnail: data?.assigned_agent?.thumbnail,
        conversation_id: data?.conversation_id,
      };
    });

    setOverviewDetailsData(mappedOverviewDetailsData);
  }, [overviewDetails, selectedAgentDetails]);

  const getRatingEmoji = (rating) => {
    const ratingObject = CSAT_RATINGS.find((item) => item.value === rating);
    return ratingObject ? ratingObject.emoji : '';
  };
  const tableCols = useMemo(
    () => [
      {
        Header: 'CSAT.REPORT_TABLE.CONTACT',
        accessor: 'name',
        Cell: (props) => {
          return (
            <>
              <div className="d-flex flex-row align-items-center pb-1">
                <Thumbnail
                  source={props?.row?.contact_thumbnail}
                  name={props?.row?.name}
                />
                {props?.row?.name}
              </div>
            </>
          );
        },
      },
      {
        Header: 'CSAT.REPORT_TABLE.ASSIGNED_AGENT',
        accessor: 'agent_name',
        Cell: (props) => {
          return (
            <>
              <div className="d-flex flex-row align-items-center pb-1">
                <Thumbnail
                  source={props?.row?.assigned_agent_thumbnail}
                  name={props?.row?.agent_name}
                />
                {props?.row?.agent_name}
              </div>
            </>
          );
        },
      },
      {
        Header: 'CSAT.REPORT_TABLE.RATING',
        accessor: 'rating',
        Cell: (props) => {
          const emoji = getRatingEmoji(props?.row?.rating);
          return (
            <div className="d-flex flex-row pb-1 align-middle">
              {emoji && <span className="text-large mr-1">{emoji}</span>}
            </div>
          );
        },
      },
      {
        Header: 'CSAT.REPORT_TABLE.FEEDBACK_COMMENT',
        accessor: 'feedback_message',
      },
      {
        Header: ' ',
        accessor: 'created_at',
        Cell: (props) => {
          const timestamp = props?.row?.created_at;
          const date = new Date(timestamp * 1000);

          return (
            <div className="text-right">
              <a
                href={`${adminRoot}/inbox/list/conversations/${props?.row?.conversation_id}`}
                className="text-primary no-hover-effect"
              >
                #{props?.row?.conversation_id}
              </a>

              <div className="text-md text-muted">
                <span id="createdOn">
                  {props?.row?.created_at
                    ? getTimeFromTimeStamp(props?.row?.created_at)
                    : ''}
                </span>

                <UncontrolledTooltip placement="top" target="createdOn">
                  <small>
                    {date.toLocaleString(CommonEnums.EN_US, {
                      year: reportsEnums.NUMERIC,
                      month: reportsEnums.SHORT,
                      day: reportsEnums.TWO_DIGIT,
                      hour: reportsEnums.TWO_DIGIT,
                      minute: reportsEnums.TWO_DIGIT,
                    })}
                  </small>
                </UncontrolledTooltip>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <CSATReport overview={overview} />
      <Card className="mt-4">
        {isNoDataAvailable ? (
          <div className="text-center csat-response">
            <p className="text-lg">
              <IntlMessages id="CSAT.REPORT_TABLE.NO_AGENT_RESPONSE" />
            </p>
          </div>
        ) : (
          <>
            <Row>
              <Colxx>
                <div className="scrollable-content">
                  <DataTableView
                    colxxs="14"
                    cols={tableCols}
                    items={overviewDetailsData}
                  />
                </div>
              </Colxx>
            </Row>

            <div className="csat-pagination">
              <Colxx xxs="10">
                <Pagination
                  currentPage={currentPage}
                  totalPage={totalPageCount}
                  onChangePage={(i) => handlePageChange(i)}
                />
              </Colxx>
              <Colxx xxs="2">
                <PageSizeSelector
                  pageSizes={pageSizes}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  handlePageSizeChange={handlePageSizeChange}
                  selectedPageSize={selectedPageSize}
                  totalCount={totalCount}
                ></PageSizeSelector>
              </Colxx>
            </div>
          </>
        )}
      </Card>
    </>
  );
};
const mapStateToProps = ({ reportsApp }) => {
  const { overviewDetails } = reportsApp;
  return {
    overviewDetails,
  };
};

export default connect(mapStateToProps, {
  getOverviewDetailsAction: getOverviewDetails,
})(CSATdata);
