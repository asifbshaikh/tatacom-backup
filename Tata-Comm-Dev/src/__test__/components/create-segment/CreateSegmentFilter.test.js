import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import CreateSegmentFilter from '../../../components/create-segment/CreateSegmentFilter';
import { CustomWrapper } from 'test-utils';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';

afterEach(cleanup);

describe('DailyWhereTheHourRangeType', () => {
  const mockContext = {
    cleanFieldValues: jest.fn(),
    getErrorMessageOfField: jest.fn(),
  };

  const form = {
    values: {
      audience_type: createSegementEnums.CONDITION.ALL_USERS,
      exclude_users: false,
      included_filters: {
        filter_operator: createSegementEnums.INITIALVALUES.AND,
        filters: [
          {
            filter_operator: createSegementEnums.INITIALVALUES.OR,
            filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
            filters: [
              {
                filter_type: createSegementEnums.INITIALVALUES.ALL_USERS,
                name: createSegementEnums.LABEL.ALL_USERS,
                id: createSegementEnums.INITIALVALUES.DIGO_ALL_USERS,
              },
            ],
          },
        ],
      },
      excluded_filters: {
        filter_operator: createSegementEnums.INITIALVALUES.AND,
        filters: [
          {
            filter_operator: createSegementEnums.INITIALVALUES.OR,
            filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
            filters: [
              {
                filter_type: createSegementEnums.INITIALVALUES.FILTER_BY_USERS,
              },
            ],
          },
        ],
      },
      segmentId: 123,
    },
    setFieldValue: jest.fn(),
    setTouched: jest.fn(),
  };

  const form2 = {
    values: {
      ...form.values,
      audience_type: createSegementEnums.CONDITION.FILTER_BY_USERS,
    },
    setFieldValue: jest.fn(),
    setTouched: jest.fn(),
  };

  it('renders input field for created segment option', () => {
    const { getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <CreateSegmentFilter form={form} segmentName="Ashok" />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const excludeUsers = getByText('Exclude Audience');
    fireEvent.change(excludeUsers, { target: { checked: true } });
    fireEvent.click(excludeUsers);

    expect(excludeUsers).toBeInTheDocument();

    expect(getByText('Select Audience')).toBeInTheDocument();
    expect(getByTestId('segmentName')).toBeInTheDocument();
  });
  it('renders radioBtn options', () => {
    form.values.exclude_users = true;
    const { getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <CreateSegmentFilter form={form} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByText(/user property/gi)).toBeInTheDocument();
    expect(getByTestId('allUsers')).toBeInTheDocument();
    expect(getByText(/All Audience Selected/gi)).toBeInTheDocument();
  });

  it('renders radioBtn options', () => {
    form.values.audience_type = createSegementEnums.CONDITION.FILTER_BY_USERS;
    form.values.exclude_users = false;
    const { getByText, getByTestId, getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <CreateSegmentFilter form={form} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const radioBtn = getByTestId('allUsers');
    fireEvent.change(radioBtn, { target: { value: 'allUsers' } });
    fireEvent.click(getByText('All Audience'));

    expect(radioBtn.value).toBe('allUsers');
    expect(radioBtn).toBeInTheDocument();
    expect(getByText(/user property/gi)).toBeInTheDocument();
  });

  it('renders radioBtn options', () => {
    form.values.audience_type = createSegementEnums.CONDITION.ALL_USERS;
    const { getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <CreateSegmentFilter form={form} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const radioBtn = getByTestId('filterByUsers');
    fireEvent.change(radioBtn, { target: { value: 'filterByUsers' } });
    fireEvent.click(getByText('Filter Audience By'));

    expect(radioBtn.value).toBe('filterByUsers');
  });

  it('Reset button', async () => {
    form.values.audience_type = createSegementEnums.CONDITION.ALL_USERS;
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <CreateSegmentFilter form={form2} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    await waitFor(() => {
      const showCollapse = getByTestId('resetBtn');
      expect(showCollapse).toBeInTheDocument();
    });

    const resetBtn = getByTestId('resetBtn');
    fireEvent.click(resetBtn);
    expect(resetBtn).toBeInTheDocument();
  });
});
