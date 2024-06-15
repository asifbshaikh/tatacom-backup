import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ListS3SFTPImportsHeading from 'containers/segments/s3-sftp-imports/ListS3SFTPImportsHeading';

describe('ListS3SFTPImportsHeading component', () => {
  const commonProps = {
    heading: 'DB Import',
    match: {
      url: '/app/accounts/6/segments/db-imports/list',
      path: '',
    },
    showAddBtn: true,
    pageSizes: [],
    changePageSize: jest.fn(),
    selectedPageSize: 10,
    totalItemCount: 20,
    startIndex: 1,
    endIndex: 10,
    handlePageChange: jest.fn(),
    currentPage: 1,
    toggle: jest.fn(),
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ListS3SFTPImportsHeading {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('render the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ListS3SFTPImportsHeading {...commonProps} />
      </CustomWrapper>
    );
    expect(getByText('Audience')).toBeInTheDocument();
  });
  it('toggle Button to open dropDown', () => {
    const { getAllByText } = render(
      <CustomWrapper>
        <ListS3SFTPImportsHeading {...commonProps} />
      </CustomWrapper>
    );

    const toggleButton = getAllByText('DB Import')[1];
    fireEvent.click(toggleButton);
    expect(toggleButton).toBeInTheDocument();
  });
});
