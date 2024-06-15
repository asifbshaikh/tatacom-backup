import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import CreateCampaignHeading from '../../../../src/containers/campaigns/CreateCampaignHeading';
import { CustomWrapper } from 'test-utils';
import userEvent from '@testing-library/user-event';

describe('CreateCampaignHeading', () => {
  const sampleProps = {
    match: { url: '', path: '' },
    heading: 'createCampaign',
    addLabel: 'save as draft',
    campaignName: 'Sample Campaign',
    handleBtnClick: jest.fn(),
    channelType: 'sms',
    campaignType: 'one_time',
    enableSaveAsDraftButton: jest.fn(),
  };
  it('renders with the provided props', () => {
    render(
      <CustomWrapper>
        <CreateCampaignHeading {...sampleProps} />
      </CustomWrapper>
    );
    expect(screen.getByText('createCampaign')).toBeInTheDocument();
    expect(screen.getByText(/Sample Campaign/g)).toBeInTheDocument();
    expect(screen.getByText('save as draft')).toBeInTheDocument();
    userEvent.click(screen.getByText('save as draft'));
    expect(sampleProps.handleBtnClick).toHaveBeenCalled();
  });
  it('if statement condition working', () => {
    sampleProps.campaignType = '';
    render(
      <CustomWrapper>
        <CreateCampaignHeading {...sampleProps} />
      </CustomWrapper>
    );
    expect(screen.getByText(/Sample Campaign/g)).toBeInTheDocument();
  });

  it('if statement condition working', () => {
    sampleProps.campaignName = '';
    sampleProps.campaignType = 'periodic';

    render(
      <CustomWrapper>
        <CreateCampaignHeading {...sampleProps} />
      </CustomWrapper>
    );
    expect(screen.getByText(/sms/gi)).toBeInTheDocument();
  });

  it('if statement condition working', () => {
    sampleProps.campaignType = '';
    sampleProps.channelType = '';
    sampleProps.campaignName = 'Sample Campaign';

    render(
      <CustomWrapper>
        <CreateCampaignHeading {...sampleProps} />
      </CustomWrapper>
    );
    expect(screen.getByText(/Sample Campaign/gi)).toBeInTheDocument();
  });
});
