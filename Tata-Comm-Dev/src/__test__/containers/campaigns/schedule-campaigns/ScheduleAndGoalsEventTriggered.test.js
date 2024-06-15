import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsEventTriggered from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsEventTriggered';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import moment from 'moment';

describe('ScheduleAndGoalsEventTriggered component', () => {
  beforeEach(() => {
    jest.mock('moment', () => {
      return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
    });
    Date.now = jest.fn(() => new Date('2020-05-13T12:33:37.000Z'));
  });
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
  };
  const campaignType = 'event_trigger';
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ScheduleAndGoalsEventTriggered
          form={form}
          campaignType={campaignType}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
