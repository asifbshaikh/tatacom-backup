import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import DBConnectionHeading from 'containers/settings/db-connection/DBConnectionHeading';

describe('DBConnectionHeading component', () => {
  const commonProps = {
    heading: 'Database Connection',
    match: {
      url: '/app/accounts/1/settings/db-connection-setup/list',
      path: '',
    },
    showAddBtn: true,
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DBConnectionHeading {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DBConnectionHeading {...commonProps} />
      </CustomWrapper>
    );
    //check if the component renders the message
    expect(getByText('Database Connection')).toBeInTheDocument();
  });
});
