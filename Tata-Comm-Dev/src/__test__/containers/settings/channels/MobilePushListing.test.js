import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import MobilePushListing from 'containers/settings/channels/MobilePushListing';
import { Suspense } from 'react';

describe('MobilePushListing component', () => {
  it('render MobilePushListing without crashing', () => {
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <MobilePushListing />
        </Suspense>
      </CustomWrapper>
    );

    const text = getByText('Mobile Push');
    expect(text).toBeInTheDocument();
  });
});
