import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ScheduleAndGoalsBestTimeForUser from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsBestTimeForUser';
import moment from 'moment';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import { CustomWrapper } from 'test-utils';

describe('radioButtons click', () => {
  const formValues = {
    sms: {
      sendCampaignTime: ScheduleAndGoalsEnums.BEST_TIME_FOR_USER,
      atFixedTime: {
        startDate: moment().format('DD MMMM YYYY'),
        startTime: moment().format('LT'),
        sendMessagesBasedOnBestTime: 'Yes, send at startTime',
        userBestTimeOutsideTimeWindow: 'Send message at start time or end time',
        userBestTimeNotAvailable: '',
      },
      bestTimeForUser: {
        startDate: moment().format('DD MMMM YYYY'),
        startTime: moment().format('LT'),
        sendMessagesBasedOnBestTime: moment().format('LT'),
        userBestTimeOutsideTimeWindow:
          ScheduleAndGoalsEnums.SEND_MESSAGE_AT_START_OR_END_TIME,
        userBestTimeNotAvailable: ScheduleAndGoalsEnums.YES_SEND_AT_START_TIME,
      },
    },
  };

  const setFieldValue = jest.fn();

  it('renders component with radio buttons', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ScheduleAndGoalsBestTimeForUser
          form={{ values: formValues, setFieldValue }}
          campaignType="sms"
        />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('radio buttons click', () => {
    render(
      <CustomWrapper>
        <ScheduleAndGoalsBestTimeForUser
          form={{ values: formValues, setFieldValue }}
          campaignType="sms"
        />
      </CustomWrapper>
    );

    const sendMessageAtStartOrEndDate = screen.getByRole('radio', {
      name: /do not send message do not send message/i,
    });

    const yesSendAtStartTime = screen.getByRole('radio', {
      name: /yes, send at start time/i,
    });

    const yesSendAtBestTime = screen.getByRole('radio', {
      name: /yes, send at the app's best time/i,
    });

    const dontSendMessage = screen.getByRole('radio', {
      name: /do not send message do not send message/i,
    });

    fireEvent.click(sendMessageAtStartOrEndDate);
    expect(sendMessageAtStartOrEndDate).toBeValid();
    fireEvent.click(yesSendAtStartTime);

    expect(yesSendAtStartTime).toBeValid();
    fireEvent.click(yesSendAtBestTime);
    expect(yesSendAtBestTime).toBeValid();

    fireEvent.click(dontSendMessage);
    expect(dontSendMessage).toBeValid();
  });
});
