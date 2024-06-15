import React, { useEffect, useState } from 'react';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import subDays from 'date-fns/subDays';
import getUnixTime from 'date-fns/getUnixTime';
import { injectIntl } from 'react-intl';
import { GROUP_BY_FILTER } from 'helpers/TringReactHelper';
import IntlMessages from 'helpers/IntlMessages';
import Select from 'react-select';
import { Label } from 'reactstrap';

const ListInboxesHeading = ({
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
  groupByFilter,
  groupByFilterVal,
  selectedGroupByFilter,
  onDateRangeChange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedDate,
  setSelectedDate,
  intl: { messages: messagesIntl },
}) => {
  const [customDateRange] = useState(null);
  useEffect(() => {
    if (!fromDate) {
      setFromDate(getFromDate());
    }
    if (!toDate) {
      setToDate(getToDate());
    }
  }, []);

  const CUSTOM_DATE_RANGE_ID = 5;

  const OptionsDate = ({ selected }) => {
    return [0, 1, 2, 3, 4, 5].map((item) => {
      return (
        <option
          key={`option_god_${item}`}
          value={messagesIntl[`AGENT_REPORTS.DATE_RANGE.${item}.id`]}
          selected={selected === parseInt(item, 10)}
        >
          {messagesIntl[`AGENT_REPORTS.DATE_RANGE.${item}.name`]}
        </option>
      );
    });
  };

  const OptionsDateGroupBy = ({ selected }) => {
    const filterList = filterItemsList();
    return filterList.groupByOptions.map((item) => {
      const labelPrefix = `REPORT.${filterList.label}.${item}`;
      return (
        <option
          key={`option_god_${item}`}
          value={messagesIntl[`${labelPrefix}.id`]}
          selected={
            selected === parseInt(messagesIntl[`${labelPrefix}.id`], 10)
          }
        >
          {messagesIntl[`${labelPrefix}.groupBy`]}
        </option>
      );
    });
  };
  const fromCustomDate = (date) => {
    return getUnixTime(startOfDay(date));
  };
  const toCustomDate = (date) => {
    return getUnixTime(endOfDay(date));
  };
  const isDateRangeSelected = (selectedDateImmidiate) => {
    if (typeof selectedDateImmidiate !== 'undefined') {
      return selectedDate === CUSTOM_DATE_RANGE_ID;
    }
    return selectedDate === CUSTOM_DATE_RANGE_ID;
  };
  const getToDate = (selectedDateImmidiate) => {
    if (isDateRangeSelected(selectedDateImmidiate)) {
      return toCustomDate(customDateRange[1]);
    }

    return toCustomDate(new Date());
  };
  const getFromDate = (selectedDateImmidiate) => {
    if (isDateRangeSelected(selectedDateImmidiate)) {
      return toCustomDate(customDateRange[0]);
    }
    const selectedDateOriginal =
      typeof selectedDateImmidiate !== 'undefined'
        ? selectedDateImmidiate
        : selectedDate;
    const dateRange = {
      0: 6,
      1: 29,
      2: 89,
      3: 179,
      4: 364,
    };

    const diff = dateRange[selectedDateOriginal];
    const fromDateNew = subDays(new Date(), diff);

    return fromCustomDate(fromDateNew);
  };
  const changeDateSelection = (e) => {
    setSelectedDate(parseInt(e.target.value, 10));
    onDateRangeChange({
      fromdate: getFromDate(e.target.value),
      todate: getToDate(e.target.value),
      selecteddate: e.target.value,
    });

    setFromDate(getFromDate(e.target.value));
    setToDate(getToDate(e.target.value));
    selectedGroupByFilter(0);
  };

  const filterItemsList = () => {
    let label = 'GROUP_BY_DAY_OPTIONS';
    let groupByOptions = [0];
    switch (selectedDate) {
      case 1:
        label = 'GROUP_BY_WEEK_OPTIONS';
        groupByOptions = [0, 1];
        break;
      case 2:
      case 3:
      case 4:
        label = 'GROUP_BY_MONTH_OPTIONS';
        groupByOptions = [0, 1, 2];
        break;
      case 5:
        label = 'GROUP_BY_YEAR_OPTIONS';
        groupByOptions = [0, 1, 2, 3];
        break;
      default:
        break;
    }
    return { label, groupByOptions };
  };
  const groupBy = () => {
    if (isDateRangeSelected()) {
      return GROUP_BY_FILTER[4].period;
    }
    const groupRange = {
      0: GROUP_BY_FILTER[1].period,
      1: GROUP_BY_FILTER[2].period,
      2: GROUP_BY_FILTER[3].period,
      3: GROUP_BY_FILTER[3].period,
      4: GROUP_BY_FILTER[3].period,
    };
    return groupRange[selectedDate];
  };
  const notLast7Days = () => {
    return groupBy() !== GROUP_BY_FILTER[1].period;
  };
  const multiselectLabel = () => {
    const typeLabels = {
      agent: 'AGENT_REPORTS.FILTER_DROPDOWN_LABEL',
      label: 'LABEL_REPORTS.FILTER_DROPDOWN_LABEL',
      inbox: 'INBOX_REPORTS.FILTER_DROPDOWN_LABEL',
      team: 'TEAM_REPORTS.FILTER_DROPDOWN_LABEL',
    };
    return typeLabels[type] || 'FORMS.MULTISELECT.SELECT_ONE';
  };
  const CommonFilter = ({
    type: fieldType,
    labelKey,
    options,
    getter,
    setter,
    isMulti,
  }) => {
    return (
      <div className="form-group p-0 m-0 mr-2">
        <Label For={`${fieldType}Selection`}>
          <IntlMessages id={multiselectLabel()} />
          <Select
            id={`${fieldType}Selection`}
            className="react-select"
            classNamePrefix="react-select"
            options={options.map((val) => {
              return { value: val.id, label: val[labelKey] };
            })}
            isMulti={isMulti}
            value={getter}
            onChange={(val) => {
              setter(val);
            }}
          />
        </Label>
      </div>
    );
  };
  return (
    <div className="form-group d-flex p-0 m-0">
      {type === 'agent' && (
        <CommonFilter
          type="agent"
          labelKey="name"
          options={agents}
          getter={agentFilter}
          setter={setAgentFilter}
        />
      )}
      {type === 'label' && (
        <CommonFilter
          type="label"
          labelKey="title"
          options={labels}
          getter={labelFilter}
          setter={setLabelFilter}
        />
      )}
      {type === 'inbox' && (
        <CommonFilter
          type="inbox"
          labelKey="name"
          options={inboxes}
          getter={inboxFilter}
          setter={setInboxFilter}
        />
      )}
      {type === 'team' && (
        <CommonFilter
          type="team"
          labelKey="name"
          options={teams}
          getter={teamFilter}
          setter={setTeamFilter}
        />
      )}
      {type === 'csat' && (
        <CommonFilter
          type="csat"
          labelKey="name"
          options={agents}
          getter={agentFilter}
          setter={setAgentFilter}
          isMulti={multiAgentFilter}
        />
      )}

      <div className="form-group p-0 m-0 mr-2">
        <Label For="currentDateRangeSelection">
          <IntlMessages id="FORMS.MULTISELECT.SELECT_ONE" />
          <select
            onChange={changeDateSelection}
            id="currentDateRangeSelection"
            className="form-control custom"
          >
            <OptionsDate selected={selectedDate} />
          </select>
        </Label>
      </div>
      {groupByFilter && notLast7Days() && (
        <div className="form-group p-0 m-0 mr-2">
          <Label For="currentSelectedFilter">
            <IntlMessages id="REPORT.GROUP_BY_FILTER_DROPDOWN_LABEL" />
            <select
              onChange={(e) => selectedGroupByFilter(e.target.value)}
              id="currentSelectedFilter"
              className="form-control"
            >
              <OptionsDateGroupBy
                selected={groupByFilterVal}
                selectedDate={selectedDate}
              />
            </select>
          </Label>
        </div>
      )}
    </div>
  );
};

export default injectIntl(ListInboxesHeading);
