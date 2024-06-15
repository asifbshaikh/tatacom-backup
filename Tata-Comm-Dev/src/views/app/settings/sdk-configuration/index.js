import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const General = React.lazy(() => import('./general'));

const SDKConfiguration = ({ match }) => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Route
          path={`${match.url}`}
          render={(props) => <General {...props} />}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
};

export default SDKConfiguration;
