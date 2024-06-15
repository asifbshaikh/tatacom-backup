import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import SMSListing from 'containers/settings/channels/SMSListing';

describe('SMSListing component', () => {
  it('render SMSListing without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SMSListing/>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});