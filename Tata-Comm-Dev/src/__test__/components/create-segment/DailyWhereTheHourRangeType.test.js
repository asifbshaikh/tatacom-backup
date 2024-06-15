import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers

import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';
import DailyWhereTheHourRangeType from 'components/create-segment/DailyWhereTheHourRangeType';

describe('DailyWhereTheHourRangeType', () => {
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
  };

  const mockObject = {
    handleOnValueChange: jest.fn(),
    identifier: 'dailyWhereTheHour',
    form: {},
    filteredValueByname: {
      operator: 'in_the_following',
      value: 'is',
    },
    filterFormErrors: {},
    filterFormTouched: {},
  };
  it('renders with hide input field option', () => {
    const { getByLabelText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DailyWhereTheHourRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByLabelText('is')).toBeInTheDocument();
  });

  it('renders without hide input field option', () => {
    mockObject.filteredValueByname.operator = 'is';
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DailyWhereTheHourRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId('is')).toBeInTheDocument();
  });

  it('renders without hide input field option', () => {
    mockObject.filteredValueByname.operator = 'is_between';
    mockObject.filteredValueByname.value1 = 'on';
    const { getByTestId, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DailyWhereTheHourRangeType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId('on')).toBeInTheDocument();
    expect(getByText('and')).toBeInTheDocument();
  });
});
