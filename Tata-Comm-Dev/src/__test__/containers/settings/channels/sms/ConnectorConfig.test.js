import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ConnectorConfig from 'containers/settings/channels/ConnectorConfig';

describe('Connector Config component', () => {
  it('render Connector Config without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ConnectorConfig/>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});