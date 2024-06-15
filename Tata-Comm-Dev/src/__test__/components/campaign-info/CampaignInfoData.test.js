import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import CampaignInfoData from 'components/campaign-info/CampaignInfoData';

describe('CampaignInfoData component', () => {
  const data = {};

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <CampaignInfoData data={data} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
