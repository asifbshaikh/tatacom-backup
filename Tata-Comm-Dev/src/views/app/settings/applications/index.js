import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ApplicationsListAll = React.lazy(() =>
    import(/* webpackChunkName: "settings-applications-listall" */ './listall')
);
const ApplicationsList = React.lazy(() =>
import(/* webpackChunkName: "settings-applications-list" */ './list')
);

const ApplIcationsInboxes = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/listall`} />
            <Route
                path={`${match.url}/listall`}
                render={(props) => <ApplicationsListAll {...props} />}
            />
            <Route
                path={`${match.url}/:applicationid`}
                render={(props) => <ApplicationsList {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default ApplIcationsInboxes;