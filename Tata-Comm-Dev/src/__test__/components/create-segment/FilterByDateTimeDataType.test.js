import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import FilterByDateTimeDataType from 'components/create-segment/FilterByDateTimeDataType';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('FilterByDateTimeDataType component', () => {
  const newDate = new Date('01/07/2023');
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  const mockObject = {
    form: {
      setFieldValue: jest.fn(),
      values: {},
    },
    filteredValueByname: {
      filter_type: 'user_property',
      data_type: 'datetime',
      category: 'Lifecycle',
      name: 'first_seen',
      value: '',
      operator: 'is_between',
      compare_operator: 'days_ago',
      range: 'date',
      value1: '',
      case_sensitive: '',
      displayed_name: 'First Seen',
    },
    identifier: 'included_filters',
  };

  const mockObject2 = {
    ...mockObject,
    filteredValueByname: {
      filter_type: 'user_property',
      data_type: 'datetime',
      category: 'Lifecycle',
      name: 'first_seen',
      value: '',
      operator: 'is',
      compare_operator: 'days_ago',
      range: 'daily_where_the_hour',
      value1: '',
      case_sensitive: '',
      displayed_name: 'First Seen',
    },
    identifier: 'included_filters',
  };

  const mockObject3 = {
    ...mockObject,
    filteredValueByname: {
      filter_type: 'user_property',
      data_type: 'datetime',
      category: 'Lifecycle',
      name: 'first_seen',
      value: '',
      operator: 'is_today',
      compare_operator: 'days_ago',
      range: 'weekly_where_the_day',
      value1: '',
      case_sensitive: '',
      displayed_name: 'First Seen',
    },
    identifier: 'included_filters',
  };

  it('Render FilterByDateTimeDataType component and Range, Operator dropdowns should be on UI', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByDateTimeDataType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByTestId('rangeDropdown')).toBeInTheDocument();
    expect(getByTestId('operatorDropdown')).toBeInTheDocument();
  });

  it('Onchnage of Range field, Operator dropdowns should be on UI', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByDateTimeDataType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const rangeDropdown = getByTestId('rangeDropdown');
    const operatorDropdown = getByTestId('operatorDropdown');
    fireEvent.change(rangeDropdown, {
      target: { value: 'daily_where_the_hour' },
    });
    fireEvent.change(operatorDropdown, { target: { value: 'on' } });
    expect(getByTestId('days_ago')).toBeInTheDocument();
  });

  it('Select Date', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByDateTimeDataType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const rangeDropdown = getByTestId('rangeDropdown');
    const operatorDropdown = getByTestId('operatorDropdown');
    fireEvent.change(rangeDropdown, {
      target: { value: 'daily_where_the_hour' },
    });
    fireEvent.change(operatorDropdown, { target: { value: 'on' } });
    const days_ago = getByTestId('days_ago');
    fireEvent.change(days_ago, { target: { value: 'days_ago' } });
    expect(getByTestId('days_ago')).toBeInTheDocument();
  });

  it('Render compare operator', async () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByDateTimeDataType {...mockObject2} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const days_ago = getByTestId('operatorDropdown');
    expect(days_ago).toBeInTheDocument();
  });

  it('Select weekly_where_the_day', async () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByDateTimeDataType {...mockObject3} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const days_ago = getByTestId('rangeDropdown');
    expect(days_ago).toBeInTheDocument();
  });
});
