import { render, screen, waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { describe, expect } from '@jest/globals';
import ImportUserUploadList from 'views/app/segments/import-users/list';
import ImportUsers from 'views/app/segments/import-users';
import ImportUserUploads from 'views/app/segments/import-users/upload';
import { CustomWrapper } from 'test-utils';

describe('ImportUsers component', () => {
  const match = { url: '/app/accounts/3/segments/import-users' };
  test('should navigate to list routes', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <>
          <ImportUsers match={match} />
          <Route
            exact
            path={`${match.url}/list`}
            component={ImportUserUploadList}
          />
        </>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should navigate to upload routes', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <>
          <ImportUsers match={match} />
          <Route
            exact
            path={`${match.url}/list`}
            component={ImportUserUploads}
          />
        </>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
