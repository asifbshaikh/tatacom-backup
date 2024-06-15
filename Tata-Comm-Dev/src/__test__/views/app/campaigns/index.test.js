import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { CustomWrapper } from 'test-utils';
import DashboadCampaigns from 'views/app/dashboards/campaigns';
import CreateCampaign from '../../../../views/app/campaigns/new';
import CampaignsContacts from 'views/app/campaigns';
import SmsTemplate from 'views/app/campaigns/SmsTemplate';
import DripCampaign from 'views/app/campaigns/drip-campaign';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});
describe('campaigns Routing', () => {
  const match = { url: '/app/accounts/3/campaigns' };

  test('render CreateCampaign component with CampaignId', () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/create-campaign/1`]}>
          <CampaignsContacts match={match} />
          <Route
            path={`${match.url}/create-campaign/1`}
            component={CreateCampaign}
          />
        </MemoryRouter>
      </CustomWrapper>
    );
    const smsChannelCard = screen.getByRole('heading', {
      name: /sms/i,
    });
    expect(smsChannelCard).toBeInTheDocument();
  });

  test('render SmsTemplate compoenent', () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/sms-template`]}>
          <CampaignsContacts match={match} />
          <Route path={`${match.url}/sms-template`} component={SmsTemplate} />
        </MemoryRouter>
      </CustomWrapper>
    );

    const templateListHeading = screen.getByRole('heading', {
      name: /template lists/i,
    });
    expect(templateListHeading).toBeInTheDocument();
  });

  test('render DripCampaign component', async () => {
    render(
      <CustomWrapper>
        <MemoryRouter initialEntries={[`${match.url}/flows/list`]}>
          <CampaignsContacts match={match} />
          <Route path={`${match.url}/flows/list`} component={DripCampaign} />
        </MemoryRouter>
      </CustomWrapper>
    );

    await waitFor(() => {
      const createFlowBtn = screen.getAllByRole('button', {
        name: /\+ create flow/i,
      });
      expect(createFlowBtn[0]).toBeInTheDocument();
    });
  });
});
