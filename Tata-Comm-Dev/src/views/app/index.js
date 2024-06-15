import React, { Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from 'layout/AppLayout';
import { ProtectedRoute } from 'helpers/authHelper';
import { UserRole } from 'constants/defaultValues';
import { getCurrentUserAccount } from 'helpers/Utils';
import CommonEnums from 'enums/commonEnums';
// import { currentAccount } from 'helpers/Utils';
// import { ProtectedRoute, UserRole } from 'helpers/authHelper';

const Dashboards = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './dashboards')
);
// const Pages = React.lazy(() =>
//   import(/* webpackChunkName: "pages" */ './pages')
// );
// const Applications = React.lazy(() =>
//   import(/* webpackChunkName: "applications" */ './applications')
// );
// const Ui = React.lazy(() => import(/* webpackChunkName: "ui" */ './ui'));
// const Menu = React.lazy(() => import(/* webpackChunkName: "menu" */ './menu'));
// const BlankPage = React.lazy(() =>
//   import(/* webpackChunkName: "blank-page" */ './blank-page')
// );
const Segments = React.lazy(() => import('./segments'));
const Contacts = React.lazy(() =>
  import(/* webpackChunkName: "pages-contacts" */ './contacts')
);
const Inbox = React.lazy(() =>
  import(/* webpackChunkName: "pages-inbox" */ './inbox')
);
const Settings = React.lazy(() =>
  import(/* webpackChunkName: "pages-settings" */ './settings')
);
const Reports = React.lazy(() =>
  import(/* webpackChunkName: "pages-reports" */ './reports')
);
const Campaigns = React.lazy(() =>
  import(/* webpackChunkName: "pages-campaigns" */ './campaigns')
);
const Profiles = React.lazy(() =>
  import(/* webpackChunkName: "pages-profiles" */ './profiles')
);
const Notifications = React.lazy(() =>
  import(/* webpackChunkName: "pages-notifications" */ './notifications')
);
const HelpCenter = React.lazy(() => import('./helpCenter'));
const ResetPassword = React.lazy(() => import('../user/reset-password'));

const App = ({ match }) => {
  const appPrefix = '';
  const currentAccountDetails = getCurrentUserAccount();
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect
              exact
              from={`${match.url}/`}
              to={
                currentAccountDetails?.role !== CommonEnums.AGENT
                  ? `${match.url}${appPrefix}/dashboards`
                  : `${match.url}${appPrefix}/contacts`
              }
            />
            {currentAccountDetails?.role !== CommonEnums.AGENT && (
              <Route
                path={`${match.url}/dashboards`}
                render={(props) => <Dashboards {...props} />}
              />
            )}
            {currentAccountDetails?.role !== CommonEnums.AGENT && (
              <Route
                path={`${match.url}/segments`}
                render={(props) => <Segments {...props} />}
              />
            )}
            <Route
              path={`${match.url}${appPrefix}/contacts`}
              render={(props) => <Contacts {...props} />}
            />
            <Route
              path={`${match.url}${appPrefix}/helpCenter`}
              render={(props) => <HelpCenter {...props} />}
            />
            <Route
              path={`${match.url}${appPrefix}/inbox`}
              render={(props) => <Inbox {...props} />}
            />
            <ProtectedRoute
              path={`${match.url}${appPrefix}/settings`}
              // render={(props) => <Settings {...props} />}
              component={Settings}
            />
            <ProtectedRoute
              path={`${match.url}${appPrefix}/reports`}
              // render={(props) => <Reports {...props} />}
              component={Reports}
              roles={[UserRole.Admin]}
            />
            <Route
              path={`${match.url}${appPrefix}/campaigns`}
              // render={(props) => <Campaigns {...props} />}
              component={Campaigns}
              roles={[UserRole.Admin]}
            />
            {/* <Route
              path={`${match.url}/applications`}
              render={(props) => <Applications {...props} />}
            /> */}
            <ProtectedRoute
              path={`${match.url}/profile`}
              // render={(props) => <Accounts {...props} />}
              component={Profiles}
              roles={[UserRole.Admin, UserRole.Agent]}
            />
            <Route
              path={`${match.url}${appPrefix}/notifications`}
              render={(props) => <Notifications {...props} />}
            />
            <Route
              path={`${match.url}/reset-password?reset_password_token=:resetToken`}
              render={(props) => <ResetPassword {...props} />}
            />
            {/* <ProtectedRoute
                    path={`${match.url}/applications`}
                    component={Applications}
                    roles={[UserRole.Admin]}
            /> */}
            {/* <Route
              path={`${match.url}/pages`}
              render={(props) => <Pages {...props} />}
            />
            <Route
              path={`${match.url}/ui`}
              render={(props) => <Ui {...props} />}
            />
            <Route
              path={`${match.url}/menu`}
              render={(props) => <Menu {...props} />}
            />
            <Route
              path={`${match.url}/blank-page`}
              render={(props) => <BlankPage {...props} />}
            /> */}
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
