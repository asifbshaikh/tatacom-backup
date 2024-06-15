import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import WeeklyMonthlyYearlyWhereRangeType from 'components/create-segment/WeeklyMonthlyYearlyWhereRangeType';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('WeeklyMonthlyYearlyWhereRangeType component', () => {
  const newDate = new Date('01/07/2023');
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  const mockObject = {
    form: {
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      values: {},
    },
    filteredValueByname: {
      filter_type: 'user_property',
      data_type: 'datetime',
      category: 'Lifecycle',
      name: 'first_seen',
      value: ['Sunday'],
      operator: 'in_the_following',
      compare_operator: '',
      range: 'weekly_where_the_day',
      value1: '',
      case_sensitive: '',
      displayed_name: 'First Seen',
    },
    identifier: 'included_filters',
    handleOnValueChange: jest.fn(),
    handleOnCompareOperatorChange: jest.fn(),
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
      range: 'weekly_where_the_day',
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
      value: '1',
      operator: 'in_the_next',
      compare_operator: '',
      range: 'yearly_where_the_month',
      value1: '',
      case_sensitive: '',
      displayed_name: 'First Seen',
    },
    identifier: 'included_filters',
  };

  it('Render WeeklyMonthlyYearlyWhereRangeType component and Range, valueSelect field should be on UI', () => {
    const { getByLabelText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <WeeklyMonthlyYearlyWhereRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByLabelText('valueSelect')).toBeInTheDocument();
  });

  it('Operator dropdowns should be on UI', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <WeeklyMonthlyYearlyWhereRangeType {...mockObject2} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByTestId('compareOperator')).toBeInTheDocument();
  });

  it('select yearly_where_the_date range', () => {
    const { getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <WeeklyMonthlyYearlyWhereRangeType {...mockObject3} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByText('months')).toBeInTheDocument();
  });

  it('select is_between operator, value1 field should be rendered', () => {
    mockObject3.filteredValueByname.operator = 'is_between';
    const { getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <WeeklyMonthlyYearlyWhereRangeType {...mockObject3} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByText('and')).toBeInTheDocument();
  });
});
