import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import EmailListing from 'containers/settings/channels/EmailListing';
import { Suspense } from 'react';

describe('EmailListing component', () => {
  it('render EmailListing without crashing', () => {
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <EmailListing />
        </Suspense>
      </CustomWrapper>
    );

    const text = getByText('Email Channel Configuration');
    expect(text).toBeInTheDocument();
  });
});
