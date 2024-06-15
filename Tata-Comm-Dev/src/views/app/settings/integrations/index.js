import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const IntegrationsList = React.lazy(() =>
    import(/* webpackChunkName: "settings-integrations-list" */ './list')
);

const IntegrationsInboxes = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
                path={`${match.url}/list`}
                render={(props) => <IntegrationsList {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default IntegrationsInboxes;