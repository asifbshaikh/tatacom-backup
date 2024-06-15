import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import AllSegments from '../../../../views/app/segments/all-segments';
import { CustomWrapper } from 'test-utils';

describe('AllSegments component', () => {
  const match = {
    url: '/app/accounts/95/segments/all-segments',
    path: '/app/accounts/95/segments/all-segments',
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <AllSegments match={match} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
