require 'rails_helper'

RSpec.describe 'Api::V3::Accounts::Concerns::Configurations::DbConfiguration', type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, role: :agent) }
  let!(:db_configuration) { create(:db_configuration, account_id: account.id) }
  let!(:db_configuration1) { create(:db_configuration, account_id: account.id) }
  let!(:db_schedule_detail) { create(:db_schedule_detail, account: account, source_id: db_configuration.id) }

  let(:valid_params) do
    {
      'name': 'test_db',
      'adapter': 'postgresql',
      'encoding': 'unicode',
      'host': 'db-test.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
      'username': 'postgres',
      'database': 'dev_tes',
      'password': 'abcd!1234!',
      'port': '5432',
      'account_id': account.id
    }
  end

  let(:invalid_params) do
    {
      'name': 'test_db',
      'adapter': 'postgresql',
      'encoding': nil,
      'host': 'db-test.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
      'username': 'postgres',
      'database': 'dev_tes',
      'password': 'abcd!1234!',
      'port': '5432'
    }
  end

  let(:user_valid_headers) do
    user.create_new_auth_token
  end

  describe 'GET /index' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/configurations/db", headers: user_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['db_configurations'].size).to eq(account.db_configurations.size)
    end
  end

  describe 'GET /show' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/configurations/db/#{db_configuration.id}", headers: user_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['db_configuration']['id']).to eq(db_configuration.id)
      expect(response.parsed_body['db_configuration']['host']).to eq(db_configuration.decrypted_host)
      expect(response.parsed_body['db_configuration']['username']).to eq(db_configuration.decrypted_username)
    end
  end

  describe 'POST /create' do
    context 'with valid parameters' do
      it 'creates a new DbConfiguration' do
        expect do
          post "/api/v3/accounts/#{account.id}/configurations/db",
               params: { db_configuration: valid_params }, headers: user_valid_headers, as: :json
        end.to change(DbConfiguration, :count).by(1)
      end

      it 'renders a JSON response with the new db_configuration' do
        post "/api/v3/accounts/#{account.id}/configurations/db",
             params: { db_configuration: valid_params }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including('application/json'))
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new DbConfiguration' do
        expect do
          post "/api/v3/accounts/#{account.id}/configurations/db",
               params: { db_configuration: invalid_params }, as: :json
        end.not_to change(DbConfiguration, :count)
      end

      it 'renders a JSON response with errors for the new db_configuration' do
        post "/api/v3/accounts/#{account.id}/configurations/db",
             params: { db_configuration: invalid_params }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
      end
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) do
        {
          'name': 'test_db',
          'adapter': 'mysql',
          'encoding': 'unicode',
          'host': 'testing-db.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
          'username': 'mysql',
          'database': 'dev_testing',
          'password': 'test!1234!',
          'port': '5432'
        }
      end

      it 'updates the requested db_configuration' do
        db_configuration = DbConfiguration.create! valid_params
        patch "/api/v3/accounts/#{account.id}/configurations/db/#{db_configuration.id}",
              params: { db_configuration: new_attributes }, headers: user_valid_headers, as: :json
        db_configuration.reload
        expect(response).to be_successful
        expect(response.parsed_body['db_configuration']['id']).to eq(db_configuration.id)
        expect(response.parsed_body['db_configuration']['host']).to eq(db_configuration.decrypted_host)
        expect(response.parsed_body['db_configuration']['username']).to eq(db_configuration.decrypted_username)
      end

      it 'renders a JSON response with the db_configuration' do
        db_configuration = DbConfiguration.create! valid_params
        patch "/api/v3/accounts/#{account.id}/configurations/db/#{db_configuration.id}",
              params: { db_configuration: new_attributes }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including('application/json'))
      end
    end

    context 'with invalid parameters' do
      it 'renders a JSON response with errors for the db_configuration' do
        db_configuration = DbConfiguration.create! valid_params
        patch "/api/v3/accounts/#{account.id}/configurations/db/#{db_configuration.id}",
              params: { db_configuration: invalid_params }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
      end
    end
  end

  describe 'POST /test_connection' do
    context 'with valid parameters' do
      let(:new_attributes) do
        {
          'name': 'dev_setup1',
          'adapter': 'postgresql',
          'encoding': 'unicode',
          'host': 'db-segmentation.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
          'username': 'postgres',
          'database': 'devsetup-1',
          'password': 'TataCom!1234!',
          'port': '5432',
          'table_name': 'accounts'
        }
      end

      it 'shows that db connection is successful' do
        post "/api/v3/accounts/#{account.id}/configurations/db/test_connection",
             params: { db_configuration: new_attributes }, headers: user_valid_headers, as: :json
        expect(response).to be_successful
        expect(response.parsed_body['message']).to eq(I18n.t('db_configuration.test_connection.success'))
      end
    end

    context 'with invalid parameters' do
      let(:wrong_params) do
        {
          'name': 'test_db',
          'adapter': 'postgresql',
          'encoding': 'unicode',
          'host': 'testing-db.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
          'username': 'psql',
          'database': 'dev_testing',
          'password': 'test!1234!',
          'port': '5432',
          'table_name': 'accounts'
        }
      end

      it 'renders the response as unprocessable entity' do
        post "/api/v3/accounts/#{account.id}/configurations/db/test_connection",
             params: { db_configuration: wrong_params }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE /db_destroy' do
    context 'when cofiguration is not associated with any active scheduler' do
      it 'successfully destroy the configuration' do
        delete "/api/v3/accounts/#{account.id}/configurations/db/#{db_configuration1.id}",
               headers: user_valid_headers, as: :json
        expect(response).to be_successful
        expect(response.parsed_body['message']).to eq(I18n.t('db_configuration.destroy.success'))
      end
    end

    context 'when cofiguration is associated with any active scheduler' do
      it 'do not destroy the configuration' do
        delete "/api/v3/accounts/#{account.id}/configurations/db/#{db_configuration.id}",
               headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['message']).to eq(I18n.t('db_configuration.destroy.active_db_connection'))
      end
    end
  end

  describe 'GET /db_configuration_list' do
    it 'provides the list of configurations id and name in json format' do
      get "/api/v3/accounts/#{account.id}/configurations/db/configuration_list",
          headers: user_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['db_configurations'].size).to eq(TWO)
    end
  end
end
