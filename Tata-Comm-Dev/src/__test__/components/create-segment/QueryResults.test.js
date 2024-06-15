import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import QueryResults from 'components/create-segment/QueryResults';
import React from 'react';

describe('Query results component render', () => {
  const mockStore = configureMockStore();

  const mockListQueryResult = [
    {
      id: 2605,
      description: 'First Name in ["Lazy", "kshitij"]',
      status: 'active',
      segment: {
        segment_id: null,
        segment_name: null,
      },
      users_count: 1,
      reachable_users: {
        total_users: 1,
        reachable_users_count: 0,
        reachability_percentage: 0.0,
        by_channels: {
          sms_reachability: {
            reachable_users: 0,
            reachability_percentage: 0.0,
          },
          email_reachability: {
            reachable_users: 0,
            reachability_percentage: 0.0,
          },
          whatsapp_reachability: {
            reachable_users: 0,
            reachability_percentage: 0.0,
          },
          push_reachability: {
            reachable_users: 0,
            reachability_percentage: 0.0,
          },
        },
        last_refreshed_at: 1700653864,
      },
      created_at: 1700653864,
      sample_users: [
        {
          id: 11,
          name: 'Hudson',
        },
      ],
      audience_type: null,
      exclude_users: null,
    },
  ];
  jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
  }));

  const initialState = {
    segmentationApp: {
      listQueryResult: mockListQueryResult,
      loadedSegmentation: true,
      successReRun: true,
    },
  };
  it('Render QueryResults component with Expand row btn click', async () => {
    const store = mockStore(initialState);
    const { getByTestId, getByText } = render(
      <CustomWrapper>
        <QueryResults store={store} />
      </CustomWrapper>
    );
    const expandBtn = getByTestId(`expandBtn_${mockListQueryResult[0].id}`);
    fireEvent.click(expandBtn);
    await waitFor(() => {
      const reachabilityText = getByText('Reachability');
      expect(reachabilityText).toBeInTheDocument();
    });
    const queryResultText = getByText(/query results/i);
    expect(expandBtn).toBeInTheDocument();
    expect(queryResultText).toBeInTheDocument();
  });

  it('Render QueryResults component ', async () => {
    mockListQueryResult[0].status = 'draft';
    const store = mockStore(initialState);

    const { getByTestId, getByText } = render(
      <CustomWrapper>
        <QueryResults store={store} />
      </CustomWrapper>
    );
    const draftBtn = getByTestId(`draft_${mockListQueryResult[0].id}`);
    const actionBtn = getByTestId(mockListQueryResult[0].id);
    fireEvent.click(draftBtn);
    fireEvent.click(actionBtn);

    await waitFor(() => {
      const viewBtn = getByText('Enter Email For Alert');
      expect(viewBtn).toBeInTheDocument();
    });
  });

  it('render component with no data ', () => {
    const initialState1 = {
      segmentationApp: {
        listQueryResult: [],
        loadedSegmentation: false,
        successReRun: true,
      },
    };
    const store = mockStore(initialState1);

    const { getByText } = render(
      <CustomWrapper>
        <QueryResults store={store} />
      </CustomWrapper>
    );
    const noDataFoundText = getByText('No Data to Show');
    expect(noDataFoundText).toBeInTheDocument();
  });
});
