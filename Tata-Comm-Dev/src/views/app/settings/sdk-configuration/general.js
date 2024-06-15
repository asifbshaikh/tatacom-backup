import React from 'react';
import SDKConfigurationHeading from 'containers/settings/sdk-configuration/SDKConfigurationHeading';
import SDKAppId from 'containers/settings/sdk-configuration/SDKAppId';

const General = ({ match }) => {
  return (
    <>
      <SDKConfigurationHeading
        heading="SDK_CONFIGURATION.HEADING"
        match={match}
      />
      <SDKAppId />
    </>
  );
};

export default General;
