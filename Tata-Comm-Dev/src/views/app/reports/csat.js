import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getCsat, getCsatDetails, getAgents } from 'redux/actions';
import OverviewHeading from 'containers/reports/OverviewHeading';

import { injectIntl } from 'react-intl';
import CSATdata from 'containers/reports/CSATdata';
import reportsEnums from 'enums/reports/reportsEnums';
import { dateFilterOptions } from 'data/reports/ReportContants';

const type = 'csat';
const headingLabel = 'CSAT_REPORTS.HEADER';

const OverviewList = ({
  match,
  overview,
  overviewLoading,
  overviewDetails,
  overviewDetailsLoading,
  getCsatAction,
  getCsatDetailsAction,
  intl,
  agents,
  loadedAgents,
  getAgentsAction,
  csatTotalCount,
  totalPages,
  since,
  until,
}) => {
  const { messages: messagesIntl } = intl;
  const [customDateSelected, setCustomDateSelected] = useState(false);
  const [customDateRange, setCustomDateRange] = useState([]);
  const [activeFirstTab, setActiveFirstTab] = useState(null);
  const [fromDate, setFromDate] = useState(since);
  const [toDate, setToDate] = useState(until);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedDateOption, setSelectedDateOption] = useState({
    value: dateFilterOptions[0].id,
    label: dateFilterOptions[0].label,
  });
  const [groupByFilterVal, setGroupByFilterVal] = useState(1);
  const [agentFilter, setAgentFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const pageSizes = [10, 15, 20];
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const totalPageCount = Math.ceil(csatTotalCount / selectedPageSize);
  const reportObj = {};
  useEffect(() => {
    if (!loadedAgents) {
      getAgentsAction();
    }
  }, []);

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages && csatTotalCount != 0) {
      handlePageChange(totalPages);
    }
  }, [totalPages]);

  useEffect(() => {
    if (customDateSelected && customDateRange[0] && customDateRange[1]) {
      reportObj.since = customDateRange[0];
      reportObj.until = customDateRange[1];
    } else {
      reportObj.since = fromDate;
      reportObj.until = toDate;
    }
    if (agentFilter && typeof agentFilter === 'object' && agentFilter.length) {
      reportObj.user_ids = agentFilter.map((item) => item.value);
    }
    if (reportObj.since && reportObj.until) {
      getCsatAction(reportObj);
      getCsatDetailsAction({
        ...reportObj,
        page: currentPage,
        per_page: selectedPageSize,
        sort: '-created_at',
      });
    }
  }, [
    activeFirstTab,
    fromDate,
    toDate,
    groupByFilterVal,
    agentFilter,
    currentPage,
    selectedPageSize,
    customDateRange,
  ]);

  const reportKeys = {
    CONVERSATIONS: 'conversations_count',
    INCOMING_MESSAGES: 'incoming_messages_count',
    OUTGOING_MESSAGES: 'outgoing_messages_count',
    FIRST_RESPONSE_TIME: 'avg_first_response_time',
    RESOLUTION_TIME: 'avg_resolution_time',
    RESOLUTION_COUNT: 'resolutions_count',
  };
  if (type === 'agent') {
    delete reportKeys.INCOMING_MESSAGES;
  }
  const reportKeysUpdated = Object.keys(reportKeys).map((label) => ({
    NAME: messagesIntl[`REPORT.METRICS.${label}.NAME`],
    KEY: reportKeys[label],
    DESC: messagesIntl[`REPORT.METRICS.${label}.DESC`],
    INDEX: label,
  }));
  if (activeFirstTab === null) {
    setActiveFirstTab(reportKeysUpdated[0]);
  }

  let data = [];
  if (!overviewDetailsLoading) {
    data = overviewDetails.filter(
      (el) => toDate - el.timestamp > 0 && el.timestamp - fromDate >= 0
    );
    if (
      activeFirstTab &&
      (activeFirstTab.KEY === reportsEnums.AVG_FIRST_RESPONSE_TIME ||
        activeFirstTab.KEY === reportsEnums.AVG_RESOLUTION_TIME)
    ) {
      data = data.map((element) => {
        element.value = (element.value / 3600).toFixed(2);
        return element;
      });
    }
  }
  const selectedGroupByFilter = (value) => {
    setGroupByFilterVal(parseInt(value, 10));
  };
  const filterItemsList = [];
  const onDateRangeChange = () => {
    // setFromDate(getFromDate());
    // setToDate(getToDate());
    // setSelectedDate(selecteddate);
  };
  const onFilterChange = () => {};

  return overviewLoading || overviewDetailsLoading ? (
    <div className="loading" />
  ) : (
    <>
      <div className="app-row1">
        <OverviewHeading
          type={type}
          agents={agents}
          agentFilter={agentFilter}
          setAgentFilter={setAgentFilter}
          multiAgentFilter
          headingLabel={headingLabel}
          match={match}
          groupByFilter
          groupByFilterVal={groupByFilterVal}
          selectedGroupByFilter={selectedGroupByFilter}
          filterItemsList={filterItemsList}
          onDateRangeChange={onDateRangeChange}
          onFilterChange={onFilterChange}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setCustomDateRange={setCustomDateRange}
          setCustomDateSelected={setCustomDateSelected}
          customDateRange={customDateRange}
          selectedDateOption={selectedDateOption}
          setSelectedDateOption={setSelectedDateOption}
        />
        <CSATdata
          overview={overview}
          pageSizes={pageSizes}
          startIndex={startIndex}
          endIndex={endIndex}
          handlePageSizeChange={handlePageSizeChange}
          selectedPageSize={selectedPageSize}
          totalCount={csatTotalCount}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPageCount={totalPageCount}
          selectedAgentDetails={agentFilter}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ reportsApp, agentsApp }) => {
  const {
    overview,
    overviewLoading,
    overviewDetails,
    overviewDetailsLoading,
    csatTotalCount,
    totalPages,
    since,
    until,
  } = reportsApp;

  const { loadedAgents, agents } = agentsApp;
  return {
    overview,
    overviewLoading,
    overviewDetails,
    overviewDetailsLoading,
    loadedAgents,
    agents,
    csatTotalCount,
    totalPages,
    since,
    until,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getCsatAction: getCsat,
    getCsatDetailsAction: getCsatDetails,
    getAgentsAction: getAgents,
  })(OverviewList)
);
