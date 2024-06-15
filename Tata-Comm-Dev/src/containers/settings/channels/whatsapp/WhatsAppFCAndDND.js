import React, { useEffect } from 'react';
import { getCountryDropdownList } from 'redux/actions';
import { connect } from 'react-redux';
import FrequencyCapping from '../sms/FrequencyCapping';
import DoNotDisturb from '../sms/DoNotDisturb';

const WhatsAppFCAndDND = ({
  channelType,
  whatsAppList,
  getCountryList,
  countryListData,
}) => {
  let whatsAppListData = [];
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

  if (whatsAppList && whatsAppList.length > 0) {
    whatsAppListData = whatsAppList.map((item) => {
      return {
        id: item.channel_id,
        value: item.phone_number,
      };
    });
    whatsAppListData.unshift({
      id: '',
      value: 'CHANNEL_MGMT.SMS_CHANNEL.NO_CONNECTOR_SELECTED',
    });
  }

  return (
    <>
      <FrequencyCapping
        channelType={channelType}
        connectorDropDownData={whatsAppListData}
      />
      <DoNotDisturb
        channelType={channelType}
        connectorDropDownData={whatsAppListData}
        countryList={countryListOptions}
      />
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { tataWhatsAppConnectors, countryList } = settingsChannels;
  return { whatsAppList: tataWhatsAppConnectors, countryListData: countryList };
};

export default connect(mapStateToProps, {
  getCountryList: getCountryDropdownList,
})(WhatsAppFCAndDND);
