require 'rails_helper'

RSpec.describe 'Api::V3::Accounts::Concerns::Configurations::S3Configuration', type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, name: 'test01@gmail.com', email: 'test01@gmail.com') }
  let!(:s3_config) { create(:s3_configuration, account: account) }

  describe 'GET #index' do
    context 'when user is not logged in' do
      it 'returns error message' do
        get "/api/v3/accounts/#{account.id}/configurations/s3"
        data = response.parsed_body
        expect(data['errors'].first).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when user is logged in' do
      it 'returns list of s3 configuration' do
        get "/api/v3/accounts/#{account.id}/configurations/s3", as: :json, params: {}, headers: user.create_new_auth_token
        expect(response.parsed_body['s3_configurations'].count).to eq(1)
        expect(response.parsed_body['s3_configurations'][0].keys).to eq(%w[id access_key secret_key region folder_path account_id
                                                                           created_at updated_at])
      end
    end
  end

  describe 'GET #show' do
    context 'when s3 config is not present' do
      it 'returns error message' do
        get "/api/v3/accounts/#{account.id}/configurations/s3/WRONG_ID", as: :json, params: {}, headers: user.create_new_auth_token
        data = response.parsed_body
        expect(data['error']).to eq("Couldn't find S3Configuration with 'id'=WRONG_ID [WHERE \"s3_configurations\".\"account_id\" = $1]")
      end
    end

    context 'when s3 config is present' do
      it 'returns s3 configuration' do
        get "/api/v3/accounts/#{account.id}/configurations/s3/#{s3_config.id}", as: :json, params: {}, headers: user.create_new_auth_token
        expect(response.parsed_body['s3_configuration'].keys).to eq(%w[id access_key secret_key region folder_path account_id
                                                                       created_at updated_at])
      end
    end
  end

  describe 'GET #create' do
    context 'when s3 config params is blank' do
      it 'returns error message' do
        post "/api/v3/accounts/#{account.id}/configurations/s3", as: :json, params: {}, headers: user.create_new_auth_token
        data = response.parsed_body
        expect(data['error']).to eq('param is missing or the value is empty: s3_configuration')
      end
    end

    context 'when s3 config params is present' do
      it 'returns s3 configuration' do
        post "/api/v3/accounts/#{account.id}/configurations/s3", as: :json,
                                                                 params: { s3_configuration: { access_key: 'testaccesskey123nckdnkcnd', secret_key: 'testsecretkeyfjkdhfkd', region: 'ap-test-123', folder_path: '/home/download/testfolder_path.csv' } }, headers: user.create_new_auth_token
        response.parsed_body
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body['s3_configuration'].keys).to eq(%w[id access_key secret_key region folder_path account_id
                                                                       created_at updated_at])
      end
    end
  end

  describe 'GET #update' do
    context 'when s3 config params is present' do
      it 'returns s3 configuration' do
        patch "/api/v3/accounts/#{account.id}/configurations/s3/#{s3_config.id}", as: :json,
                                                                                  params: { s3_configuration: { access_key: 'testaccesskey123nckdnkcnd', secret_key: 'testsecretkeyfjkdhfkd', region: 'ap-test-123', folder_path: '/home/download/testfolder_path.csv' } }, headers: user.create_new_auth_token
        response.parsed_body
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body['s3_configuration'].keys).to eq(%w[id access_key secret_key region folder_path account_id
                                                                       created_at updated_at])
      end
    end
  end

  describe 'GET #download_csv' do
    context 'when user is not loggedin' do
      it 'returns error message' do
        get download_csv_api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {}, headers: nil
        data = JSON.parse(response.body)
        expect(data["errors"]).to eq(["You need to sign in or sign up before continuing."])
      end
    end

    context 'when user is loggedin' do
      it 'returns error message' do
        file_path = "#{Rails.root}/tmp/crm_cdp/#{account.id}/S3/#{s3_config.id}/registered_user_data_20231019.csv" #key: "registered_user_data_20231019.csv"}
        allow(Aws::S3::Resource).to receive(:new).and_return(s3)
        allow(s3).to receive(:bucket).with(s3_config.bucket_name).and_return(objects)
        allow(objects).to receive(:download_file).and_return(true)
        get download_csv_api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {id: s3_config.id, import_type: "registered", date_format: "20231019"}, headers: user.create_new_auth_token
        expect(objects.download_file).to eq(true)
      end
    end
  end
end
