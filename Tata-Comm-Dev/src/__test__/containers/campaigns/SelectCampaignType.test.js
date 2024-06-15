import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import SelectCampaignType from '../../../../src/containers/campaigns/SelectCampaignType';
import { CustomWrapper } from 'test-utils';

describe('CampaignTypeCard component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SelectCampaignType />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
