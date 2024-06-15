import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import ImportConfiguration from 'components/s3-sftp/ImportConfiguration';

const commonProps = {};

describe('ImportConfiguration component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ImportConfiguration {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ImportConfiguration {...commonProps} />
      </CustomWrapper>
    );
  });

  it('handle submit btn click', () => {
    const nextMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <ImportConfiguration {...commonProps} next={nextMock} />
      </CustomWrapper>
    );
    const userID = screen.getAllByTestId('userID')[0];
    fireEvent.change(userID, { target: { value: 'test' } });

    const userID1 = screen.getAllByTestId('userID')[1];
    fireEvent.change(userID1, { target: { value: 'test' } });

    const userID2 = screen.getAllByTestId('userID')[2];
    fireEvent.change(userID2, { target: { value: 'test' } });

    const userID3 = screen.getAllByTestId('userID')[3];
    fireEvent.change(userID3, { target: { value: 'test' } });

    const userID4 = screen.getAllByTestId('userID')[4];
    fireEvent.change(userID4, { target: { value: 'test' } });

    const userID5 = screen.getAllByTestId('userID')[5];
    fireEvent.change(userID5, { target: { value: 'test' } });

    const userID6 = screen.getAllByTestId('userID')[6];
    fireEvent.change(userID6, { target: { value: 'test' } });

    const emailID = screen.getByTestId('emailID');
    fireEvent.change(emailID, { target: { value: 'test@gmail.com' } });

    const submitButton = getByText('Next');
    act(() => {
      fireEvent.click(submitButton);
    });
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <ImportConfiguration previous={previousMock} />
      </CustomWrapper>
    );

    const previousButton = getByText('Previous');

    act(() => {
      fireEvent.click(previousButton);
    });
    expect(previousMock).toHaveBeenCalled();
  });

  it('Add attribute button click', () => {
    const previousMock = jest.fn();
    const mockToggle = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <ImportConfiguration previous={previousMock} toggleModal={mockToggle} />
      </CustomWrapper>
    );

    const AddAttributeButton1 = screen.getAllByText('Add attribute')[1];

    act(() => {
      fireEvent.click(AddAttributeButton1);
    });
  });

  it('Skip Column button click', () => {
    const previousMock = jest.fn();
    const mockToggle = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <ImportConfiguration previous={previousMock} toggleModal={mockToggle} />
      </CustomWrapper>
    );

    const skipButton = screen.getAllByText('Skip column')[0];

    act(() => {
      fireEvent.click(skipButton);
    });

    const skipButton1 = screen.getAllByText('Skip column')[1];

    act(() => {
      fireEvent.click(skipButton1);
    });
  });

  it('Save button click', () => {
    const previousMock = jest.fn();
    const mockToggle = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <ImportConfiguration previous={previousMock} toggleModal={mockToggle} />
      </CustomWrapper>
    );

    const AddAttributeButton1 = screen.getAllByTestId('addBtnIcon')[1];

    act(() => {
      fireEvent.click(AddAttributeButton1);
    });
    const saveButton = screen.getByText('Save');
    act(() => {
      fireEvent.click(saveButton);
    });
  });

  it('Cancel button click', () => {
    const previousMock = jest.fn();
    const mockToggle = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <ImportConfiguration previous={previousMock} toggleModal={mockToggle} />
      </CustomWrapper>
    );

    const AddAttributeButton1 = screen.getAllByTestId('addBtnIcon')[1];

    act(() => {
      fireEvent.click(AddAttributeButton1);
    });

    const cancelButton = screen.getByText('Cancel');
    act(() => {
      fireEvent.click(cancelButton);
    });
  });
});
