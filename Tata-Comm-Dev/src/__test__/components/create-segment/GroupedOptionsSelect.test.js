import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import GroupedOptionsSelect from 'components/create-segment/GroupedOptionsSelect';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('GroupedOptionsSelect component', () => {
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
    identifier: 'user_property',
    filterFormErrors: {},
    filterFormTouched: {},
    data: [
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
    ],
    groupedOptionsValue: {
      filter_type: 'user_property',
      name: 'no_of_conversions',
      operator: '',
      compare_operator: '',
      range: '',
      value: '',
      value1: '',
      case_sensitive: '',
      data_type: 'string',
      category: 'Lifecycle',
      displayed_name: 'No. of Conversions',
    },
    optionIdentifier: {
      label: 'displayed_name',
      value: 'name',
    },
    optionType: 'grouped',
  };

  const mockObject2 = {
    ...mockObject,
    handleOnChangeDropDown: jest.fn(),
    isCheckboxMultiSelect: true,
    optionType: 'unGrouped',
  };

  const mockObject3 = {
    ...mockObject,
    data: [],
  };

  const mockObject4 = {
    ...mockObject,
    groupedOptionsValue: {
      filter_type: 'user_property',
      name: 'no_of_conversions',
      operator: '',
      compare_operator: '',
      range: '',
      value: ['a', 'v'],
      value1: '',
      case_sensitive: '',
      data_type: 'string',
      category: 'Lifecycle',
      displayed_name: 'No. of Conversions',
    },
    fieldGroupedLabel: 'value',
  };

  it('Render GroupedOptionsSelect component for grouped category', () => {
    const { getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <GroupedOptionsSelect match={match} {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const value = getByRole('combobox');
    expect(value).toBeInTheDocument();
  });

  it('Render GroupedOptionsSelect component for unGrouped category', () => {
    const { getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <GroupedOptionsSelect match={match} {...mockObject2} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const value = getByRole('combobox');
    expect(value).toBeInTheDocument();
  });

  it('empty options in GroupedOptionsSelect component', () => {
    const { getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <GroupedOptionsSelect match={match} {...mockObject3} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const value = getByRole('combobox');
    expect(value).toBeInTheDocument();
  });

  it('multiselect values selected in GroupedOptionsSelect component', () => {
    const { getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <GroupedOptionsSelect match={match} {...mockObject4} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const value = getByRole('combobox', {
      name: 'react-select',
    });
    expect(value).toBeInTheDocument();
  });
});
