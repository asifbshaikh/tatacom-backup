import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import CampaignDetails from '../../../../src/containers/campaigns/CampaignDetails';
import { CustomWrapper } from 'test-utils';

describe('CampaignDetails component', () => {
  const form = {
    errors: {},
    values: {
      campaignName: '',
    },
    setFieldValue: jest.fn(),
  };
  it('render component with campaign name and user attribute onChange', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <CampaignDetails
          form={form}
          setCampaignName={jest.fn()}
          campaignTagsOptions={[{ id: 'test', name: 'test' }]}
          colAttributesList={[
            {
              name: 'Email',
              type: 'string',
            },
          ]}
        />
      </CustomWrapper>
    );

    const campaignNameField = getByTestId('campaignNameField');
    const userAttributeField = getByTestId('userAttributeField');
    fireEvent.change(campaignNameField, { target: { value: 'Test' } });
    fireEvent.change(userAttributeField, { target: { value: 'Email' } });

    expect(campaignNameField).toBeInTheDocument();
    expect(userAttributeField).toBeInTheDocument();
  });
});
