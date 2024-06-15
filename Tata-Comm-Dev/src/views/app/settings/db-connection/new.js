import { Separator } from 'components/common/CustomBootstrap';
import DBConnectionForm from 'containers/settings/db-connection/DBConnectionForm';
import DBConnectionHeading from 'containers/settings/db-connection/DBConnectionHeading';
import React from 'react';

const DBConnectionNew = ({ match }) => {
  return (
    <div className="app-row1">
      <DBConnectionHeading
        heading="S3SFTP.DB_SETTING.ADD_NEW_CONNECTION"
        match={match}
        showAddBtn={false}
      />
      <Separator className="mb-5" />
      <DBConnectionForm />
    </div>
  );
};

export default DBConnectionNew;
