import ApiClient from './ApiClient';

class CampaignsAPI extends ApiClient {
  constructor() {
    super('campaigns', { accountScoped: true });
  }

  getCampaignReports(campaignId) {
    return axios.get(`${this.url}/reports`, {
      params: { campaign_id: campaignId },
    });
  }
}

export default new CampaignsAPI();
