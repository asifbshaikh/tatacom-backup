import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import SendInUserTimeZone from 'containers/campaigns/SendInUserTimeZone';
import moment from 'moment';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';

describe('SendInUserTimeZone component', () => {
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

        sendUserTimeZonePassed: '',
      },

      one_time: {
        sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
        sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
        atFixedTime: {
          startDate: moment().format('DD MMMM YYYY'),
          sendTime: moment().format('LT'),
        },

        sendInUserTimeZone: {
          startDate: moment().format('DD MMMM YYYY'),
          sendTime: moment().format('LT'),
          sendUserTimeZonePassed: ScheduleAndGoalsEnums.YES_SEND_IT,
        },
      },
    },
    setFieldValue: jest.fn(),
  };

  it('radioBtn onChange crashing', () => {
    render(
      <CustomWrapper>
        <SendInUserTimeZone form={form} campaignType="one_time" />
      </CustomWrapper>
    );

    const yesSendAtBestTime = screen.getByRole('radio', {
      name: /yes/i,
    });

    const dontSendMessage = screen.getByRole('radio', {
      name: /no/i,
    });

    fireEvent.click(yesSendAtBestTime);
    expect(yesSendAtBestTime).toBeValid();
    fireEvent.click(dontSendMessage);

    expect(dontSendMessage).toBeValid();

    const radioList = screen.getByTestId('yes_send_it');

    fireEvent.change(radioList, { target: { value: 'Yes' } });
  });
});
