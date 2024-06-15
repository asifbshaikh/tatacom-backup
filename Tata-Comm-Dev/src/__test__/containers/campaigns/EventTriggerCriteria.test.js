import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import EventTriggerCriteria from 'containers/campaigns/EventTriggerCriteria';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';

describe('EventTriggerCriteria component', () => {
  const form = {
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
                  executed: 'false',
                  name: 'APP_OPENED',
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
    setTouched: jest.fn(),
  };
  it('render filter dropdowns', () => {
    render(
      <CustomWrapper>
        <EventTriggerCriteria
          form={form}
          triggerRootIdentifier={TargetAudienceEnums.TRIGGER_CRITERIA}
          triggerFilterIdentifier={TargetAudienceEnums.INCLUDED_FILTERS}
        />
      </CustomWrapper>
    );
    const filterButton = screen.getByRole('button', {
      name: '+ ADD FILTER',
    });

    fireEvent.click(filterButton);
    expect(filterButton).toBeValid();
  });

  it('Reset button', async () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <EventTriggerCriteria
          form={form}
          triggerRootIdentifier={TargetAudienceEnums.TRIGGER_CRITERIA}
          triggerFilterIdentifier={TargetAudienceEnums.INCLUDED_FILTERS}
        />
      </CustomWrapper>
    );

    await waitFor(() => {
      const showCollapse = getByTestId('resetBtn');
      expect(showCollapse).toBeInTheDocument();
    });

    const resetBtn = getByTestId('resetBtn');
    fireEvent.click(resetBtn);
    expect(resetBtn).toBeInTheDocument();
  });
});
