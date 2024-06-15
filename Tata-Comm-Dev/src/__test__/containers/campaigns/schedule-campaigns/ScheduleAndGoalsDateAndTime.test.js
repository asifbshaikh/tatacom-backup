import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsDateAndTime from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsDateAndTime';
import moment from 'moment';

describe('ScheduleAndGoalsDateAndTime component', () => {
  const form = {
    values: {
      startDate: moment('2023-09-07').format('DD MMMM YYYY'),
      sendTime: moment('14:30 PM').format('LT'),
    },
    setFieldValue: jest.fn(),
  };

  const leftFieldID = 'startDate';
  const leftFieldLabel = 'Start date';
  const leftFieldPlaceholder = 'Send date';
  const rightFieldId = 'sendTime';
  const rightFieldLabel = 'Send time';
  const rightFieldPlaceholder = 'Send time';

  it('change Input fields', () => {
    render(
      <CustomWrapper>
        <ScheduleAndGoalsDateAndTime
          form={form}
          leftFieldID={leftFieldID}
          leftFieldLabel={leftFieldLabel}
          leftFieldPlaceholder={leftFieldPlaceholder}
          rightFieldId={rightFieldId}
          rightFieldLabel={rightFieldLabel}
          rightFieldPlaceholder={rightFieldPlaceholder}
        />
      </CustomWrapper>
    );

    expect(screen.getByText(/Start date/gi)).toBeInTheDocument();

    expect(screen.getByText(/Send time/gi)).toBeInTheDocument();
  });

  it('updates form values when date and time are selected', () => {
    render(
      <CustomWrapper>
        <ScheduleAndGoalsDateAndTime
          form={form}
          leftFieldID={leftFieldID}
          leftFieldLabel={leftFieldLabel}
          leftFieldPlaceholder={leftFieldPlaceholder}
          rightFieldId={rightFieldId}
          rightFieldLabel={rightFieldLabel}
          rightFieldPlaceholder={rightFieldPlaceholder}
        />
      </CustomWrapper>
    );

    const sendDateInput = screen.queryAllByRole('textbox');

    fireEvent.change(sendDateInput[0], { target: { value: '2023-09-07' } });

    expect(form.setFieldValue).toHaveBeenCalledWith(
      'startDate',
      '07 September 2023'
    );
  });
  it('updates form values when date and time are selected', () => {
    render(
      <CustomWrapper>
        <ScheduleAndGoalsDateAndTime
          form={form}
          leftFieldID={leftFieldID}
          leftFieldLabel={leftFieldLabel}
          leftFieldPlaceholder={leftFieldPlaceholder}
          rightFieldId={rightFieldId}
          rightFieldLabel={rightFieldLabel}
          rightFieldPlaceholder={rightFieldPlaceholder}
        />
      </CustomWrapper>
    );

    const sendTimeInput = screen.queryAllByRole('textbox');

    fireEvent.change(sendTimeInput[1], { target: { value: '2:30 PM' } });

    expect(form.setFieldValue).toHaveBeenCalledWith('sendTime', '2:30 PM');
  });
  it('invalid date', () => {
    form.values.startDate = 'Invalid date';
    render(
      <CustomWrapper>
        <ScheduleAndGoalsDateAndTime
          form={form}
          leftFieldID={leftFieldID}
          leftFieldLabel={leftFieldLabel}
          leftFieldPlaceholder={leftFieldPlaceholder}
          rightFieldId={rightFieldId}
          rightFieldLabel={rightFieldLabel}
          rightFieldPlaceholder={rightFieldPlaceholder}
        />
      </CustomWrapper>
    );

    const sendDateInput = screen.queryAllByRole('textbox');

    fireEvent.change(sendDateInput[0], { target: { value: '' } });

    expect(form.setFieldValue).toHaveBeenCalledWith('startDate', '');
  });
  it('invalid time', () => {
    form.values.sendTime = 'Invalid time';
    render(
      <CustomWrapper>
        <ScheduleAndGoalsDateAndTime
          form={form}
          leftFieldID={leftFieldID}
          leftFieldLabel={leftFieldLabel}
          leftFieldPlaceholder={leftFieldPlaceholder}
          rightFieldId={rightFieldId}
          rightFieldLabel={rightFieldLabel}
          rightFieldPlaceholder={rightFieldPlaceholder}
        />
      </CustomWrapper>
    );

    const sendTimeInput = screen.queryAllByRole('textbox');

    fireEvent.change(sendTimeInput[0], { target: { value: '' } });

    expect(form.setFieldValue).toHaveBeenCalledWith('startDate', '');
  });
});
