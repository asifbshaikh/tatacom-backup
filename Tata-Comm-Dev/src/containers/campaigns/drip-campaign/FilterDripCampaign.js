import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import { Input } from 'reactstrap';
import { injectIntl } from 'react-intl';
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import FlowsEnums from 'enums/campaigns/flowsEnums';
import CustomDateRangePopOver from 'containers/dashboards/campaigns/CustomDateRangePopOver';

const FilterDripCampaign = ({
  handlePageChange,
  intl,
  getDashboardDataAction = () => {},
}) => {
  const { messages } = intl;

  const today = new Date();
  const yesterday = subDays(today, 1);
  const sevenDaysAgo = subDays(today, 7);
  const startOfThisWeek = startOfWeek(today);
  const endOfThisWeek = endOfWeek(today);
  const startOfLastWeek = subDays(startOfThisWeek, 7);
  const endOfLastWeek = subDays(endOfThisWeek, 7);
  const startOfLastThirtyDays = subDays(today, 30);
  const startOfThisMonth = startOfMonth(today);
  const startOfLastMonth = startOfMonth(subMonths(today, 1));
  const endOfLastMonth = endOfMonth(subMonths(today, 1));
  const [selectOption, setSelectedOption] = useState(null);
  const [customDate, setIsCustomDate] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(null);

  const convert = (str) => {
    const date = new Date(str);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [campaignName, setCampaignName] = useState('');
  const selectType = [];
  const selectDeliveryType = [];
  const handleSelectDate = (e) => {
    setSelectedOption(e.label);
    setSelectedFrom(null);
    getDashboardDataAction({ selectDateType: e });

    switch (e.label) {
      case FlowsEnums.TODAY:
        getDashboardDataAction({
          startDate: convert(today),
          endDate: convert(today),
        });
        break;

      case FlowsEnums.YESTERDAY:
        getDashboardDataAction({
          startDate: convert(yesterday),
          endDate: convert(yesterday),
        });
        break;

      case FlowsEnums.LAST_7_DAYS:
        getDashboardDataAction({
          startDate: convert(sevenDaysAgo),
          endDate: convert(yesterday),
        });
        break;

      case FlowsEnums.THIS_WEEK:
        getDashboardDataAction({
          startDate: convert(startOfThisWeek),
          endDate: convert(today),
        });
        break;

      case FlowsEnums.LAST_WEEK:
        getDashboardDataAction({
          startDate: convert(startOfLastWeek),
          endDate: convert(endOfLastWeek),
        });
        break;

      case FlowsEnums.LAST_30_DAYS:
        getDashboardDataAction({
          startDate: convert(startOfLastThirtyDays),
          endDate: convert(today),
        });
        break;

      case FlowsEnums.THIS_MONTH:
        getDashboardDataAction({
          startDate: convert(startOfThisMonth),
          endDate: convert(today),
        });
        break;

      case FlowsEnums.LAST_MONTH:
        getDashboardDataAction({
          startDate: convert(startOfLastMonth),
          endDate: convert(endOfLastMonth),
        });
        break;

      case FlowsEnums.SINCE:
        setIsCustomDate(true);
        break;

      case FlowsEnums.CUSTOM_RANGE:
        setIsCustomDate(true);
        break;

      default:
        getDashboardDataAction({
          startDate: '',
          endDate: '',
        });
        break;
    }
  };

  const handleSelectEntry = (e) => {};

  const handleSelectStatus = (e) => {};

  const handleSearchValue = (e) => {
    handlePageChange(1);
    getDashboardDataAction({ campaignName: e });
  };

  const allEntryTypes = [
    {
      label: messages['DRIP_CAMPAIGN.LABELS.ONE_TIME'],
      value: FlowsEnums.ONE_TIME,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.PERIODIC'],
      value: FlowsEnums.PERIODIC,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.EVENT_TRIGERRED'],
      value: FlowsEnums.EVENT_TRIGERRED,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.ON_FLOW_EXIT'],
      value: FlowsEnums.ON_FLOW_EXIT,
    },
  ];

  const statusTypes = [
    {
      label: messages['DRIP_CAMPAIGN.LABELS.PAUSED'],
      value: FlowsEnums.PAUSED,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.STOPPED'],
      value: FlowsEnums.STOPPED,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.RETIRED'],
      value: FlowsEnums.RETIRED,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.ACTIVE'],
      value: FlowsEnums.ACTIVE,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.SCHEDULED'],
      value: FlowsEnums.SCHEDULED,
    },
    {
      label: messages['DRIP_CAMPAIGN.LABELS.COMPLETED'],
      value: FlowsEnums.COMPLETED,
    },
  ];

  const dateTypes = [
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.TODAY'],
      value: FlowsEnums.TODAY,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.YESTERDAY'],
      value: FlowsEnums.YESTERDAY,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_7_DAYS'],
      value: FlowsEnums.LAST_7_DAYS,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.THIS_WEEK'],
      value: FlowsEnums.THIS_WEEK,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_WEEK'],
      value: FlowsEnums.LAST_WEEK,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_30_DAYS'],
      value: FlowsEnums.LAST_30_DAYS,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.THIS_MONTH'],
      value: FlowsEnums.THIS_MONTH,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_MONTH'],
      value: FlowsEnums.LAST_MONTH,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.SINCE'],
      value: FlowsEnums.SINCE,
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.CUSTOM_RANGE'],
      value: FlowsEnums.CUSTOM_RANGE,
    },
  ];

  const searchFlowsPlaceHolder =
    messages['DRIP_CAMPAIGN.PLACEHOLDERS.SEARCH_FLOWS'];

  return (
    <>
      <Colxx xxs="12" md="3" className="mb-5">
        <div className="search  align-top">
          <Input
            className="dashboard-search-value"
            type="text"
            name="keyword"
            id="search"
            value={campaignName}
            placeholder={searchFlowsPlaceHolder}
            onChange={(e) => {
              handleSearchValue(e.target.value);
            }}
          />
        </div>
      </Colxx>
      <Colxx xxs="12" md="3">
        <Select
          className="react-select"
          classNamePrefix="react-select"
          placeholder={messages['DASHBOARD.CAMPAIGN.PLACEHOLDERS.SELECT_DATE']}
          name="form-field-name"
          onChange={(e) => handleSelectDate(e)}
          options={dateTypes}
          defaultValue={''}
        />
      </Colxx>

      <Colxx xxs="12" md="3">
        <Select
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          placeholder={messages['DRIP_CAMPAIGN.LABELS.SELECT_ENTRY_TYPE']}
          onChange={(e) => handleSelectEntry(e)}
          options={allEntryTypes}
          defaultValue={selectType.map((val) => {
            return val;
          })}
          isMulti
        />
      </Colxx>
      <Colxx xxs="12" md="3">
        <Select
          className="react-select"
          classNamePrefix="react-select"
          isMulti
          name="form-field-name"
          placeholder={messages['DRIP_CAMPAIGN.LABELS.SELECT_STATUS']}
          onChange={(e) => handleSelectStatus(e)}
          options={statusTypes}
          defaultValue={selectDeliveryType.map((val) => {
            return val;
          })}
        />
      </Colxx>
      {(selectOption === FlowsEnums.SINCE ||
        selectOption === FlowsEnums.CUSTOM_RANGE) &&
      customDate ? (
        <CustomDateRangePopOver
          selectOption={selectOption}
          customDate={customDate}
          setIsCustomDate={setIsCustomDate}
          selectedFrom={selectedFrom}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default injectIntl(FilterDripCampaign);
