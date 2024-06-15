import React, { useEffect } from 'react';
import { getCountryDropdownList } from 'redux/actions';
import { connect } from 'react-redux';
import FrequencyCapping from './FrequencyCapping';
import DoNoDisturb from './DoNotDisturb';

const FrequencyCappingAndDnD = ({
  channelType,
  smsList,
  getCountryList,
  countryListData,
}) => {
  let smsListData = [];
  let countryListOptions = [];

  useEffect(() => {
    getCountryList();
  }, []);

  if (countryListData && countryListData.length > 0) {
    countryListOptions = countryListData.map((item) => {
      return {
        id: item.country_code,
        value: `${item.name} (${item.phone_code})`,
      };
    });
    countryListOptions.unshift({ id: '', value: '' });
  }

  if (smsList && smsList.length > 0) {
    smsListData = smsList.map((item) => {
      return {
        id: item.channel_id,
        value: item.sender_id,
      };
    });
    smsListData.unshift({
      id: '',
      value: 'CHANNEL_MGMT.SMS_CHANNEL.NO_CONNECTOR_SELECTED',
    });
  }

  return (
    <>
      <FrequencyCapping
        channelType={channelType}
        connectorDropDownData={smsListData}
      />
      <DoNoDisturb
        channelType={channelType}
        connectorDropDownData={smsListData}
        countryList={countryListOptions}
      />
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { tataSMSConnectors, countryList } = settingsChannels;
  return { smsList: tataSMSConnectors, countryListData: countryList };
};

export default connect(mapStateToProps, {
  getCountryList: getCountryDropdownList,
})(FrequencyCappingAndDnD);
