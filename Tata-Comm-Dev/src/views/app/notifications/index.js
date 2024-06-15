import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const NotificationsList = React.lazy(() =>
  import(/* webpackChunkName: "notifications-list" */ './list')
);

const PagesNotifications = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={(props) => <NotificationsList {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default PagesNotifications;
