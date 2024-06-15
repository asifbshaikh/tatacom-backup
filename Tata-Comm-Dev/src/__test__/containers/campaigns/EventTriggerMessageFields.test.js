import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import EventTriggerMessageFields from 'containers/campaigns/EventTriggerMessageFields';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';

describe('EventTriggerMessageFields component', () => {
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  const form = {
    errors: {},
    values: {
      triggerCriteria: {
        trigger_relation: TargetAudienceEnums.AFTER,
        trigger_attr: TargetAudienceEnums.IF_ACTION,
        time_value: TargetAudienceEnums.TIME_VALUE,
        time_multiplier: TargetAudienceEnums.TIME_MULTIPLIER,
        trigger_message_type: TargetAudienceEnums.IMMEDIATELY,
      },
    },
    setFieldValue: jest.fn(),
  };

  it('should render the input fields with correct labels and placeholders', () => {
    const { getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <EventTriggerMessageFields
            form={form}
            triggerRootIdentifier={TargetAudienceEnums.TRIGGER_CRITERIA}
            triggerFilterIdentifier={TargetAudienceEnums.INCLUDED_FILTERS}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const thenTriggerMessage = getByText('THEN trigger the message');

    const radioBtn = getByTestId('withDelay');
    fireEvent.change(radioBtn, { target: { value: 'with_delay' } });
    fireEvent.click(getByText('With Delay'));

    expect(thenTriggerMessage).toBeInTheDocument();
    expect(radioBtn).toBeInTheDocument();
  });

  it('should render the input fields with correct labels and placeholders', () => {
    form.values.triggerCriteria.trigger_message_type =
      TargetAudienceEnums.WITH_DELAY;
    const { getByText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <EventTriggerMessageFields
            form={form}
            triggerRootIdentifier={TargetAudienceEnums.TRIGGER_CRITERIA}
            triggerFilterIdentifier={TargetAudienceEnums.INCLUDED_FILTERS}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const radioBtn = getByTestId('immediately');
    fireEvent.change(radioBtn, { target: { value: 'immediately' } });
    fireEvent.click(getByText('Immediately'));

    expect(radioBtn).toBeInTheDocument();
  });
});
