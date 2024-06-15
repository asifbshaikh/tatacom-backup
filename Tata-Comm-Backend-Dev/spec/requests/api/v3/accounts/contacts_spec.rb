require 'rails_helper'

RSpec.describe "Api::V3::Accounts::Contacts", type: :request do

  describe '#user_audience_count' do
    let(:account) { create(:account) }
    let(:user) { create(:user, account: account) }
    context 'returns the audience count' do
      it 'returns the audience count' do
        get "/api/v3/accounts/#{account.id}/contacts/user_audience_count",headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe '#select_target_audience' do
    let(:account) { create(:account) }
    let(:user) { create(:user, account: account) }
    context 'returns the select target audience' do
      let(:contact) { create(:contact, account: account,name:"alan wings",email:"alan@gmail.com",phone_number: "+919988998891",additional_attributes: {"description"=>"test", "company_name"=>"PSL", "social_profiles"=>{"github"=>"", "twitter"=>"", "facebook"=>"", "linkedin"=>""}}) }
      it 'returns the select target audience' do
        get "/api/v3/accounts/#{account.id}/contacts/select_target_audience",headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
      end
    end

    context 'returns the contacts not present for login user' do
      it 'returns the contacts not present for login user' do
        get "/api/v3/accounts/#{account.id}/contacts/select_target_audience",headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
        expect(data['message']).to eq("contacts not found for login user")
      end
    end
  end
end
