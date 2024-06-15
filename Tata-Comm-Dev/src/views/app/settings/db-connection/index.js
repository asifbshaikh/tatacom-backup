import React, { Suspense } from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';

const DBConnectionList = React.lazy(() => import('./list'));
const DBConnectionNew = React.lazy(() => import('./new'));

const DBConnector = ({ match }) => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
        <Route
          path={`${match.url}/list`}
          render={(props) => <DBConnectionList {...props} />}
        />
        <Route
          path={`${match.url}/new`}
          render={(props) => <DBConnectionNew {...props} />}
        />
        <Route
          path={`${match.url}/edit`}
          render={(props) => <DBConnectionNew {...props} />}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
};

export default DBConnector;
