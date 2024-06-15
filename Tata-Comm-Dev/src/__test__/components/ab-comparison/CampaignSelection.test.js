import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import CampaignSelection from 'components/ab-comparison/CampaignSelection';
import { CustomWrapper } from 'test-utils';
jest.mock('react-select', () => {
  return function cb({ options, value, onChange, dataTestID }) {
    function handleChange(event) {
      const option = options.find(
        (option) => option.value === event.currentTarget.value
      );
      onChange({ value: option });
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

describe('Comparison select components', () => {
  const campaigns = [
    {
      id: '1065',
      title: 'Test campaign sms',
    },
    {
      id: '1064',
      title: 'Test campaign sms',
    },
  ];
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <CampaignSelection
          campaigns={campaigns}
          heading="DASHBOARD.AB_COMPARISON.SELECT_CAMPAIGN_1"
          sectionTitle="DASHBOARD.AB_COMPARISON.CAMPAIGN_1"
          setFilterCampaignList={jest.fn()}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('select channel change', () => {
    const onChannelChange = jest.fn();
    const onCampaignChange = jest.fn();
    const setChannelChannelChange = jest.fn();
    render(
      <CustomWrapper>
        <CampaignSelection
          campaigns={campaigns}
          heading="DASHBOARD.AB_COMPARISON.SELECT_CAMPAIGN_1"
          sectionTitle="DASHBOARD.AB_COMPARISON.CAMPAIGN_1"
          setFilterCampaignList={onChannelChange}
          getCampaign={onCampaignChange}
          setChannelValue={setChannelChannelChange}
          channelValue={''}
        />
      </CustomWrapper>
    );

    const channelDropdown = screen.getByTestId('abChannelSelect');
    fireEvent.change(channelDropdown, { target: { value: 'sms' } });
    expect(onChannelChange).toHaveBeenCalledTimes(1);
    const campaignDropdown = screen.getByTestId('abCampaignSelect');
    fireEvent.change(campaignDropdown, { target: { value: '1064' } });
    expect(onChannelChange).toHaveBeenCalledTimes(1);
  });
});
