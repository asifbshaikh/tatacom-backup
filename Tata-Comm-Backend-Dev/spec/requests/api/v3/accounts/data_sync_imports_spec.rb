require 'rails_helper'

RSpec.describe 'Api::V3::Accounts::DataSyncImports' do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, role: :agent) }
  let!(:db_configuration) { create(:db_configuration, account_id: account.id) }
  let!(:db_schedule_detail) { create(:db_schedule_detail, source_id: db_configuration.id, account_id: account.id) }
  let!(:data_sync_import) { create(:data_sync_import, crm_cdp_schedule_detail_id: db_schedule_detail.id, account_id: account.id) }

  let(:user_valid_headers) do
    user.create_new_auth_token
  end

  describe 'GET /index' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/data_sync_imports?type=db", headers: user_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['imports'].size).to eq(account.data_sync_imports.filter_by_type('db').size)
    end
  end

  describe 'GET /show' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/data_sync_imports/#{data_sync_import.id}", headers: user_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['import']['id']).to eq(data_sync_import.id)
      expect(response.parsed_body['import']['name']).to eq(data_sync_import.name)
      expect(response.parsed_body['import']['status']).to eq(data_sync_import.status)
    end
  end
end
