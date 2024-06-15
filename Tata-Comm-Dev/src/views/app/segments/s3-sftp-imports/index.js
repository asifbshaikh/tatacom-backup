import ImportSchedulerDetail from 'components/s3-sftp/ImportSchedulerDetail';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const S3SFTPUploadList = React.lazy(() => import('./list'));

const S3SFTPUploads = React.lazy(() => import('./upload'));
const S3SftpImports = ({ match }) => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
        <Route
          path={`${match.url}/list`}
          render={(props) => <S3SFTPUploadList {...props} />}
        />
        <Route
          path={[`${match.url}/upload/:importType`]}
          render={(props) => <S3SFTPUploads {...props} />}
        />
        <Route
          path={`${match.url}/scheduler-info/:ImportSchedulerId`}
          render={(props) => <ImportSchedulerDetail {...props} />}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
};
export default S3SftpImports;
