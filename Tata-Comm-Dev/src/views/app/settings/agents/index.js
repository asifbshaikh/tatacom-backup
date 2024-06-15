import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const AgentsList = React.lazy(() =>
    import(/* webpackChunkName: "settings-agents-list" */ './list')
);

const AgentsInboxes = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
                path={`${match.url}/list`}
                render={(props) => <AgentsList {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default AgentsInboxes;