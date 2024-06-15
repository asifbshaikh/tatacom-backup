require 'rails_helper'

RSpec.describe 'NotificationChannelsController', type: :request do
  let(:account) { create(:account) }
  let(:user) { create(:user, account: account) }
  let(:notification_channel) { create(:notification_channel, account: account) }
  let(:file_params) { fixture_file_upload('private_key.json', 'application/p') }
  let(:notification_channel_secrete_file) do
    create(:notification_channel_secrete_file, notification_channel: notification_channel)
  end

  describe 'GET index' do
    let(:notification_channel) { create(:notification_channel, account: account) }

    it 'returns a list of notification channels' do
      get "/api/v3/accounts/#{account.id}/notification_channels", headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response).to include('')
    end
  end

  describe 'GET show' do
    context 'with valid notification channel ID' do
      it 'returns the details of the notification channel' do
        get "/api/v3/accounts/#{account.id}/notification_channels/#{notification_channel.id}", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to include('notification_channel_secrete_files')
      end
    end

    context 'with invalid notification channel ID' do
      it 'returns not_found' do
        get "/api/v3/accounts/#{account.id}/notification_channels/123", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST create' do
    context 'with valid parameters' do
      it 'creates a new notification channel with a private key file' do
        post "/api/v3/accounts/#{account.id}/notification_channels", params: { notification_channel: { channel_name: 'mobile_push', platform: 'android', configuration: { config_type: 'private_key_file' } }, channel_secret_file: file_params },
        headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end

      it 'creates a new notification channel with an APNS authentication key' do
        post "/api/v3/accounts/#{account.id}/notification_channels", params: { notification_channel: { channel_name: 'mobile_push', platform: 'ios', configuration: { config_type: 'apns_authentication_key' } }, channel_secret_file: file_params },
        headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end

      it 'creates a new notification channel with an APNS provider certificate' do
        post "/api/v3/accounts/#{account.id}/notification_channels", params: { notification_channel: { channel_name: 'mobile_push', platform: 'ios', configuration: { config_type: 'apns_provider_certificate' } }, channel_secret_file: file_params },
        headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters' do
      it 'returns unprocessable_entity with invalid file extension' do
        file = fixture_file_upload('private_key.txt', 'text/plain')
        post "/api/v3/accounts/#{account.id}/notification_channels", params: { notification_channel: { channel_name: 'mobile_push', platform: 'android', configuration: { config_type: 'private_key_file' } }, channel_secret_file: file }, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns unprocessable_entity without a file' do
        post "/api/v3/accounts/#{account.id}/notification_channels", params: { notification_channel: { channel_name: 'mobile_push', platform: 'android', configuration: { config_type: 'private_key_file' } }, channel_secret_file: nil },
        headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PUT update' do
    context 'with valid notification channel ID and parameters' do
      it 'updates the notification channel' do
        put "/api/v3/accounts/#{account.id}/notification_channels/#{notification_channel.id}", params: { id: notification_channel.id, notification_channel: { channel_name: 'mobile_push' }, channel_secret_file: file_params }, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        expect(json_response).to include('')
      end
    end

    context 'with invalid notification channel id' do
      it 'returns not_found' do
        put "/api/v3/accounts/#{account.id}/notification_channels/#{notification_channel.id}", params: { id: 90, notification_channel: { channel_name: 'Updated Channel' } }, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end