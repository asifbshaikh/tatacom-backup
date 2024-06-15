import React from 'react';
import { fireEvent, render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FilterByBooleanDataType from 'components/create-segment/FilterByBooleanDataType';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('boolean dataType', () => {
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  const mockObject = {
    handleOnCompareOperatorChange: jest.fn(),
    identifier: 'boolean',
    form: {
      setFieldValue: jest.fn(),
    },
    filteredValueByname: {
      operator: 'is',
      value: 'is_not',
    },
    filterFormErrors: {},
    filterFormTouched: {},
  };
  it('render Input fields for before after opertor', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByBooleanDataType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const operatorField = getByTestId('is');

    fireEvent.change(operatorField, { target: { value: 'is_not' } });

    expect(getByTestId('is_not')).toBeInTheDocument();
    expect(operatorField).toBeInTheDocument();
    expect(operatorField.value).toBe('is');
  });
});
