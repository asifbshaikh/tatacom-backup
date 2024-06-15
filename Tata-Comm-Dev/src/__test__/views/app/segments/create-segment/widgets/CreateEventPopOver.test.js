import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import CreateEventPopOver from 'views/app/segments/create-segment/widgets/CreateEventPopOver';
import configureMockStore from 'redux-mock-store';

describe('createEvent Modal component', () => {
  const mockStore = configureMockStore();
  const initialState = {
    segmentationApp: {
      successAddPopOver: true,
      errorAdd: { errorMsg: 'error' },
    },
  };
  const store = mockStore(initialState);

  const mockData = {
    showCreateEvent: true,
    setShowCreateEvent: jest.fn(),
    loading: true,
    createCustomEventAction: jest.fn(),
    getUserEventsDropDownList: jest.fn(),
    formError: initialState.segmentationApp.errorAdd,
    formSuccess: initialState.segmentationApp.successAddPopOver,
  };

  it('render Modal with cancel button', async () => {
    const { getByText, getByRole } = render(
      <CustomWrapper>
        <CreateEventPopOver {...mockData} store={store} />
      </CustomWrapper>
    );

    const cancelBtn = getByRole('button', {
      name: 'Cancel',
    });

    fireEvent.click(cancelBtn);

    expect(getByText('Create Event')).toBeInTheDocument();
  });

  it('render Modal with form submit button', async () => {
    mockData.loading = false;
    const { getByPlaceholderText, getByLabelText, getByText, getByRole } =
      render(
        <CustomWrapper>
          <CreateEventPopOver {...mockData} store={store} />
        </CustomWrapper>
      );

    const eventNameField = getByPlaceholderText('Please enter a event name');
    const descriptionBoxField = getByPlaceholderText('Add Description');
    const propertyNameField = getByPlaceholderText(
      'Please enter property name'
    );
    const typeField = getByLabelText('selectType');

    await waitFor(() => {
      fireEvent.change(eventNameField, { target: { value: 'Test' } });
      fireEvent.change(descriptionBoxField, {
        target: { value: 'Test event' },
      });
      fireEvent.change(propertyNameField, {
        target: { value: 'Test property' },
      });
      fireEvent.change(typeField, { target: { value: 'boolean' } });
      fireEvent.click(getByText('Boolean'));
    });

    const submitBtn = getByRole('button', {
      name: 'Submit',
    });
    await waitFor(() => {
      fireEvent.click(submitBtn);
    });
    expect(submitBtn).toBeInTheDocument();
  });
});
