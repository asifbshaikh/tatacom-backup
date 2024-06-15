import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';


import {
    getOverview, getOverviewDetails,
    downloadOverview,
    downloadOverviewClean,
} from 'redux/actions';

import OverviewHeading from 'containers/reports/OverviewHeading';
import OverviewListing from 'containers/reports/OverviewListing';
// import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import { downloadCsvFile, GROUP_BY_FILTER } from 'helpers/TringReactHelper';

import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';

const downloadLabel = "REPORT.DOWNLOAD_AGENT_REPORTS";
const headingLabel = "REPORT.HEADER";
// const type = 'account';
// const filePrefix = 'agent';

const OverviewList = ({
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
}) => {
    const [editFormData, setEditFormData] = useState({});
    const [activeFirstTab, setActiveFirstTab] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(0);
    const [groupByFilterVal, setGroupByFilterVal] = useState(1);



    const reportObj = {
        metric: 'conversations_count', // this.metrics[this.currentSelection].KEY,
        since: '1642703400',
        until: '1674239399',
        group_by: 'day', // groupBy.period,
        type: 'account',
        id: '',
        timezone_offset: 5.5,
    }
    useEffect(() => {
        reportObj.metric = activeFirstTab.KEY;
        reportObj.since = fromDate;
        reportObj.until = toDate;
        reportObj.group_by = 'day';
        if (groupByFilterVal && GROUP_BY_FILTER[groupByFilterVal]) {
            reportObj.group_by = GROUP_BY_FILTER[groupByFilterVal].period;
        }
        if (reportObj.metric && reportObj.since && reportObj.until) {
            getOverviewAction(reportObj);
            getOverviewDetailsAction(reportObj);
        }
    }, [activeFirstTab, fromDate, toDate, groupByFilterVal]);
    const { messages: messagesIntl } = intl;

    const reportKeys = {
        CONVERSATIONS: 'conversations_count',
        INCOMING_MESSAGES: 'incoming_messages_count',
        OUTGOING_MESSAGES: 'outgoing_messages_count',
        FIRST_RESPONSE_TIME: 'avg_first_response_time',
        RESOLUTION_TIME: 'avg_resolution_time',
        RESOLUTION_COUNT: 'resolutions_count',
    };
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
            el =>
                reportObj.to - el.timestamp > 0 && el.timestamp - reportObj.from >= 0
        );
        if (
            reportObj.metric === 'avg_first_response_time' ||
            reportObj.metric === 'avg_resolution_time'
        ) {
            data = data.map(element => {
                /* eslint-disable no-param-reassign */
                element.value = (element.value / 3600).toFixed(2);
                return element;
            });
        }
    }
    const selectedGroupByFilter = (value) => {
        setGroupByFilterVal(parseInt(value, 10))
    };
    const filterItemsList = [];
    const onDateRangeChange = ({ fromdate, todate, selecteddate }) => {
        // setFromDate(getFromDate());
        // setToDate(getToDate());
        // setSelectedDate(selecteddate);
    };
    const onFilterChange = (e) => {
    };

    const downloadFile = () => {
        downloadOverviewAction({ since: fromDate, until: toDate })
    }
    if (downloadSuccess) {
        const fileName = `agent-report-${format(
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
                {/* <DeleteOverviewModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                /> */}
                {<OverviewListing
                    overview={overview}
                    overviewDetails={data}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    reportKeysUpdated={reportKeysUpdated}
                    activeFirstTab={activeFirstTab}
                    setActiveFirstTab={setActiveFirstTab}
                    groupByFilterVal={groupByFilterVal}
                />}
            </div>
        </>
    );
};


const mapStateToProps = ({ reportsApp }) => {
    const {
        overview,
        overviewLoading,
        overviewDetails,
        overviewDetailsLoading,
        downloadSuccess,
        downloadContent,
    } = reportsApp;
    return {
        overview,
        overviewLoading,
        overviewDetails,
        overviewDetailsLoading,
        downloadSuccess,
        downloadContent,
    };
};
export default injectIntl(
    connect(mapStateToProps, {
        getOverviewAction: getOverview,
        getOverviewDetailsAction: getOverviewDetails,
        downloadOverviewAction: downloadOverview,
        downloadOverviewCleanAction: downloadOverviewClean,
    })(OverviewList)
);
