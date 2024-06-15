import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const AccountsEdit = React.lazy(() =>
    import(/* webpackChunkName: "settings-accounts-edit" */ './edit')
);

const SettingsAccounts = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/edit`} />
            <Route
                path={`${match.url}/edit`}
                render={(props) => <AccountsEdit {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default SettingsAccounts;