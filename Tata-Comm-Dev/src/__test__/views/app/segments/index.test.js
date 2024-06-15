import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import Segments from 'views/app/segments';
import AllSegments from 'views/app/segments/all-segments';
import CreateSegment from 'views/app/segments/create-segment';
import ImportUsers from 'views/app/segments/import-users';
import RFMSegment from 'views/app/segments/rfm-segment';
import S3SFTPImports from 'views/app/segments/s3-sftp-imports';
import { CustomWrapper } from 'test-utils';

describe('Segments Routing', () => {
  const match = { url: '/app/accounts/3/segments' };

  test('should navigate to Allsegments routes', () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/all-segments`]}>
          <Segments match={match} />
          <Route
            exact
            path={`${match.url}/all-segments`}
            component={AllSegments}
          />
        </MemoryRouter>
      </CustomWrapper>
    );
    const allSegments = screen.getAllByText(/all segments/i);
    expect(allSegments.length).toBeGreaterThan(0);
  });
  test('should navigate to createSegment routes', () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/create-segment`]}>
          <Segments match={match} />
          <Route
            exact
            path={`${match.url}/create-segment`}
            component={CreateSegment}
          />
        </MemoryRouter>
      </CustomWrapper>
    );
    const createSegmant = screen.getAllByText(/Create Segment/i);
    expect(createSegmant.length).toBeGreaterThan(0);
  });
  test('should navigate to importUsers routes', () => {
    render(
      <MemoryRouter initialEntries={[`${match.url}/import-users`]}>
        <Segments match={match} />
        <Route
          exact
          path={`${match.url}/import-users`}
          component={ImportUsers}
        />
      </MemoryRouter>
    );
    expect(screen.findByText(/Import Users/i)).toBeDefined();
  });
  test('should navigate to importUsers routes', () => {
    render(
      <MemoryRouter initialEntries={[`${match.url}/rfm-segment`]}>
        <Segments match={match} />
        <Route exact path={`${match.url}/rfm-segment`} component={RFMSegment} />
      </MemoryRouter>
    );
    expect(screen.getByText(/rfmSegment/i)).toBeInTheDocument();
  });
  test('should navigate to importUsers routes', () => {
    render(
      <MemoryRouter initialEntries={[`${match.url}/db-imports`]}>
        <Segments match={match} />
        <Route
          exact
          path={`${match.url}/db-imports`}
          component={S3SFTPImports}
        />
      </MemoryRouter>
    );
    waitFor(() => {
      const sftpSegmant = screen.getAllByText('S3/SFTP Import');
      expect(sftpSegmant.length).toBeGreaterThan(0);
    });
  });
});
