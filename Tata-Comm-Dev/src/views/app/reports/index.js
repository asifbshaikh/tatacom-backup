import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Overview = React.lazy(() =>
    import(/* webpackChunkName: "reports-overview" */ './overview')
);
const Agent = React.lazy(() =>
    import(/* webpackChunkName: "reports-agent" */ './agent')
);
const Label = React.lazy(() =>
    import(/* webpackChunkName: "reports-label" */ './label')
);
const Inbox = React.lazy(() =>
    import(/* webpackChunkName: "reports-inbox" */ './inbox')
);
const Team = React.lazy(() =>
    import(/* webpackChunkName: "reports-team" */ './team')
);
const Csat = React.lazy(() =>
    import(/* webpackChunkName: "reports-csat" */ './csat')
);
const Users = React.lazy(() =>
    import('./users')
);

const Reports = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/overview`} />
            <Route
                path={`${match.url}/overview`}
                render={(props) => <Overview {...props} />}
            />
            <Route
                path={`${match.url}/agent`}
                render={(props) => <Agent {...props} />}
            />
            <Route
                path={`${match.url}/label`}
                render={(props) => <Label {...props} />}
            />
            <Route
                path={`${match.url}/inbox`}
                render={(props) => <Inbox {...props} />}
            />
            <Route
                path={`${match.url}/team`}
                render={(props) => <Team {...props} />}
            />
            <Route
                path={`${match.url}/csat`}
                render={(props) => <Csat {...props} />}
            />
              <Route
                path={`${match.url}/users`}
                render={(props) => <Users {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Reports;