require 'rails_helper'

RSpec.describe "Api::V3::Accounts::EmailTemplates", type: :request do
  let(:account) {create(:account)}
  let(:user) {create(:user, account: account, email: "test@example.com")}
  let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}
  let!(:email_template) {create(:email_template, account: account, name: "New Template", body: "/home/diksha/Documents/email_template.html")}

  describe "GET #index" do
    before do
      create(:email_template, name: "Test Template", body: "/home/diksha/Documents/email_template.html", account: account)
    end

    context "with pagination parameters" do
      it "returns paginated templates" do
        get "/api/v3/accounts/#{account.id}/email_templates", headers: user.create_new_auth_token, as: :json, params: {page: 1, per_page: 1}
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['email_templates'].length).to eq(1)
      end
    end

    context "without pagination parameters" do
      it "returns paginated templates" do
        get "/api/v3/accounts/#{account.id}/email_templates", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['email_templates'].length).to eq(2)
      end
    end
  end

  describe 'Get #show' do
    context 'with valid id' do
      it 'returns email template details' do
        get "/api/v3/accounts/#{account.id}/email_templates/#{email_template.id}", params: {}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'without valid campaign id' do
      it 'return a a not found message' do
        get "/api/v3/accounts/#{account.id}/email_templates/-1", params: {}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'Post #create' do
    context 'when user is not logged in' do
      it 'returns status 404' do
        post api_v3_account_email_templates_url(account_id: ''), as: :json, params: {}
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'with valid attributes' do
      let(:valid_attributes) {{name: 'Email Template', body: "/home/diksha/Documents/email_template.html", account_id: account.id}}
      it 'creates a new template' do
        expect {
          post "/api/v3/accounts/#{account.id}/email_templates", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(EmailTemplate, :count).by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid attributes' do
      let(:invalid_attributes) {{name: nil, body: nil}}
      it 'creates a new template' do
        post "/api/v3/accounts/#{account.id}/email_templates", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'Patch #update' do
    context 'when user is not logged in' do
      it 'returns status 404' do
        post api_v3_account_email_template_url(account_id: '', id: ''), as: :json, params: {}
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is logged in and email template not present' do
      it 'returns status 404' do
        put "/api/v3/accounts/#{account.id}/email_templates/-1", as: :json, params: {}, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is logged in and email template present' do
      it 'returns data with some keys' do
        put "/api/v3/accounts/#{account.id}/email_templates/#{email_template.id}", as: :json, params: { name: "Test Template" }, headers: user.create_new_auth_token
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(resp["email_template"]["name"]).to eq("Test Template")
      end
    end
  end

  describe "Delete #destroy" do
    context "when the email template exists" do
      it "destroy the email template" do
        delete "/api/v3/accounts/#{account.id}/email_templates/#{email_template.id}", params: {}, headers: user.create_new_auth_token, as: :json
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(resp).to include("message" => "Email Template deleted successfully")
      end
    end

    context "does not exists" do
      it "returns an error" do
        delete "/api/v3/accounts/#{account.id}/email_templates/wrong_id", params: {}, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)).to include("error" => "Resource could not be found")
      end
    end
  end

  describe 'Get #get_predefined_templates' do
    context 'when pre-defined templates are present' do
      let!(:predefined_template) {create(:email_template, account_id: 1, name: "New Template", body: "/home/diksha/Documents/email_template.html")}

      it 'returns status as ok' do
        get "/api/v3/accounts/#{account.id}/email_templates/get_predefined_templates", headers: user.create_new_auth_token, as: :json
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end

      it 'returns pre-defined template results' do
        get "/api/v3/accounts/#{account.id}/email_templates/get_predefined_templates", headers: user.create_new_auth_token, as: :json
        resp = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        # For this we need to create records for email-template with account_id = 1
        expect(JSON.parse(response.body)['email_templates'].length).to eq(2)
      end
    end
  end
end
