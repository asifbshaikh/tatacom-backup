import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import HelpCenterFormHeading from 'views/app/helpCenter/HelpCenterFormHeading';

describe('Help Center Form testing', () => {
  const match = { url: '/app/accounts/3/helpCenter', path: '' };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <HelpCenterFormHeading match={match} />
      </CustomWrapper>
    );
    expect(screen.getByText('Submit a request')).toBeInTheDocument();
  });
});
