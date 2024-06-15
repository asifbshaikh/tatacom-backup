import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const LabelsList = React.lazy(() =>
    import(/* webpackChunkName: "settings-labels-list" */ './list')
);

const LabelsInboxes = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
                path={`${match.url}/list`}
                render={(props) => <LabelsList {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default LabelsInboxes;