import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import CustomSegment from 'components/create-segment/CustomSegment';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';

const customSegList = [
  {
    id: 49,
    name: 'no contacts bug',
    description: null,
  },
  {
    id: 9,
    name: 'TEST',
    description: null,
  },
  {
    id: 7,
    name: 'TEST',
    description: null,
  },
];

describe('CustomSegment component', () => {
  const mockStore = configureMockStore();

  const mockContext = {
    getErrorMessageOfField: jest.fn(),
  };

  const match = {
    url: '/app/accounts/95/segments/create-segment',
    path: '/app/accounts/95/segments/create-segment',
  };

  const mockObject = {
    handleOnValueChange: jest.fn(),
    form: {
      setFieldValue: jest.fn(),
    },
    filterFormErrors: {},
    filterFormTouched: {},
    selectedCustomSegmentValues: {
      segment_id: 49,
      name: 'no contacts bug',
    },
  };

  it('Render CustomSegment component ', () => {
    const { getByLabelText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <CustomSegment match={match} {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByLabelText('custom-segment-select')).toBeInTheDocument();
  });

  it('Custom select dropdown should be on UI after render ', async () => {
    const initialState = { segmentationApp: { customSegList: customSegList } };
    const store = mockStore(initialState);

    const { getByLabelText, container, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <CustomSegment store={store} match={match} {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    await waitFor(() => getByLabelText('custom-segment-select'));
    const selectDrop = getByLabelText('custom-segment-select');
    fireEvent.change(container.querySelector('input'), {
      target: { value: '9' },
    });
    fireEvent.click(getByText('TEST'));
    expect(selectDrop).toBeInTheDocument();
  });
});
