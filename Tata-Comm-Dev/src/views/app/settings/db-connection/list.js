import React from 'react';
import DBConnectionHeading from 'containers/settings/db-connection/DBConnectionHeading';
import DBConnectionListing from 'containers/settings/db-connection/DBConnectionListing';

const DBConnectionList = ({ match }) => {
  return (
    <div className="app-row1">
      <DBConnectionHeading
        heading="S3SFTP.DB_SETTING.DB_SETTING_LABEL"
        match={match}
        showAddBtn={true}
      />
      <DBConnectionListing />
    </div>
  );
};

export default DBConnectionList;
