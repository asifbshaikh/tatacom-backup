import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const InboxesList = React.lazy(() =>
    import(/* webpackChunkName: "settings-inboxes-list" */ './list')
);
const InboxesNew = React.lazy(() =>
    import(/* webpackChunkName: "settings-inboxes-new" */ './new')
);
const InboxesEdit = React.lazy(() =>
    import(/* webpackChunkName: "settings-inboxes-edit" */ './edit')
);

const SettingsInboxes = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
                path={`${match.url}/list`}
                render={(props) => <InboxesList {...props} />}
            />
            <Route
                path={[
                    `${match.url}/new`,
                    `${match.url}/new/:inboxchannel`
                ]}
                render={(props) => <InboxesNew {...props} />}
            />
            <Route
                path={`${match.url}/:inboxid`}
                render={(props) => <InboxesEdit {...props} />}
            />
            {/* <Route
                path={`${match.url}/:inboxid`}
                render={(props) => <InboxesUpdate {...props} />}
            />
            <Route
                path={[
                    `${match.url}/new`,
                    `${match.url}/new/:inboxid`
                ]}
                render={(props) => <InboxesAdd {...props} />}
            /> */}
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default SettingsInboxes;