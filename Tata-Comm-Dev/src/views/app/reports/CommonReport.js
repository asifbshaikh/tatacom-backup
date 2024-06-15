import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import {
  getOverview,
  getOverviewDetails,
  downloadOverview,
  downloadOverviewClean,
  getAgents,
  getLabels,
  getInbox,
  getTeams,
} from 'redux/actions';

import OverviewHeading from 'containers/reports/OverviewHeading';
import OverviewListing from 'containers/reports/OverviewListing';
// import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import { downloadCsvFile, GROUP_BY_FILTER } from 'helpers/TringReactHelper';

import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';

const OverviewList = ({
  type,
  headingLabel,
  downloadLabel,
  filePrefix,
  match,
  overview,
  overviewLoading,
  overviewDetails,
  overviewDetailsLoading,
  getOverviewAction,
  getOverviewDetailsAction,
  downloadOverviewAction,
  downloadOverviewCleanAction,
  downloadSuccess,
  downloadContent,
  intl,
  agents,
  loadedAgents,
  getAgentsAction,
  labels,
  loadedLabels,
  getLabelsAction,
  inboxes,
  loadedInboxes,
  getInboxesAction,
  teams,
  loadedTeams,
  getTeamsAction,
}) => {
  const [activeFirstTab, setActiveFirstTab] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [groupByFilterVal, setGroupByFilterVal] = useState(1);
  const [agentFilter, setAgentFilter] = useState(null);
  const [labelFilter, setLabelFilter] = useState(null);
  const [inboxFilter, setInboxFilter] = useState(null);
  const [teamFilter, setTeamFilter] = useState(null);

  const reportObj = {
    metric: 'conversations_count', // this.metrics[this.currentSelection].KEY,
    // since: '1642703400',
    // until: '1674239399',
    group_by: 'day', // groupBy.period,
    type: 'account',
    id: '',
    timezone_offset: 5.5,
  };
  useEffect(() => {
    if (!loadedAgents) {
      getAgentsAction();
    }
    if (!loadedLabels) {
      getLabelsAction();
    }
    if (!loadedInboxes) {
      getInboxesAction();
    }
    if (!loadedTeams) {
      getTeamsAction();
    }
  }, []);
  useEffect(() => {
    reportObj.metric = activeFirstTab.KEY;
    reportObj.since = fromDate;
    reportObj.until = toDate;
    reportObj.group_by = 'day';
    reportObj.type = type;
    if (groupByFilterVal && GROUP_BY_FILTER[groupByFilterVal]) {
      reportObj.group_by = GROUP_BY_FILTER[groupByFilterVal].period;
    }
    let isValid = true;
    if (type === 'agent') {
      if (!agents || !agents.length) {
        isValid = false;
      } else {
        if (agentFilter === null) {
          setAgentFilter({ value: agents[0].id, label: agents[0].name });
        }
        reportObj.id = agentFilter ? agentFilter.value : agents[0].id;
      }
    }
    if (type === 'label') {
      if (!labels || !labels.length) {
        isValid = false;
      } else {
        if (labelFilter === null) {
          setLabelFilter({ value: labels[0].id, label: labels[0].title });
        }
        reportObj.id = labelFilter ? labelFilter.value : labels[0].id;
      }
    }
    if (type === 'inbox') {
      if (!inboxes || !inboxes.length) {
        isValid = false;
      } else {
        if (inboxFilter === null) {
          setInboxFilter({ value: inboxes[0].id, label: inboxes[0].name });
        }
        reportObj.id = inboxFilter ? inboxFilter.value : inboxes[0].id;
      }
    }
    if (type === 'team') {
      if (!teams || !teams.length) {
        isValid = false;
      } else {
        if (teamFilter === null) {
          setTeamFilter({ value: teams[0].id, label: teams[0].name });
        }
        reportObj.id = teamFilter ? teamFilter.value : teams[0].id;
      }
    }
    if (reportObj.metric && reportObj.since && reportObj.until && isValid) {
      getOverviewAction(reportObj);
      getOverviewDetailsAction(reportObj);
    }
  }, [
    activeFirstTab,
    fromDate,
    toDate,
    groupByFilterVal,
    agents,
    agentFilter,
    labels,
    labelFilter,
    inboxes,
    inboxFilter,
    teams,
    teamFilter,
  ]);
  const { messages: messagesIntl } = intl;

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
      (activeFirstTab.KEY === 'avg_first_response_time' ||
        activeFirstTab.KEY === 'avg_resolution_time')
    ) {
      data = data.map((element) => {
        /* eslint-disable no-param-reassign */
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

  const downloadFile = () => {
    downloadOverviewAction({ since: fromDate, until: toDate, type });
  };
  if (downloadSuccess) {
    const fileName = `${filePrefix}-report-${format(
      fromUnixTime(toDate),
      'dd-MM-yyyy'
    )}.csv`;
    downloadCsvFile(fileName, downloadContent);
    downloadOverviewCleanAction();
  }

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
          labels={labels}
          labelFilter={labelFilter}
          setLabelFilter={setLabelFilter}
          inboxes={inboxes}
          inboxFilter={inboxFilter}
          setInboxFilter={setInboxFilter}
          teams={teams}
          teamFilter={teamFilter}
          setTeamFilter={setTeamFilter}
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
          downloadFile={downloadFile}
          downloadLabel={downloadLabel}
        />
        <OverviewListing
          overview={overview}
          overviewDetails={data}
          reportKeysUpdated={reportKeysUpdated}
          activeFirstTab={activeFirstTab}
          setActiveFirstTab={setActiveFirstTab}
          groupByFilterVal={groupByFilterVal}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({
  reportsApp,
  agentsApp,
  labelsApp,
  inboxApp,
  teamsApp,
}) => {
  const {
    overview,
    overviewLoading,
    overviewDetails,
    overviewDetailsLoading,
    downloadSuccess,
    downloadContent,
  } = reportsApp;

  const { loadedAgents, agents } = agentsApp;
  const { loadedLabels, labels } = labelsApp;
  const { loadedInboxes, inboxes } = inboxApp;
  const { loadedTeams, teams } = teamsApp;
  return {
    overview,
    overviewLoading,
    overviewDetails,
    overviewDetailsLoading,
    downloadSuccess,
    downloadContent,
    loadedAgents,
    agents,
    loadedLabels,
    labels,
    loadedInboxes,
    inboxes,
    loadedTeams,
    teams,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getOverviewAction: getOverview,
    getOverviewDetailsAction: getOverviewDetails,
    downloadOverviewAction: downloadOverview,
    downloadOverviewCleanAction: downloadOverviewClean,
    getAgentsAction: getAgents,
    getLabelsAction: getLabels,
    getInboxesAction: getInbox,
    getTeamsAction: getTeams,
  })(OverviewList)
);
