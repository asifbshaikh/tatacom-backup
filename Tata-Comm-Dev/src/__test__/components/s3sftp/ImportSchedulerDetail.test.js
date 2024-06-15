import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import ImportSchedulerDetail from 'components/s3-sftp/ImportSchedulerDetail';

const commonProps = {};

const match = {
  url: '/app/accounts/1/segments/db-imports/scheduler-info/:ImportSchedulerId',
  path: '/app/accounts/1/segments/db-imports/scheduler-info/25',
  params: { ImportSchedulerId: '25' },
  isExact: true,
};

describe('ImportSchedulerDetail component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ImportSchedulerDetail {...commonProps} match={match} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ImportSchedulerDetail {...commonProps} match={match} />
      </CustomWrapper>
    );
  });
});
