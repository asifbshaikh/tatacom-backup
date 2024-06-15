require 'rails_helper'

RSpec.describe "Api::V3::Accounts::EmailConfigs", type: :request do
  let(:account) { create(:account) }  
  let(:agent_user) { create(:user, account: account, name: "agent@gmail.com", email: "agent@gmail.com", role: :agent)}
  let(:user) { create(:user, account: account, name: "administrator@gmail.com", email: "administrator@gmail.com", role: :administrator) }
  let!(:email_channel) { create(:channel_email, account: account) }
  describe 'Get #index' do
    context 'with unauthorize user' do 
      it 'returns a error message' do
        get "/api/v3/accounts/#{account.id}/email_configs/", headers: agent_user.create_new_auth_token, as: :json
        response_data = JSON.parse(response.body)
        expect(response_data["error"]).to eq("Unauthorize to view email connector configuration.")
        expect(response_data["status"]).to eq(false)
      end
    end
    context 'with valid account' do 
      it 'returns a list of email channels' do
        get "/api/v3/accounts/#{account.id}/email_configs", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)

        response_data = JSON.parse(response.body)
        expect(response_data['emails']).not_to be_empty
      end
    end

    context 'without valid account' do
      it 'returns a not found message' do 
        get "/api/v3/accounts/#{1}/email_configs", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(401)
      end 
    end

    context "with pagination parameters" do
      it "returns paginated templates" do
        get "/api/v3/accounts/#{account.id}/email_configs", headers: user.create_new_auth_token, as: :json, 
        params: {page: 1, per_page: 1}
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['emails'].length).to eq(1)
      end
    end
  end

  describe 'Get #show' do
    context 'with valid email id' do
      it 'returns a list of email channels' do
        get "/api/v3/accounts/#{account.id}/email_configs/#{email_channel.id}", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok) 
      end 
    end 
        
    context 'without valid email id' do 
      it 'return a a not found message' do
        get "/api/v3/accounts/#{account.id}/email_configs/#{1}", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found) 
      end
    end
  end
  
  describe 'Post #create' do 
    context 'when user is not logged in' do
      it 'returns status 404' do
        post api_v3_account_email_configs_url(account_id: ''), as: :json, params: {}
        expect(response.status).to eq(404)
      end
    end

    context 'when user is logged in and params are blank' do
      before do
        post api_v3_account_email_configs_url(account_id: account.id), as: :json, params: {}, headers: user.create_new_auth_token
      end

      it 'returns status false' do
        resp = JSON.parse(response.body)
        expect(resp["status"]).to eq(false)
      end

      it 'returns error message' do
        resp = JSON.parse(response.body)
        expect(resp["error_message"]).to eq("Provide necessary params to save email connector configuration.")
      end     
    end

    context 'when user is logged in and params are present' do
      before do
        post api_v3_account_email_configs_url(account_id: account.id), as: :json, params: {"host_name": "smtp@gmail.com", "port": "554", "protocol": "SSL", "smtp_auth_enable": true, "smtp_user_name": "exampletest01@gmail.com", "smtp_password": "Test@123", "maximum_send_rate": 200, "unsubscribe_setting": "Tracking", "bounces_and_complaint_tracking": "www.bounces_and_complaint_tracking.com/tracking_complaints"}, headers: user.create_new_auth_token
      end

      it 'returns data with some keys' do
        resp = JSON.parse(response.body)
        expect(resp.keys).to include("id", "host_name", "port", "protocol", "smtp_user_name")
      end  
    end
  end

  describe 'Patch #update' do
    context 'when user is not logged in' do
      it 'returns status 404' do
        post api_v3_account_email_configs_url(account_id: ''), as: :json, params: {}
        expect(response.status).to eq(404)
      end
    end

    context 'when user is logged in and email connector config not present' do
      before do
        patch api_v3_account_email_config_url(account_id: account.id, id: 1), as: :json, params: {}, headers: user.create_new_auth_token
      end

      it 'returns status false' do
        resp = JSON.parse(response.body)
        expect(resp["status"]).to eq(false)
      end

      it 'returns error message' do
        resp = JSON.parse(response.body)
        expect(resp["error_message"]).to eq("Email connector config not found.")
      end     
    end

    context 'when user is logged in and email connector config present' do
      before do
        patch api_v3_account_email_config_url(account_id: account.id, id: email_channel.id), as: :json, params: {"host_name": "smtp.sendgrid.net", "port": "25", "protocol": "TSL", "smtp_auth_enable": true, "smtp_user_name": "change@gmail.com", "smtp_password": "Test@123", "maximum_send_rate": 200, "unsubscribe_setting": "Tracking", "bounces_and_complaint_tracking": "www.bounces_and_complaint_tracking.com/tracking_complaints"}, headers: user.create_new_auth_token
      end

      it 'returns data with some keys' do
        resp = JSON.parse(response.body)
        expect(resp.keys).to include("id", "host_name", "port", "smtp_user_name", "protocol", "smtp_auth_enable", "maximum_send_rate", "unsubscribe_setting", "bounces_and_complaint_tracking")
      end  
    end
  end

  describe 'Delete #destroy' do
    context 'when user is not logged in' do
      it 'returns status 404' do
        delete api_v3_account_email_config_url(account_id: '', id: ''), as: :json, params: {}
        expect(response.status).to eq(404)
      end
    end

    context 'when user is logged in but email config is not present' do 
      it 'returns error message' do
        delete api_v3_account_email_config_url(account_id: account.id, id: 10), as: :json, params: {}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(resp["error_message"]).to eq("Email connector config not found.")
      end

      it 'returns status false' do
        delete api_v3_account_email_config_url(account_id: account.id, id: 10), as: :json, params: {}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(resp["status"]).to eq(false)
      end
    end

    context 'when user is logged in and email config is present' do 
      it 'returns status true' do
        delete api_v3_account_email_config_url(account_id: account.id, id: email_channel.id), as: :json, params: {}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(resp["status"]).to eq(true)
      end

      it 'returns success message' do
        delete api_v3_account_email_config_url(account_id: account.id, id: email_channel.id), as: :json, params: {}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(resp["success_message"]).to eq("Email connector configuration deleted successfully.")
      end
    end
  end
end
