import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ABComparisonCampaignMappping from 'containers/dashboards/ab-comparison/ABComparisonCampaignMappping';
import configureMockStore from 'redux-mock-store';

jest.mock('react-select', () => {
  return function cb({ options, value, onChange, dataTestID }) {
    function handleChange(event) {
      const option = options.find(
        (option) => option.value === event.target.value
      );
      onChange(option);
    }

    return (
      <select data-testid={dataTestID} value={value} onChange={handleChange}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  };
});

describe('ABComparisonCampaignMappping component', () => {
  const mockStore = configureMockStore();
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ABComparisonCampaignMappping />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('Campaign 1 and Campaign 2 to be in the document', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <ABComparisonCampaignMappping />
      </CustomWrapper>
    );
    await waitFor(() => {
      expect(getByText('Campaign 1')).toBeInTheDocument();
      expect(getByText('Campaign 2')).toBeInTheDocument();
    });
  });

  it('Display analytic results', async () => {
    const initialState = {
      dashboardCampaignsApp: {
        abDashboardCampaign1List: [
          {
            id: '1061',
            title: 'Test campaign sms',
          },
          {
            id: '1062',
            title: 'Test campaign email',
          },
          {
            id: '1063',
            title: 'Test campaign sms',
          },
        ],
        abDashboardCampaign2List: [
          {
            id: '1051',
            title: 'Test campaign sms',
          },
          {
            id: '1052',
            title: 'Test campaign email',
          },
          {
            id: '1053',
            title: 'Test campaign sms',
          },
        ],
        campaign1Info: {
          campaign: {
            campaign_analytics: {
              ab_comparison: {
                conversion_events: {
                  value: 10,
                  percentage: false,
                  label: 'Conversion Events',
                },
                click_through_rate: {
                  value: 500,
                  percentage: false,
                  label: 'Click Through Rate',
                },
                average_order_value: {
                  value: 10,
                  percentage: false,
                  label: 'Average Order Value',
                },
                clicks: {
                  value: 43,
                  percentage: true,
                  label: 'Clicks',
                },
              },
            },
          },
        },
        campaign2Info: {
          campaign: {
            campaign_analytics: {
              ab_comparison: {
                delivery_rate: {
                  value: 8,
                  percentage: false,
                  label: 'Delivery Rate',
                },
                delivered: {
                  value: 600,
                  percentage: false,
                  label: 'Delivered',
                },
                conversion_events: {
                  value: 8,
                  percentage: false,
                  label: 'Conversion Events',
                },
                conversions: {
                  value: 67,
                  percentage: true,
                  label: 'Conversions',
                },
                generic_api_call_error: {
                  value: 67,
                  percentage: true,
                  label: 'Generic API Call Error',
                },
              },
            },
          },
        },
      },
    };
    const store = mockStore(initialState);

    const { findAllByTestId, getAllByText } = render(
      <CustomWrapper>
        <ABComparisonCampaignMappping store={store} />
      </CustomWrapper>
    );
    await waitFor(async () => {
      const channelDropdown = await findAllByTestId('abChannelSelect');
      fireEvent.change(channelDropdown[0], {
        target: {
          value: 'push',
        },
      });
      const campaignDropdown = await findAllByTestId('abCampaignSelect');
      fireEvent.change(campaignDropdown[0], {
        target: {
          value: '1062',
        },
      });
      expect(getAllByText('Click Through Rate')).toHaveLength(1);
      fireEvent.change(channelDropdown[1], {
        target: {
          value: 'sms',
        },
      });
      fireEvent.change(campaignDropdown[1], {
        target: {
          value: '1053',
        },
      });
      expect(getAllByText('Conversions')).toHaveLength(1);
    });
  });
});
