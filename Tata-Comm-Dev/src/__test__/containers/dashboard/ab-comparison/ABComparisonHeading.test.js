import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ABComparisonHeading from 'containers/dashboards/ab-comparison/ABComparisonHeading';

describe('ABComparisonHeading component', () => {
  const match = {
    path: '/app/accounts/95/dashboards/ab-comparison',
    url: '/app/accounts/95/dashboards/ab-comparison',
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ABComparisonHeading match={match} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('A/B Comparison heading to be there', () => {
    render(
      <CustomWrapper>
        <ABComparisonHeading match={match} />
      </CustomWrapper>
    );
    expect(
      screen.getByRole('heading', { leave: 1, name: 'A/B Comparison' })
    ).toBeInTheDocument();
  });
});
