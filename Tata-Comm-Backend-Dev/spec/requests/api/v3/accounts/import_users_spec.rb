require 'rails_helper'

RSpec.describe "Api::V3::Accounts::ImportUsers", type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, name: "test01@gmail.com", email: "test01@gmail.com") }
  let!(:agent) { create(:user, account: account, role: :agent, name: "test02@gmail.com", email: "test02@gmail.com") }
  let!(:agent1) { create(:user, account: account, role: :agent, name: "test03@gmail.com", email: "test03@gmail.com") }
  let!(:import_users) { 
        build_list(:import_user, 15) do |import, i|
          import.account = account
          import.account_user = agent.account_users.first
          import.file_url = 'http://example.com'
          import.user_type = 'registered'
          import.total_rows = 100 + i 
          import.new_users_count = 10 + i 
          import.updated_users_count = 10 + i
          import.update_existing_user = 'true'
          import.new_custom_attributes = []
          import.status = "created" 
          import.save!
        end
      }
  
  describe 'GET #new' do
    context "when auth_token is not present" do
      it "returns signin error" do
        get new_api_v3_account_import_user_path(account_id: account.id)
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)["errors"]).to eq(["You need to sign in or sign up before continuing."])
      end
    end

    context "when user signed in" do
      it "returns instance of import user" do
        get api_v3_account_import_users_url(account_id: account.id), params: {}, headers: agent.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data).to eq([])
      end
    end
  end

  describe '#user_attribute_mapping' do
    context 'when account id params is not present' do
      it 'returns 404 status' do
        get "/api/v3/accounts/#{}/import_users/user_attribute_mapping", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(404)
      end
    end

    context 'when account id params is present' do
      it 'returns only contacts attributes mapped' do
        get "/api/v3/accounts/#{account.id}/import_users/user_attribute_mapping",headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
        expect(data['status']).to eq(200)
      end
    end

    context 'When account_id params is present and custom attribute defination is present then we mapped both table attributes' do
      let!(:custom_attribute_definition) { create(:custom_attribute_definition, account: account,attribute_display_name:"User City",attribute_key: "user_city",attribute_display_type:"text",attribute_model:"contact_attribute",attribute_description:"city") }

      before do
        get "/api/v3/accounts/#{account.id}/import_users/user_attribute_mapping",params: {account_id: account.id},headers: user.create_new_auth_token, as: :json
      end

      it 'Return contacts attributes with custom_attribute_definition table mapped attributes' do
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
        expect(data['status']).to eq(200)
      end
    end
  end

  describe 'GET #index' do
    context 'when auth_token is not provided' do
      it 'returns error message for sign in' do
        get api_v3_account_import_users_url(account_id: account.id), as: :json, params: {page: 1, result_per_page: 10}, headers: nil
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)["errors"]).to eq(["You need to sign in or sign up before continuing."])
      end
    end

    context 'when params is not provided' do
      it 'returns blank json' do
        get api_v3_account_import_users_url(account_id: account.id), as: :json, params: {}, headers: agent.create_new_auth_token
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)).to eq([])
      end
    end

    context 'when user id params is not present' do
      it 'returns blank import user message' do
        get api_v3_account_import_users_url(account_id: account.id), as: :json, params: {page: 1, result_per_page: 10}, headers: agent.create_new_auth_token
        data = JSON.parse(response.body)
        expect(data).to eq([])
      end
    end

    context 'When page params is not present' do 
      it 'takes 1 as page params and returns the data' do
        get api_v3_account_import_users_url(account_id: account.id), as: :json, params: {user_id: agent.id, result_per_page: 10}, headers: agent.create_new_auth_token
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
        expect(data["total_records"]).to be(15)
        expect(data["data"].length).to be(10)
      end
    end

    context 'When page params is present' do 
      it 'returns data as per given page params' do
        get api_v3_account_import_users_url(account_id: account.id), as: :json, params: {user_id: agent.id, page: 2, result_per_page: 10}, headers: agent.create_new_auth_token
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
        expect(data["total_records"]).to be(15)
        expect(data["data"].length).to be(5)
      end
    end

    context 'When user is present with the given params' do
      before do
        get api_v3_account_import_users_url(account_id: account.id), as: :json, params: {user_id: agent.id}, headers: agent.create_new_auth_token
      end

      it 'Return past import user list' do 
        data = JSON.parse(response.body)
        expect(data['data'].count).to be > 0
      end

      it 'Return n number of json of past import users' do
        data = JSON.parse(response.body)
        expect(data['data'].count).to eq(10)
      end

      it 'Json should contains the file_url' do
        data = JSON.parse(response.body)
        expect(data['data'][0].keys).to eq(["uploaded_date", "files_uploaded", "file_name", "import_type", "total_rows_in_file", "new_users_added", "users_updated", "failed_users", "skipped_records", "custom_segment", "status"])
      end
    end

    context 'When import users is not present with the given params' do
      before do
        get api_v3_account_import_users_url(account_id: account.id), as: :json, params: {user_id: agent1.id}, headers: agent.create_new_auth_token, as: :json 
      end

      it 'Returns status 404' do 
        data = JSON.parse(response.body)
        expect(data).to eq []
      end

      it 'Returns blank data' do
        data = JSON.parse(response.body)
        expect(data.length).to be 0
      end
    end
  end

  describe 'POST /api/v3/accounts/{account.id}/import_users/import' do
    file = 'spec/assets/contacts.csv'

    context 'when it is an authenticated user' do
      let(:agent) { create(:user, account: account, role: :agent, name: "test04@gmail.com", email: "test04@gmail.com") }
      it 'upload csv file import user' do
        file = fixture_file_upload(Rails.root.join('spec/assets/contacts.csv'), 'text/csv')
        json_data = {user_type: 'registered', identifier: "customer_id", update_existing_user: false, col_types: {"0": {customer_id: 1}, "1": {first_name: "string"}, "2": {name: "string", email: "string"}}, skipped_col: [0], user_id: agent.id}

        post "/api/v3/accounts/#{account.id}/import_users/import",
             headers: agent.create_new_auth_token,
             params: { file: file, import_user: json_data.to_json} 
        data = JSON.parse(response.body)
        expect(response.status).to eq 200 
        expect(data["message"]).to eq("File imported successfully")
      end
    end

    context 'when file is empty' do
      let(:agent) { create(:user, account: account, role: :agent, name: "test05@gmail.com", email: "test05@gmail.com") }

      it 'returns Unprocessable Entity' do
        json_data = {user_type: 'registered', identifier: "customer_id", update_existing_user: false, col_types: {"0": {customer_id: 1}, "1": {first_name: "string"}, "2": {name: "string", email: "string"}}, skipped_col: [0], user_id: agent.id}

        post "/api/v3/accounts/#{account.id}/import_users/import",
             headers: agent.create_new_auth_token,
             params: { import_user: json_data.to_json} 
        json_response = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
