import { UserRole } from 'constants/defaultValues';
import { ProtectedRoute } from 'helpers/authHelper';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SegmentType from './SegmentType';
import UserProfile from './userProfile';

const AllSegments = React.lazy(() => import('./all-segments'));
const CreateSegment = React.lazy(() => import('./create-segment'));
const RFMSegment = React.lazy(() => import('./rfm-segment'));
const ImportUsers = React.lazy(() => import('./import-users'));
const S3SftpImports = React.lazy(() => import('./s3-sftp-imports'));
const RecentEvents = React.lazy(() => import('./recent-events'));

const Segments = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/all-segments`} />
      <Route
        path={`${match.url}/all-segments/segment-info/:segmentionId/:userId`}
        render={(props) => <UserProfile {...props} />}
      />
      <Route
        path={`${match.url}/all-segments/segment-info/:segmentionId`}
        render={(props) => <SegmentType {...props} />}
      />
      <Route
        path={`${match.url}/all-segments`}
        render={(props) => <AllSegments {...props} />}
        exact
      />
      <Route
        path={`${match.url}/create-segment`}
        render={(props) => <CreateSegment {...props} />}
      />
      <Route
        path={`${match.url}/rfm-segment`}
        render={(props) => <RFMSegment {...props} />}
      />
      <ProtectedRoute
        path={`${match.url}/import-users`}
        component={ImportUsers}
        roles={[UserRole.Admin, UserRole.Agent]}
      />
      <Route
        path={`${match.url}/db-imports`}
        component={S3SftpImports}
        roles={[UserRole.Admin, UserRole.Agent]}
      />
      <Route
        path={`${match.url}/recent-events`}
        component={RecentEvents}
        roles={[UserRole.Admin, UserRole.Agent]}
      />

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Segments;
