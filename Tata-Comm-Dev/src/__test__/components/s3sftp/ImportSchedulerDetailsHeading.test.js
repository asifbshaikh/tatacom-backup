import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ViewImportDetailsHeading from 'components/s3-sftp/ImportSchedulerDetailsHeading';

const commonProps = {};

const match = {
  url: '/app/accounts/1/segments/db-imports/scheduler-info/:ImportSchedulerId',
  path: '/app/accounts/1/segments/db-imports/scheduler-info/25',
  params: { ImportSchedulerId: '25' },
  isExact: true,
};

describe('ViewImportDetailsHeading component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ViewImportDetailsHeading
          {...commonProps}
          match={match}
          heading={'S3SFTP.IMPORT_SCHEDULER_DETAIL.IMPORT_SCHEDULER_INFO'}
          segmentName={''}
        />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ViewImportDetailsHeading
          {...commonProps}
          match={match}
          heading={'S3SFTP.IMPORT_SCHEDULER_DETAIL.IMPORT_SCHEDULER_INFO'}
          segmentName={''}
        />
      </CustomWrapper>
    );
  });
});
