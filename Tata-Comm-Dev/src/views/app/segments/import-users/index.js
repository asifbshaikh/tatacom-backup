import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ImportUserUploadList = React.lazy(() =>
  import(/* webpackChunkName: "settings-inboxes-list" */ './list')
);

const ImportUserUploads = React.lazy(() =>
  import(/* webpackChunkName: "settings-inboxes-list" */ './upload')
);
const ImportUsers = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={(props) => <ImportUserUploadList {...props} />}
      />
      <Route
        path={[`${match.url}/upload`, `${match.url}/upload`]}
        render={(props) => <ImportUserUploads {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ImportUsers;
