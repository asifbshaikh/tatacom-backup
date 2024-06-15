import React, { useEffect, useState } from 'react';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import subDays from 'date-fns/subDays';
import getUnixTime from 'date-fns/getUnixTime';
import { injectIntl } from 'react-intl';
import { Label } from 'reactstrap';
import { CUSTOM_DATE_RANGE_ID, dateRange } from 'data/reports/csatFilterData';
import reportsEnums from 'enums/reports/reportsEnums';
import CSATReportFilter from 'data/reports/csatFilter';
import CustomDateRangePopOver from 'containers/dashboards/campaigns/CustomDateRangePopOver';
import { getCustomDateReportDataClean } from 'redux/reports/actions';
import IntlMessages from 'helpers/IntlMessages';
import { format, fromUnixTime } from 'date-fns';
import { connect } from 'react-redux';
import Select from 'react-select';
import { dateFilterOptions } from 'data/reports/ReportContants';

const CSATAgentsFilter = ({
  type,
  agents,
  agentFilter,
  setAgentFilter,
  multiAgentFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedDate,
  setSelectedDate,
  onDateRangeChange,
  since,
  until,
  getCustomDateReportDataCleanAction,
  setCustomDateRange,
  setCustomDateSelected,
  customDateRange,
  selectedDateOption,
  setSelectedDateOption,
  intl: { messages: messagesIntl },
}) => {
  const [customDate, setIsCustomDate] = useState(false);
  useEffect(() => {
    if (!fromDate) {
      setFromDate(getFromDate());
    }
    if (!toDate) {
      setToDate(getToDate());
    }
  }, []);

  const isDateRangeSelected = (selectedDateImmidiate) => {
    if (typeof selectedDateImmidiate !== 'undefined') {
      return selectedDate === CUSTOM_DATE_RANGE_ID;
    }
    return selectedDate === CUSTOM_DATE_RANGE_ID;
  };
  const getToDate = (selectedDateImmidiate) => {
    if (isDateRangeSelected(selectedDateImmidiate) && customDateRange) {
      return getUnixTime(endOfDay(customDateRange[1]));
    }
    if (selectedDateImmidiate === reportsEnums.CUSTOM_DATE_INDEX) {
      return getUnixTime(endOfDay(until));
    } else {
      return getUnixTime(endOfDay(new Date()));
    }
  };

  const getFromDate = (selectedDateImmidiate) => {
    if (isDateRangeSelected(selectedDateImmidiate) && customDateRange) {
      return getUnixTime(startOfDay(customDateRange[0]));
    }
    let fromDateNew = reportsEnums.INITIALISE_VALUE;
    const selectedDateOriginal =
      typeof selectedDateImmidiate !== 'undefined'
        ? selectedDateImmidiate
        : selectedDate;

    if (selectedDateImmidiate === reportsEnums.CUSTOM_DATE_INDEX) {
      fromDateNew = new Date(since);
    } else {
      const diff = dateRange[selectedDateOriginal];
      fromDateNew = subDays(new Date(), diff);
    }
    return getUnixTime(startOfDay(fromDateNew));
  };

  const changeDateSelection = (e) => {
    setSelectedDateOption(e);
    setSelectedDate(parseInt(e.value, 10));
    getCustomDateReportDataCleanAction();
    if (e.value === reportsEnums.CUSTOM_DATE_INDEX) {
      setCustomDateSelected(true);
      setIsCustomDate(true);
    } else {
      onDateRangeChange({
        fromdate: getFromDate(e.value),
        todate: getToDate(e.value),
        selecteddate: e.value,
      });
      setFromDate(getFromDate(e.value));
      setToDate(getToDate(e.value));
      setIsCustomDate(false);
      setCustomDateRange([]);
      setCustomDateSelected(false);
    }
  };

  useEffect(() => {
    if (selectedDate !== reportsEnums.CUSTOM_DATE_INDEX) {
      setFromDate(getFromDate(selectedDate));
      setToDate(getToDate(selectedDate));
    }
  }, [selectedDate]);

  return (
    <div className="form-group d-flex p-0 m-0">
      <div className="form-group p-0 m-0 mr-2">
        <Label for="currentDateRangeSelection">
          <Select
            id="currentDateRangeSelection"
            className="react-select filter-select"
            classNamePrefix="react-select"
            options={dateFilterOptions.map((val) => {
              return {
                value: val.id,
                label: val.label,
              };
            })}
            onChange={(e) => changeDateSelection(e)}
            value={selectedDateOption}
            defaultValue={selectedDateOption}
          />
        </Label>
        {selectedDate === 5 && since && until && (
          <>
            <section className="d-flex justify-content-between mt-1 font-weight-bold">
              <div>
                <span>
                  <IntlMessages id="DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.FROM" />
                </span>
                <span>
                  {' '}
                  {format(fromUnixTime(since), reportsEnums.DATE_FORMAT)}
                </span>
              </div>
              <div>
                <span>
                  <IntlMessages id="DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.TO" />
                </span>
                <span>
                  {' '}
                  {format(fromUnixTime(until), reportsEnums.DATE_FORMAT)}{' '}
                </span>
              </div>
            </section>
          </>
        )}
      </div>
      {customDate ? (
        <CustomDateRangePopOver
          selectOption={reportsEnums.CUSTOM_RANGE}
          customDate={customDate}
          setIsCustomDate={setIsCustomDate}
          moduleName={reportsEnums.REPORT}
          setCustomDateRange={setCustomDateRange}
        />
      ) : (
        <></>
      )}
      {type === reportsEnums.CSAT && (
        <CSATReportFilter
          type="reportsEnums.CSAT"
          labelKey="name"
          options={agents}
          getter={agentFilter}
          setter={setAgentFilter}
          isMulti={multiAgentFilter}
        />
      )}
    </div>
  );
};

const mapStateToProps = ({ reportsApp }) => {
  const { since, until } = reportsApp;
  return {
    since,
    until,
  };
};

export default connect(mapStateToProps, {
  getCustomDateReportDataCleanAction: getCustomDateReportDataClean,
})(injectIntl(CSATAgentsFilter));
