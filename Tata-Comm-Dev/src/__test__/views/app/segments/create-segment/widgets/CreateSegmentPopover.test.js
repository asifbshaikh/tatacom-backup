import React from 'react';
import { fireEvent, getByText, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import CreateSegmentPopover from 'views/app/segments/create-segment/widgets/CreateSegmentPopover';

describe('createSegment Modal component', () => {
  const mockStore = configureMockStore();
  const initialState = {
    segmentationApp: {
      listQueryResult: [],
      loadedSegmentation: true,
      successSegmentAdd: true,
      usersCount: 2,
    },
  };
  const store = mockStore(initialState);

  const mockData = {
    createSegment: true,
    segmentName: 'Test',
    type: '',
    isFiltersValid: true,
    clearUserCount: jest.fn(),
    userCountFilterMethod: jest.fn(),
    form: {
      values: {
        segmentId: 1,
        exclude_users: {},
      },
    },
  };

  it('render Modal with create segment', async () => {
    const { getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <CreateSegmentPopover {...mockData} store={store} />
      </CustomWrapper>
    );

    const createBtn = getByRole('button', {
      name: 'Create',
    });
    fireEvent.click(createBtn);
    await waitFor(() => {
      const enterSegmentName = getByTestId('enterSegmentName');
      fireEvent.change(enterSegmentName, { target: { value: 'Test' } });
    });
    const createsegmentBtn = getByTestId('createFormSubmitBtn');

    await waitFor(() => {
      fireEvent.click(createsegmentBtn);
    });
    fireEvent.click(createBtn);

    await waitFor(() => {
      const createBtn1 = getByRole('button', {
        name: 'Create',
      });
      fireEvent.click(createBtn1);
      expect(createBtn1).toBeInTheDocument();
    });

    expect(getByText('Create Segment')).toBeInTheDocument();
  });
  it('render Edit button', async () => {
    mockData.type = 'Edit';
    mockData.form.values = {
      audience_type: 'allUsers',
      exclude_users: false,
      included_filters: {
        filter_operator: 'and',
        filters: [
          {
            filter_operator: 'or',
            filter_type: 'nested_filters',
            filters: [
              {
                filter_type: 'all_users',
                name: 'All Users',
                id: 'digo_all_users',
              },
            ],
          },
        ],
      },
      excluded_filters: {
        filter_operator: 'and',
        filters: [
          {
            filter_operator: 'or',
            filter_type: 'nested_filters',
            filters: [
              {
                filter_type: 'filterByUsers',
              },
            ],
          },
        ],
      },
    };
    const { getByRole } = render(
      <CustomWrapper>
        <CreateSegmentPopover {...mockData} store={store} />
      </CustomWrapper>
    );

    const updateBtn = getByRole('button', {
      name: 'Update',
    });

    fireEvent.click(updateBtn);

    expect(updateBtn).toBeInTheDocument();
  });
  it('render Duplicate button', async () => {
    mockData.type = 'Duplicate';

    const { getByRole } = render(
      <CustomWrapper>
        <CreateSegmentPopover {...mockData} store={store} />
      </CustomWrapper>
    );

    const duplicateBtn = getByRole('button', {
      name: 'Duplicate',
    });

    fireEvent.click(duplicateBtn);

    expect(duplicateBtn).toBeInTheDocument();

    const cancelBtn = getByRole('button', {
      name: 'Cancel',
    });

    fireEvent.click(cancelBtn);
  });
  it('render showCount button', async () => {
    mockData.hideCreateButton = true;

    const { getByRole } = render(
      <CustomWrapper>
        <CreateSegmentPopover {...mockData} store={store} />
      </CustomWrapper>
    );

    const showCountBtn = getByRole('button', {
      name: 'Show Count',
    });
    fireEvent.click(showCountBtn);

    await waitFor(() => {
      expect(
        getByRole('heading', {
          name: /users count: 2/i,
        })
      ).toBeInTheDocument();
    });
  });
});
