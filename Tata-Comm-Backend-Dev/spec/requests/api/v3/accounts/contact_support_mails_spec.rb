require 'rails_helper'
require 'webmock'

RSpec.describe "Api::V3::Accounts::ContactSupportMails", type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, name: "TestUser", email: "example10@gmail.com") }
  let!(:sms_channel) { create(:channel_sms) }
  let!(:sms_inbox) { create(:inbox, channel: sms_channel) }
  let!(:template) { create(:template, account: account) }
  let!(:campaign_sms_campaign) { create(:campaign_sms_campaign, account: account, template_id: template.id) }

  describe "#POST create" do
    context 'when user is logged in and sends request for customer care' do
      it 'returns the unprocessable_entity' do
				invalid_params = {
					subject: "Test Subject",
					priority: "High"
				}
        post "/api/v3/accounts/#{account.id}/contact_support_mails", as: :json, params: invalid_params,headers: user.create_new_auth_token
				data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns error message' do
				invalid_params = {
					subject: "Test Subject",
					priority: "High"
				}
        post "/api/v3/accounts/#{account.id}/contact_support_mails", as: :json, params: invalid_params,headers: user.create_new_auth_token
				data = JSON.parse(response.body)
        expect(data['message']).to eq("Unable to send mail")
      end
    end
  end

	describe "#POST create" do
    before do
      WebMock.stub_request(:get, "https://login.microsoftonline.com/20210462-2c5e-4ec8-b3e2-0be950f292ca/oauth2/v2.0/token").
        with(
          body: {"client_id"=>"acd3f163-1ccc-4b2e-8a3f-2dee57d9434a", "client_secret"=>"VVS8Q~EccAiMqzMqmQZ6o8EpOt1~sTX4TiN-TaZA", "grant_type"=>"client_credentials", "scope"=>"https://graph.microsoft.com/.default"},
          headers: {
          'Accept'=>'*/*',
          'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
          'Content-Type'=>'application/x-www-form-urlencoded',
          'Host'=>'login.microsoftonline.com',
          'User-Agent'=>'Ruby'
          }).
        to_return(status: 200, body: JSON.dump({message: "Email delivered successfully!"}),headers: { 'Content-Type' => 'application/json' })
    end

    context 'when user is logged in and sends request for customer care' do
      let(:contact_support_mail) { create(:contact_support_mail, user: user)}
      it 'returns data with some keys' do
				valid_params = {
					subject: "Test Subject",
					priority: "High",
					description: "Test",
          cc_users: ['test1@gmail.com', 'test2@gmail.com'],
          bcc_users: ['testbcc1@gmail.com']
				}
        post "/api/v3/accounts/#{account.id}/contact_support_mails", as: :json, params: valid_params, headers: user.create_new_auth_token
        expect(response.content_type).to eq('text/html; charset=utf-8')
      end
    end

    context 'when user is logged in and sends request for customer care success' do
      let(:contact_support_mail) { create(:contact_support_mail, user: user)}
      it 'returns data with some keys' do
				valid_params = {
					subject: "Test Subject",
					priority: "High",
					description: "Test",
          cc_users: ['test1@gmail.com', 'test2@gmail.com'],
          bcc_users: ['testbcc1@gmail.com']
				}
        post "/api/v3/accounts/#{account.id}/contact_support_mails", as: :json, params: valid_params, headers: user.create_new_auth_token
        expect(response).to have_http_status(:ok)
      end
    end
  end
end

