import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const TeamsList = React.lazy(() =>
    import(/* webpackChunkName: "settings-teams-list" */ './list')
);
const TeamsNew = React.lazy(() =>
    import(/* webpackChunkName: "settings-teams-new" */ './new')
);

const SettingsTeams = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
                path={`${match.url}/list`}
                render={(props) => <TeamsList {...props} />}
            />
            <Route
                path={[
                    `${match.url}/new/:itemid`,
                    `${match.url}/new`,
                ]}
                render={(props) => <TeamsNew {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default SettingsTeams;