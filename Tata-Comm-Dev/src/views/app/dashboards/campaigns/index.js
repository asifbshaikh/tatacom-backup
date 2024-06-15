import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const DashboadCampaignsList = React.lazy(() => import('./list'));
const InfoView = React.lazy(() => import('../../infoview'));

const DashboadCampaigns = ({ match }) => {
  return (
    <div>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
          <Route
            path={`${match.url}/list`}
            render={(props) => <DashboadCampaignsList {...props} />}
          />
          <Route
            path={`${match.url}/campaign/:campaignID`}
            component={InfoView}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </div>
  );
};

export default DashboadCampaigns;
