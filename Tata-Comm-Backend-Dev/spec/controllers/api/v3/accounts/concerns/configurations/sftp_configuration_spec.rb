require 'rails_helper'

RSpec.describe 'Api::V3::Accounts::Concerns::Configurations::SftpConfiguration', type: :request do
  let!(:account) { create(:account) }
  let!(:agent) { create(:user, account: account, role: :agent) }
  let!(:admin) { create(:user, account: account, role: :administrator) }
  let!(:sftp_configuration) { create(:sftp_configuration, account_id: account.id) }

  let(:valid_params) do
    {
      'hostname': 'SFTP_HOSTNAME',
      'username': 'SFTP_USERNAME',
      'password': 'SFTP_PASSWORD',
      'folder_path': 'SFTP_FOLDER_PATH',
      'decryption_key': 'SFTP_DECRYPTION_KEY',
      'is_encrypted': false,
      'account_id': account.id
    }
  end

  let(:invalid_params) do
    {
      'hostname': nil,
      'username': 'SFTP_USERNAME',
      'password': 'SFTP_PASSWORD',
      'folder_path': 'SFTP_FOLDER_PATH',
      'decryption_key': nil,
      'is_encrypted': true
    }
  end

  let(:agent_valid_headers) do
    agent.create_new_auth_token
  end

  describe 'GET /index' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/configurations/sftp", headers: agent_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['sftp_configurations'].size).to eq(account.sftp_configurations.size)
    end
  end

  describe 'GET /show' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/configurations/sftp/#{sftp_configuration.id}", headers: agent_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['sftp_configuration']['id']).to eq(sftp_configuration.id)
      expect(response.parsed_body['sftp_configuration']['hostname']).to eq(sftp_configuration.decrypted_hostname)
      expect(response.parsed_body['sftp_configuration']['username']).to eq(sftp_configuration.decrypted_username)
    end
  end

  describe 'POST /create' do
    context 'with valid parameters' do
      it 'creates a new SftpConfiguration' do
        expect do
          post "/api/v3/accounts/#{account.id}/configurations/sftp",
               params: { sftp_configuration: valid_params }, headers: agent_valid_headers, as: :json
        end.to change(SftpConfiguration, :count).by(1)
      end

      it 'renders a JSON response with the new sftp_configuration' do
        post "/api/v3/accounts/#{account.id}/configurations/sftp",
             params: { sftp_configuration: valid_params }, headers: agent_valid_headers, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including('application/json'))
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new SftpConfiguration' do
        expect do
          post "/api/v3/accounts/#{account.id}/configurations/sftp",
               params: { sftp_configuration: invalid_params }, as: :json
        end.not_to change(SftpConfiguration, :count)
      end

      it 'renders a JSON response with errors for the new sftp_configuration' do
        post "/api/v3/accounts/#{account.id}/configurations/sftp",
             params: { sftp_configuration: invalid_params }, headers: agent_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
      end
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) do
        {
          'hostname': 'UPDATED_SFTP_HOSTNAME',
          'username': 'SFTP_USERNAME',
          'password': 'UPDATED_SFTP_PASSWORD',
          'folder_path': 'SFTP_FOLDER_PATH',
          'decryption_key': 'SFTP_DECRYPTION_KEY',
          'is_encrypted': true
        }
      end

      it 'updates the requested sftp_configuration' do
        sftp_configuration = SftpConfiguration.create! valid_params
        patch "/api/v3/accounts/#{account.id}/configurations/sftp/#{sftp_configuration.id}",
              params: { sftp_configuration: new_attributes }, headers: agent_valid_headers, as: :json
        sftp_configuration.reload
        expect(response).to be_successful
        expect(response.parsed_body['sftp_configuration']['id']).to eq(sftp_configuration.id)
        expect(response.parsed_body['sftp_configuration']['hostname']).to eq(sftp_configuration.decrypted_hostname)
        expect(response.parsed_body['sftp_configuration']['username']).to eq(sftp_configuration.decrypted_username)
      end

      it 'renders a JSON response with the sftp_configuration' do
        sftp_configuration = SftpConfiguration.create! valid_params
        patch "/api/v3/accounts/#{account.id}/configurations/sftp/#{sftp_configuration.id}",
              params: { sftp_configuration: new_attributes }, headers: agent_valid_headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including('application/json'))
      end
    end

    context 'with invalid parameters' do
      it 'renders a JSON response with errors for the sftp_configuration' do
        sftp_configuration = SftpConfiguration.create! valid_params
        patch "/api/v3/accounts/#{account.id}/configurations/sftp/#{sftp_configuration.id}",
              params: { sftp_configuration: invalid_params }, headers: agent_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
      end
    end
  end
end
