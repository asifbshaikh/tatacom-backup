import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { CustomWrapper } from 'test-utils';
import DashboadCampaigns from 'views/app/dashboards/campaigns';
import DashboadCampaignsList from 'views/app/dashboards/campaigns/list';
import infoview from 'views/app/infoview';

describe('dashboard routing', () => {
  const match = { url: '/app/accounts/3/dashboards/all-campaigns' };

  test('render DashboadCampaignsList component', () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/list`]}>
          <DashboadCampaigns match={match} />
          <Route
            exact
            path={`${match.url}/list`}
            component={DashboadCampaignsList}
          />
        </MemoryRouter>
      </CustomWrapper>
    );
    const allCampaignsHeading = screen.getByRole('heading', {
      name: /all campaigns/i,
    });
    expect(allCampaignsHeading).toBeInTheDocument();
  });

  test('render InfoView component', () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/campaign/1`]}>
          <DashboadCampaigns match={match} />
          <Route exact path={`${match.url}/campaign/1`} component={infoview} />
        </MemoryRouter>
      </CustomWrapper>
    );
    const analylticsHeading = screen.getByRole('heading', {
      name: /analytics/i,
    });
    expect(analylticsHeading).toBeInTheDocument();
  });
});
