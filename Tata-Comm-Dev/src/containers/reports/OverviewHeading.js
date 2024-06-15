/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Row, Button } from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import FilterSelector from './FilterSelector';
import CSATAgentsFilter from './CSATAgentsFilter';
import reportsEnums from 'enums/reports/reportsEnums';

const OverviewHeading = ({
  type,
  agents,
  agentFilter,
  setAgentFilter,
  multiAgentFilter,
  labels,
  labelFilter,
  setLabelFilter,
  inboxes,
  inboxFilter,
  setInboxFilter,
  teams,
  teamFilter,
  setTeamFilter,
  match,
  headingLabel,
  groupByFilter,
  groupByFilterVal,
  selectedGroupByFilter,
  filterItemsList,
  onDateRangeChange,
  onFilterChange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedDate,
  setSelectedDate,
  downloadFile,
  downloadLabel,
  setCustomDateRange,
  setCustomDateSelected,
  customDateRange,
  selectedDateOption,
  setSelectedDateOption,
}) => {
  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={headingLabel} />
          </h1>
          <div className="text-zero top-right-button-container">
            {downloadLabel && (
              <Button
                color="primary"
                size="lg"
                className="top-right-button"
                onClick={() => downloadFile()}
              >
                <IntlMessages id={downloadLabel} />
              </Button>
            )}
          </div>
          <Breadcrumb match={match} />
        </div>

        <div className="mb-2">
          {type === reportsEnums.CSAT ? (
            <>
              <CSATAgentsFilter
                type={type}
                agents={agents}
                agentFilter={agentFilter}
                setAgentFilter={setAgentFilter}
                multiAgentFilter={multiAgentFilter}
                onDateRangeChange={onDateRangeChange}
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
            </>
          ) : (
            <FilterSelector
              type={type}
              agents={agents}
              agentFilter={agentFilter}
              setAgentFilter={setAgentFilter}
              multiAgentFilter={multiAgentFilter}
              labels={labels}
              labelFilter={labelFilter}
              setLabelFilter={setLabelFilter}
              inboxes={inboxes}
              inboxFilter={inboxFilter}
              setInboxFilter={setInboxFilter}
              teams={teams}
              teamFilter={teamFilter}
              setTeamFilter={setTeamFilter}
              groupByFilter={groupByFilter}
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
            />
          )}
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default OverviewHeading;
