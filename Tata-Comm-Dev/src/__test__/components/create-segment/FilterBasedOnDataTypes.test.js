import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import FilterBasedOnDataTypes from 'components/create-segment/FilterBasedOnDataTypes';

describe('render FilterByUsersBehaviour component', () => {
  const mockContext = {
    cleanFieldValues: jest.fn(),
    getErrorMessageOfField: jest.fn(),
  };

  const mockObject = {
    form: {
      setFieldValue: jest.fn(),
      values: {
        audience_type: 'filterByUsers',
        exclude_users: false,
        included_filters: {
          filter_operator: 'and',
          filters: [
            {
              filter_operator: 'or',
              filter_type: 'nested_filters',
              filters: [
                {
                  filter_type: 'user_property',
                  name: 'ltv',
                  operator: '',
                  compare_operator: '',
                  range: '',
                  value: '',
                  value1: '',
                  case_sensitive: '',
                  data_type: '',
                  category: 'Lifecycle',
                  displayed_name: 'LTV',
                },
              ],
            },
          ],
        },
      },
      setFieldTouched: jest.fn(),
    },
    identifier: 'included_filters.filters.0.filters.0',
    filteredValueByname: {
      filter_type: 'user_property',
      name: 'ltv',
      operator: '',
      compare_operator: '',
      range: '',
      value: '',
      value1: '',
      case_sensitive: '',
      data_type: '',
      category: 'Lifecycle',
      displayed_name: 'LTV',
    },
    dataTypeOptions: [
      {
        id: '',
        value: 'Select Operator',
      },
      {
        id: 'string',
        value: 'string',
      },
      {
        id: 'double',
        value: 'double',
      },
    ],
    filterFormErrors: jest.fn(),
    filterFormTouched: jest.fn(),
  };

  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const { getByText, getByTestId, getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterBasedOnDataTypes {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const dataTypeField = getByTestId('dataTypeDropDown');
    fireEvent.change(dataTypeField, { target: { value: 'string' } });

    expect(dataTypeField.value).toBe('string');
  });

  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const mockObjectDummy = {
      ...mockObject,
      filteredValueByname: {
        ...mockObject.filteredValueByname,
        data_type: 'string',
        displayed_name: 'User Creation Source',
        filter_type: 'user_property',
        name: 'creation_source',
      },
      dataTypeOptions: [
        {
          id: 'string',
          value: 'string',
        },
      ],
    };
    const { getByText, getByTestId, getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterBasedOnDataTypes {...mockObjectDummy} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const stringDataType = getByTestId('operatorSelect');

    expect(stringDataType).toBeInTheDocument();
  });
  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const mockObjectDummy = {
      ...mockObject,
      filteredValueByname: {
        ...mockObject.filteredValueByname,
        data_type: 'datetime',
        displayed_name: 'First Seen',
        filter_type: 'user_property',
        name: 'first_seen',
      },
      dataTypeOptions: [
        {
          id: 'datetime',
          value: 'datetime',
        },
      ],
    };
    const { getByText, getByTestId, getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterBasedOnDataTypes {...mockObjectDummy} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const dateTimeDataType = getByTestId('rangeDropdown');

    expect(dateTimeDataType).toBeInTheDocument();
  });
  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const mockObjectDummy = {
      ...mockObject,
      filteredValueByname: {
        ...mockObject.filteredValueByname,
        data_type: 'double',
        displayed_name: 'First Seen',
        filter_type: 'user_property',
        name: 'first_seen',
        operator: 'is_equal_to',
      },
      dataTypeOptions: [
        {
          id: 'double',
          value: 'double',
        },
      ],
    };
    const { getByText, getByTestId, getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterBasedOnDataTypes {...mockObjectDummy} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const doubleDataType = getByTestId('is_equal_to');

    expect(doubleDataType).toBeInTheDocument();
  });
  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const mockObjectDummy = {
      ...mockObject,
      filteredValueByname: {
        ...mockObject.filteredValueByname,
        data_type: 'bool',
        displayed_name: 'First Seen',
        filter_type: 'user_property',
        name: 'first_seen',
        operator: 'is',
      },
      dataTypeOptions: [
        {
          id: 'bool',
          value: 'bool',
        },
      ],
    };
    const { getByText, getByTestId, getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterBasedOnDataTypes {...mockObjectDummy} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const booleanDataType = getByTestId('is');

    expect(booleanDataType).toBeInTheDocument();
  });
});
