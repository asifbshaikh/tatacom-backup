import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DateAndYearlyWhereDateRangeType from 'components/create-segment/DateAndYearlyWhereDateRangeType';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('DailyWhereTheHourRangeType', () => {
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
  };

  const mockObject = {
    handleOnCompareOperatorChange: jest.fn(),
    identifier: 'dateAndYearlyWhereTheDate',
    form: {
      setFieldValue: jest.fn(),
    },
    filteredValueByname: {
      compare_operator: 'daily_where_the_hour',
      operator: 'before',
      value: 123,
    },
    filterFormErrors: {},
    filterFormTouched: {},
  };

  it('render Input fields for before after opertor', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId(123)).toBeInTheDocument();
    expect(getByTestId('daily_where_the_hour')).toBeInTheDocument();
  });

  it('render Input fields for before after opertor datepicker', async () => {
    mockObject.filteredValueByname.compare_operator = 'date';
    mockObject.filteredValueByname.value = '2023-07-01';

    const { getByPlaceholderText, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const datePickerInput = getByPlaceholderText('Select Date');
    fireEvent.change(datePickerInput, { target: { value: '2022-07-01' } });
    expect(datePickerInput).toBeInTheDocument();
  });

  it('render Input fields for before after opertor datepicker with inavlid date', async () => {
    mockObject.filteredValueByname.compare_operator = 'date';
    mockObject.filteredValueByname.value = '2023234';

    const { getByPlaceholderText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const datePickerInput = getByPlaceholderText('Select Date');
    fireEvent.change(datePickerInput, { target: { value: '1234532' } });
    expect(datePickerInput).toBeInTheDocument();
  });

  it('render Input fields for in the next opertor', () => {
    mockObject.filteredValueByname.operator = 'in_the_next';
    mockObject.filteredValueByname.range = 'date';
    mockObject.filteredValueByname.value = 123;

    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId(123)).toBeInTheDocument();
  });

  it('render Input fields for yearly where the date', () => {
    mockObject.filteredValueByname.operator = 'in_the_next';
    mockObject.filteredValueByname.range = 'yearly_where_the_date';
    mockObject.filteredValueByname.value = 'yearly_where_the_date';

    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId('yearly_where_the_date')).toBeInTheDocument();
  });

  it('render Input fields for on operator and days ago compare opertor', () => {
    mockObject.filteredValueByname.operator = 'on';
    mockObject.filteredValueByname.range = 'yearly_where_the_date';
    mockObject.filteredValueByname.value = 'yearly_where_the_date';
    mockObject.filteredValueByname.compare_operator = 'days_ago';

    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId('yearly_where_the_date')).toBeInTheDocument();
  });

  it('render datePicker fields for on operator and date compare opertor', async () => {
    mockObject.filteredValueByname.operator = 'on';
    mockObject.filteredValueByname.range = 'date';
    mockObject.filteredValueByname.value = '2023-11-09';
    mockObject.filteredValueByname.compare_operator = 'date';

    const { getByPlaceholderText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const selectedField = getByPlaceholderText('Select Date');
    fireEvent.change(selectedField, { target: { value: '2021-11-09' } });
    expect(selectedField).toBeInTheDocument();
  });

  it('render datePicker fields for is_between operator and date compare opertor', () => {
    mockObject.filteredValueByname.operator = 'is_between';
    mockObject.filteredValueByname.range = 'date';
    mockObject.filteredValueByname.value = '2023-11-01';
    mockObject.filteredValueByname.value1 = '2023-11-03';
    mockObject.filteredValueByname.compare_operator = 'date';

    const { getAllByPlaceholderText, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const valueField = getAllByPlaceholderText('Select Date');
    fireEvent.change(valueField[1], { target: { value: '2023-11-02' } });

    expect(valueField[1]).toBeInTheDocument();
    expect(getByText('and')).toBeInTheDocument();
  });

  it('render datePicker fields for is_between operator and date compare opertor', () => {
    mockObject.filteredValueByname.operator = 'is_between';
    mockObject.filteredValueByname.range = 'yearly_where_the_date';
    mockObject.filteredValueByname.value = '023122132';
    mockObject.filteredValueByname.value1 = '02312213221';
    mockObject.filteredValueByname.compare_operator = 'date';

    const { getAllByPlaceholderText, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const valueField = getAllByPlaceholderText('Select Date');
    fireEvent.change(valueField[1], { target: { value: '023122132' } });
    fireEvent.change(valueField[0], { target: { value: '02312213223' } });

    expect(valueField[1]).toBeInTheDocument();
    expect(getByText('and')).toBeInTheDocument();
  });

  it('render datePicker fields for is_between operator and days_ago compare opertor', () => {
    mockObject.filteredValueByname.operator = 'is_between';
    mockObject.filteredValueByname.range = 'yearly_where_the_date';
    mockObject.filteredValueByname.value = 123;
    mockObject.filteredValueByname.value1 = 1234;
    mockObject.filteredValueByname.compare_operator = 'days_ago';

    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DateAndYearlyWhereDateRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId(1234)).toBeInTheDocument();
  });
});
