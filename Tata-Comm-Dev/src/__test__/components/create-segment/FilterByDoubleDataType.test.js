import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FilterByDoubleDataType from 'components/create-segment/FilterByDoubleDataType';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('double dataType', () => {
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  const mockObject = {
    handleOnCompareOperatorChange: jest.fn(),
    identifier: 'double',
    form: {
      setFieldValue: jest.fn(),
    },
    filteredValueByname: {
      operator: 'is_between',
      value: '10',
      value1: '20',
    },
    filterFormErrors: {},
    filterFormTouched: {},
  };
  it('render Input fields for before after opertor', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByDoubleDataType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const opertorChange = getByTestId('is_between');
    fireEvent.change(opertorChange, { target: { value: 'is_not_between' } });
    expect(getByTestId('10')).toBeInTheDocument();
    expect(getByTestId('20')).toBeInTheDocument();
  });

  it('render multi Select dropdown fields for in the following opertor', () => {
    mockObject.filteredValueByname.operator = 'in_the_following';
    mockObject.filteredValueByname.value = ['20'];
    const { getByLabelText, getByText, container } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByDoubleDataType {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const valueChange = getByLabelText('multiSelectIntheFollowing');
    fireEvent.keyDown(valueChange, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(valueChange, { key: 'Enter', code: 'Enter' });

    expect(valueChange).toBeInTheDocument();
  });
});
