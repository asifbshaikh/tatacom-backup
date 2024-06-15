import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ProfilesSettings = React.lazy(() =>
  import(/* webpackChunkName: "profiles-settings" */ './settings')
);

const PagesProfiles = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/settings`} />
      <Route
        path={`${match.url}/settings`}
        render={(props) => <ProfilesSettings {...props} />}
        isExact
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default PagesProfiles;
