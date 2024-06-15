import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import EventTriggerFieldArray from 'containers/campaigns/EventTriggerFieldArray';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';

describe('EventTriggerCriteria component', () => {
  const mockObject = {
    form: {
      errors: {},
      touched: {},
      values: {
        triggerCriteria: {
          included_filters: {
            filter_operator: 'and',
            filters: [
              {
                filter_operator: 'and',
                filters: [
                  {
                    filter_type: 'user_behavior',
                    executed: 'true',
                    name: 'APP_OPENED',
                    operator: 'at_least',
                    value: 1,
                    attributes: {
                      filter_operator: 'and',
                      filters: [],
                    },
                    category: 'Lifecycle',
                  },
                  {
                    filter_type: 'user_behavior',
                    executed: 'true',
                    name: 'LOGOUT',
                    operator: 'at_least',
                    value: 1,
                    attributes: {
                      filter_operator: 'and',
                      filters: [],
                    },
                    category: 'Lifecycle',
                  },
                ],
              },
            ],
          },
          trigger_relation: 'after',
          trigger_attr: 'If Action',
          time_value: 1,
          time_multiplier: 60,
          trigger_message_type: 'immediately',
        },
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
      setFieldTouched: jest.fn(),
    },
    index: 0,
    nestedIndex: 0,
    nestedCriteria: {
      filter_type: 'user_behavior',
      executed: 'true',
      name: 'LOGOUT',
      operator: 'at_least',
      value: 1,
      attributes: {
        filter_operator: 'and',
        filters: [],
      },
      category: 'Lifecycle',
    },
    filterFormErrors: {},
    filterFormTouched: {},
    userEventsList: [
      {
        id: 2,
        name: 'LOGOUT',
        displayed_name: 'User Logout',
        description: 'Tracked when user Logout of the app/site or user reset.',
        category: 'Lifecycle',
        source: ['SDK'],
        created_at: '2023-09-21T14:46:26.707Z',
        updated_at: '2023-09-21T14:46:26.707Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
      {
        id: 68,
        name: '1_loan_application_started',
        displayed_name: '1_loan_application_started',
        description: '',
        category: 'Tracked User Events',
        source: ['S2S'],
        created_at: '2023-09-21T14:46:26.974Z',
        updated_at: '2023-09-21T14:46:26.974Z',
        property_name: null,
        data_type: null,
        account_id: null,
      },
    ],
  };

  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  it('render filter dropdowns', () => {
    const { getByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <EventTriggerFieldArray
            {...mockObject}
            triggerRootIdentifier={TargetAudienceEnums.TRIGGER_CRITERIA}
            triggerFilterIdentifier={TargetAudienceEnums.INCLUDED_FILTERS}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const attributeButton = getByRole('button', {
      name: /attribute/i,
    });

    fireEvent.click(attributeButton);
    expect(attributeButton).toBeValid();
  });

  it('render filter dropdowns', async () => {
    mockObject.nestedIndex = 1;
    const { getByTestId, getByText, getByLabelText, container } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <EventTriggerFieldArray
            {...mockObject}
            triggerRootIdentifier={TargetAudienceEnums.TRIGGER_CRITERIA}
            triggerFilterIdentifier={TargetAudienceEnums.INCLUDED_FILTERS}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    await waitFor(() => getByLabelText('eventTriggerCriteriaField'));
    const nameFieldDropDown = getByLabelText('eventTriggerCriteriaField');
    fireEvent.blur(nameFieldDropDown);
    fireEvent.change(container.querySelector('input'), {
      target: { value: 'LOGOUT' },
    });
    fireEvent.click(getByText('User Logout'));
    expect(nameFieldDropDown).toBeInTheDocument();

    const closeBtn = getByText('x');

    fireEvent.click(closeBtn);

    expect(closeBtn).toBeInTheDocument();
    expect(getByTestId('executedDropdown')).toBeInTheDocument();
  });
});
