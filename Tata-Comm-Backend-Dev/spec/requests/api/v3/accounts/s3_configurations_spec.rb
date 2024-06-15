require 'rails_helper'

RSpec.describe "Api::V3::Accounts::ImportUsers", type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, name: "test01@gmail.com", email: "test01@gmail.com") }
  let!(:s3_config) {create(:s3_configuration, account: account)}
  let(:s3) { double }
  let(:download_file) {double}
  let(:objects) { double } #key: "registered_user_data_20231019.csv"}

  describe 'GET #index' do
    context 'when user is not logged in' do
      it 'returns error message' do
        get api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {}
        data = JSON.parse(response.body)
        expect(data["errors"].first).to eq("You need to sign in or sign up before continuing.")
      end
    end

    context 'when user is logged in' do
      it 'returns list of s3 configuration' do        
        get api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {}, headers: user.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data.count).to eq(1)
        expect(data["s3_configurations"][0].keys).to eq(["id", "access_key", "secret_key", "region", "folder_path", "account_id", "created_at", "updated_at"])
      end
    end
  end

  describe 'GET #show' do
    context 'when s3 config is not present' do
      it 'returns error message' do
        get api_v3_account_s3_configuration_url(account_id: account.id, id: "ekwhdkjnsjknkjsdnjs"), as: :json, params: {}, headers: user.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data["error"]).to eq("Resource could not be found")
      end
    end
    context 'when s3 config is present' do
      it 'returns s3 configuration' do
        get api_v3_account_s3_configuration_url(account_id: account.id, id: s3_config.id), as: :json, params: {}, headers: user.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data["s3_configuration"].keys).to eq(["id", "access_key", "secret_key", "region", "folder_path", "account_id", "created_at", "updated_at"])
      end
    end
  end

  describe 'GET #create' do
    context 'when s3 config params is blank' do
      it 'returns error message' do
        post api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {}, headers: user.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data["error"]).to eq("param is missing or the value is empty: s3_configuration")
      end
    end
    context 'when s3 config params is present' do
      it 'returns s3 configuration' do
        post api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {access_key: "testaccesskey123nckdnkcnd", secret_key: "testsecretkeyfjkdhfkd", region: "ap-test-123", folder_path: "/home/download/testfolder_path.csv"}, headers: user.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data["status"]).to eq("ok")
        expect(data["success_message"]).to eq("S3 configuration saved successfully.")
      end
    end
  end
  
  describe 'GET #update' do
    context 'when s3 config params is blank' do
      it 'returns error message' do
        patch api_v3_account_s3_configuration_url(account_id: account.id, id: s3_config.id), as: :json, params: {}, headers: user.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data["error"]).to eq("param is missing or the value is empty: s3_configuration")
      end
    end
    context 'when s3 config params is present' do
      it 'returns s3 configuration' do
        patch api_v3_account_s3_configuration_url(account_id: account.id, id: s3_config.id), as: :json, params: {access_key: "testaccesskey123nckdnkcnd", secret_key: "testsecretkeyfjkdhfkd", region: "ap-test-123", folder_path: "/home/download/testfolder_path.csv"}, headers: user.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data["status"]).to eq("ok")
        expect(data["success_message"]).to eq("S3 configuration updated successfully.")
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

  describe 'GET #downloadable_cvs_preview' do
    context 'when user is not loggedin' do
      it 'returns error message' do
        get downloadable_csv_preview_api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {}, headers: nil
        data = JSON.parse(response.body)
        expect(data["errors"]).to eq(["You need to sign in or sign up before continuing."])
      end
    end

    context 'when user is loggedin' do
     
      it 'returns error message' do
        file_path = Rails.root.join('spec/assets/contacts.csv')
        allow(Aws::S3::Resource).to receive(:new).and_return(s3)
        allow(s3).to receive(:bucket).with(s3_config.bucket_name).and_return(objects)
        allow(objects).to receive(:download_file).and_return(true)
        get downloadable_csv_preview_api_v3_account_s3_configurations_url(account_id: account.id), as: :json, params: {id: s3_config.id, import_type: "registered", date_format: "20231019"}, headers: user.create_new_auth_token
        expect(objects.download_file).to eq(true)
        expect(CSV.readlines(file_path, headers: false)[1,5].count).to eq 5
      end
    end
  end

end