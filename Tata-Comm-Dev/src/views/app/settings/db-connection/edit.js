import React from 'react';
import DBConnectionHeading from 'containers/settings/db-connection/DBConnectionHeading';
import DBConnectionForm from 'containers/settings/db-connection/DBConnectionForm';

const DBConnectionEdit = ({ match }) => {
  return (
    <div className="app-row1">
      <DBConnectionHeading
        heading="S3SFTP.DB_SETTING.EDIT_CONNECTION"
        match={match}
        showAddBtn={false}
      />
      <DBConnectionForm />
    </div>
  );
};

export default DBConnectionEdit;
