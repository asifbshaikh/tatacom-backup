import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';

const RecentEventList = React.lazy(() => import('./list'));

const RecentEvents = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}`}
        render={(props) => <RecentEventList {...props} />}
      />
    </Switch>
  </Suspense>
);

export default RecentEvents;
