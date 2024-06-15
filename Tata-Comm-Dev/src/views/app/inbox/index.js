import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const InboxList = React.lazy(() =>
  import(/* webpackChunkName: "inbox-list" */ './list')
);

const PagesInbox = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={[
          `${match.url}/list/label/:labelid`,
          `${match.url}/list/:conversationtype/conversations`,
          `${match.url}/list/conversations/:conversationid`,
          `${match.url}/list/custom_view/:filterId/conversations/:conversationid`,
          `${match.url}/list/custom_view/:filterId`,
          `${match.url}/list/:inboxid`,
          `${match.url}/list`,
        ]}
        render={(props) => <InboxList {...props} />}
        isExect
      />

      {/*
      <Route
        path={`${match.url}/list/label/:labelid`}
        render={(props) => <InboxList {...props} />}
        isExect
      />
      <Route
        path={`${match.url}/list/:conversationtype/conversations`}
        render={(props) => <InboxList {...props} />}
        isExect
      />
      <Route
        path={`${match.url}/list/conversations/:conversationid`}
        render={(props) => <InboxList {...props} />}
        isExect
      />
      <Route
        path={`${match.url}/list/conversations/:conversationid`}
        render={(props) => <InboxList {...props} />}
        isExect
      />
      <Route
        path={`${match.url}/list/:inboxid`}
        render={(props) => <InboxList {...props} />}
        isExect
      />
      <Route
        path={`${match.url}/list`}
        render={(props) => <InboxList {...props} />}
      />
      */}
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default PagesInbox;
