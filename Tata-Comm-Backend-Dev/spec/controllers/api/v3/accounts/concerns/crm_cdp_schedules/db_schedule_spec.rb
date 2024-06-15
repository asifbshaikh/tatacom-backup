require 'rails_helper'

RSpec.describe 'Api::V3::Accounts::Concerns::CrmCdpSchedules::DbSchedule', type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, role: :agent) }
  let!(:db_configuration) { create(:db_configuration, account_id: account.id) }
  let!(:db_schedule_detail) { create(:db_schedule_detail, source_id: db_configuration.id, account_id: account.id) }

  let(:valid_params) do
    {
      'frequency': 'daily',
      'import_name': Faker::Lorem.words.join(' '),
      'start_date': Time.zone.now.to_i,
      'occurrences': 1,
      'schedule_type': 'as_soon_as_possible',
      'source_id': db_configuration.id,
      'source_type': 'database',
      'status': 'initiated',
      'table_name': 'db_contacts',
      'time_zone': 'Asia/Calcutta',
      'email_ids': ['abc@yopmail.com', 'test@yopmail.com'],
      'events_name': %w[test app_open],
      'repeat_every': 2,
      'import_type': 'registered_audience',
      'account_id': account.id
    }
  end

  let(:invalid_params) do
    {
      'next_run_at': '2023-11-16T09:12:26.511Z',
      'occurrences': 1,
      'start_date': '2023-11-16T09:12:25.511Z',
      'schedule_type': 'one time',
      'source_type': 'db',
      'status': 'scheduled',
      'table_name': 'contacts',
      'time_zone': 'india',
      'email_ids': ['abc@yopmail.com', 'test@yopmail.com'],
      'import_type': 'registered_audience'
    }
  end

  let(:user_valid_headers) do
    user.create_new_auth_token
  end

  describe 'GET /index' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/schedule_details/db", headers: user_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['db_schedules'].size).to eq(account.db_schedule_details.size)
    end
  end

  describe 'GET /show' do
    it 'renders a successful response' do
      get "/api/v3/accounts/#{account.id}/schedule_details/db/#{db_schedule_detail.id}", headers: user_valid_headers, as: :json
      expect(response).to be_successful
      expect(response.parsed_body['db_schedule']['id']).to eq(db_schedule_detail.id)
      expect(response.parsed_body['db_schedule']['import_name']).to eq(db_schedule_detail.import_name)
      expect(response.parsed_body['db_schedule']['frequency']).to eq(db_schedule_detail.frequency)
    end
  end

  describe 'POST /create' do
    context 'with valid parameters' do
      it 'creates a new DbScheduleDetail' do
        expect do
          post "/api/v3/accounts/#{account.id}/schedule_details/db",
               params: { db_schedule_detail: valid_params }, headers: user_valid_headers, as: :json
        end.to change(DbScheduleDetail, :count).by(1)
      end

      it 'renders a JSON response with the new db_schedule_detail' do
        post "/api/v3/accounts/#{account.id}/schedule_details/db",
             params: { db_schedule_detail: valid_params }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including('application/json'))
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new DbScheduleDetail' do
        expect do
          post "/api/v3/accounts/#{account.id}/schedule_details/db",
               params: { db_schedule_detail: invalid_params }, as: :json
        end.not_to change(DbScheduleDetail, :count)
      end

      it 'renders a JSON response with errors for the new db_schedule_detail' do
        post "/api/v3/accounts/#{account.id}/schedule_details/db",
             params: { db_schedule_detail: invalid_params }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
      end
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) do
        {
          'import_name': Faker::Lorem.words.join(' '),
          'start_date': Time.zone.now.to_i,
          'occurrences': 1,
          'schedule_type': 'as_soon_as_possible',
          'source_type': 'database',
          'status': 'initiated',
          'table_name': 'db_contacts',
          'time_zone': 'Asia/Calcutta',
          'email_ids': ['abc@yopmail.com', 'test@yopmail.com'],
          'import_type': 'registered_audience'
        }
      end

      it 'updates the requested db_schedule_detail' do
        db_schedule_detail = DbScheduleDetail.create! valid_params
        patch "/api/v3/accounts/#{account.id}/schedule_details/db/#{db_schedule_detail.id}",
              params: { db_schedule_detail: new_attributes }, headers: user_valid_headers, as: :json
        db_schedule_detail.reload
        expect(response).to be_successful
        expect(response.parsed_body['db_schedule']['id']).to eq(db_schedule_detail.id)
        expect(response.parsed_body['db_schedule']['table_name']).to eq(db_schedule_detail.table_name)
        expect(response.parsed_body['db_schedule']['frequency']).to eq(db_schedule_detail.frequency)
      end

      it 'renders a JSON response with the db_schedule_detail' do
        db_schedule_detail = DbScheduleDetail.create! valid_params
        patch "/api/v3/accounts/#{account.id}/schedule_details/db/#{db_schedule_detail.id}",
              params: { db_schedule_detail: new_attributes }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including('application/json'))
      end
    end
  end

  describe 'POST /preview' do
    context 'with valid params' do
      it 'renders rows of records for registered audience' do
        preview_params = {
          'import_name': db_configuration.name,
          'import_type': 'registered_audience',
          'source_id': db_configuration.id,
          'source_type': 'db',
          'table_name': 'db_contacts',
          'events_name': ['App/Site Opened']
        }
        post "/api/v3/accounts/#{account.id}/schedule_details/db/preview",
             params: { db_preview: preview_params }, headers: user_valid_headers, as: :json
        expect(response).to be_successful
      end

      it 'renders rows of records for anonymous audience' do
        preview_params = {
          'import_name': db_configuration.name,
          'import_type': 'anonymous_audience',
          'source_id': db_configuration.id,
          'source_type': 'db',
          'table_name': 'db_contacts',
          'events_name': ['App/Site Opened']
        }
        post "/api/v3/accounts/#{account.id}/schedule_details/db/preview",
             params: { db_preview: preview_params }, headers: user_valid_headers, as: :json
        expect(response).to be_successful
      end

      it 'renders rows of records for event' do
        preview_params = {
          'import_name': db_configuration.name,
          'import_type': 'event',
          'source_id': db_configuration.id,
          'source_type': 'db',
          'table_name': 'db_events',
          'events_name': ['App/Site Opened']
        }
        post "/api/v3/accounts/#{account.id}/schedule_details/db/preview",
             params: { db_preview: preview_params }, headers: user_valid_headers, as: :json
        expect(response).to be_successful
      end
    end

    context 'with invalid params' do
      it 'do not renders rows of records for registered audience' do
        preview_params = {
          'import_name': db_configuration.name,
          'import_type': 'registered_audience',
          'source_type': 'db',
          'table_name': 'db_contacts',
          'events_name': ['App/Site Opened']
        }
        post "/api/v3/accounts/#{account.id}/schedule_details/db/preview",
             params: { db_preview: preview_params }, headers: user_valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH /db_deactivate' do
    context 'with valid schedule id' do
      it 'successfully deactivate the schedule' do
        patch "/api/v3/accounts/#{account.id}/schedule_details/db/#{db_schedule_detail.id}/deactivate",
              headers: user_valid_headers, as: :json
        expect(response).to be_successful
        expect(response.parsed_body['message']).to eq(I18n.t('db_schedule.deactivate'))
      end
    end
  end

  describe 'GET /db_imports' do
    it 'successfully renders the list of data sync imports for that schedule' do
      get "/api/v3/accounts/#{account.id}/schedule_details/db/#{db_schedule_detail.id}/imports",
          headers: user_valid_headers, as: :json
      expect(response).to be_successful
    end
  end
end
