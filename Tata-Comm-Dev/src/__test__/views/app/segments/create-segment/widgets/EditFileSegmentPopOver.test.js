import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import EditFileSegmentPopOver from 'views/app/segments/create-segment/widgets/EditFileSegmentPopOver';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';

describe('EditFile Segment component', () => {
  const mockStore = configureMockStore();
  const initialState = {
    segmentationApp: {
      errorMessage: 'Unable to upload file',
      formSuccess: true,
      successMessage: 'Update success',
      viewSegmentData: {},
      editSegmentErrorMessage: undefined,
    },
  };
  const store = mockStore(initialState);

  const mockData = {
    showEditFileSegment: true,
    segmentId: 1,
    setShowEditFileSegment: jest.fn(),
    getCategoryDropdownListAction: jest.fn(),
    editFileSegmentAction: jest.fn(),
    getViewSegDataAction: jest.fn(),
    clearEditSegmentDataAction: jest.fn(),
  };

  const file = new File(['test'], 'test.csv', { type: 'csv' });

  it('render Modal and click on button click of cancel and remove csv file', async () => {
    const emptyfile = new File([], 'test.csv', { type: 'csv' });
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <EditFileSegmentPopOver {...mockData} store={store} />
      </CustomWrapper>
    );

    const cancelBtn = getByRole('button', {
      name: 'Cancel',
    });
    const uploadCsvField = getByTestId('updoadCsvFile');
    fireEvent.click(cancelBtn);
    userEvent.click(uploadCsvField);
    await waitFor(() => {
      userEvent.upload(uploadCsvField, emptyfile);
    });
    const removeBtn = getByTestId('removeBtn');
    fireEvent.click(removeBtn);

    expect(getByText('Edit File Segment')).toBeInTheDocument();
  });
  it('render Modal and form submit', async () => {
    const { getByTestId, getByPlaceholderText, getByRole } = render(
      <CustomWrapper>
        <EditFileSegmentPopOver {...mockData} store={store} />
      </CustomWrapper>
    );
    const emailField = getByPlaceholderText(
      "Enter email id's here. Use commas to separate emails"
    );
    const uploadCsvField = getByTestId('updoadCsvFile');

    fireEvent.change(emailField, { target: { value: 'test@test.com' } });
    userEvent.click(uploadCsvField);
    await waitFor(() => {
      userEvent.upload(uploadCsvField, file);
      userEvent.click(uploadCsvField);
    });

    const addUsersBtn = getByRole('button', {
      name: 'Add Users',
    });
    await waitFor(() => {
      fireEvent.click(addUsersBtn);
    });
  });
});
