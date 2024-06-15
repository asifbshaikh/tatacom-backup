import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsSendCampaignHeader from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsSendCampaignHeader';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import moment from 'moment';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});

describe('ScheduleAndGoalsSendCampaignHeader component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ScheduleAndGoalsSendCampaignHeader
          form={{ values: {}, setFieldValue: jest.fn() }}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('Reset button click', () => {
    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsSendCampaignHeader
          form={{
            values: {},
            setFieldValue: jest.fn(),
            handleReset: jest.fn(),
          }}
        />
      </CustomWrapper>
    );
    const resetButton = getByRole('button', {
      name: /Reset/i,
    });

    fireEvent.click(resetButton);
    fireEvent.keyDown(resetButton);

    expect(resetButton).toBeValid();
  });
  it('render one time component', () => {
    const form = {
      values: {
        one_time: {
          sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
          sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
          atFixedTime: {
            startDate: moment().format('DD MMMM YYYY'),
            sendTime: moment().format('LT'),
          },
        },
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };
    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsSendCampaignHeader
          campaignType="one_time"
          form={form}
        />
      </CustomWrapper>
    );
    const immediatelyBtn = getByRole('button', {
      name: /Immediately/i,
    });

    fireEvent.click(immediatelyBtn);

    expect(immediatelyBtn).toBeValid();
  });
  it('render periodic component', () => {
    const form = {
      values: {
        periodic: {
          sendCampaignType: ScheduleAndGoalsEnums.DAILY,
          sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
          sendInUserTimeZone: {
            startDate: moment().format('DD MMMM YYYY'),
            sendTime: moment().format('LT'),
            sendUserTimeZonePassed: '',
          },
          atFixedTime: {
            startDate: moment().format('DD MMMM YYYY'),
            sendTime: moment().format('LT'),
          },
        },
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };
    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsSendCampaignHeader
          campaignType="periodic"
          form={form}
        />
      </CustomWrapper>
    );
    const dailyBtn = getByRole('button', {
      name: /Daily/i,
    });

    fireEvent.click(dailyBtn);

    expect(dailyBtn).toBeValid();
  });
  it('render event triggered component', () => {
    const form = {
      values: {
        event_trigger: {
          sendCampaignType: ScheduleAndGoalsEnums.ACTIVE_CONTINOUSLY,
          startDate: moment(new Date()).format('DD MMMM YYYY'),
          sendTime: moment(new Date()).format('LT'),
          endDate: moment(new Date()).format('DD MMMM YYYY'),
          endTime: moment(new Date()).format('LT'),
        },
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };
    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsSendCampaignHeader
          campaignType="event_trigger"
          form={form}
        />
      </CustomWrapper>
    );
    const activeContinouslyBtn = getByRole('button', {
      name: /Active Continously/i,
    });

    fireEvent.click(activeContinouslyBtn);

    expect(activeContinouslyBtn).toBeValid();
  });
});
