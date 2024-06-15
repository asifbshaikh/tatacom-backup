import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import ImportUserUploadList from 'views/app/segments/import-users/list';
import S3SftpImports from 'views/app/segments/s3-sftp-imports';
import ImportUserUploads from 'views/app/segments/import-users/upload';
import { CustomWrapper } from 'test-utils';
import { Route, MemoryRouter, Router } from 'react-router-dom';

import React, { Suspense } from 'react';
import S3SFTPUploadList from 'views/app/segments/s3-sftp-imports/list';
import S3SFTPUploads from 'views/app/segments/s3-sftp-imports/upload';
import ImportSchedulerDetail from 'components/s3-sftp/ImportSchedulerDetail';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});

describe('S3SFTP import component', () => {
  const match = {
    url: 'app/accounts/3/segments/db-imports',
    path: '',
  };

  it('render without crashing', () => {
    const commonProps = {
      heading: 'DB Import',
      match: {
        url: '/app/accounts/3/segments/db-imports',
        path: '',
      },
    };
    const { asFragment } = render(
      <CustomWrapper>
        <S3SftpImports {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should navigate to List route', () => {
    const { getAllByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <MemoryRouter initialEntries={[`${match.url}/list`]}>
            <S3SftpImports match={match} />
            <Route
              exact
              path={`${match.url}/list`}
              component={S3SFTPUploadList}
            />
          </MemoryRouter>
        </Suspense>
      </CustomWrapper>
    );

    expect(getAllByText('DB Import')[0]).toBeInTheDocument();
  });

  test('should navigate to Upload route', () => {
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <MemoryRouter initialEntries={[`${match.url}/upload/audience`]}>
            <S3SftpImports match={match} />
            <Route
              exact
              path={`${match.url}/upload`}
              component={S3SFTPUploads}
            />
          </MemoryRouter>
        </Suspense>
      </CustomWrapper>
    );
  });

  test('should navigate to Scheduler info route', () => {
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <MemoryRouter initialEntries={[`${match.url}/scheduler-info/25`]}>
            <S3SftpImports match={match} />
            <Route
              exact
              path={`${match.url}/scheduler-info`}
              component={ImportSchedulerDetail}
            />
          </MemoryRouter>
        </Suspense>
      </CustomWrapper>
    );
  });
});
