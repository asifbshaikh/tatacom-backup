import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import FilterAttributesFieldArray from 'components/create-segment/FilterAttributesFieldArray';

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
                  filter_type: 'user_behavior',
                  executed: 'true',
                  name: 'APP_OPENED',
                  operator: '',
                  attributes: {
                    filter_operator: 'and',
                    filters: [
                      {
                        name: 'ACTIVITY_NAME',
                        operator: '',
                        compare_operator: '',
                        range: '',
                        value: '',
                        value1: '',
                        case_sensitive: '',
                        data_type: 'string',
                        category: 'Event Attributes',
                      },
                    ],
                  },
                  value: '',
                  category: 'Lifecycle',
                },
              ],
            },
          ],
        },
      },
      setFieldTouched: jest.fn(),
    },
    attributeIdentifier: 'attributes',
    dropDownType: 'unGrouped',
    filterFormErrors: {},
    filterFormTouched: {},
    ConditionLabel: 'With Attribute',
    filterAttributeIdentifier: 'included_filters.filters.0.filters.0',
    filterAttributeValue: {
      filter_type: 'user_behavior',
      executed: 'true',
      name: 'APP_OPENED',
      operator: '',
      attributes: {
        filter_operator: 'and',
        filters: [
          {
            name: 'ACTIVITY_NAME',
            operator: '',
            compare_operator: '',
            range: '',
            value: '',
            value1: '',
            case_sensitive: '',
            data_type: 'string',
            category: 'Event Attributes',
          },
        ],
      },
      value: '',
      category: 'Lifecycle',
    },
    userAttributesList: [
      {
        id: 1,
        name: 'ACTIVITY_NAME',
        display_name: 'ACTIVITY_NAME',
        category: 'Event Attributes',
        common_event_id: 14,
        values: [],
        data_types: ['string'],
        created_at: '2023-11-03T12:56:04.150Z',
        updated_at: '2023-11-03T12:56:04.150Z',
      },
      {
        id: 2,
        name: 'appVersion',
        display_name: 'App Version',
        category: 'Event Attributes',
        common_event_id: 14,
        values: [],
        data_types: ['string'],
        created_at: '2023-11-03T12:56:04.158Z',
        updated_at: '2023-11-03T12:56:04.158Z',
      },
      {
        id: 3,
        name: 'device_model',
        display_name: 'Device Model',
        category: 'Event Attributes',
        common_event_id: 14,
        values: [],
        data_types: ['string'],
        created_at: '2023-11-03T12:56:04.164Z',
        updated_at: '2023-11-03T12:56:04.164Z',
      },
    ],

    getUserAttributesDropDownList: jest.fn(),
  };

  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterAttributesFieldArray {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const attributeBtn = getByRole('button', {
      name: '+ Attributes',
    });
    const nameField = getByLabelText('filterAttributeNameField');
    fireEvent.click(attributeBtn);

    fireEvent.change(nameField, { target: { value: 'appVersion' } });
    fireEvent.click(getByText('App Version'));

    expect(nameField).toBeInTheDocument();
    expect(getByText('With Attribute')).toBeInTheDocument();

    expect(attributeBtn).toBeInTheDocument();
  });
  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const mockObjectChange = {
      ...mockObject,
      ConditionLabel: 'with',
      isFilterTypeDropDown: true,
      filterAttributeValue: {
        ...mockObject.filterAttributeValue,
        attributes: {
          ...mockObject.filterAttributeValue.attributes,
          filters: [
            ...mockObject.filterAttributeValue.attributes.filters,
            {
              name: 'ACTIVITY_NAME',
              operator: '',
              compare_operator: '',
              range: '',
              value: '',
              value1: '',
              case_sensitive: '',
              data_type: 'string',
              category: 'Event Attributes',
            },
          ],
        },
      },
    };
    const { getByText, getByTestId, getAllByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterAttributesFieldArray {...mockObjectChange} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const filterConditionField = getByTestId('filterCondition');
    const deleteBtn = getAllByRole('button');
    fireEvent.click(deleteBtn[0]);

    expect(filterConditionField).toBeInTheDocument();
  });
  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const mockObjectChange = {
      ...mockObject,
      ConditionLabel: 'with',
      isWithAttribute: true,
      isFilterTypeDropDown: true,
      filterAttributeValue: {
        ...mockObject.filterAttributeValue,
        attributes: {
          ...mockObject.filterAttributeValue.attributes,
          filters: [
            ...mockObject.filterAttributeValue.attributes.filters,
            {
              name: 'ACTIVITY_NAME',
              operator: '',
              compare_operator: '',
              range: '',
              value: '',
              value1: '',
              case_sensitive: '',
              data_type: 'string',
              category: 'Event Attributes',
            },
          ],
        },
      },
    };
    const { getByRole, getByTestId, getAllByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterAttributesFieldArray {...mockObjectChange} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const filterConditionField = getByTestId('filterCondition');
    const deleteBtn = getAllByRole('button');
    fireEvent.click(deleteBtn[0]);

    expect(filterConditionField).toBeInTheDocument();
  });
});
