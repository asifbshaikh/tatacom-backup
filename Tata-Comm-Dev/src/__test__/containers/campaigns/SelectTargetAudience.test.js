import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import SelectTargetAudience from '../../../containers/campaigns/SelectTargetAudience';
import { CustomWrapper } from 'test-utils';

describe('CampaignTypeCard component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SelectTargetAudience />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
