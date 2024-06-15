import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const AttributesList = React.lazy(() =>
    import(/* webpackChunkName: "settings-attributes-list" */ './list')
);

const AttributesInboxes = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
                path={`${match.url}/list`}
                render={(props) => <AttributesList {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default AttributesInboxes;