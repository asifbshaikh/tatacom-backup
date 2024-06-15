import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import SelectUserType from 'components/import-user/SelectUserType';
import { CustomWrapper } from 'test-utils';

describe('SelectUserType component', () => {
  const commonProps = {
    setSelectUser: jest.fn(),
    selectUser: [],
    getImportUsersUploadDataAction: [],
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SelectUserType {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SelectUserType {...commonProps} />
      </CustomWrapper>
    );
    //check if the component renders the message
    expect(getByText('Select Audience Type')).toBeInTheDocument();
  });
  it('selects and deselects first card on click', () => {
    render(
      <CustomWrapper>
        <SelectUserType {...commonProps} />
      </CustomWrapper>
    );

    //click the Registered user card
    fireEvent.click(screen.getByText('Registered Audience'));

    //click if the Registered user card is selected
    expect(screen.getByText(/Registered/)).toBeInTheDocument();

    //click the Registered user card again to deselect
    fireEvent.click(screen.getByText('Registered Audience'));

    //check if the Registered user card is deselected
    expect(screen.queryByText('Registered')).toBeNull();
  });
  it('selects and deselects second card on click', () => {
    render(
      <CustomWrapper>
        <SelectUserType {...commonProps} />
      </CustomWrapper>
    );

    //click the Anonymous user card
    fireEvent.click(screen.getByText('Anonymous Audience'));

    //click if the Anonymous user card is selected
    expect(screen.getByText(/Anonymous/)).toBeInTheDocument();

    //click the Anonymous user card again to deselect
    fireEvent.click(screen.getByText('Anonymous Audience'));

    //check if the Anonymous user card is deselected
    expect(screen.queryByText('Anonymous')).toBeNull();
  });
});
