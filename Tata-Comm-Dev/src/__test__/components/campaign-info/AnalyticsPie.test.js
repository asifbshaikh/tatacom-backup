import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import AnalyticsPie from 'components/campaign-info/AnalyticsPie';

describe('AnalyticsPie component', () => {
  const data = {};

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <AnalyticsPie data={data} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
