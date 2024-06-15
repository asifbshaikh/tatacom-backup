import { render } from '@testing-library/react';
import { describe, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import MobilePushConfig from 'containers/settings/channels/mobile-push/AndroidMobilePushConfig';
import { Suspense } from 'react';

describe('MobilePushConfig component', () => {
  it('render MobilePushConfig without crashing', () => {
    render(
      <CustomWrapper>
        <Suspense fallback="Loading">
          <MobilePushConfig />
        </Suspense>
      </CustomWrapper>
    );
  });
});
