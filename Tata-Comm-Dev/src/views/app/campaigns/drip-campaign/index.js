import React, { Suspense } from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';

const DripCampaignList = React.lazy(() => import('./list'));
const CreateDripCampaign = React.lazy(() => import('./new'));

const DripCampaign = ({ match }) => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
        <Route
          path={`${match.url}/list`}
          render={(props) => <DripCampaignList {...props} />}
        />
        <Route
          path={`${match.url}/create-flow`}
          render={(props) => <CreateDripCampaign {...props} />}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
};

export default DripCampaign;
