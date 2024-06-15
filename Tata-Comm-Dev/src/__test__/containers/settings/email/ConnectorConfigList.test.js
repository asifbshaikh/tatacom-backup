import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ConnectorConfigList from 'containers/settings/channels/email/ConnectorConfigList';

describe('Connector Config component', () => {
  it('render Connector Config without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ConnectorConfigList data={[]} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
