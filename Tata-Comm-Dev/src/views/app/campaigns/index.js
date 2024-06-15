import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// const CampaignsList = React.lazy(() => import('./list'));

const CreateCampaign = React.lazy(() => import('./new'));
const SMSTemplate = React.lazy(() => import('./SmsTemplate'));
const DripCampaign = React.lazy(() => import('./drip-campaign'));

const CampaignsContacts = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect
        exact
        from={`${match.url}/`}
        to={`${match.url}/create-campaign`}
      />
      <Route
        path={`${match.url}/create-campaign/:campaignID`}
        render={(props) => <CreateCampaign {...props} />}
      />
      <Route
        path={`${match.url}/create-campaign`}
        render={(props) => <CreateCampaign {...props} />}
        isExact
      />
      <Route
        path={`${match.url}/sms-template`}
        render={(props) => <SMSTemplate {...props} />}
        isExact
      />

      <Route
        path={`${match.url}/flows`}
        render={(props) => <DripCampaign {...props} />}
        isExact
      />
      <Route
        path={`${match.url}/reschedule-campaign/:campaignID`}
        render={(props) => <CreateCampaign {...props} />}
        isExact
      />
      {/* <Route
        path={`${match.url}/list/:campaigntype`}
        render={(props) => <CampaignsList {...props} />}
        isExact
      /> */}
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default CampaignsContacts;
