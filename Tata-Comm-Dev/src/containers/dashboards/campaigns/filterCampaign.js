import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import { Input } from 'reactstrap';
import { getDashboardData } from 'redux/actions';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import CustomDateRangePopOver from './CustomDateRangePopOver';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import IntlMessages from 'helpers/IntlMessages';

const FilterCampaign = ({
  selectDeliveryType,
  selectChannel,
  selectDateType,
  getDashboardDataAction,
  intl,
  campaignName,
  handlePageChange,
  startDate,
  endDate,
}) => {
  const { messages } = intl;
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [selectOption, setSelectedOption] = useState(null);
  const [customDate, setIsCustomDate] = useState(false);
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

  const convert = (str) => {
    const date = new Date(str);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSelectDate = (e) => {
    setSelectedOption(e.label);
    setSelectedFrom(null);
    setSelectedTo(null);
    getDashboardDataAction({ selectDateType: e });
    if (e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.TODAY']) {
      getDashboardDataAction({
        startDate: convert(today),
        endDate: convert(today),
      });
    }
    if (e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.YESTERDAY']) {
      getDashboardDataAction({
        startDate: convert(yesterday),
        endDate: convert(yesterday),
      });
    }
    if (
      e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_7_DAYS']
    ) {
      getDashboardDataAction({
        startDate: convert(sevenDaysAgo),
        endDate: convert(yesterday),
      });
    }
    if (e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.THIS_WEEK']) {
      getDashboardDataAction({
        startDate: convert(startOfThisWeek),
        endDate: convert(today),
      });
    }
    if (e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_WEEK']) {
      getDashboardDataAction({
        startDate: convert(startOfLastWeek),
        endDate: convert(endOfLastWeek),
      });
    }
    if (
      e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_30_DAYS']
    ) {
      getDashboardDataAction({
        startDate: convert(startOfLastThirtyDays),
        endDate: convert(today),
      });
    }
    if (
      e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.THIS_MONTH']
    ) {
      getDashboardDataAction({
        startDate: convert(startOfThisMonth),
        endDate: convert(today),
      });
    }
    if (
      e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_MONTH']
    ) {
      getDashboardDataAction({
        startDate: convert(startOfLastMonth),
        endDate: convert(endOfLastMonth),
      });
    }
    if (e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.SINCE']) {
      setIsCustomDate(true);
    }
    if (
      e.label === messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.CUSTOM_RANGE']
    ) {
      setIsCustomDate(true);
    }

    if (e.lenght === 0) {
      getDashboardDataAction({
        startDate: '',
        endDate: '',
      });
    }
  };

  const handleSelectChannel = (e) => {
    getDashboardDataAction({ selectChannel: e });
    if (e.length === 0) {
      getDashboardDataAction({ channelType: [] });
    }
  };

  const handleSelectDeliveryType = (e) => {
    getDashboardDataAction({ selectDeliveryType: e });
    if (e.length === 0) {
      getDashboardDataAction({ campaignTypes: [] });
    }
  };

  const handleSearchValue = (e) => {
    handlePageChange(1);
    getDashboardDataAction({ campaignName: e });
  };

  useEffect(() => {
    if (selectDeliveryType.length > 0) {
      const selectedOptions = [...selectDeliveryType];
      const opt = selectedOptions.map((val) => {
        return val.value;
      });
      getDashboardDataAction({ campaignTypes: opt });
    }
    if (selectChannel.length > 0) {
      const selectedChannelOptions = [...selectChannel];
      const opt = selectedChannelOptions.map((val) => {
        return val.value;
      });
      getDashboardDataAction({ channelType: opt });
    }
  }, [selectDeliveryType, selectChannel]);

  const allChannels = [
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.EMAIL_CAMPAIGN'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.CHANNELS.EMAIL_CAMPAIGN'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.SMS_CAMPAIGN'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.CHANNELS.SMS_CAMPAIGN'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.CHANNELS.WHATSAPP_CAMPAIGN'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.CHANNELS.WHATSAPP_CAMPAIGN'],
    },
  ];

  const deliveryTypes = [
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DELIVERY_TYPES.ONE_TIME'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DELIVERY_TYPES.ONE_TIME'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DELIVERY_TYPES.PERIODIC'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DELIVERY_TYPES.PERIODIC'],
    },
    {
      label:
        messages['DASHBOARD.CAMPAIGN.LABELS.DELIVERY_TYPES.EVENT_TRIGGERED'],
      value:
        messages['DASHBOARD.CAMPAIGN.VALUE.DELIVERY_TYPES.EVENT_TRIGGERED'],
    },
    {
      label:
        messages['DASHBOARD.CAMPAIGN.LABELS.DELIVERY_TYPES.LOCATION_TRIGGERED'],
      value:
        messages['DASHBOARD.CAMPAIGN.VALUE.DELIVERY_TYPES.LOCATION_TRIGGERED'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DELIVERY_TYPES.API_TRIGGERED'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DELIVERY_TYPES.API_TRIGGERED'],
    },
    {
      label:
        messages['DASHBOARD.CAMPAIGN.LABELS.DELIVERY_TYPES.DEVICE_TRIGGERED'],
      value:
        messages['DASHBOARD.CAMPAIGN.VALUE.DELIVERY_TYPES.DEVICE_TRIGGERED'],
    },
  ];

  const dateTypes = [
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.TODAY'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.TODAY'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.YESTERDAY'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.YESTERDAY'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_7_DAYS'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.LAST_7_DAYS'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.THIS_WEEK'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.THIS_WEEK'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_WEEK'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.LAST_WEEK'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_30_DAYS'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.LAST_30_DAYS'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.THIS_MONTH'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.THIS_MONTH'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.LAST_MONTH'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.LAST_MONTH'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.SINCE'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.SINCE'],
    },
    {
      label: messages['DASHBOARD.CAMPAIGN.LABELS.DATE_TYPE.CUSTOM_RANGE'],
      value: messages['DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.CUSTOM_RANGE'],
    },
  ];

  const searchCampaignPlaceHolder =
    messages['DASHBOARD.CAMPAIGN.PLACEHOLDERS.SEARCH_CAMPAIGN'];
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
            placeholder={searchCampaignPlaceHolder}
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
          defaultValue={selectDateType}
        />
        {selectDateType.value === DashboardEnums.CUSTOM_RANGE &&
          startDate &&
          endDate && (
            <>
              <section className="d-flex justify-content-between mt-1 font-weight-bold">
                <div>
                  <span>
                    <IntlMessages id="DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.FROM" />
                  </span>
                  <span> {startDate}</span>
                </div>
                <div>
                  <span>
                    <IntlMessages id="DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.TO" />
                  </span>
                  <span> {endDate} </span>
                </div>
              </section>
            </>
          )}
        {selectDateType.value === DashboardEnums.SINCE && startDate && (
          <>
            <section className="d-flex mt-2 font-weight-bold">
              <div>
                <span>
                  {' '}
                  <IntlMessages id="DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.FROM" />{' '}
                </span>
                <span> {startDate}</span>
              </div>
            </section>
          </>
        )}
      </Colxx>

      <Colxx xxs="12" md="3">
        <Select
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          placeholder={
            messages['DASHBOARD.CAMPAIGN.PLACEHOLDERS.SELECT_CHANNEL']
          }
          onChange={(e) => handleSelectChannel(e)}
          options={allChannels}
          defaultValue={selectChannel.map((val) => {
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
          placeholder={
            messages['DASHBOARD.CAMPAIGN.PLACEHOLDERS.DELIVERY_TYPE']
          }
          onChange={(e) => handleSelectDeliveryType(e)}
          options={deliveryTypes}
          defaultValue={selectDeliveryType.map((val) => {
            return val;
          })}
        />
      </Colxx>

      {(selectOption === DashboardEnums.SINCE ||
        selectOption === DashboardEnums.CUSTOM_RANGE) &&
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

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const {
    campaignStatus,
    selectChannel,
    selectDeliveryType,
    selectDateType,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
  } = dashboardCampaignsApp;
  return {
    campaignStatus,
    selectChannel,
    selectDeliveryType,
    selectDateType,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
  };
};
export default connect(mapStateToProps, {
  getDashboardDataAction: getDashboardData,
})(injectIntl(FilterCampaign));
