import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import FilterByUsersProperty from 'components/create-segment/FilterByUsersProperty';
import configureMockStore from 'redux-mock-store';

describe('FilterByUsers component', () => {
  const mockStore = configureMockStore();

  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
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
                  name: '',
                },
              ],
            },
          ],
        },
      },

      setFieldTouched: jest.fn(),
    },
    filterFormErrors: {},
    filterFormTouched: {},
    identifier: 'included_filters.filters.0.filters.0',
    filteredUserPropertyValues: {
      filter_type: 'user_property',
      name: '',
    },

    getCategoryDropdownListAction: jest.fn(),
  };

  const categoryList = [
    {
      data_types: ['datetime'],
      name: 'first_seen',
      displayed_name: 'First Seen',
      description: 'First seen time of the user',
      category: 'Lifecycle',
    },
    {
      data_types: ['string'],
      name: 'creation_source',
      displayed_name: 'User Creation Source',
      description: 'Source from which this user was created',
      category: 'Lifecycle',
    },
    {
      data_types: ['string', 'double'],
      name: 'ltv',
      displayed_name: 'LTV',
      description: 'Life time value of the user',
      category: 'Lifecycle',
    },

    {
      data_types: ['string'],
      name: 'customer_id',
      displayed_name: 'Customer ID',
      description:
        'Unique Id that the app has set for a user. This is a standard attribute where name is provided by Digo Engage and the value is provided by client',
      category: 'Tracked Standard Attribute',
    },
  ];

  it('Filter BY users render user property and nested filter btn click', async () => {
    const initialState = {
      segmentationApp: { categoryDropdownList: categoryList },
    };
    const store = mockStore(initialState);

    const { getByLabelText, getByText, container } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUsersProperty {...mockObject} store={store} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    await waitFor(() => getByLabelText('userPropertyNameField'));
    const nameFieldDropDown = getByLabelText('userPropertyNameField');
    fireEvent.blur(nameFieldDropDown);
    fireEvent.change(container.querySelector('input'), {
      target: { value: 'customer_id' },
    });
    fireEvent.click(getByText('Customer ID'));
    expect(nameFieldDropDown).toBeInTheDocument();
  });

  it('Filter BY users when multiple dataTypes user property and nested filter btn click', async () => {
    const initialState = {
      segmentationApp: { categoryDropdownList: categoryList },
    };
    const store = mockStore(initialState);

    const { getByLabelText, getByText, container } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUsersProperty {...mockObject} store={store} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    await waitFor(() => getByLabelText('userPropertyNameField'));
    const nameFieldDropDown = getByLabelText('userPropertyNameField');
    fireEvent.blur(nameFieldDropDown);
    fireEvent.change(container.querySelector('input'), {
      target: { value: 'ltv' },
    });
    fireEvent.click(getByText('LTV'));
    expect(nameFieldDropDown).toBeInTheDocument();
  });

  it('Filter BY users when multiple dataTypes user property and nested filter btn click', async () => {
    mockObject.filteredUserPropertyValues.name = 'ltv';
    mockObject.filteredUserPropertyValues.data_type = '';
    mockObject.filteredUserPropertyValues.category = 'Lifecycle';
    const initialState = {
      segmentationApp: { categoryDropdownList: categoryList },
    };
    const store = mockStore(initialState);

    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUsersProperty {...mockObject} store={store} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const datatypeField = getByTestId('dataTypeDropDown');
    expect(datatypeField).toBeInTheDocument();
  });
});
