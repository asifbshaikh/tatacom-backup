import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const CannedsList = React.lazy(() =>
    import(/* webpackChunkName: "settings-canneds-list" */ './list')
);

const CannedsInboxes = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
                path={`${match.url}/list`}
                render={(props) => <CannedsList {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default CannedsInboxes;