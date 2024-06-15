import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import CreateCampaign from '../../../../views/app/campaigns/new';
import { CustomWrapper } from 'test-utils';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});

const smsCampaignSteps = [
  { id: 'select_channel', name: 'Select Channel' },
  { id: 'campaign_type', name: 'Select Campaign' },
  { id: 'target_audience', name: 'Target Audience' },
  { id: 'content_configuration', name: 'Content Configuration' },
  { id: 'schedule_and_goal', name: 'Schedule and Goals' },
];
const currentStep = { id: 'select_channel', name: 'Select Channel' };
const stepClicked = { id: 'campaign_type', name: 'Select Campaign' };
const pushed = jest.fn();
const topNavClick = jest.fn();
describe('Form component', () => {
  const commonProps = {
    match: { url: '', path: '' },
    next: jest.fn(),
    smsCampaignSteps,
    campaignStep: { route: 'campaign_type' },
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <CreateCampaign {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('render without crashing', () => {
    render(
      <CustomWrapper>
        <CreateCampaign {...commonProps} />
      </CustomWrapper>
    );

    const handleTopNavClick = screen.getByRole('link', {
      name: /campaign type/i,
    });
    fireEvent.click(handleTopNavClick);
    expect(topNavClick).toBeTruthy();
    fireEvent.click(screen.getByText(/Next/i));
  });
});
