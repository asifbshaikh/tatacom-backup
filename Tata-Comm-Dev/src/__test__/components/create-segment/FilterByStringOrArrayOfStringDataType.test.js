import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import FilterByStringOrArrayOfStringDataType from 'components/create-segment/FilterByStringOrArrayOfStringDataType';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('FilterByStringOrArrayOfStringDataType component', () => {
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  const match = {
    url: '/app/accounts/95/segments/create-segment',
    path: '/app/accounts/95/segments/create-segment',
  };

  const mockObject = {
    form: {
      setFieldValue: jest.fn(),
      values: {},
    },
    filteredValueByname: { operator: 'contains' },
    identifier: 'user_property',
    filterFormErrors: {},
    filterFormTouched: {},
  };

  const mockObject2 = {
    ...mockObject,
    filteredValueByname: { operator: 'exists' },
  };

  it('Render FilterByStringOrArrayOfStringDataType component and Case Sensitive Checkbox should be on UI', () => {
    const { getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByStringOrArrayOfStringDataType
            match={match}
            {...mockObject}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const caseSensitive = getByText('Case Sensitive');
    fireEvent.change(caseSensitive, { target: { checked: true } });
    fireEvent.click(caseSensitive);

    expect(caseSensitive).toBeInTheDocument();
  });

  it('Handle change in operator dropdown', () => {
    const { getByTestId, queryByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByStringOrArrayOfStringDataType
            match={match}
            {...mockObject2}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const connectorSelect = getByTestId('operatorSelect');
    fireEvent.change(connectorSelect, { target: { value: 'exists' } });
    expect(queryByText('Case Sensitive')).toBeNull();
  });
  it('Handle change in value field for in the following', () => {
    const mockObject3 = {
      ...mockObject,
      filteredValueByname: {
        operator: 'in_the_following',
        value: ['Test', 'Test1'],
      },
    };

    const { getByText, getByLabelText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByStringOrArrayOfStringDataType
            match={match}
            {...mockObject3}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const valueSelect = getByLabelText('reactSelectTag');
    fireEvent.change(valueSelect, {
      target: { value: 'not_in_the_following' },
    });
    fireEvent.click(getByText('not in the following'));
    fireEvent.keyDown(valueSelect, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(valueSelect).toBeInTheDocument();
  });

  it('Handle change in value without initial values for in the following', () => {
    const mockObject4 = {
      ...mockObject,
      filteredValueByname: {
        data_type: 'array_string',
        operator: 'in_the_following',
        value: [],
      },
    };

    const { getByText, getByLabelText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByStringOrArrayOfStringDataType
            match={match}
            {...mockObject4}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const valueSelect = getByLabelText('reactSelectTag');

    expect(getByText('(any of) is')).toBeInTheDocument();
    expect(valueSelect).toBeInTheDocument();
  });
});
