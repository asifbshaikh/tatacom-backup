import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsPeriodic from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsPeriodic';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import moment from 'moment';

describe('ScheduleAndGoalsPeriodic component', () => {
  const form = {
    values: {
      periodic: {
        sendCampaignType: ScheduleAndGoalsEnums.DAILY,
        sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
        sendInUserTimeZone: {
          startDate: moment('10/15/2014 9:00').format('DD MMMM YYYY'),
          sendTime: moment('10/15/2014 9:00').format('LT'),
          sendUserTimeZonePassed: '',
        },
        atFixedTime: {
          startDate: moment('10/15/2014 9:00').format('DD MMMM YYYY'),
          sendTime: moment('10/15/2014 9:00').format('LT'),
        },
        bestTimeForUser: {
          startDate: moment('10/15/2014 9:00').format('DD MMMM YYYY'),
          startTime: moment('10/15/2014 9:00').format('LT'),
          sendMessagesBasedOnBestTime: moment().format('LT'),
          userBestTimeOutsideTimeWindow:
            ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
          userBestTimeNotAvailable:
            ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
        },
        repeatEvery: '',
        repeatOn: ScheduleAndGoalsEnums.DAY_OF_MONTH,
        sendUserTimeZonePassed: '',
        daysOfMonth: [],
        daysOfWeek: ['Monday'],
        ends: '',
        on: {
          endDate: moment(new Date()).format('DD MMMM YYYY'),
        },
        after: {
          occurrences: '',
        },
      },
    },
    setFieldValue: jest.fn(),
    errors: {},
  };
  const setShowTimeZone = jest.fn();
  it('render without crashing', () => {
    const setShowTimeZone = jest.fn();
    const { getByTestId, getByText } = render(
      <CustomWrapper>
        <ScheduleAndGoalsPeriodic
          form={form}
          campaignType="periodic"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );

    const radioBtn = getByTestId('send_in_user_time_zone');
    fireEvent.change(radioBtn, { target: { value: 'send_in_user_time_zone' } });
    fireEvent.click(getByText('Send in user time zone'));

    expect(radioBtn.value).toBe('send_in_user_time_zone');
    expect(radioBtn).toBeInTheDocument();
  });

  it('render weekly components', () => {
    form.values.periodic.sendCampaignType = ScheduleAndGoalsEnums.WEEKLY;

    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsPeriodic
          form={form}
          campaignType="periodic"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );

    const weeksBtn = getByRole('button', {
      name: 'M',
    });

    fireEvent.click(weeksBtn);
    fireEvent.keyDown(weeksBtn);
    expect(weeksBtn).toBeValid();
  });
  it('render monthly components', () => {
    form.values.periodic.sendCampaignType = ScheduleAndGoalsEnums.MONTHLY;

    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsPeriodic
          form={form}
          campaignType="periodic"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );

    const dayOfMonth = getByRole('radio', {
      name: 'Date of Month',
    });

    fireEvent.click(dayOfMonth);
    expect(dayOfMonth).toBeValid();
  });

  it('render monthly components', () => {
    form.values.periodic.repeatOn = ScheduleAndGoalsEnums.DAY_OF_WEEK;
    form.values.periodic.sendCampaignType = ScheduleAndGoalsEnums.MONTHLY;

    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsPeriodic
          form={form}
          campaignType="periodic"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );

    const dayOfWeek = getByRole('radio', {
      name: 'Day of Week',
    });

    const weeksBtn = getByRole('button', {
      name: 'M',
    });

    fireEvent.click(weeksBtn);
    fireEvent.keyDown(weeksBtn);
    expect(weeksBtn).toBeValid();

    fireEvent.click(dayOfWeek);
    expect(dayOfWeek).toBeValid();
  });
  it('render at specific date and time components', () => {
    form.values.periodic.sendCampaignTime =
      ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME;
    form.values.periodic.repeatOn = ScheduleAndGoalsEnums.DAY_OF_WEEK;
    form.values.periodic.sendCampaignType = ScheduleAndGoalsEnums.MONTHLY;

    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsPeriodic
          form={form}
          campaignType="periodic"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );
    const endsRadiolist = getByRole('radio', {
      name: 'Never',
    });
    fireEvent.click(endsRadiolist);
    expect(endsRadiolist).toBeValid();
  });
  // skipped below test case as we have hidden this component from ui
  it.skip('render at best time for user components', () => {
    form.values.periodic.sendCampaignTime =
      ScheduleAndGoalsEnums.BEST_TIME_FOR_USER;

    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsPeriodic
          form={form}
          campaignType="periodic"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );
    const endsRadiolist = getByRole('radio', {
      name: 'On',
    });
    fireEvent.click(endsRadiolist);
    expect(endsRadiolist).toBeValid();
  });
});
