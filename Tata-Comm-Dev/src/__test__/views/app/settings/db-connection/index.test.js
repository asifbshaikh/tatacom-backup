import { render, waitFor, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import DBConnector from 'views/app/settings/db-connection';
import { CustomWrapper } from 'test-utils';
import DBConnectionList from 'views/app/settings/db-connection/list';
import { Route, MemoryRouter, Router } from 'react-router-dom';
import React, { Suspense } from 'react';
import DBConnectionEdit from 'views/app/settings/db-connection/edit';
import DBConnectionNew from 'views/app/settings/db-connection/new';
import { createMemoryHistory } from 'history';
import DBConnectionForm from 'views/app/settings/db-connection/new';

describe('EditDBConnection component', () => {
  const match = {
    url: 'app/accounts/1/settings/db-connection-setup',
    path: '',
  };

  it('render without crashing', () => {
    const commonProps = {
      heading: 'Database Connection',
      match: {
        url: '/app/accounts/1/settings/db-connection-setup',
        path: '',
      },
    };
    const { asFragment } = render(
      <CustomWrapper>
        <DBConnector {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should navigate to DBConnectionList route', () => {
    const { getByText } = render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/list`]}>
          <DBConnector match={match} />
          <Route
            exact
            path={`${match.url}/list`}
            component={DBConnectionList}
          />
        </MemoryRouter>
      </CustomWrapper>
    );
    expect(getByText('Add Connection')).toBeInTheDocument();
  });

  test('should navigate to DBConnectionForm route', () => {
    const { getByText } = render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/new`]}>
          <DBConnector match={match} />
          <Route exact path={`${match.url}/new`} component={DBConnectionForm} />
        </MemoryRouter>
      </CustomWrapper>
    );
    expect(getByText('Add New Connection')).toBeInTheDocument();
  });

  test('should navigate to DBConnectionEdit route', () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/edit`]}>
          <DBConnector match={match} />
          <Route
            exact
            path={`${match.url}/edit`}
            component={DBConnectionEdit}
          />
        </MemoryRouter>
      </CustomWrapper>
    );
    expect(screen.getAllByText('Edit Connection')[0]).toBeInTheDocument();
  });
});
