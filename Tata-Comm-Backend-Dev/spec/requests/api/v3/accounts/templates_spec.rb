require 'rails_helper'

RSpec.describe "Api::V3::Accounts::Templates", type: :request do

    # test cases for index action
    describe "GET #index" do
      let(:account) { create(:account) }
      let(:user) { create(:user, account: account) }
      let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}
      let(:valid_attributes){{name: 'Updated name', description: 'Updated description', message: 'Updated message', account_id: account.id, account_user_id: account_user.id}}
      let!(:template) {create(:template,name: "Updated names",registered_dlt: "test", description: "Updated description", message: "demo", account: account)}

      context "with pagination parameters" do
        it "returns paginated templates" do
          get "/api/v3/accounts/#{account.id}/templates", headers: user.create_new_auth_token, as: :json, 
          params: {page: 1, per_page: 1}
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)['templates'].length).to eq(1)
        end
      end
  
      context "with pagination parameters" do
        it "returns paginated templates" do
          get "/api/v3/accounts/#{account.id}/templates", headers: user.create_new_auth_token, as: :json
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)['templates'].length).to eq(1)
        end
      end
    end 

  # test cases for create action
  describe 'POST #create' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}
    let(:valid_attributes){{name: 'Updated name', description: 'Updated description', message: 'Updated message', account_id: account.id, account_user_id: account_user.id}}
    context 'with valid attributes' do
      it 'creates a new template' do
        expect {
          post "/api/v3/accounts/#{account.id}/templates", params: {template: valid_attributes}, headers: user.create_new_auth_token, as: :json
        }.to change(Template, :count).by(1)
        expect(response).to have_http_status(:ok)
      end 

      it 'returns the created sms template' do
        post "/api/v3/accounts/#{account.id}/templates", params: {template: valid_attributes}, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)['name']).to eq(valid_attributes[:name])
        expect(JSON.parse(response.body)['description']).to eq(valid_attributes[:description]) 
        expect(JSON.parse(response.body)['message']).to eq(valid_attributes[:message]) 
      end
    end
  end

  describe 'POST #create' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}
    let(:valid_attributes){{name: 'Updated name', description: 'Updated description', message: 'Updated message', account_id: account.id, account_user_id: account_user.id}}
    context 'with valid attributes' do
      it 'creates a new template' do
        expect {
          post "/api/v3/accounts/#{account.id}/templates", params: {template: valid_attributes}, headers: user.create_new_auth_token, as: :json
        }.to change(Template, :count).by(1)
        expect(response).to have_http_status(:ok)
      end 
    end
  end
  describe 'with invalid attributes' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}
    let(:valid_attributes){{name: 'Updated name', description: 'Updated description', message: 'Updated message', account_id: account.id, account_user_id: account_user.id}}

    let(:invalid_attributes){{name: nil, description: nil, message: nil, account_id: 10}}

    it 'returns an error' do
      post "/api/v3/accounts/#{account.id}/templates", headers: user.create_new_auth_token, as: :json, params:{ template: invalid_attributes}
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  # test cases for update action
  describe 'PUT #update' do
    let!(:template) { create(:template) }

    context 'with valid attributes' do
        let!(:account) { create(:account) }
        let!(:user) { create(:user, account: account) }
        let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}

        let!(:template) {create(:template,name: "Updated names",registered_dlt: "test", description: "Updated description", message: "demo", account: account)}
        
        it 'updates the template' do
            put "/api/v3/accounts/#{account.id}/templates/#{template.id}",headers: user.create_new_auth_token, as: :json, params: {template: {name: "Updated name", description: "Updated description"}}
            
            template.reload 
            expect(template.name).to eq('Updated name')
            expect(template.description).to eq('Updated description')
            expect(response).to have_http_status(:ok)
        end
    end
  


    context 'with invalid attributes' do
      let(:invalid_attributes) {{ name: nil, description: nil, message: nil}}

      let!(:account) { create(:account) }
      let!(:user) { create(:user, account: account) }
      let!(:template) {create(:template,name: "test",registered_dlt: "test", description: "testing", message: "demo", account: account)}

      it 'returns an error' do
          put "/api/v3/accounts/#{account.id}/templates/#{template.id}",headers: user.create_new_auth_token, as: :json, params: {id: template.id, template: invalid_attributes}
          expect(response).to have_http_status(:unprocessable_entity) 
      end

      it 'does not update the template' do
          original_name = template.name 
          put "/api/v3/accounts/#{account.id}/templates/#{template.id}", headers: user.create_new_auth_token, as: :json,params: {id: template.id, template: invalid_attributes}
          template.reload
          expect(template.name).to eq(original_name) 
      end

      it 'returns the error messages in response' do
          put "/api/v3/accounts/#{account.id}/templates/#{template.id}", headers: user.create_new_auth_token, as: :json,params: {id: template.id, template: invalid_attributes}
          expect(JSON.parse(response.body)['errors']).to be_present
      end
    end
  end

  # test cases for delete action
  describe "Delete" do
    let(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:template) {create(:template, account: account)}
    let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}

    context "when the template exists" do
      it "destroys the template" do
        template
        delete "/api/v3/accounts/#{account.id}/templates/#{template.id}",headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.body).to include("Template deleted successfully")
      end
    end

    context "does not exists" do
      it "returns an error" do
        delete "/api/v3/accounts/#{account.id}/templates/-1",headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)).to include("error" => "Resource could not be found")
      end
    end
  end

  # test cases for search template api
  describe 'POST #search_template' do
    let!(:account) { create(:account) }
    let(:user) { create(:user, account: account) }
    let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}

    context 'when search_term is not present' do
      it 'raises error' do
        get "/api/v3/accounts/#{account.id}/templates/search_template", headers: user.create_new_auth_token, as: :json
        # request.headers['Content-Type'] = 'application/json'
        expect(JSON.parse(response.body)['errors']).to eq("Search Term is missing!") 
        expect(response.status).to eq(422)
      end
    end

    context 'when search_term is present' do

      context 'when template is not present' do
        it 'return blank array' do
          get "/api/v3/accounts/#{account.id}/templates/search_template", headers: user.create_new_auth_token , params: { search_term: 'Update name' }, as: :json
          expect(response.status).to eq(200)
        end
      end

      context 'when template is present' do
        let!(:search_term) { {name: "Updated name"} }
        let!(:sample_template) { create(:template, account: account)}
        
        it 'returns search template results' do
          get "/api/v3/accounts/#{account.id}/templates/search_template", headers: user.create_new_auth_token, params: { search_term: sample_template.name, page: 1, per_page: 10 }, as: :json
          expect(response.status).to eq(200)
        end
      end
    end
  end

  describe 'with invalid attributes' do
    let(:account) { create(:account) }
    let(:user) { create(:user, account: account) }

    it 'returns an error' do
      get "/api/v3/accounts/#{account.id}/templates/search_template",params: {}, headers: user.create_new_auth_token, as: :json
      expect(JSON.parse(response.body)['errors']).to eq("Search Term is missing!")
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end


  # test cases for show template
  describe "GET #show_template" do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:template) {create(:template, account: account, sender_id: '4')}
    
    context "when templates with sender_id exists" do
      it "returns a list of templates" do 
        get "/api/v3/accounts/#{account.id}/templates/show_template", params: {sender_id: template.sender_id, template_id: template.id},
        headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        templates = JSON.parse(response.body)['template']
        expect(templates.first['sender_id']).to eq(template.sender_id)  
      end
    end
  end  

  describe "GET #shows_template with invalid attributes" do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:account_user) {AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user)}
    let!(:template) {create(:template,name: "test",registered_dlt: "test", description: "testing", message: "demo", account: account)}
    context "when template with sender_id does not exists" do
      it "returns no result found" do 
        get "/api/v3/accounts/#{account.id}/templates/show_template", params: {sender_id: -1},
        headers: user.create_new_auth_token, as: :json 
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq("Missing sender_id")
      end
    end
    
    context "when template with sender_id does not exists" do
      it "returns no result found" do 
        get "/api/v3/accounts/#{account.id}/templates/show_template",headers: user.create_new_auth_token, as: :json 
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq("Missing sender_id")
      end
    end

    context "when template with sender_id does not exists" do
      it "returns no result found" do 
        get "/api/v3/accounts/#{account.id}/templates/show_template", params: {sender_id: "invalid"},headers: user.create_new_auth_token, as: :json 
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq("Missing sender_id")
      end
    end
  end

  # test cases for upload template
  describe "POST #upload_template" do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    context 'with invalid file format' do 
      it 'returns an error message' do 
        file = Rack::Test::UploadedFile.new('./spec/fixtures/files/upload_template_copy.xls', 'text/csv')
        post "/api/v3/accounts/#{account.id}/templates/upload_template", params: {file: file},headers: user.create_new_auth_token, as: :json 
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('error')
      end
    end
  end
end
