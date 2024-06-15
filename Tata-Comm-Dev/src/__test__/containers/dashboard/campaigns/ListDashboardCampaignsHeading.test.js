import { describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ListDashboardCampaignsHeading from 'containers/dashboards/campaigns/ListDashboardCampaignsHeading';
import { CustomWrapper } from 'test-utils';

describe('ListDashboardCampaignsHeading component', () => {
  const match = {
    url: 'app/accounts/1/dashboards/all-campaigns/list',
    path: 'app/accounts/1/dashboards/all-campaigns/list',
  };
  const mockObject = {
    heading: 'DASHBOARD.CAMPAIGN.LABELS.ALL_CAMPAIGN_FOR',
    setFilters: jest.fn(),
    setShowRefresh: jest.fn(),
  };

  it('Render ListDashboardCampaignsHeading', async () => {
    const { getAllByText } = render(
      <CustomWrapper>
        <ListDashboardCampaignsHeading match={match} {...mockObject} />
      </CustomWrapper>
    );

    await waitFor(() => {
      const text = getAllByText('All Campaigns')[0];
      expect(text).toBeInTheDocument();
    });
  });

  it('reset button should be in the document', async () => {
    const { getAllByText, getByTestId } = render(
      <CustomWrapper>
        <ListDashboardCampaignsHeading match={match} {...mockObject} />
      </CustomWrapper>
    );

    await waitFor(() => {
      const text = getAllByText('All Campaigns')[0];
      expect(text).toBeInTheDocument();
      getByTestId('resetBtn');
    });

    const resetBtn = getByTestId('resetBtn');
    fireEvent.click(resetBtn);
    expect(resetBtn).toBeInTheDocument();
  });

  it('refresh button should be in the document', async () => {
    const { getAllByText, getByTestId } = render(
      <CustomWrapper>
        <ListDashboardCampaignsHeading match={match} {...mockObject} />
      </CustomWrapper>
    );

    await waitFor(() => {
      const text = getAllByText('All Campaigns')[0];
      expect(text).toBeInTheDocument();
      getByTestId('refreshBtn');
    });

    const refreshBtn = getByTestId('refreshBtn');
    fireEvent.click(refreshBtn);
    expect(refreshBtn).toBeInTheDocument();
  });
});
