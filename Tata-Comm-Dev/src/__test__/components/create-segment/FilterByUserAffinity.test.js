import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import FilterByUserAffinity from 'components/create-segment/FilterByUserAffinity';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';

describe('FilterByUserAffinity component', () => {
  const newDate = new Date('01/07/2023');

  const mockContext = {
    getErrorMessageOfField: jest.fn(),
  };

  const mockObject = {
    form: {
      setFieldValue: jest.fn(),
      values: {},
      setFieldTouched: jest.fn(),
    },
    userEventsList: [
      {
        id: 14,
        name: 'APP_OPENED',
        displayed_name: 'App/Site Opened',
        description:
          'Tracked when a user session begins on the app or website.',
        category: 'Lifecycle',
        source: ['S2S', 'SDK'],
        created_at: '2023-11-03T12:54:56.701Z',
        updated_at: '2023-11-03T12:54:56.701Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
      {
        id: 15,
        name: 'LOGOUT',
        displayed_name: 'User Logout',
        description: 'Tracked when user Logout of the app/site or user reset.',
        category: 'Lifecycle',
        source: ['SDK'],
        created_at: '2023-11-03T12:54:56.708Z',
        updated_at: '2023-11-03T12:54:56.708Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
      {
        id: 16,
        name: 'PAGE_VIEWED',
        displayed_name: 'Viewed Web Page',
        description:
          'Tracked when a user visits a web page. Select page URL as event attribute to find number of users visiting a particular page or use it to setup a "Drop-off capture" Smart Trigger Web Push.',
        category: 'Lifecycle',
        source: ['SDK'],
        created_at: '2023-11-03T12:54:56.713Z',
        updated_at: '2023-11-03T12:54:56.713Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
      {
        id: 17,
        name: 'USER_MERGED',
        displayed_name: 'User Merged',
        description:
          'This event is tracked for a known user whenever a moengage user object is merged with it',
        category: 'Lifecycle',
        source: ['S2S'],
        created_at: '2023-11-03T12:54:56.717Z',
        updated_at: '2023-11-03T12:54:56.717Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
    ],
    getUserAttributesDropDownList: jest.fn(),
    userAttributesList: [],
    userAffinityIdentifier: 'included_filters',
    filterUserAffinityValues: {
      filter_type: 'user_affinity',
      executed: true,
      name: '',
      value: '',
      operator_type: '',
      attributes: {
        filter_operator: 'and',
        filters: [],
      },
      user_affinity_attributes: {
        filter_operator: 'and',
        filters: [
          {
            filter_type: 'user_affinity_attributes',
          },
        ],
      },
      primary_time_range: {
        period_unit: '',
        type: '',
        value: '',
      },
    },
  };

  it('Render FilterByUserAffinity component and Has Executed label should be on UI', () => {
    const { getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUserAffinity {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByText('Has Executed')).toBeInTheDocument();
  });

  it('After changing name dropdown value it should render Operator Select', async () => {
    mockObject.filterUserAffinityValues.name = 'APP_OPENED';
    mockObject.filterUserAffinityValues.operator_type = 'predominantly';
    const { getByLabelText, container, getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUserAffinity {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const opertorTypeChange = getByTestId('operatorSelect');

    await waitFor(() => getByLabelText('userAffinityNameField'));
    fireEvent.change(container.querySelector('input'), {
      target: { value: 'APP_OPENED' },
    });
    fireEvent.click(getByText('App/Site Opened'));
    fireEvent.blur(container.querySelector('input'));
    fireEvent.change(opertorTypeChange, {
      target: { value: 'for_a_minimum_of' },
    });
    fireEvent.click(opertorTypeChange);
    expect(getByTestId('operatorSelect')).toBeInTheDocument();
  });

  it('covering branch of opertor_type most_no_of_times and onchange of operator_type dropdown', async () => {
    mockObject.filterUserAffinityValues.name = 'APP_OPENED';
    mockObject.filterUserAffinityValues.operator_type = 'most_no_of_times';
    const { getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUserAffinity {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const filterTop = getByText('and filter top');

    const opertorTypeChange = getByTestId('operatorSelect');
    fireEvent.change(opertorTypeChange, {
      target: { value: 'most_no_of_times' },
    });
    fireEvent.click(opertorTypeChange);
    expect(filterTop).toBeInTheDocument();
  });

  it('covering branch of opertor_type least_no_of_times', async () => {
    mockObject.filterUserAffinityValues.name = 'APP_OPENED';
    mockObject.filterUserAffinityValues.operator_type = 'least_no_of_times';
    const { getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUserAffinity {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const filterBottom = getByText('and filter bottom');
    expect(filterBottom).toBeInTheDocument();
  });

  it('On changing operator_type dropdown value it should render Value field with the specific labels like "% of times"', async () => {
    mockObject.filterUserAffinityValues.name = 'APP_OPENED';
    mockObject.filterUserAffinityValues.operator_type = 'for_a_minimum_of';
    const { getByLabelText, container, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUserAffinity {...mockObject} />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    await waitFor(() => getByLabelText('userAffinityNameField'));
    fireEvent.change(container.querySelector('input'), {
      target: { value: 'APP_OPENED' },
    });
    fireEvent.click(getByText('App/Site Opened'));
    expect(getByText('% of times')).toBeInTheDocument();
  });
});
