require 'rails_helper'

RSpec.describe "Api::V3::Accounts::CampaignDetails", type: :request do
  let(:account) { create(:account) }
  let(:agent_user) { create(:user, account: account, name: "agent@gmail.com", email: "agent@gmail.com", role: :agent)}
  let(:user) { create(:user, account: account, name: "administrator@gmail.com", email: "administrator@gmail.com", role: :administrator) }
  let!(:email_channel) { create(:channel_email, account: account) }
  let!(:email_inbox) { create(:inbox, channel: email_channel) }
  let!(:email_campaign) { create(:email_campaign) }
	let!(:campaign) {create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account)}
	let!(:campaign_detail) {create(:campaign_detail, account: account, channel_email_id: email_channel.id, campaign_id: campaign.id)}

  describe 'Get #show_campaign_details' do
    context 'with valid campaign id' do
      it 'returns campaign details' do
        get "/api/v3/accounts/#{account.id}/campaign_details/show_campaign_details", params: {campaign_detail: {campaign_id: campaign.id}}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'without valid campaign id' do
      it 'return a a not found message' do
        get "/api/v3/accounts/#{account.id}/campaign_details/show_campaign_details", params: {campaign_detail: {campaign_id: nil}}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'Post #create' do
    context 'when user is not logged in' do
      it 'returns status 404' do
        post api_v3_account_campaign_details_url(account_id: ''), as: :json, params: {}
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is logged in and params are blank' do
      it 'when campaign not present' do
        post "/api/v3/accounts/#{account.id}/campaign_details", as: :json, params: {}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
				expect(resp["message"]).to eq("Campaign not found!")
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when user is logged in and params are present' do
      let!(:new_campaign) {create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account)}

      it 'returns data with some keys' do
        post "/api/v3/accounts/#{account.id}/campaign_details", as: :json, params: {campaign_detail: {subject: "Let Your Summer Look Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"], from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id, campaign_id: new_campaign.id}}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(resp['subject']).to eq("Let Your Summer Look Shine!!!!")
        expect(resp['sender_name']).to eq("Tata User")
      end
    end
  end

  describe 'Patch #update' do
    context 'when user is not logged in' do
      it 'returns status 404' do
        post api_v3_account_campaign_detail_url(account_id: '', id: ''), as: :json, params: {"campaign_detail": {campaign_id: nil}}
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is logged in and campaign details not present' do
      it 'returns status 404' do
        put "/api/v3/accounts/#{account.id}/campaign_details/#{campaign_detail.id}", as: :json, params: {"campaign_detail": {campaign_id: nil}}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is logged in and campaign details present' do
      it 'returns data with some keys' do
        put "/api/v3/accounts/#{account.id}/campaign_details/#{campaign_detail.id}", as: :json, params: {campaign_detail: {subject: "Let Your Summer Look Super Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"], campaign_id: campaign.id}}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(resp['subject']).to eq("Let Your Summer Look Super Shine!!!!")
        expect(resp['sender_name']).to eq("Tata User")
      end
    end
  end

  describe "Delete #destroy" do
    context "when the campaign details exists" do
      it "destroy the campaign details" do
        delete "/api/v3/accounts/#{account.id}/campaign_details/#{campaign_detail.id}", params: {campaign_detail: {campaign_id: campaign.id}}, headers: user.create_new_auth_token, as: :json
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(resp).to include("message" => "Campaign Details deleted successfully")
      end
    end

    context "does not exists" do
      it "returns an error" do
        delete "/api/v3/accounts/#{account.id}/campaign_details/wrong_id", params: {}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)).to include("errors" => "Resource could not be found")
      end
    end
  end
end
