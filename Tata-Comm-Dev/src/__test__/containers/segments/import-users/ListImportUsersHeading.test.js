import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ListImportUsersHeading from 'containers/segments/import-users/ListImportUsersHeading';

describe('ListImport component', () => {
  const commonProps = {
    heading: 'Import Audience',
    match: { url: '/app/accounts/3/segments/import-users/list', path: '' },
    changePageSize: jest.fn(),
    selectedPageSize: 10,
    totalItemCount: 20,
    startIndex: 1,
    endIndex: 10,
    currentPage: 1,
    pageSizes: [10, 15, 20, 25],
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ListImportUsersHeading {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('render the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ListImportUsersHeading {...commonProps} />
      </CustomWrapper>
    );
    expect(getByText('Display Options')).toBeInTheDocument();
  });

  it('change the page size', () => {
    render(
      <CustomWrapper>
        <ListImportUsersHeading {...commonProps} />
      </CustomWrapper>
    );
    const dropdownToggle = screen.getByRole('button', {
      name: /10/i,
    });
    fireEvent.click(dropdownToggle);
    expect(dropdownToggle).toBeTruthy();
  });

  it('handle onclick display option', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <ListImportUsersHeading {...commonProps} />
      </CustomWrapper>
    );

    fireEvent.click(getByTestId('import-user-display-option'));
    expect(getByTestId('import-user-display-option')).toBeInTheDocument();

    fireEvent.click(getByTestId('import-user-page-size-0'));
    expect(getByTestId('import-user-page-size-0')).toBeInTheDocument();
  });
});
