import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsCampaignBtnGroup from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsCampaignBtnGroup';

describe('ScheduleAndGoalsCampaignBtnGroup component', () => {
  const form = {
    setFieldValue: jest.fn(),
  };
  const scheduleCampaignOneTimeBtnList = [
    {
      value: 'Immediately',
      label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.IMMEDIATELY',
      id: 'one_time.sendCampaignType',
    },
    {
      value: 'At specific date and time',
      label:
        'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.AT_SPECIFIC_DATE_AND_TIME',
      id: 'one_time.sendCampaignType',
    },
  ];
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ScheduleAndGoalsCampaignBtnGroup
          form={form}
          btnLists={scheduleCampaignOneTimeBtnList}
          activeBtn="Immediately"
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('buttons click', () => {
    render(
      <CustomWrapper>
        <ScheduleAndGoalsCampaignBtnGroup
          form={form}
          btnLists={scheduleCampaignOneTimeBtnList}
          activeBtn="Immediately"
        />
      </CustomWrapper>
    );

    const btnClick = screen.getByRole('button', {
      name: /immediately/i,
    });

    fireEvent.click(btnClick);

    expect(btnClick).toBeValid();
  });
});
