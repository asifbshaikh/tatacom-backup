import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import SheduleConversionGoals from 'containers/campaigns/schedule-campaigns/SheduleConversionGoals';

describe('SheduleConversionGoals component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SheduleConversionGoals />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
