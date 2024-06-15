import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const DashboadCampaigns = React.lazy(() => import('./campaigns'));
const ABComparison = React.lazy(() => import('./ab-comparison'));

const Dashboards = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect
        exact
        from={`${match.url}/`}
        to={`${match.url}/all-campaigns`}
      />
      <Route
        path={`${match.url}/all-campaigns`}
        render={(props) => <DashboadCampaigns {...props} />}
      />
      <Route
        path={`${match.url}/ab-comparison`}
        render={(props) => <ABComparison {...props} />}
      />

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Dashboards;
