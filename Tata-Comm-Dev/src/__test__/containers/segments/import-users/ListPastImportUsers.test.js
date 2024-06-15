import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ListPastImportUsers from 'containers/segments/import-users/ListPastImportUsers';

describe('ListImport component', () => {
  const commonProps = {
    currentPage: 1,
    totalPage: 10,
    onChangePage: jest.fn(),
    items: [
      {
        uploaded_date: 1703060060,
        files_uploaded: null,
        file_name: 'RegisteredUsersNEW.csv',
        import_type: 'registered',
        total_rows_in_file: 1,
        new_users_added: 1,
        users_updated: 2,
        failed_users: 0,
        skipped_records: 0,
        custom_segment: '',
        status: 'completed',
      },
      {
        uploaded_date: 1701856513,
        files_uploaded: null,
        file_name: 'LoggedInUsers.csv',
        import_type: 'registered',
        total_rows_in_file: 5,
        new_users_added: 5,
        users_updated: 3,
        failed_users: 0,
        skipped_records: 0,
        custom_segment: 'New File Filter Segment',
        status: 'completed',
      },
      {
        uploaded_date: 1701856513,
        files_uploaded: null,
        file_name: 'LoggedInUsers.csv',
        import_type: 'registered',
        total_rows_in_file: 5,
        new_users_added: 5,
        users_updated: 0,
        failed_users: 0,
        skipped_records: 0,
        custom_segment: 'New File Filter Segment',
        status: 'completed',
      },
    ],
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ListPastImportUsers {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('render the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ListPastImportUsers {...commonProps} />
      </CustomWrapper>
    );
    expect(getByText(/Uploaded Date/i)).toBeInTheDocument();
  });
});
