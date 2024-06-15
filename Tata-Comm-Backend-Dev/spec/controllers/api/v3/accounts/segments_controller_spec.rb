require 'rails_helper'

RSpec.describe 'Segments API', type: :request do
  let(:account) { create(:account) }
  let(:email) {create(:email)}
  let(:admin) { create(:user, account: account, role: :administrator, email: "test1@gmail.com") }
  let(:segment_filter) {account.segment_filters.create}
  let(:segment) {account.segments.create(name: "segment test")}
  let(:direct_from_filter_params) { SegmentParam.direct_from_filter }
  let(:user_count_by_filter) { SegmentParam.user_count_by_filter }
  let(:export_user_params) { SegmentParam.export_user_params }
  let(:direct_from_query) { SegmentParam.direct_from_query(account.id, segment_filter.id) }
  let(:update_params) { SegmentParam.update_params }

  describe 'GET /api/v3/accounts/#{account.id}/segments' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorized' do
        get "/api/v3/accounts/#{account.id}/segments"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user with archived true' do
      it 'returns list of archived segments' do
        params = {
            limit: 10,
            archieved: true,
            page: 1
          }
        get "/api/v3/accounts/#{account.id}/segments",
            params: params,
            headers: admin.create_new_auth_token,
            as: :json
        expect(response).to have_http_status(:success)
        response_body = JSON.parse(response.body)
        expect(response_body["pagination"]["total_count"]).to eql(account.segments.archived.count)
      end
    end

    context 'when it is an authorized user with archived false ' do
        it 'returns non archived list of segments' do
          params = {
              limit: 10,
              archieved: false,
              page: 1
            }
          get "/api/v3/accounts/#{account.id}/segments",
              params: params,
              headers: admin.create_new_auth_token,
              as: :json
          expect(response).to have_http_status(:success)
          response_body = JSON.parse(response.body)
          expect(response_body["pagination"]["total_count"]).to eql(account.segments.not_archived.count)
        end
    end
  end

  describe 'GET /api/v3/accounts/#{account.id}/segments/:id' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/segments/#{segment.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user' do
      it 'returns segment with the given id' do
        get "/api/v3/accounts/#{account.id}/segments/#{segment.id}", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:success)
        response_body = JSON.parse(response.body)
        expect(response_body["segment"]["segment_details"]["id"]).to eql(segment.id)
        expect(response_body["segment"]["segment_details"]["name"]).to eql(segment.name)
      end
    end
  end

  describe 'EDIT /api/v3/accounts/#{account.id}/segments/:id/edit' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/segments/#{segment.id}/edit"
        expect(response).to have_http_status(:unauthorized)
      end
    end
    context 'when it is an authorized user' do
      it 'returns segment need be edited' do
        get "/api/v3/accounts/#{account.id}/segments/#{segment.id}/edit", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:success)
        response_body = JSON.parse(response.body)
        expect(response_body["segment"]["name"]).to eql(segment.name)
        expect(response_body["segment"]["account_id"]).to eql(account.id)
      end
    end
  end

  describe 'CREATE /api/v3/accounts/:account_id/segments' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        post "/api/v3/accounts/#{account.id}/segments"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user with direct_from_filter params' do
      it 'returns newly created segment' do
        post "/api/v3/accounts/#{account.id}/segments", headers: admin.create_new_auth_token, params: direct_from_filter_params, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["segment"]["segment_details"]["description"]).to eql ("All Users")
      end
    end

    context 'when it is an authorized user with direct_from_filter params but segment is invalid' do
      it 'returns error of unprocessable_entity' do
        direct_from_filter_params["segment"]["name"] = nil
        post "/api/v3/accounts/#{account.id}/segments", headers: admin.create_new_auth_token, params: direct_from_filter_params, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when it is an authorized user with direct_from_query params' do
      it 'returns newly created segment' do
        post "/api/v3/accounts/#{account.id}/segments", headers: admin.create_new_auth_token, params: direct_from_query, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["segment"].keys).to eq(["segment_details", "reachable_users", "sample_users", "revision_history", "import_file_url"]
        )
        expect(json_response.dig("segment", "segment_details", "name")).to eql ('DirecrFromQuery')
        expect(json_response.dig("segment", "segment_details", "source_type")).to eql ('Segmentation')
      end
    end
  end

  describe 'UPDATE PUT /api/v3/accounts/:account_id/segments/segment_id' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        put "/api/v3/accounts/#{account.id}/segments/#{segment.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user with direct_from_filter params' do
      it 'returns user count' do
        put "/api/v3/accounts/#{account.id}/segments/#{segment.id}", headers: admin.create_new_auth_token, params: update_params, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["segment"].keys).to eq(["segment_details", "reachable_users", "sample_users", "revision_history", "import_file_url"]
        )
        expect(json_response.dig("segment", "segment_details", "name")).to eql ('Exclude User validation 1170')
      end
    end

    context 'segment update with same segment filter or description' do
      it 'returns user count' do
        update_params[:segment][:segment_filter_id] = segment_filter.id
        segment.update(segment_filter_id: segment_filter.id)

        put "/api/v3/accounts/#{account.id}/segments/#{segment.id}", headers: admin.create_new_auth_token, params: update_params, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["segment"].keys).to eq(["segment_details", "reachable_users", "sample_users", "revision_history", "import_file_url"]
        )
        expect(json_response.dig("segment", "segment_details", "name")).to eql ('Exclude User validation 1170')
      end
    end
  end

  describe 'POST /api/v3/accounts/:account_id/segments/get_user_count_by_filter' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        post "/api/v3/accounts/#{account.id}/segments/get_user_count_by_filter"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user with direct_from_filter params' do
      it 'returns user count' do
        post "/api/v3/accounts/#{account.id}/segments/get_user_count_by_filter", headers: admin.create_new_auth_token, params: user_count_by_filter, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["segment_filter"]["description"]).to eql ("All Users")
      end
    end
  end

  describe 'GET /api/v3/accounts/:account_id/segments/get_user_events' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/segments/get_user_events"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when it is an authorized user' do
      it 'returns user events' do
        get "/api/v3/accounts/#{account.id}/segments/get_user_events", headers: admin.create_new_auth_token, params: user_count_by_filter, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["user_events"].count).to eql (CommonEvent.count)
      end
    end
  end

  describe 'GET /api/v3/accounts/:account_id/segments/get_user_event_attributes' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/segments/get_user_event_attributes"
        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authorized user' do
      it 'returns user events attributes of a given id' do
        event = CommonEvent.create(name: "test", account_id: account.id)
        event_attributes = event.common_event_attributes.create(name: "test event attributes")
        get "/api/v3/accounts/#{account.id}/segments/get_user_event_attributes", headers: admin.create_new_auth_token, params: {event_id: event.id}, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["event_attributes"].count).to eql (CommonEventAttribute.where(common_event_id: event.id).count)
      end
    end
  end

  describe 'GET /api/v3/accounts/:account_id/segments/get_user_property_list' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/segments/get_user_property_list"
        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authorized user' do
      it 'returns user property list' do
        get "/api/v3/accounts/#{account.id}/segments/get_user_property_list", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["user_properties"].count).to eql (JSON.parse(File.read('./private/user_property/user_property.json')).count)
      end
    end
  end

  describe 'GET /api/v3/accounts/:account_id/segments/get_custom_segments' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/segments/get_custom_segments"
        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authorized user' do
      it 'returns custom segments' do
        get "/api/v3/accounts/#{account.id}/segments/get_custom_segments", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(json_response["custom_segments"].count).to eql (account.segments.not_archived.count)
      end
    end
  end

  describe 'GET /api/v3/accounts/:account_id/segments/sample_users_details' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/segments/sample_users_details"
        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authorized user but data is passsed it params' do
      it 'returns error message' do
        get "/api/v3/accounts/#{account.id}/segments/sample_users_details", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']).to eql("Couldn't find SegmentFilter without an ID")
      end
    end

    context 'when it is an authorized user but data is passsed it params' do
      it 'returns error message' do
        get "/api/v3/accounts/#{account.id}/segments/sample_users_details", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']).to eql("Couldn't find SegmentFilter without an ID")
      end
    end

    #need to add one positive test case
  end

  describe 'GET /api/v3/accounts/:account_id/segments/query_rerun' do

    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        post "/api/v3/accounts/#{account.id}/segments/query_rerun"
        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authorized user but record not found' do
      it 'returns error with not found status' do
        post "/api/v3/accounts/#{account.id}/segments/query_rerun", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
        expect(response.parsed_body['error']).to eql("Resource could not be found")
      end
    end

    # context 'when it is an authorized user and segment filter is present for given it' do
    #   it 'return the segment filter' do
    #     segment_filter_sample =account.segment_filters.create
    #     segment_filter_sample.sql_query = "select contacts.id from contacts where account_id = #{segment_filter_sample.id}"
    #     post "/api/v3/accounts/#{account.id}/segments/query_rerun", headers: admin.create_new_auth_token, params: {sf_id: segment_filter_sample.id}, as: :json
    #     expect(response).to have_http_status(:success)
    #     json_response = response.parsed_body
    #     expect(json_response['error']).to eql("Couldn't find SegmentFilter without an ID")
    #   end
    # end

  end

  describe 'POST /api/v3/accounts/:account_id/segments/segment_id/export_users' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        post "/api/v3/accounts/#{account.id}/segments/#{segment.id}/export_users"
        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authorized user but record not found for given ' do
      it 'returns error with not found status' do
        post "/api/v3/accounts/f33/segments/#{segment.id}/export_users", headers: admin.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
        expect(response.parsed_body['error']).to eql("Resource could not be found")
      end
    end

    context 'when it is an authorized user and exports is done succesfully' do
      it 'returns a successfull message' do
        post "/api/v3/accounts/#{account.id}/segments/#{segment.id}/export_users", headers: admin.create_new_auth_token, params: :export_user_params, as: :json
        expect(response).to have_http_status(:success)
        json_response = response.parsed_body
        expect(response.parsed_body["message"]).to eql ("Please check your email after sometime. You can also check your exports in Reports section.")
      end
    end

  end

end
