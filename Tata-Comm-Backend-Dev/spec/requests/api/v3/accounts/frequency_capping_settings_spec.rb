require 'rails_helper'

RSpec.describe "Api::V3::Accounts::FrequencyCappingSettings", type: :request do

  # test cases for fc_setting_details api

    describe 'Get #fc_setting_details' do
      let(:account) { create(:account) }
      let!(:user) { create(:user, account: account, email: "test@gmail.com") }
      let!(:frequency_capping_setting) {create(:frequency_capping_setting, frequency_capping_flag: false, number_of_emails: 2, number_of_days: 10, refresh_the_fc_daily_at: "App Timezone", fc_timezone: "Asia/Kolkata", account_id: account.id, channel_type: 'tata_smsc', sender_id: 1)}

    context 'when the FC Settings exists' do
      it 'return the FC Settings' do
        get "/api/v3/accounts/#{account.id}/frequency_capping_settings/fc_setting_details", params: {sender_id: 1,channel_type: 'tata_smsc'}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'without valid account id' do
      it 'return a a not found message' do
        get "/api/v3/accounts/#{-1}/frequency_capping_settings/fc_setting_details", params: {sender_id: 2,channel_type: 'tata_smsc'}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end



  # test cases for update api
  describe 'PUT #update' do
    let!(:frequency_capping_setting) { create(:frequency_capping_setting) }

    context 'with valid attributes' do
      let!(:account) { create(:account) }
      let!(:user) { create(:user, account: account, email: "test@gmail.com") }
      let!(:frequency_capping_setting) {create(:frequency_capping_setting, frequency_capping_flag: false, number_of_emails: 2, number_of_days: 10, refresh_the_fc_daily_at: "App Timezone", fc_timezone: "Asia/Kolkata", account_id: account.id, channel_type: 'tata_smsc', sender_id: 1)}

      it 'updates the FC Settings' do
          put "/api/v3/accounts/#{account.id}/frequency_capping_settings/#{frequency_capping_setting.id}",headers: user.create_new_auth_token, as: :json, params: {frequency_capping: {number_of_days: 12, frequency_capping_flag: true}}
          frequency_capping_setting.reload
          expect(frequency_capping_setting.frequency_capping_flag).to eq(true)
          expect(frequency_capping_setting.number_of_days).to eq(12)
          expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid attributes' do
      let(:invalid_attributes) {{ number_of_emails: nil, number_of_days: nil}}
      let!(:account) { create(:account) }
      let!(:user) { create(:user, account: account, email: "test@gmail.com") }
      let!(:frequency_capping_setting) {create(:frequency_capping_setting, frequency_capping_flag: false, number_of_emails: 2, number_of_days: 10, refresh_the_fc_daily_at: "App Timezone", fc_timezone: "Asia/Kolkata", account_id: account.id, channel_type: 'tata_smsc', sender_id: 1)}

      it 'returns an error' do
          put "/api/v3/accounts/#{account.id}/frequency_capping_settings/#{frequency_capping_setting.id}",headers: user.create_new_auth_token, as: :json, params: {frequency_capping: invalid_attributes}
          expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'does not update the FC Settings' do
          put "/api/v3/accounts/#{account.id}/frequency_capping_settings/#{frequency_capping_setting.id}", headers: user.create_new_auth_token, as: :json,params: {frequency_capping: invalid_attributes}
          frequency_capping_setting.reload
          expect(frequency_capping_setting.number_of_emails).to eq(2)
      end

      it 'returns the error messages in response' do
          put "/api/v3/accounts/#{account.id}/frequency_capping_settings/#{frequency_capping_setting.id}", headers: user.create_new_auth_token, as: :json,params: {frequency_capping: invalid_attributes}
          expect(JSON.parse(response.body)['errors']).to be_present
      end
    end
  end
end