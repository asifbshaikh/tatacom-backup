import React, { Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { validityCheck } from 'redux/actions';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import { NotificationContainer } from './components/common/react-notifications';
import {
  isMultiColorActive,
  adminRoot,
  UserRole,
} from './constants/defaultValues';
import { getDirection, flattenMessages } from './helpers/Utils';
import { ProtectedRoute } from './helpers/authHelper';
import { ErrorBoundary } from 'components/error-boundaries/ErrorBoundary';

const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/app')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);
const ViewUnauthorized = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/unauthorized')
);
const SurveyResponse = React.lazy(() =>
  import(
    /* webpackChunkName: "views-survey" */ 'containers/inbox/SurveyResponse'
  )
);

const App = ({ locale, validityCheckAction }) => {
  const direction = getDirection();
  const currentAppLocale = AppLocale[locale];
  useEffect(() => {
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [direction]);
  useEffect(() => {
    if (window.location.pathname.startsWith('/app')) {
      validityCheckAction();
    }
  }, []);

  return (
    <div className="h-100">
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={flattenMessages(currentAppLocale.messages)}
      >
        <>
          <ErrorBoundary>
            <NotificationContainer />
          </ErrorBoundary>
          {isMultiColorActive && <ColorSwitcher />}
          <Suspense fallback={<div className="loading" />}>
            <Router>
              <Switch>
                <Redirect exact from="/" to={adminRoot} />
                <Redirect exact from="/app" to={adminRoot} />
                <ProtectedRoute
                  path={adminRoot}
                  component={ViewApp}
                  roles={[UserRole.Admin, UserRole.Agent]}
                />
                <Route
                  path="/user"
                  render={(props) => <ViewUser {...props} />}
                />
                <Route
                  path="/error"
                  exact
                  render={(props) => <ViewError {...props} />}
                />
                <Route
                  path="/unauthorized"
                  exact
                  render={(props) => <ViewUnauthorized {...props} />}
                />
                <Route
                  path={'/survey/responses/:id'}
                  render={() => <SurveyResponse />}
                  isExect
                />
                <Redirect to="/error" />
              </Switch>
            </Router>
          </Suspense>
        </>
      </IntlProvider>
    </div>
  );
};

const mapStateToProps = ({ authUser, settings }) => {
  const { currentUser } = authUser;
  const { locale } = settings;
  return { currentUser, locale };
};
const mapActionsToProps = {
  validityCheckAction: validityCheck,
};

export default connect(mapStateToProps, mapActionsToProps)(App);
