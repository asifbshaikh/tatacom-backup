require 'rails_helper'

RSpec.describe "Api::V3::Accounts::CampaignTags", type: :request do
  # test cases for create action
  describe 'POST #create' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:sms_channel) { create(:channel_sms) }
    let!(:sms_inbox) { create(:inbox, channel: sms_channel) }
    
    context 'with valid attributes' do
      let!(:group_tag) { create(:group_tag, name:"sms test") }
      let!(:campaign) do
      create(:campaign, inbox: sms_inbox, account: account)
      end
      let(:valid_attributes){{name: 'Updated name', description: 'Updated description', campaign_id: campaign.id, group_tag_id: group_tag.id, custom_attributes:{"sample":"test"} }}
      it 'creates a new template' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaign_tags", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(CampaignTag, :count).by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'Name params passed as blank' do
      let!(:group_tag) { create(:group_tag, name:"sms test") }
      let!(:campaign) do
      create(:campaign, inbox: sms_inbox, account: account)
      end
      let(:invalid_attributes){{name: "", description: 'Updated description', campaign_id: campaign.id, group_tag_id: group_tag.id, custom_attributes:{"sample":"test"} }}
      it 'message comes as name cannot be blank' do
        post "/api/v3/accounts/#{account.id}/campaign_tags", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(data['message']).to eq("Name cannot be blank")
      end
    end

    context 'campaign_id params passed as blank' do
      let!(:group_tag) { create(:group_tag, name:"sms test") }
      let!(:campaign) do
      create(:campaign, inbox: sms_inbox, account: account)
      end
      let(:invalid_attributes){{name: "test", description: 'Updated description', campaign_id: "", group_tag_id: group_tag.id, custom_attributes:{"sample":"test"} }}
      it 'message comes as campaign not found' do
        post "/api/v3/accounts/#{account.id}/campaign_tags", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(data['message']).to eq("campaign not found")
      end
    end

    context 'group_tag_id params passed as blank' do
      let!(:group_tag) { create(:group_tag, name:"sms test") }
      let!(:campaign) do
      create(:campaign, inbox: sms_inbox, account: account)
      end
      let(:invalid_attributes){{name: "test", description: 'Updated description', campaign_id: campaign.id, group_tag_id: "", custom_attributes:{"sample":"test"} }}
      it 'message comes as group_tag_id cannot be blank' do
        post "/api/v3/accounts/#{account.id}/campaign_tags", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(data['message']).to eq("group tag id cannot be blank")
      end
    end
  end
end
