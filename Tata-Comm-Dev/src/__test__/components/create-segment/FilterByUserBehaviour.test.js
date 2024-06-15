import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import FilterByUserBehaviour from 'components/create-segment/FilterByUserBehaviour';

describe('render FilterByUsersBehaviour component', () => {
  const mockContext = {
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
                  name: '',
                  operator: '',
                  attributes: {
                    filter_operator: 'and',
                    filters: [],
                  },
                  value: '',
                  primary_time_range: {
                    period_unit: '',
                    type: 'in_the_last',
                    value: '',
                  },
                },
              ],
            },
          ],
        },
      },

      setFieldTouched: jest.fn(),
    },
    userAttributesList: [],
    filterFormErrors: {},
    filterFormTouched: {},
    userBehaviorIdentifier: 'included_filters.filters.0.filters.0',
    filterUserBehaviourValues: {
      filter_type: 'user_behavior',
      executed: 'true',
      name: '',
      operator: '',
      attributes: {
        filter_operator: 'and',
        filters: [],
      },
      value: '',
      primary_time_range: {
        period_unit: '',
        type: 'in_the_last',
        value: '',
      },
    },
    userEventsList: [
      {
        id: 19,
        name: 'INSTALL',
        displayed_name: 'INSTALL',
        description: 'Tracked when a user installs the app on the device.',
        category: 'Acquisition',
        source: ['SDK'],
        created_at: '2023-11-03T12:54:56.724Z',
        updated_at: '2023-11-03T12:54:56.724Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
      {
        id: 20,
        name: 'Device Uninstall',
        displayed_name: 'Device Uninstall',
        description: 'Tracked when a user uninstalls the app on a device.',
        category: 'Uninstall',
        source: ['SDK'],
        created_at: '2023-11-03T12:54:56.728Z',
        updated_at: '2023-11-03T12:54:56.728Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
      {
        id: 21,
        name: 'USER_REINSTALL',
        displayed_name: 'User ReInstall',
        description:
          'Tracked when a inactive user reinstalls the app on a device.',
        category: 'Uninstall',
        source: ['INTERNAL'],
        created_at: '2023-11-03T12:54:56.732Z',
        updated_at: '2023-11-03T12:54:56.732Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
    ],

    getUserAttributesDropDownList: jest.fn(),
  };

  it('Filter BY users render user behavior and excecuted and event dropdown change', async () => {
    const { getByTestId, getByLabelText, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUserBehaviour {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const executedField = getByTestId('userBehaviorExecuted');
    const nameField = getByLabelText('userBehaviourNameField');

    fireEvent.change(executedField, { target: { value: 'true' } });
    fireEvent.change(nameField, { target: { value: 'USER_REINSTALL' } });
    fireEvent.click(getByText('User ReInstall'));

    expect(executedField.value).toBe('true');
    expect(nameField).toBeInTheDocument();
  });

  it('Attributes button click and branches cover', async () => {
    const mockedObjectDummy = {
      ...mockObject,

      filterUserBehaviourValues: {
        ...mockObject.filterUserBehaviourValues,
        name: 'USER_REINSTALL',
        category: 'Uninstall',
      },
    };

    const { getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUserBehaviour {...mockedObjectDummy} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const attributeBtn = getByRole('button', {
      name: '+ Attributes',
    });

    fireEvent.click(attributeBtn);
    expect(attributeBtn).toBeInTheDocument();
  });
});
