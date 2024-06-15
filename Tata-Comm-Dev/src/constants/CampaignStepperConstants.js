import CampaignRoutesEnums from 'enums/campaigns/campaignRoutesEnums';
import IntlMessages from 'helpers/IntlMessages';

export const smsCampaignSteps = [
  {
    route: CampaignRoutesEnums.SELECT_CHANNEL,
    name: (
      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CHANNEL_TYPE.HEADER" />
    ),
  },
  {
    route: CampaignRoutesEnums.CAMPAIGN_TYPE,
    name: (
      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CAMPAIGN_TYPE.HEADER" />
    ),
  },
  {
    route: CampaignRoutesEnums.TARGET_AUDIENCE,
    name: (
      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.HEADER" />
    ),
  },
  {
    route: CampaignRoutesEnums.CONTENT_CONFIGURATION,
    name: (
      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.HEADER" />
    ),
  },
  {
    route: CampaignRoutesEnums.SCHEDULE_AND_GOALS,
    name: (
      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.HEADER" />
    ),
  },
];
