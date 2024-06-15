require 'rails_helper'

RSpec.describe 'SegmentFIlterAPI', type: :request do
  let(:account) { create(:account) }
  let(:email) {create(:email)}
  let(:admin) { create(:user, account: account, role: :administrator, email: "testing@gmail.com")}

  describe 'GET /api/v3/accounts/{account.id}/segment_filter' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorized' do
        get "/api/v3/accounts/#{account.id}/segment_filters"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user' do
      it 'returns list of segments filter' do
        get "/api/v3/accounts/#{account.id}/segment_filters",
             headers: admin.create_new_auth_token,
            as: :json
        expect(response).to have_http_status(:success)
        response_body = JSON.parse(response.body)
        segment_filters = account.segment_filters.order_by_desc.limit(TWENTY)
        expect(response_body["list_query_result"].count).to eql(JSON.parse(ActiveModelSerializers::SerializableResource.new(segment_filters, each_serializer: SegmentFiltersSerializer).to_json).count)
      end
    end
  end

  describe 'GET /api/v3/accounts/{account.id}/segment_filter/:id' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorized' do
        segment_filter = account.segment_filters.create
        get "/api/v3/accounts/#{account.id}/segment_filters/#{segment_filter.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user' do
      it 'returns list of segments filter' do
        segment_filter = account.segment_filters.create
        get "/api/v3/accounts/#{account.id}/segment_filters/#{segment_filter.id}",
          headers: admin.create_new_auth_token,
          as: :json

        expect(response).to have_http_status(:success)
        response_body = JSON.parse(response.body)
        expect(response_body["list_query_result"].count).to eql(JSON.parse(ActiveModelSerializers::SerializableResource.new(segment_filter, each_serializer: SegmentFiltersSerializer).to_json).count)
      end
    end
  end
end
