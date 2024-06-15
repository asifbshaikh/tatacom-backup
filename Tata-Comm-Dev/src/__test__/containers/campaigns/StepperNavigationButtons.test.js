import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';

describe('StepperNavigationButtons component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <StepperNavigationButtons />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
