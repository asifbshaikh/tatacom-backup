import CommonEnums from 'enums/commonEnums';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCountryDropdownList, getEmailConnectorList } from 'redux/actions';

const FrequencyCapping = React.lazy(() => import('../sms/FrequencyCapping'));
const DoNoDisturb = React.lazy(() => import('../sms/DoNotDisturb'));

const FCandDND = ({
  channelType,
  getConnectorList,
  emailList,
  getCountryList,
  countryListData,
}) => {
  let emailListData = [];
  let countryListOptions = [];

  useEffect(() => {
    getConnectorList(CommonEnums.EMAIL);
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

  if (emailList && emailList.length > 0) {
    emailListData = emailList.map((item) => {
      return {
        id: item.channel_id,
        value: item.channel_name,
      };
    });
    emailListData.unshift({
      id: '',
      value: 'CHANNEL_MGMT.SMS_CHANNEL.NO_CONNECTOR_SELECTED',
    });
  }

  return (
    <>
      <FrequencyCapping
        channelType={channelType}
        connectorDropDownData={emailListData}
      />
      <DoNoDisturb
        channelType={channelType}
        connectorDropDownData={emailListData}
        countryList={countryListOptions}
      />
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { tataEmailConnectors, countryList } = settingsChannels;
  return { emailList: tataEmailConnectors, countryListData: countryList };
};

export default connect(mapStateToProps, {
  getConnectorList: getEmailConnectorList,
  getCountryList: getCountryDropdownList,
})(FCandDND);
