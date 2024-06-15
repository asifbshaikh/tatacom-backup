import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import CreateSegment from 'views/app/segments/create-segment';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import { Router } from 'react-router-dom/cjs/react-router-dom.min';
import { createMemoryHistory } from 'history';

describe('CreateSegment component', () => {
  const match = {
    path: '/app/accounts/6/segments/create-segment',
    url: '/app/accounts/6/segments/create-segment',
    isExact: true,
    params: {},
  };
  const mockStore = configureMockStore();

  const insitialStateObj = {
    segmentationApp: {
      lastExecutedFilterId: null,
      successSegmentAdd: false,
      successAdd: false,
      segmentData: {},
    },
  };
  const initialState = { ...insitialStateObj };
  const store = mockStore(initialState);
  it('render without crashing', async () => {
    const { getByRole, getByTestId } = render(
      <CustomWrapper>
        <CreateSegment match={match} store={store} />
      </CustomWrapper>
    );

    await waitFor(() => {
      const createBtn = getByTestId('createSegmentPopUpBtn');
      fireEvent.click(createBtn);
      expect(
        getByRole('heading', {
          name: /create segment/i,
        })
      ).toBeInTheDocument();
    });
  });

  it('render to successAdd and successSegmentAdd and edit segment', async () => {
    const history = createMemoryHistory();
    history.push(
      '/app/accounts/6/segments/create-segment?segmentId=198&type=Edit'
    );
    initialState.segmentationApp.successAdd = true;
    initialState.segmentationApp.successSegmentAdd = true;
    initialState.segmentationApp.segmentData = {
      id: 198,
      segment_type: 'Filter',
      account_id: 6,
      name: 'Filter Segment1398',
      last_run_at: 0,
      segment_filter: {
        id: 2022,
        account_id: 6,
        filter_hash: {
          excluded_filters: {},
          included_filters: {
            filters: [
              {
                filters: [
                  {
                    name: 'Custom_Segment1325',
                    segment_id: 196,
                    filter_type: 'custom_segments',
                  },
                ],
                filter_type: 'nested_filters',
                filter_operator: 'or',
              },
            ],
            filter_operator: 'and',
          },
        },
        description: 'Users in custom segment: Custom_Segment1325',
        audience_type: 'filterByUsers',
        exclude_users: false,
      },
    };

    const { getByRole, getByText } = render(
      <CustomWrapper>
        <Router history={history}>
          <CreateSegment match={match} store={store} />
        </Router>
      </CustomWrapper>
    );

    await waitFor(() => {
      const updateBtn = getByText(/update/i);
      fireEvent.click(updateBtn);
      expect(
        getByRole('heading', {
          name: /select audience/i,
        })
      ).toBeInTheDocument();
    });
  });
  it('render to successAdd and successSegmentAdd and duplicate segment', async () => {
    const history = createMemoryHistory();
    history.push(
      '/app/accounts/6/segments/create-segment?segmentId=198&type=Duplicate'
    );

    const { getByRole } = render(
      <CustomWrapper>
        <Router history={history}>
          <CreateSegment match={match} store={store} />
        </Router>
      </CustomWrapper>
    );

    await waitFor(() => {
      expect(
        getByRole('heading', {
          name: /Duplicate/i,
        })
      ).toBeInTheDocument();
    });
  });
});
