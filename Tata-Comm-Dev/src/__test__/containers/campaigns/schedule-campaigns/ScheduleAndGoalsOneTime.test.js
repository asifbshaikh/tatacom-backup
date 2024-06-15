import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsOneTime from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsOneTime';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import moment from 'moment';

describe('ScheduleAndGoalsOneTime component', () => {
  it('render without crashing', () => {
    const form = {
      values: {
        one_time: {
          sendCampaignType: ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
          sendCampaignTime: ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE,
          sendInUserTimeZone: {
            startDate: '23 November 2023',
            sendTime: '2:24 PM',
            sendUserTimeZonePassed: ScheduleAndGoalsEnums.YES_SEND_IT,
          },
          atFixedTime: {
            startDate: '23 November 2023',
            sendTime: '2:24 PM',
          },
        },
      },
      setFieldValue: jest.fn(),
    };
    const setShowTimeZone = jest.fn();
    render(
      <CustomWrapper>
        <ScheduleAndGoalsOneTime
          form={form}
          campaignType="one_time"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );

    const radioBtn = screen.getByTestId('send_in_user_time_zone');
    fireEvent.change(radioBtn, { target: { value: 'send_in_user_time_zone' } });
    fireEvent.click(screen.getByText('At fixed time'));

    expect(radioBtn.value).toBe('send_in_user_time_zone');
    expect(radioBtn).toBeInTheDocument();
  });
  // skipped below test case as we have hidden this component from ui

  it.skip('render without crashing one time', () => {
    const form = {
      values: {
        one_time: {
          sendCampaignType: ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
          sendCampaignTime: ScheduleAndGoalsEnums.BEST_TIME_FOR_USER,
          bestTimeForUser: {
            startDate: moment().format('DD MMMM YYYY'),
            startTime: moment().format('LT'),
            sendMessagesBasedOnBestTime: moment().format('LT'),
            userBestTimeOutsideTimeWindow:
              ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
            userBestTimeNotAvailable:
              ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
          },
        },
      },
      setFieldValue: jest.fn(),
    };
    const setShowTimeZone = jest.fn();
    render(
      <CustomWrapper>
        <ScheduleAndGoalsOneTime
          form={form}
          campaignType="one_time"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );
    const radioList = screen.getByTestId('best_time_for_user');
    fireEvent.change(radioList, {
      target: { value: 'Best time for user(Sherpa)' },
    });

    const sendInUserComponent = screen.getByRole('radio', {
      name: /At fixed time/i,
    });

    fireEvent.click(sendInUserComponent);
    expect(sendInUserComponent).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('Send Time')).toBeInTheDocument();
  });

  it('render immediately without module name', () => {
    const form = {
      values: {
        one_time: {
          sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
        },
      },
      setFieldValue: jest.fn(),
    };
    const setShowTimeZone = jest.fn();
    render(
      <CustomWrapper>
        <ScheduleAndGoalsOneTime
          form={form}
          campaignType="one_time"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );
    expect(screen.getByText(/Send message immediately/gi)).toBeInTheDocument();
  });
  it('render immediately with module name "db_imports"', () => {
    const form = {
      values: {
        one_time: {
          sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
        },
      },
      setFieldValue: jest.fn(),
    };
    const setShowTimeZone = jest.fn();
    render(
      <CustomWrapper>
        <ScheduleAndGoalsOneTime
          form={form}
          campaignType="one_time"
          moduleName="db_imports"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );
    expect(
      screen.getByText(/Start DB import immediately/gi)
    ).toBeInTheDocument();
  });

  it('render message at fixed time without module name', () => {
    const form = {
      values: {
        one_time: {
          sendCampaignType: ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
          sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
          atFixedTime: {
            startDate: '23 November 2023',
            sendTime: '2:24 PM',
          },
        },
      },
      setFieldValue: jest.fn(),
    };
    const setShowTimeZone = jest.fn();
    render(
      <CustomWrapper>
        <ScheduleAndGoalsOneTime
          form={form}
          campaignType="one_time"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );

    expect(
      screen.getByText('The campaign is scheduled for 23 November 2023 2:24 PM')
    ).toBeInTheDocument();
  });
  it('render message at fixed time with module name', () => {
    const form = {
      values: {
        one_time: {
          sendCampaignType: ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
          sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
          atFixedTime: {
            startDate: '23 November 2023',
            sendTime: '2:24 PM',
          },
        },
      },
      setFieldValue: jest.fn(),
    };
    const setShowTimeZone = jest.fn();
    render(
      <CustomWrapper>
        <ScheduleAndGoalsOneTime
          form={form}
          campaignType="one_time"
          moduleName="db_imports"
          setShowCampaignTimezone={setShowTimeZone}
        />
      </CustomWrapper>
    );

    expect(
      screen.getByText('DB import will next start on 23 November 2023 2:24 PM')
    ).toBeInTheDocument();
  });
});
