import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import DBConnectionList from 'views/app/settings/db-connection/list';
import { CustomWrapper } from 'test-utils';

describe('EditDBConnection component', () => {
  it('render without crashing', () => {
    const commonProps = {
      heading: 'Database Connection',
      match: {
        url: '/app/accounts/1/settings/db-connection-setup/list',
        path: '',
      },
    };
    const { asFragment } = render(
      <CustomWrapper>
        <DBConnectionList {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
