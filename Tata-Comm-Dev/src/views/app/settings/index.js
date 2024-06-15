import { UserRole } from 'constants/defaultValues';
import { ProtectedRoute } from 'helpers/authHelper';
import React, { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';

const Inboxes = React.lazy(() =>
  import(/* webpackChunkName: "settings-inboxes" */ './inboxes')
);
const Agents = React.lazy(() =>
  import(/* webpackChunkName: "settings-agents" */ './agents')
);
const Labels = React.lazy(() =>
  import(/* webpackChunkName: "settings-labels" */ './labels')
);
const Canneds = React.lazy(() =>
  import(/* webpackChunkName: "settings-canneds" */ './canneds')
);
const Attributes = React.lazy(() =>
  import(/* webpackChunkName: "settings-attributes" */ './attributes')
);
const Teams = React.lazy(() =>
  import(/* webpackChunkName: "settings-teams" */ './teams')
);
const Integrations = React.lazy(() =>
  import(/* webpackChunkName: "settings-integrations" */ './integrations')
);
const Applications = React.lazy(() =>
  import(/* webpackChunkName: "settings-applications" */ './applications')
);
const Accounts = React.lazy(() =>
  import(/* webpackChunkName: "settings-accounts" */ './accounts')
);
const Channels = React.lazy(() => import('./channels'));

const DBConnectionSetup = React.lazy(() => import('./db-connection'));

const SDKConfiguration = React.lazy(() => import('./sdk-configuration'));

const Settings = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/inboxes`} />
      <ProtectedRoute
        path={`${match.url}/inboxes`}
        // render={(props) => <Inboxes {...props} />}
        component={Inboxes}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/agents`}
        // render={(props) => <Agents {...props} />}
        component={Agents}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/labels`}
        // render={(props) => <Labels {...props} />}
        component={Labels}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/canneds`}
        // render={(props) => <Canneds {...props} />}
        component={Canneds}
        roles={[UserRole.Admin, UserRole.Agent]}
      />
      <ProtectedRoute
        path={`${match.url}/attributes`}
        // render={(props) => <Attributes {...props} />}
        component={Attributes}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/teams`}
        // render={(props) => <Teams {...props} />}
        component={Teams}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/integrations`}
        // render={(props) => <Integrations {...props} />}
        component={Integrations}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/applications`}
        // render={(props) => <Applications {...props} />}
        component={Applications}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/accounts`}
        // render={(props) => <Accounts {...props} />}
        component={Accounts}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/channels`}
        component={Channels}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/db-connection-setup`}
        component={DBConnectionSetup}
        roles={[UserRole.Admin]}
      />

      <ProtectedRoute
        path={`${match.url}/sdk-configuration`}
        component={SDKConfiguration}
        roles={[UserRole.Admin]}
      />

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Settings;
