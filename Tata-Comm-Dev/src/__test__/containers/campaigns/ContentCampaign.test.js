import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import ContentCampaign from '../../../../src/containers/campaigns/ContentCampaign';
import { CustomWrapper } from 'test-utils';

describe('ContentCampaign component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ContentCampaign />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
