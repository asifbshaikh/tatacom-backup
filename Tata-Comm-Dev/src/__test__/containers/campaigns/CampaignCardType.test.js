import { fireEvent, render } from '@testing-library/react';
import IntlMessages from 'helpers/IntlMessages';
import { describe, expect, it } from '@jest/globals';
import CampaignTypeCard from '../../../containers/campaigns/CampaignCardType';
import { CustomWrapper } from 'test-utils';

describe('CampaignTypeCard component', () => {
  const campaignTypesList = [
    {
      type: 'one_time',
      label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.TYPES.ONE_TIME" />,
      icon: 'iconsminds-basket-coins',
    },
    {
      type: 'periodic',
      label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.TYPES.PERIODIC" />,
      icon: 'iconsminds-clock',
    },
    {
      type: 'event_trigger',
      label: (
        <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.TYPES.EVENT_TRIGGERED" />
      ),
      icon: 'simple-icon-event',
    },
  ];

  const form = {
    values: {
      campaignType: 'one_time',
    },
    setFieldValue: jest.fn(),
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <CampaignTypeCard
          cardsList={campaignTypesList}
          form={form}
          identifier="campaignType"
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('card click', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <CampaignTypeCard
          cardsList={campaignTypesList}
          form={form}
          identifier="campaignType"
        />
      </CustomWrapper>
    );
    const card = getByTestId('one_time');
    fireEvent.click(card);
    expect(card).toBeValid();
  });
});
