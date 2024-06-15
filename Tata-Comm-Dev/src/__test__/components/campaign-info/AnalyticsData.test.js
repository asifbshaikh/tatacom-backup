import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import AnalyticsData from 'components/campaign-info/AnalyticsData';

describe('AnalyticsData component', () => {
  const data = {};

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <AnalyticsData data={data} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
