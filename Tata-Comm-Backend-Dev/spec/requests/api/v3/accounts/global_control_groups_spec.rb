require 'rails_helper'

RSpec.describe 'Api::V3::Accounts::GlobalControlGroups' do
  describe 'GET /index POST /create' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account, name: 'TestUser', email: 'example10@gmail.com') }
    let!(:sms_channel) { create(:channel_sms) }
    let!(:sms_inbox) { create(:inbox, channel: sms_channel) }
    let!(:global_control_group) do
      create(:global_control_group, control_group: 0, random_allocation_percentage: 50, apply_global: true, allow_marketers: true, active: true,
                                    account_id: account.id)
    end

    context 'list' do
      it 'gives the all global control group' do
        get "/api/v3/accounts/#{account.id}/global_control_groups", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body.length).to eq(1)
      end
    end

    context 'find by id' do
      it 'will find the global control group by id' do
        get "/api/v3/accounts/#{account.id}/global_control_groups/#{global_control_group.id}", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'create' do
      it 'will create new global control group' do
        post "/api/v3/accounts/#{account.id}/global_control_groups", params: global_control_group, headers: user.create_new_auth_token, as: :json
        response.parsed_body
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body['message']).to eq('Control group was successfully created.')
      end
    end

    context 'unable to delete' do
      it 'unable to delete the global control group' do
        invalid_attributes = global_control_group
        invalid_attributes[:control_group] = nil
        allow_any_instance_of(GlobalControlGroup).to receive(:save).and_return(false)

        expect do
          post "/api/v3/accounts/#{account.id}/global_control_groups", headers: user.create_new_auth_token,
                                                                       params: { global_control_group: invalid_attributes }, as: :json
        end.not_to change(GlobalControlGroup, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'update' do
      it 'will update the existing global control group' do
        put "/api/v3/accounts/#{account.id}/global_control_groups/#{global_control_group.id}", headers: user.create_new_auth_token, as: :json,
                                                                                               params: { global_control_group: { random_allocation_percentage: 80 } }
        expect(global_control_group.random_allocation_percentage).to eq(50)
        response.parsed_body
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body['message']).to eq('Control group updated successfully.')
      end
    end

    context 'delete' do
      it 'will delete existing global control group' do
        delete "/api/v3/accounts/#{account.id}/global_control_groups/#{global_control_group.id}", headers: user.create_new_auth_token, as: :json,
                                                                                                  params: { global_control_group: { random_allocation_percentage: 80 } }
        expect(global_control_group.random_allocation_percentage).to eq(50)
        response.parsed_body
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body['message']).to eq('Control group was successfully destroyed.')
      end
    end

    context 'unable to delete' do
      it 'will no able to delete global control group' do
        allow_any_instance_of(GlobalControlGroup).to receive(:destroy).and_return(false)
        delete "/api/v3/accounts/#{account.id}/global_control_groups/#{global_control_group.id}", headers: user.create_new_auth_token, as: :json,
                                                                                                  params: { global_control_group: { random_allocation_percentage: 80 } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'download' do
      it 'will download a csv file for given global control group' do
        get "/api/v3/accounts/#{account.id}/global_control_groups/#{global_control_group.id}/download_users_csv_file", headers: user.create_new_auth_token, as: :json,
                                                                                                                       params: { id: global_control_group.id }
        expect(response).to have_http_status(:ok)
        expect(response.headers['Content-Type']).to eq('text/csv')
      end
    end
  end

  describe 'Negative Scenario' do
    let!(:global_control_group) { create(:global_control_group) }
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:account_user) { AccountUser.find_by(account: account, user: user) || create(:account_user, account: account, user: user) }
    let(:valid_attributes) do
      {
        control_group: 0, random_allocation_percentage: 75, apply_global: true, allow_marketers: true, active: true
      }
    end

    context 'Unable to create' do
      it 'invalid attributes' do
        invalid_attributes = valid_attributes.merge(control_group: nil)
        post "/api/v3/accounts/#{account.id}/global_control_groups", headers: user.create_new_auth_token,
                                                                     params: { global_control_group: invalid_attributes }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'Unable to create global control group action random allocation' do
      it 'will throw validaton errors' do
        invalid_attributes = valid_attributes.merge(control_group: nil)
        post "/api/v3/accounts/#{account.id}/global_control_groups", headers: user.create_new_auth_token,
                                                                     params: { global_control_group: invalid_attributes }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        response.parsed_body
        expect(response.parsed_body['message']).to eq("Control group can't be blank")
      end
    end

    context 'Unable to update' do
      let(:valid_attributes) do
        {
          random_allocation_percentage: 75, apply_global: true, allow_marketers: true, active: true
        }
      end

      it 'global control group action upload user list' do
        valid_attributes_with_user_list = valid_attributes.merge(control_group: 'upload_user_list', random_allocation_percentage: 75,
                                                                 user_list_file: fixture_file_upload('spec/assets/global_control_file.csv', 'text/csv'))
        put "/api/v3/accounts/#{account.id}/global_control_groups/#{global_control_group.id}", headers: user.create_new_auth_token,
                                                                                               params: { global_control_group: valid_attributes_with_user_list }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['message']).to eq('User list file user_list_file is not present now')
        response.parsed_body
      end
    end
  end
end
