require 'rails_helper'

RSpec.describe 'Accounts API V3', type: :request do
  let(:account) { create(:account) }
  let(:account_setting) { account.account_setting }
  let(:user) { create(:user, account: account, role: :administrator) }
  let(:common_event) { create(:common_event, account: account) }
  let!(:contact) { create(:contact, account: account, customer_id: "testid") }
  let(:contact_common_event) { create(account: account, common_event: common_event, contact: contact) }

  describe '#show account settings details' do
    context 'with valid account id' do
      it 'returns campaign details' do
        get "/api/v3/accounts/#{account.id}/setting", params: {}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['result']['app_id']).to eq(account_setting.app_id)
        expect(parsed_response['result']['account_id']).to eq(account_setting.account_id)
      end
    end

    context 'without invalid acount id' do
      it 'return a a not found message' do
        get "/api/v3/accounts/111/settings", params: {}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe '#generate access token' do
    context 'with valid app_id' do
      it 'returns campaign details' do
        post "/api/v3/accounts/#{account.id}/generate_access_token", params: {'account_setting': {'app_id': account.account_setting.app_id}}, as: :json
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['access_token']).not_to eq(nil)
        expect(parsed_response['account_id']).to eq(account.id)
      end
    end

    context 'Invalid app id' do
      it 'return a a not found message' do
          post "/api/v3/accounts/#{account.id}/generate_access_token", params: {'account_setting': {'app_id': SecureRandom.hex(12).upcase}}, as: :json
          expect(response).to have_http_status(:unprocessable_entity)
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['error']).to eq('Invalid app_id')
      end
    end
  end

  describe 'GET #get_event_log' do
    context 'when user is authenticated' do
      it 'returns a successful response' do
        get "/api/v3/accounts/#{account.id}/get_event_log", params: {id: account.id, page: 1, result_per_page: 10}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end

      it 'assigns total_records, page_no, and result_per_page' do
        get "/api/v3/accounts/#{account.id}/get_event_log", params: {id: account.id, page: 1, result_per_page: 10}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["page_no"]).to eq(1)
        expect(parsed_response["result_per_page"]).to eq(10)
      end

      it 'assigns contact_common_events' do
        get "/api/v3/accounts/#{account.id}/get_event_log", params: {id: account.id, page: 1, result_per_page: 10}, headers: user.create_new_auth_token, as: :json
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["result_per_page"]).to eq(10)
      end
    end
  end

  describe 'POST #create_event_log' do
    context 'when user is authenticated' do
      let(:valid_event_params) do
        {
          user_attributes: {
            unique_user_id: "testt234",
            customer_id: contact.customer_id ,
          },
          device_attributes: {
            advertising_identifier: "(iOS Device)",
            network_type: "(android networkType)"
          },
          event: {
            name: "update",
            app_version: "1.1.0",
            sdk_version: "1.0.0",
            platform: "android",
            category: "app_event",
            source: "{Internal/Sdk}"
          }
        }
      end
      it 'returns a successful response' do
        post "/api/v3/accounts/#{account.id}/generate_access_token", params: {'account_setting': {'app_id': account.account_setting.app_id}}, as: :json
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        post "/api/v3/accounts/#{account.id}/create_event_log", params: { id: account.id, event_log: valid_event_params }, headers: {Authorization: "Bearer #{parsed_response['access_token']}"}
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
