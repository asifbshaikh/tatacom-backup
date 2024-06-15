require 'rails_helper'

RSpec.describe "Api::V3::Accounts::EmailGeneralSettings", type: :request do
  describe 'POST #create' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:email_channel) { create(:channel_email, account: account) }
    let!(:email_inbox) { create(:inbox, channel: email_channel, account: account) }

    context 'with valid attributes' do
      let(:valid_attributes){{user_attribute: 'Campaign Name', channel_email_id: email_channel.id, email_address:["mycompany@gmail.com"] }}
      it 'creates a new email general settings' do
        expect {
          post "/api/v3/accounts/#{account.id}/email_general_settings", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(EmailGeneralSetting, :count).by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'email general settings record already present for channel' do
      let(:valid_attributes){{user_attribute: 'Campaign Name', channel_email_id: email_channel.id, email_address:["mycompany@gmail.com"] }}
      it 'return email general settings already present for channel' do
        post "/api/v3/accounts/#{account.id}/email_general_settings", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        expect(EmailGeneralSetting.where(channel_email_id: email_channel.id)).to exist
      end
    end
  end
  # test cases for show action
  describe 'GET #show' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:email_channel) { create(:channel_email, account: account) }
    let!(:email_inbox) { create(:inbox, channel: email_channel, account: account) }
    let!(:email_general_setting) {create(:email_general_setting, user_attribute: 'Campaign Name', channel_email_id: email_channel.id, email_address: ["test@gmail.com","john@gmail.com"])}

    context 'with valid channel id params' do
      it 'it shows the email general settings record' do
        get "/api/v3/accounts/#{account.id}/email_general_settings/#{email_channel.id}", headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid channel id params' do
      it 'return email general setting not found for channel' do
        get "/api/v3/accounts/#{account.id}/email_general_settings/22", headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
        expect(data['message']).to eq("Email General Setting not found for channel")
      end
    end
  end
  # test cases for update action
  describe 'PUT #update' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:email_channel) { create(:channel_email, account: account) }
    let!(:email_inbox) { create(:inbox, channel: email_channel, account: account) }
    let!(:email_general_setting) {create(:email_general_setting, user_attribute: 'Campaign Name', channel_email_id: email_channel.id, email_address: ["test@gmail.com","john@gmail.com"])}

    context 'with valid attribute update email general setting' do
      let(:valid_attributes){{user_attribute: 'Email', email_address:["test@gmail.com","john@gmail.com","mycompany@gmail.com"] }}
      it 'return the message with updated email_general_setting record' do
        put "/api/v3/accounts/#{account.id}/email_general_settings/#{email_channel.id}",params: valid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        email_general_setting.reload 
        expect(email_general_setting.user_attribute).to eq('Email')
        expect(email_general_setting.email_address).to eq(["test@gmail.com","john@gmail.com","mycompany@gmail.com"])
        expect(response).to have_http_status(:ok)
        expect(data['message']).to eq("Email General Setting Updated successfully")
      end
    end

    context 'with invalid channel id params update Email General setting' do
      it 'return the message email general setting not found for channel' do
        put "/api/v3/accounts/#{account.id}/email_general_settings/22", headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
        expect(data['message']).to eq("Email General Setting not found for channel")
      end
    end
  end
end
