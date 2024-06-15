require 'rails_helper'

RSpec.describe 'Api::V3::Accounts::Channels' do
  let!(:account) { create(:account) }
  let!(:agent) { create(:user, account: account, role: :agent) }
  let(:admin) { create(:user, account:, role: :administrator) }
  let!(:channel_tata_smsc) { create(:channel_tata_smsc, account: account) }
  let!(:inbox) { create(:inbox, account:, channel: channel_tata_smsc) }
  let!(:inbox_member) { create(:inbox_member, user: admin, inbox: inbox) }
  let!(:inbox_params) do
    {
      'name': 'John Doe Inbox',
      'greeting_enabled': true,
      'greeting_message': 'HI MAN',
      'enable_email_collect': true,
      'csat_survey_enabled': false,
      'enable_auto_assignment': true,
      'allow_messages_after_resolved': true,
      'working_hours_enabled': true,
      'out_of_office_message': 'We are unavailable at the moment. Leave a message we will respond once we are back.',
      'working_hours': [
        {
          'day_of_week': 6,
          'closed_all_day': true,
          'open_hour': '',
          'open_all_day': false
        }
      ],
      'channel': {
        "auth_token": "TCL-AMANRANDOM_ACCESS_TOKEN",
        "sender_id": "123232",
        "medium": "tata",
        "sender_type": ["promotional", "transactional"].sample,
        "callback_url": "https://www.example.com/"
      }
    }.with_indifferent_access
  end
  let!(:tata_smsc_token) { "Basic #{Base64.strict_encode64('tcl-RANDOM_ACCESS_TOKEN:FROM_TATA_SMSC_SERVICE')}" }
  let!(:invalid_tata_smsc_token) { "Basic #{Base64.strict_encode64('RANDOM_ACCESS_TOKEN:FROM_TATA_SMSC_SERVICE')}" }
  let!(:tata_smsc_params) do
    { 'channel': {
        'name': 'SMSC Channel',
        'auth_token': tata_smsc_token,
        'medium': 'tata',
        'sender_id': '1234',
        'sender_type': ["promotional", "transactional"].sample
      },
      'account_id': account.id,
      'type': 'tata_smsc' }
  end
  let!(:wa_tatacom_params) do
    {
      'name': 'WHATSAPP CHANNEL',
      'channel': {
        'type': 'whatsapp_tata_communications',
        'phone_number': '919876543210',
        'provider': 'TATA Communications',
        'provider_config': {
          'api_key': 'API_KEY',
          'auth_key': 'AUTH_KEY',
          'waba_id': 'WABA_ID',
          'phone_number_id': '919876543210'
        }
      },
      'account_id': account.id,
      'type': 'whatsapp_tata_communications'
    }
  end
  let!(:test_sms_params) do
    {
      'auth_token': 'Basic RANDOM TOKEN',
      'from': 'TCLSMS',
      'to': '919876543210',
      'msg': 'Hi Aman, we are testing Engage SMSC API',
      'dlr': {
        'mask': 1,
        'url': 'https://webhook.site/70e672fc-7c75-47a8-9a50-9360b05d0f85'
      },
      'tlv': {
        'PE_ID': '919876543210',
        'TEMPLATE_ID': '919876543210',
        'TELEMARKETER_ID': '919876543210'
      }
    }
  end
  let!(:test_sms_response) do
    '{
    "id": "f2e3be8d-2894-442c-b433-c0364de0ab91",
    "statusCode": 2,
    "status": "DELIVERED",
    "submitDate": "2023-08-16T06:10:48.825Z",
    "doneDate": "2023-08-16T06:10:54.376Z",
    "err": 0
  }'
  end

  describe '#index' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorized' do
        get "/api/v3/accounts/#{account.id}/channels"

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authenticated user' do
      it 'returns tata_email channels of current_account as administrator' do
        get "/api/v3/accounts/#{account.id}/channels", headers: admin.create_new_auth_token, as: :json

        resp = response.parsed_body
        expect(response).to have_http_status(:success)
        expect(resp.keys).to include('tata_email')
      end

      it 'returns tata_sms channels of current_account as administrator' do
        get "/api/v3/accounts/#{account.id}/channels", headers: admin.create_new_auth_token, as: :json

        resp = response.parsed_body
        expect(response).to have_http_status(:success)
        expect(resp.keys).to include('tata_sms')
      end

      it 'returns tata_whatsapp channels of current_account as administrator' do
        get "/api/v3/accounts/#{account.id}/channels", headers: admin.create_new_auth_token, as: :json

        resp = response.parsed_body
        expect(response).to have_http_status(:success)
        expect(resp.keys).to include('tata_whatsapp')
      end
    end
  end

  describe '#show' do
    context 'when it is an unauthenticated user' do
      let(:inbox) { create(:inbox, account:) }

      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/channels/#{inbox.id}"

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is unauthenticated user' do
      let(:agent) { create(:user, account:, role: :agent) }
      let(:admin) { create(:user, account:, role: :administrator) }
      let(:inbox) { create(:inbox, account:) }

      it 'returns unauthorized for an agent who is not assigned' do
        get "/api/v3/accounts/#{account.id}/channels/#{inbox.id}", as: :json
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns the channel inbox if administrator' do
        get "/api/v3/accounts/#{account.id}/channels/#{inbox.id}", headers: admin.create_new_auth_token, as: :json

        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body, symbolize_names: true)[:id]).to eq(inbox.id)
      end

      it 'returns the channel inbox if assigned inbox is assigned as agent' do
        create(:inbox_member, user: agent, inbox:)
        get "/api/v3/accounts/#{account.id}/channels/#{inbox.id}", headers: agent.create_new_auth_token, as: :json

        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body, symbolize_names: true)[:id]).to eq(inbox.id)
      end
    end
  end

  describe 'CREATE /api/v3/accounts/:account_id/channels' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        post "/api/v3/accounts/#{account.id}/channels"

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authenticated user tata smsc configuration and inbox' do
      it 'returns account not_found the account' do
        post '/api/v3/accounts/WRONG_ACCOUNT_ID/channels', headers: agent.create_new_auth_token, params: tata_smsc_params
        expect(response).to have_http_status(:not_found)
        json_response = response.parsed_body
        expect(json_response['error']).to eql('Resource could not be found')
      end

      it 'return invalid base64 token' do
        tata_smsc_params[:channel][:auth_token] = 'INVALID TOKEN'
        post "/api/v3/accounts/#{account.id}/channels", headers: agent.create_new_auth_token, params: tata_smsc_params
        channel = response.parsed_body

        expect(response).to have_http_status(:unprocessable_entity)
        expect(channel['error']).to eq('invalid base64')
      end

      it 'returns invalid auth token' do
        tata_smsc_params[:channel][:auth_token] = invalid_tata_smsc_token
        post "/api/v3/accounts/#{account.id}/channels", headers: agent.create_new_auth_token, params: tata_smsc_params
        channel = response.parsed_body

        expect(response).to have_http_status(:unprocessable_entity)
        expect(channel['error']).to eq('Invalid Auth Token')
      end

      it 'create the tata smsc configuration and inbox' do
        post "/api/v3/accounts/#{account.id}/channels", headers: agent.create_new_auth_token, params: tata_smsc_params

        channel = response.parsed_body

        expect(response).to have_http_status(:ok)
        expect(channel['name']).to eq(tata_smsc_params[:channel][:name])
        expect(channel['channel_type']).to eq('Channel::TataSmsc')
      end
    end

    context 'when it is an authenticated user whatsapp_tata_communications and inbox' do
      before do
        allow_any_instance_of(ChannelGenericMethods).to receive(:verify_phone_number).and_return({ 'display_phone_number': ' -919876543210' }.as_json)
      end

      it 'returns wa account not_found the account' do
        post '/api/v3/accounts/WRONG_ACCOUNT_ID/channels', headers: agent.create_new_auth_token, params: wa_tatacom_params
        expect(response).to have_http_status(:not_found)
        json_response = response.parsed_body
        expect(json_response['error']).to eql('Resource could not be found')
      end

      it 'create the tata whatsapp configuration and inbox' do
        post "/api/v3/accounts/#{account.id}/channels", headers: agent.create_new_auth_token, params: wa_tatacom_params
        channel = response.parsed_body

        expect(response).to have_http_status(:ok)
        expect(channel['name']).to eq(wa_tatacom_params[:name])
        expect(channel['channel_type']).to eq('Channel::WhatsappTataCommunications')
      end
    end

    context 'when it is an authenticated user but invalid channel type' do
      it 'returns .not_found the account' do
        post '/api/v3/accounts/WRONG_ACCOUNT_ID/channels', headers: agent.create_new_auth_token, params: wa_tatacom_params
        expect(response).to have_http_status(:not_found)
        json_response = response.parsed_body
        expect(json_response['error']).to eql('Resource could not be found')
      end

      it 'create the tata whatsapp configuration and inbox' do
        wa_tatacom_params[:type] = 'INVALID_CHANNEL_TYPE'
        post "/api/v3/accounts/#{account.id}/channels", headers: agent.create_new_auth_token, params: wa_tatacom_params
        channel = response.parsed_body

        expect(response).to have_http_status(:unprocessable_entity)
        expect(channel['error']).to eq('Invalid channel type')
      end
    end
  end

  describe 'PATCH /api/v3/accounts/:account_id/channels/:id' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        get "/api/v3/accounts/#{account.id}/channels/#{inbox.id}"

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authenticated user' do
      it 'returns inbox not_found the channel' do
        patch "/api/v3/accounts/#{account.id}/channels/INVALID_CHANNEL_INBOX_ID", headers: agent.create_new_auth_token, params: inbox_params

        expect(response).to have_http_status(:not_found)
        json_response = response.parsed_body
        expect(json_response['error']).to eql('Resource could not be found')
      end

      it 'updates the inbox channel' do
        patch "/api/v3/accounts/#{account.id}/channels/#{inbox.id}", headers: agent.create_new_auth_token, params: inbox_params

        updated_inbox = response.parsed_body

        expect(response).to have_http_status(:ok)
        expect(updated_inbox['name']).to eq(inbox_params['name'])
        expect(updated_inbox['working_hours'][6]['day_of_week']).to eql(inbox_params['working_hours'][0]['day_of_week'])
        expect(updated_inbox['working_hours'][6]['close_minutes']).to be_nil
        expect(updated_inbox['out_of_office_message']).to eq(inbox_params['out_of_office_message'])
        expect(updated_inbox['auth_token']).to eq(inbox_params['channel']['auth_token'])
        expect(updated_inbox['sender_type']).to eq(inbox_params['channel']['sender_type'])
        expect(updated_inbox['sender_id']).to eq(inbox_params['channel']['sender_id'])
        expect(updated_inbox['callback_url']).to eq(inbox_params['channel']['callback_url'])
      end
    end
  end

  describe '#destroy /api/v3/accounts/:account_id/channels/:id' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthenticated' do
        delete "/api/v3/accounts/#{account.id}/channels/#{inbox.id}", as: :json

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authenticated user' do
      it 'returns .not_found the inbox channel' do
        patch "/api/v3/accounts/#{account.id}/channels/INVALID_CHANNEL_INBOX_ID", headers: agent.create_new_auth_token, params: inbox_params

        expect(response).to have_http_status(:not_found)
        json_response = response.parsed_body
        expect(json_response['error']).to eql('Resource could not be found')
      end

      it 'returns .not_found the inbox channel' do
        delete "/api/v3/accounts/#{account.id}/channels/#{inbox.id}", headers: agent.create_new_auth_token

        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe '#test_sms /api/v3/accounts/:account_id/channels/test_sms' do
    context 'when it is an unauthenticated user' do
      it 'returns unauthorizes' do
        post "/api/v3/accounts/#{account.id}/channels/test_sms"

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body['errors'][0]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'when it is an authenticated user' do
      before do
        allow_any_instance_of(Api::V3::Accounts::Concerns::CallSmscService).to receive(:authenticate_tata).and_return(test_sms_response)
      end

      it 'returns .not_found the account' do
        post '/api/v3/accounts/WRONG_ID/channels/test_sms', headers: agent.create_new_auth_token, params: test_sms_params

        expect(response).to have_http_status(:not_found)
        json_response = response.parsed_body
        expect(json_response['error']).to eql('Resource could not be found')
      end

      it 'send sms successfully' do
        post "/api/v3/accounts/#{account.id}/channels/test_sms", headers: agent.create_new_auth_token, params: test_sms_params
        parsed_json = response.parsed_body

        expect(response).to have_http_status(:ok)
        expect(parsed_json).to eq(JSON.parse(test_sms_response))
      end
    end

    context 'handle exception' do
      it 'returns error' do
        post "/api/v3/accounts/#{account.id}/channels/test_sms", headers: agent.create_new_auth_token, params: test_sms_params
        parsed_json = response.parsed_body

        expect(response).to have_http_status(:unprocessable_entity)
        expect(parsed_json['error']).to eq('param is missing or the value is empty: channel')
      end
    end
  end
end
