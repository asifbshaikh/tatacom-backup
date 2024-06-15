require 'rails_helper'

RSpec.describe "Api::V3::Accounts::Campaigns", type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account, name: "example10@gmail.com", email: "example10@gmail.com") }
  let!(:sms_channel) { create(:channel_sms) }
  let!(:sms_inbox) { create(:inbox, channel: sms_channel) }
  let!(:template) { create(:template, account: account) }
  let!(:campaign_sms_campaign) { create(:campaign_sms_campaign, account: account, template_id: template.id) }
  let!(:contact) { create(:contact, account: account, first_name: "Yash", last_name: "kotalwar", email: "contactemail@yopmail.com") }
  # let!(:campaign1) { create(:campaign, inbox: sms_inbox, account: account, total_order_value: 200, number_of_conversion_events: 5, number_of_unique_conversions: 4, campaignable: campaign_sms_campaign) }

  describe 'GET #calculate_metrics' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account, name: "yashkotalwar10@gmail.com", email: "yashkotalwar10@gmail.com") }
    let!(:sms_channel) { create(:channel_sms) }
    let!(:sms_inbox) { create(:inbox, channel: sms_channel) }

    context 'when account has campaigns' do
      let!(:campaign1) {
        create(:campaign, inbox: sms_inbox, account: account, total_order_value: 200, number_of_conversion_events: 5, number_of_unique_conversions: 4)
      }

      let!(:campaign2) {
        create(:campaign, inbox: sms_inbox, account: account, total_order_value: 100, number_of_conversion_events: 5, number_of_unique_conversions: 4)
      }

      it 'calculates metrics for campaigns associated with the account' do
        get "/api/v3/accounts/#{account.id}/campaigns/calculate_metrics", headers: user.create_new_auth_token, as: :json

        expect(response).to have_http_status(:success)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['total_campaign_revenue'].to_f).to eq(300)
        expect(parsed_response['average_order_value'].to_f).to eq(300.0 / (campaign1.number_of_conversion_events + campaign2.number_of_conversion_events))
        expect(parsed_response['average_revenue_per_user'].to_f).to eq(300.0 / (campaign1.number_of_unique_conversions + campaign2.number_of_unique_conversions))
      end
    end

    context 'when account has no campaigns' do
      it 'calculates metrics with zero values' do
        get "/api/v3/accounts/#{account.id}/campaigns/calculate_metrics", headers: user.create_new_auth_token, as: :json

        expect(response).to have_http_status(:success)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['total_campaign_revenue'].to_f).to eq(0)
        expect(parsed_response['average_order_value']).to be_nil
        expect(parsed_response['average_revenue_per_user']).to be_nil
      end
    end

    context 'when account id does not exits' do
      it 'returns not found response' do
        get "/api/v3/accounts/#{-1}/campaigns/calculate_metrics", headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'GET #calculate_metrics1' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account, name: "yashkotalwar10@gmail.com", email: "yashkotalwar10@gmail.com") }
    let!(:sms_channel) { create(:channel_sms) }
    let!(:sms_inbox) { create(:inbox, channel: sms_channel) }

    context 'when account has campaigns' do
      let!(:campaign) {
        create(:campaign, inbox: sms_inbox, account: account, total_order_value: 200, number_of_conversion_events: 5, number_of_unique_conversions: 4)
      }

      it 'calculates metrics for campaigns associated with the account' do
        puts campaign.id
        get "/api/v3/accounts/#{account.id}/campaigns/#{campaign.id}/calculate_revenue", headers: user.create_new_auth_token, as: :json,
                                                                                         params: { account_id: account.id, id: campaign.id }

        expect(response).to have_http_status(:success)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['total_campaign_revenue'].to_f).to eq(200)
        expect(parsed_response['average_order_value'].to_f).to eq(200.0 / (campaign.number_of_conversion_events))
        expect(parsed_response['average_revenue_per_user'].to_f).to eq(200.0 / (campaign.number_of_unique_conversions))
      end
    end
  end

  describe '#campaign_info' do
    let!(:account) { create(:account) }
    let(:user) { create(:user, account: account, email: "test@example.com", name: "test@example.com") }
    let!(:sms_channel) { create(:channel_sms) }
    let!(:sms_inbox) { create(:inbox, channel: sms_channel) }
    let!(:campaign) { create(:campaign, inbox: sms_inbox, account: account) }
    context 'when campaign id params is not present' do
      let(:invalid_attributes) { { campaign_id: "" } }
      it 'returns the message campaign not found' do
        get "/api/v3/accounts/#{account.id}/campaigns/campaign_info", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)

        expect(response).to have_http_status(:success)
        expect(data['message']).to eq("campaign not found")
      end
    end

    context 'when campaign id params is present' do
      let(:valid_attributes) { { campaign_id: campaign.id } }
      let!(:campaign_goal) {
        create(:campaign_goal, campaign_id: campaign.id, account_id: account.id, name: "Test Goal", attribute_name: "Test Attribute",
                               attribute_value: "Test Value")
      }
      let!(:goal_event) { create(:goal_event, campaign_goal_id: campaign_goal.id, event_name: "demo event") }

      it 'returns the campaign_info data' do
        get "/api/v3/accounts/#{account.id}/campaigns/campaign_info", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe '#post test_sms_message_via_tatasms' do
    let!(:account) { create(:account) }
    let(:template) { create(:template, sender_id: 3) }
    let(:contact) { create(:contact, phone_number: "+918975843702", email: "test@gmail.com") }
    let(:custom_options) { { message: "Test Message" } }
    let!(:user) { create(:user, account: account, name: "yashkotalwar10@gmail.com", email: "yashkotalwar10@gmail.com") }
    context "when selected option is  'phone_number'" do
      before do
        allow_any_instance_of(ChannelSmsSchedulerService)
          .to receive(:send_sms_message)
          .and_return(
            {
              "status" => "success",
              "message" => "Mock message"
            }
          )
      end
      it "sends an sms message via tata sms" do
        post "/api/v3/accounts/#{account.id}/campaigns/test_sms_message_via_tatasms",
             params: {
               selected_option: "phone_number",
               sender_id: template.sender_id,
               phone_number: contact.phone_number,
               custom_options: custom_options
             }, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)["message"]).to eq("Message successfully delivered to handset.")
      end
    end

    context "when selected option is 'email'" do
      before do
        allow_any_instance_of(ChannelSmsSchedulerService)
          .to receive(:send_sms_message)
          .and_return(
            {
              "status" => "success",
              "message" => "Mock message"
            }
          )
      end
      it "sends an sms message via tata sms" do
        post "/api/v3/accounts/#{account.id}/campaigns/test_sms_message_via_tatasms",
             params: {
               selected_option: "email",
               sender_id: template.sender_id,
               email: contact.email,
               custom_options: custom_options
             }, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)["message"]).to eq("Message successfully delivered to handset.")
      end
      it "sends an sms message via tata sms" do
        post "/api/v3/accounts/#{account.id}/campaigns/test_sms_message_via_tatasms",
             params: {
               selected_option: "emails",
               sender_id: template.sender_id,
               email: contact.email,
               custom_options: custom_options
             }, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)["message"]).to eq("Invalid option")
      end
      it "failed sms message for invalid option" do
        post "/api/v3/accounts/#{account.id}/campaigns/test_sms_message_via_tatasms",
             params: {
               selected_option: "email",
               sender_id: template.sender_id,
               email: "testuser@gmail.com",
               custom_options: custom_options
             }, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)["message"]).to eq("Email is not found ")
      end
    end

    context "failed an sms message via tata sms" do
      before do
        allow_any_instance_of(ChannelSmsSchedulerService)
          .to receive(:send_sms_message)
          .and_return(
            {
              "status" => "not delivered",
              "message" => "Failed message"
            }
          )
      end

      it "failed sms message for invalid option" do
        post "/api/v3/accounts/#{account.id}/campaigns/test_sms_message_via_tatasms",
             params: {
               selected_option: "phone_number",
               sender_id: template.sender_id,
               phone_number: "+9187394793",
               custom_options: custom_options
             }, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)["message"]).to eq("Phone number is not found")
      end

      it "when sms message is nill" do
        post "/api/v3/accounts/#{account.id}/campaigns/test_sms_message_via_tatasms",
             params: {
               selected_option: "phone_number",
               sender_id: template.sender_id,
               phone_number: contact.phone_number
             }, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)["message"]).to eq("Message successfully delivered to handset.")
      end

      it "when sender id is not correct" do
        post "/api/v3/accounts/#{account.id}/campaigns/test_sms_message_via_tatasms",
             params: {
               selected_option: "phone_number",
               sender_id: 55,
               phone_number: contact.phone_number,
               custom_options: custom_options
             }, headers: user.create_new_auth_token, as: :json
        expect(JSON.parse(response.body)["message"]).to eq("Give proper sender id")
      end
    end
  end

  describe 'POST #personalize_message' do
    context 'when user not logeed in' do
      let!(:campaign1) {
        Campaign.create!(title: "test camp", message: "Test message", inbox_id: sms_inbox.id, account_id: account.id, total_order_value: 200,
                         number_of_conversion_events: 5, number_of_unique_conversions: 4, campaignable: campaign_sms_campaign)
      }

      it 'returns error message' do
        post "/api/v3/accounts/#{account.id}/campaigns/personalize_message"
        resp = JSON.parse(response.body)
        expect(resp["errors"]).to eq(["You need to sign in or sign up before continuing."])
      end
    end

    context 'when user logeed in and params[:mapping] or params[:message] is blank' do
      let!(:campaign1) {
        Campaign.create!(title: "test camp", message: "Test message", inbox_id: sms_inbox.id, account_id: account.id, total_order_value: 200,
                         number_of_conversion_events: 5, number_of_unique_conversions: 4, campaignable: campaign_sms_campaign)
      }

      it 'returns error message and false status' do
        post "/api/v3/accounts/#{account.id}/campaigns/personalize_message", headers: user.create_new_auth_token, as: :json
        resp = JSON.parse(response.body)
        expect(resp["status"]).to eq(false)
        expect(resp["error_message"]).to eq("Params of message or mapping can't be blank.")
      end
    end

    context 'when user logeed in and params[:mapping] and params[:message] is present' do
      let!(:campaign1) {
        Campaign.create!(title: "test camp", message: "Test message", inbox_id: sms_inbox.id, account_id: account.id, total_order_value: 200,
                         number_of_conversion_events: 5, number_of_unique_conversions: 4, campaignable: campaign_sms_campaign)
      }

      it 'returns error message and false status' do
        post "/api/v3/accounts/#{account.id}/campaigns/personalize_message", headers: user.create_new_auth_token, as: :json,
                                                                             params: { message: "Hi, {user} {name} sharing my location: {location}", mapping: { user: "first_name", name: "last_name", location: "address" } }
        resp = JSON.parse(response.body)
        expect(resp["status"]).to eq("ok")
        expect(resp["data"]["personalize_message"]).to eq("Hi, Yash kotalwar sharing my location: ")
        expect(resp["message"]).to eq("Message personalize successfully.")
      end
    end
  end

  describe '#save_as_draft' do
    let!(:account) { create(:account) }
    let(:user) { create(:user, account: account) }
    let!(:sms_channel) { create(:channel_sms) }
    let!(:sms_inbox) { create(:inbox, channel: sms_channel) }
    let!(:template) { create(:template, account: account) }

    context 'when invalid attribute params type present' do
      let(:invalid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc_one", title: "demo", message: "demo message", select_audience: "All Users", exclude_users: false,
                      send_campaign_to_the_opted_out_users: false, sender_id: "", template_id: "", template_record_id: "", status: 6 }, campaign_scheduler: { schedule_type: "at_specific_time", schedule_time: 1692815202 }
        }
      }
      it 'returns the message Invalid campaignable type' do
        post "/api/v3/accounts/#{account.id}/campaigns/save_as_draft", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['error']).to eq("Invalid campaignable type")
      end
    end

    context 'when valid attribute present' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "demo", message: "demo message", select_audience: "All Users", exclude_users: false,
                      send_campaign_to_the_opted_out_users: false, sender_id: "", template_id: "", template_record_id: "", status: 6 }, campaign_scheduler: { schedule_type: "at_specific_time", schedule_time: 1692815202 }
        }
      }
      it 'returns the Campaign & SmsCampaign & CampaignScheduler created' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns/save_as_draft", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
      end
    end

    context 'when valid attribute present but schedular params not present' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "demo", message: "demo message", select_audience: "All Users", exclude_users: false,
                      send_campaign_to_the_opted_out_users: false, sender_id: "", template_id: template.id, template_record_id: template.id, status: 6 }, campaign_scheduler: {}
        }
      }
      it 'returns the Campaign & SmsCampaign created' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns/save_as_draft", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
      end
    end

    context 'when params id attribute present' do
      let!(:campaign_sms_campaign) { create(:campaign_sms_campaign, account: account, template_id: template.id) }
      let!(:campaign) {
        Campaign.create!(title: "test camp", message: "Test message", inbox_id: sms_inbox.id, account_id: account.id, total_order_value: 200,
                         number_of_conversion_events: 5, number_of_unique_conversions: 4, campaignable: campaign_sms_campaign, campaignable_id: campaign_sms_campaign.id)
      }
      let(:valid_attributes) {
        {
          campaign: { id: campaign.id, type: "tata_smsc", title: "updated title", message: "updated message", select_audience: "All Users",
                      exclude_users: false, send_campaign_to_the_opted_out_users: false, sender_id: "", template_id: template.id, template_record_id: template.id, status: 6 }, campaign_scheduler: {}
        }
      }
      it 'returns the Campaign & SmsCampaign and campaign_scheduler attribute updated' do
        post "/api/v3/accounts/#{account.id}/campaigns/save_as_draft", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        campaign_sms_campaign.reload
        campaign.reload
        expect(campaign_sms_campaign.template_record_id).to eq(template.id)
        expect(campaign.title).to eq('updated title')
        expect(campaign.message).to eq('updated message')
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'GET #Campaigns' do
    it 'returns a JSON response with all campaigns for current account' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1')
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2')
      get "/api/v3/accounts/#{account.id}/campaigns", headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(2)
      expect(response_data['campaigns'].pluck('title')).to contain_exactly('Campaign 1', 'Campaign 2')
    end

    it 'returns an empty JSON response when no campaigns are found' do
      get "/api/v3/accounts/#{account.id}/campaigns", headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns']).to be_empty
    end

    it 'returns date range filter for custom range' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                        created_at: 8.days.ago)
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2',
                        created_at: 1.days.ago)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { start_date: 9.days.ago, end_date: Time.zone.today },
                                                      headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(2)
    end

    it 'returns no campaign found for custom range' do
      get "/api/v3/accounts/#{account.id}/campaigns", params: { start_date: 9.days.ago, end_date: Time.zone.today },
                                                      headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns']).to be_empty
    end

    it 'applies delivery types filter' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'One-time Campaign',
                        created_at: 1.days.ago, scheduling_type: 'one_time', status: :completed)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { delivery_types: ['one_time'] }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(1)
      expect(response_data['campaigns'].first['title']).to eq('One-time Campaign')
    end

    it 'applies delivery types filter' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'One-time Campaign',
                        created_at: 1.days.ago, scheduling_type: 'one_time', status: :completed)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { delivery_types: '' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(1)
      expect(response_data['campaigns'].first['title']).to eq('One-time Campaign')
    end

    it 'applies delivery types filter using paignation' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'One-time Campaign 1',
                        created_at: 1.days.ago, scheduling_type: 'one_time', status: :completed)
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'One-time Campaign 2',
                        created_at: 1.days.ago, scheduling_type: 'one_time', status: :completed)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { delivery_types: ['one_time'], current_page: 1, limit: 2 },
                                                      headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(2)
      expect(response_data['campaigns'].first['title']).to eq('One-time Campaign 2')
    end

    it 'returns no campaigns for delivery types filter' do
      get "/api/v3/accounts/#{account.id}/campaigns", params: { delivery_types: ['one_time'], current_page: 1, limit: 2 },
                                                      headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns']).to be_empty
    end

    it 'applies date range filter for scheduled' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                        scheduled_at: Time.now + 1.day, status: :scheduled)
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2',
                        scheduled_at: Time.now + 1.day, status: :scheduled)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { query: 'scheduled' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(2)
      expect(response_data['campaigns'].first['title']).to eq('Campaign 2')
    end
  end

  describe 'GET #active' do
    it 'applies date range filter for active' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                        created_at: Time.zone.today, status: :processing)
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2',
                        created_at: Date.yesterday, status: :processing)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { query: 'processing' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(2)
      expect(response_data['campaigns'].first['title']).to eq('Campaign 1')
    end

    it 'applies date range filter for active' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                        created_at: Time.zone.today, status: :completed)
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2',
                        created_at: Date.yesterday, status: :completed)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { query: 'processing', campaign_name: 'Campaign 1' }, headers: user.create_new_auth_token,
                                                      as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(1)
      expect(response_data['campaigns'].first['title']).to eq('Campaign 1')
    end

    it 'returns an empty JSON response when no campaigns are found' do
      get "/api/v3/accounts/#{account.id}/campaigns", headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns']).to be_empty
    end

    it 'applies status filter' do
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Success Campaign',
                        created_at: 1.days.ago, status: :processing)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { status: 'processing' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(1)
      expect(response_data['campaigns'].first['title']).to eq('Success Campaign')
    end
  end

  describe 'GET #draft' do
    it 'applies date range filter for today' do
      yesterday = Date.yesterday
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                        scheduled_at: yesterday.midnight, status: :draft)
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2',
                        scheduled_at: yesterday.midnight, status: :draft)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { query: 'draft' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(2)
      expect(response_data['campaigns'].first['title']).to eq('Campaign 2')
    end

    it 'returns an empty JSON response when no campaigns are found' do
      get "/api/v3/accounts/#{account.id}/campaigns", headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns']).to be_empty
    end

    it 'applies date range filter for today' do
      get "/api/v3/accounts/#{account.id}/campaigns", params: { channel_types: 'sms' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns']).to be_empty
    end

    it 'applies date range filter for today' do
      yesterday = Date.yesterday
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                        scheduled_at: yesterday.midnight, status: :draft)
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2',
                        scheduled_at: yesterday.midnight, status: :draft)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { created_by: 'example10@gmail.com' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(2)
      expect(response_data['campaigns'].first['title']).to eq('Campaign 2')
    end
  end

  describe 'GET #ran_yesterday' do
    it 'applies date range filter for today' do
      yesterday = Date.yesterday
      future_campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                                           scheduled_at: yesterday.midnight, status: :draft, account: account)
      future_campaign_scheduler = create(:campaign_scheduler, campaign: future_campaign1, campaign_type: "0", schedule_type: "periodic", schedule_time: yesterday.midnight, campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "at_fixed_time", scheduling_frequency: "daily", schedule_start_date: "1697090800", schedule_end_date: "", repeat_every: "2",
                                                              send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "")
      get "/api/v3/accounts/#{account.id}/campaigns", params: { query: 'ran_yesterday' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(1)
      expect(response_data['campaigns'].first['title']).to eq('Campaign 1')
    end

    it 'returns an empty JSON response when no campaigns are found' do
      get "/api/v3/accounts/#{account.id}/campaigns", headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns']).to be_empty
    end

    it 'applies date range filter' do
      yesterday = Date.yesterday
      future_campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                                           scheduled_at: yesterday.midnight, status: :draft, account: account)
      future_campaign_scheduler = create(:campaign_scheduler, campaign: future_campaign1, campaign_type: "0", schedule_type: "periodic", schedule_time: yesterday.midnight, campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "at_fixed_time", scheduling_frequency: "daily", schedule_start_date: "1697090800", schedule_end_date: "", repeat_every: "2",
                                                              send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "")
      create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',
                        created_at: Time.zone.today, status: :processing)
      get "/api/v3/accounts/#{account.id}/campaigns", params: { query: 'ran_yesterday' }, headers: user.create_new_auth_token, as: :json
      expect(response).to have_http_status(:ok)
      response_data = response.parsed_body
      expect(response_data['campaigns'].length).to eq(1)
      expect(response_data['metrics']['active_count']).to eq(1)
    end
  end

  describe 'POST #create' do
    let!(:account) { create(:account) }
    let(:user) { create(:user, account: account, email: "test123@example.com", name: "test123@example.com") }
    let!(:template) { create(:template, account: account) }
    let!(:tata_smsc) { create(:channel_tata_smsc, account: account, medium: "tata") }
    let!(:tatasms_inbox) { create(:inbox, channel: tata_smsc) }
    context 'when valid attribute present for create campaign for type immediate(as_soon_as_possible)' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "as_soon_as_possible", schedule_time: "1695208603" }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the Immediate Campaign' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present for create campaign for type at_specific_time schedule' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "at_specific_time", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "at_fixed_time", scheduling_frequency: "", start_date: 1697090800, end_date: "", repeat_every: "", send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "" }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the At Specific Time schedule Campaign' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present for create campaign for type at_specific_time schedule(send in user time zone)' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "at_specific_time", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "send_in_user_time_zone", scheduling_frequency: "", start_date: 1697090800, end_date: "", repeat_every: "", send_if_user_timezone_expired: true, occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "" }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the At Specific Time schedule Campaign(send in user time zone)' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present for create campaign for type at_specific_time schedule(best_time_for_user)' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "at_specific_time", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "best_time_for_user", scheduling_frequency: "", start_date: 1697090800, end_date: "", repeat_every: "", send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: true, alternate_timezone: "" }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the At Specific Time schedule Campaign(best_time_for_user)' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present for create campaign for type at_specific_time schedule(best_time_for_user with alernate timezone)' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "at_specific_time", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "best_time_for_user", scheduling_frequency: "", start_date: 1697090800, end_date: "", repeat_every: "", send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: 0 }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the At Specific Time schedule Campaign(best_time_for_user)' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present for create campaign for type periodic schedule(daily)' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "periodic", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "at_fixed_time", scheduling_frequency: "daily", start_date: 1697090800, end_date: "", repeat_every: "2", send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "" }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the Periodic schedule Campaign' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present for create campaign for type periodic schedule(weekly) and send in user time zone' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "periodic", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "send_in_user_time_zone", scheduling_frequency: "weekly", start_date: 1697090800, end_date: "", repeat_every: "2", send_if_user_timezone_expired: "true", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "", repeat_on_day_of_week: ["monday", "friday"] }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the Periodic schedule Campaign' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present for create campaign for type periodic schedule(weekly) and best_time_for_user' do
      let(:valid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "periodic", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta", send_campaign_time: "best_time_for_user", scheduling_frequency: "monthly", start_date: 1697090800, end_date: "", repeat_every: "2", send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: true, alternate_timezone: "", repeat_on_day_of_month: [1, 3, 5] }, segment: { segment_filter_id: "231" }
        }
      }
      it 'Create the Periodic schedule Campaign' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::SmsCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when valid attribute present but channel not found' do
      let(:invalid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "testdata", segment_id: "", template_customized: "true",
                      message: "Hi {{name}} Have a glorious day {{city}} https://www.perfmatrix.com/jmeter-timestamp/#:~:text=If%20you%20want%20to%20pass,value%20in%20desired%20time%20format.&text=In%20case%20you%20want%20to,format%20separated%20by%20a%20comma. {{email}} Promotional code will be sent to your mobile number {{phone_number}}", select_audience: "All Users", exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "99999", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: { "{name}": "name", "{email}": "email", "{city}": "last_known_city", "{phone_number}": "phone_number" } }, campaign_scheduler: { campaign_type: "0", schedule_type: "as_soon_as_possible", schedule_time: "1695208603" }, segment: { segment_filter_id: "231" }
        }
      }
      it 'returns then message invalid sender id' do
        post "/api/v3/accounts/#{account.id}/campaigns", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['errors']).to eq("Invalid sender id")
      end
    end

    context 'when invalid attribute present means title and message params not present' do
      let(:invalid_attributes) {
        {
          campaign: { id: "", type: "tata_smsc", title: "", segment_id: "", template_customized: "true", message: "", select_audience: "All Users",
                      exclude_users: "false", send_campaign_to_the_opted_out_users: "false", sender_id: "12345", template_id: "#{template.id}", selected_contact_attribute: "last_known_city", template_record_id: "#{template.id}", personalise_mapping_attribute: {} }, campaign_scheduler: { campaign_type: "0", schedule_type: "as_soon_as_possible", schedule_time: "1695208603" }, segment: { segment_filter_id: "231" }
        }
      }
      it 'returns then errors message ' do
        post "/api/v3/accounts/#{account.id}/campaigns", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['errors']).to eq(["Title can't be blank", "Message can't be blank", "Campaigns is invalid"])
      end
    end
  end

  describe 'Post #create' do
    let!(:email_channel) { create(:channel_email, account: account) }
    let!(:email_inbox) { create(:inbox, channel: email_channel) }
    let!(:email_campaign) { create(:email_campaign) }
    let!(:campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
    let!(:campaign_detail) { create(:campaign_detail, account: account, channel_email_id: email_channel.id, campaign_id: campaign.id) }
    let!(:email_template) { create(:email_template, account: account, name: "New Template", body: "/home/yash/Downloads/email_template.html") }

    context 'when account valid' do
      let(:invalid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email_type", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "email", schedule_type: "as_soon_as_possible" }, segment: { segment_id: "68" } }
      }
      it 'but invalid attributes' do
        post "/api/v3/accounts/#{account.id}/campaigns", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when account valid when channel id invalid' do
      let(:invalid_attributes) {
        { campaign: { channel_id: "test", email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "email", schedule_type: "as_soon_as_possible" }, segment: { segment_id: "68" },
          campaign_detail: { campaign_id: campaign.id } }
      }
      it 'but invalid channel id' do
        post "/api/v3/accounts/#{account.id}/campaigns", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when account valid campaign created' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:valid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "email", schedule_type: "as_soon_as_possible" }, segment: { segment_id: "68" },
          campaign_detail: { subject: "Let Your Summer Look Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                             from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'but invalid channel id' do
        post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when account valid campaign as soon as possible' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:valid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "email", schedule_type: "as_soon_as_possible" }, segment: { segment_id: "68" },
          campaign_detail: { subject: "Let Your Summer Look Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                             from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'at specific time' do
        post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end
  end

  describe 'Post #create' do
    let!(:email_channel) { create(:channel_email, account: account) }
    let!(:email_inbox) { create(:inbox, channel: email_channel) }
    let!(:email_campaign) { create(:email_campaign) }
    let!(:campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
    let!(:campaign_detail) { create(:campaign_detail, account: account, channel_email_id: email_channel.id, campaign_id: campaign.id) }
    let!(:email_template) { create(:email_template, account: account, name: "New Template", body: "/home/yash/Downloads/email_template.html") }

    context 'when account valid' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:valid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "0", schedule_type: "at_specific_time", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta",
                                send_campaign_time: "at_fixed_time", scheduling_frequency: "", start_date: 1697090800, end_date: "", repeat_every: "",
                                send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "" }, segment: { segment_id: "68" },
          campaign_detail: { subject: "Let Your Summer Look Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                             from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'at specific time' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::EmailCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when account valid' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:valid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "0", schedule_type: "at_specific_time", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta",
                                send_campaign_time: "send_in_user_time_zone", scheduling_frequency: "", start_date: 1697090800, end_date: "", repeat_every: "",
                                send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "" }, segment: { segment_id: "68" },
          campaign_detail: { subject: "Let Your Summer Look Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                             from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'at specific time' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::EmailCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when account valid best time for user-> At Specific Time' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:valid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "0", schedule_type: "at_specific_time", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta",
                                send_campaign_time: "best_time_for_user", scheduling_frequency: "", start_date: 1697090800, end_date: "", repeat_every: "",
                                send_if_user_timezone_expired: "", occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "" }, segment: { segment_id: "68" },
          campaign_detail: { subject: "Let Your Summer Look Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                             from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'at specific time' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::EmailCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end
    context 'when account valid send in user time zone -> Periodic Weekly' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:valid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "0", schedule_type: "periodic", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta",
                                send_campaign_time: "send_in_user_time_zone", scheduling_frequency: "weekly", start_date: 1697090800, end_date: "", repeat_every: "2", send_if_user_timezone_expired: "true",
                                occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "", repeat_on_day_of_week: ["monday", "friday"] },
          segment: { segment_id: "68" }, campaign_detail: { subject: "Let Your Summer Look Shine!!!!", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                                                            from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'at specific time' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: valid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::EmailCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when account valid send in user time zone without subject' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:invalid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: email_template.id, campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "0", schedule_type: "periodic", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta",
                                send_campaign_time: "send_in_user_time_zone", scheduling_frequency: "weekly", start_date: 1697090800, end_date: "", repeat_every: "2", send_if_user_timezone_expired: "true",
                                occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "", repeat_on_day_of_week: ["monday", "friday"] },
          segment: { segment_id: "68" }, campaign_detail: { subject: "", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                                                            from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'at specific time' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(1) && change(CampaignScheduler, :count).by(1) && change(Campaign::EmailCampaign, :count).by(1)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['message']).to eq("Subject can't be blank")
      end
    end

    context 'when account valid send in user time zone without subject' do
      let!(:new_campaign) { create(:campaign, campaignable: email_campaign, inbox: email_inbox, account: account) }
      let(:invalid_attributes) {
        { campaign: { channel_id: email_channel.id, email_template_id: "", campaign_content_type: "promotional",
                      scheduling_type: "periodic", inbox: email_inbox, type: "email", title: "demo", select_audience: "All Users", exclude_users: false },
          campaign_scheduler: { campaign_type: "0", schedule_type: "periodic", schedule_time: "1695208603", campaign_time_zone: "(GMT+5:30) Asia/Calcutta",
                                send_campaign_time: "send_in_user_time_zone", scheduling_frequency: "weekly", start_date: 1697090800, end_date: "", repeat_every: "2", send_if_user_timezone_expired: "true",
                                occurrences: "", best_time_for_user: "", on_best_time: "", alternate_timezone: "", repeat_on_day_of_week: ["monday", "friday"] },
          segment: { segment_id: "68" }, campaign_detail: { subject: "", sender_name: "Tata User", cc_email_address: ["test@gmail.com"],
                                                            from_email_address: "test@example.com", reply_to_email_address: "test@example.com", channel_email_id: email_channel.id } }
      }
      it 'at specific time' do
        expect {
          post "/api/v3/accounts/#{account.id}/campaigns", params: invalid_attributes, headers: user.create_new_auth_token, as: :json
        }.to change(Campaign, :count).by(0) && change(CampaignScheduler, :count).by(0) && change(Campaign::EmailCampaign, :count).by(0)
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['error']).to eq("Email template can't be blank, Please generate/select saved template.")
      end
    end
  end
  describe '#update_or_perform_action' do
      let!(:account) { create(:account) }
      let(:user) { create(:user, account: account, email: "test@example.com", name: "test@example.com") }
      let!(:sms_channel) { create(:channel_sms) }
      let!(:sms_inbox) { create(:inbox, channel: sms_channel) }
      let!(:campaign) { create(:campaign, inbox: sms_inbox, account: account) }
      context 'when campaign id params is not present' do
        let(:invalid_attributes){{campaign_id: "" }}
        it 'returns the message Campaign not found' do
          put "/api/v3/accounts/#{account.id}/campaigns/update", params: {state: "paused", id: nil}, headers: user.create_new_auth_token, as: :json
          data = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(response.body).to include('Campaign not found')
        end
      end
      context 'when campaign id params is not present' do
        let(:invalid_attributes){{campaign_id: "" }}
        it 'returns the message Campaign not found' do
          put "/api/v3/accounts/#{account.id}/campaigns/update", params: {state: "resume", id: nil}, headers: user.create_new_auth_token, as: :json
          data = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(response.body).to include('Campaign not found')
        end
      end
      context 'when campaign id params is not present' do
        let(:invalid_attributes){{campaign_id: "" }}
        it 'returns the message Campaign not found' do
          put "/api/v3/accounts/#{account.id}/campaigns/update", params: {state: "cancelled", id: nil}, headers: user.create_new_auth_token, as: :json
          data = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(response.body).to include('Campaign not found')
        end
      end
	  end

  describe 'GET #export' do
    context 'export' do
      let(:valid_params) do
        {
          start_date: Date.yesterday,
          end_date: Date.yesterday
        }
      end
      it 'returns a csv file' do
        campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',created_at: Date.yesterday)
        get "/api/v3/accounts/#{account.id}/campaigns.csv",params: valid_params, headers: user.create_new_auth_token, as: :json
        serial_number = 1;
        expected_csv_content = "Sr No.,Title,Description,Created Date,Updated Date,Campaign Type,Start Date,Campaign Id,Inbox Id,Avatar Url,Name,Message,Status,Trigger Rules,Trigger business hours\n1,#{campaign1.title},#{campaign1.description},#{campaign1.created_at},#{campaign1.updated_at},#{campaign1.campaign_type},#{campaign1.campaign_scheduler&.start_date},#{campaign1.id},#{campaign1.inbox.id},\"\",#{campaign1.inbox.name},#{campaign1.message},#{campaign1.status},#{campaign1.trigger_rules},#{campaign1.trigger_only_during_business_hours}\n"
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to eq('text/csv')
        expect(response.body).to include(expected_csv_content)
      end

      it 'returns a invalid format' do
        campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',created_at: Date.yesterday)
        get "/api/v3/accounts/#{account.id}/campaigns.invalid",params: valid_params, headers: user.create_new_auth_token, as: :json
        serial_number = 1;
        expected_csv_content = "Sr No.,Title,Description,Created Date,Updated Date,Campaign Type,Start Date,Campaign Id,Inbox Id,Avatar Url,Name,Message,Status,Trigger Rules,Trigger business hours\n1,#{campaign1.title},#{campaign1.description},#{campaign1.created_at},#{campaign1.updated_at},#{campaign1.campaign_type},#{campaign1.campaign_scheduler&.start_date},#{campaign1.id},#{campaign1.inbox.id},\"\",#{campaign1.inbox.name},#{campaign1.message},#{campaign1.status},#{campaign1.trigger_rules},#{campaign1.trigger_only_during_business_hours}\n"
        response_data = response.parsed_body
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_data['message']).to eq("Invalid format")
      end

      it 'returns a pdf file' do
        campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',created_at: Date.yesterday)
        get "/api/v3/accounts/#{account.id}/campaigns.pdf",params: valid_params, headers: user.create_new_auth_token, as: :json
        serial_number = 1;
        expected_pdf_content = "Sr No.,Title,Description,Created Date,Updated Date,Campaign Type,Start Date,Campaign Id,Inbox Id,Avatar Url,Name,Message,Status,Trigger Rules,Trigger business hours\n1,#{campaign1.title},#{campaign1.description},#{campaign1.created_at},#{campaign1.updated_at},#{campaign1.campaign_type},#{campaign1.campaign_scheduler&.start_date},#{campaign1.id},#{campaign1.inbox.id},\"\",#{campaign1.inbox.name},#{campaign1.message},#{campaign1.status},#{campaign1.trigger_rules},#{campaign1.trigger_only_during_business_hours}\n"
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to eq('application/pdf')
      end

      it 'returns a excel file' do
        campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',created_at: Date.yesterday)
        get "/api/v3/accounts/#{account.id}/campaigns.xlsx",params: valid_params, headers: user.create_new_auth_token, as: :json
        serial_number = 1;
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to eq('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      end
    end

    context 'export' do
      let(:invalid_params) do
        {}
      end
      it 'returns a date required' do
        campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',created_at: Date.yesterday)
        get "/api/v3/accounts/#{account.id}/campaigns.csv",params: invalid_params, headers: user.create_new_auth_token, as: :json
        serial_number = 1;
        expected_csv_content = "Sr No.,Title,Description,Created Date,Updated Date,Campaign Type,Start Date,Campaign Id,Inbox Id,Avatar Url,Name,Message,Status,Trigger Rules,Trigger business hours\n1,#{campaign1.title},#{campaign1.description},#{campaign1.created_at},#{campaign1.updated_at},#{campaign1.campaign_type},#{campaign1.campaign_scheduler&.start_date},#{campaign1.id},#{campaign1.inbox.id},\"\",#{campaign1.inbox.name},#{campaign1.message},#{campaign1.status},#{campaign1.trigger_rules},#{campaign1.trigger_only_during_business_hours}\n"
        response_data = response.parsed_body
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_data['message']).to eq("Start date and end date required")
      end

      it 'returns a date required' do
        campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',created_at: Date.yesterday)
        get "/api/v3/accounts/#{account.id}/campaigns.pdf",params: invalid_params, headers: user.create_new_auth_token, as: :json
        serial_number = 1;
        expected_csv_content = "Sr No.,Title,Description,Created Date,Updated Date,Campaign Type,Start Date,Campaign Id,Inbox Id,Avatar Url,Name,Message,Status,Trigger Rules,Trigger business hours\n1,#{campaign1.title},#{campaign1.description},#{campaign1.created_at},#{campaign1.updated_at},#{campaign1.campaign_type},#{campaign1.campaign_scheduler&.start_date},#{campaign1.id},#{campaign1.inbox.id},\"\",#{campaign1.inbox.name},#{campaign1.message},#{campaign1.status},#{campaign1.trigger_rules},#{campaign1.trigger_only_during_business_hours}\n"
        response_data = response.parsed_body
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_data['message']).to eq("Start date and end date required")
      end

      it 'returns a date required' do
        campaign1 = create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',created_at: Date.yesterday)
        get "/api/v3/accounts/#{account.id}/campaigns.xlsx",params: invalid_params, headers: user.create_new_auth_token, as: :json
        serial_number = 1;
        expected_csv_content = "Sr No.,Title,Description,Created Date,Updated Date,Campaign Type,Start Date,Campaign Id,Inbox Id,Avatar Url,Name,Message,Status,Trigger Rules,Trigger business hours\n1,#{campaign1.title},#{campaign1.description},#{campaign1.created_at},#{campaign1.updated_at},#{campaign1.campaign_type},#{campaign1.campaign_scheduler&.start_date},#{campaign1.id},#{campaign1.inbox.id},\"\",#{campaign1.inbox.name},#{campaign1.message},#{campaign1.status},#{campaign1.trigger_rules},#{campaign1.trigger_only_during_business_hours}\n"
        response_data = response.parsed_body
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_data['message']).to eq("Start date and end date required")
      end
    end
  end

  describe 'GET #CampaignTag' do
    context 'group_tag_id params passed as blank' do
      let!(:group_tag) { create(:group_tag, name:"GroupTag") }
      let!(:group_tag1) { create(:group_tag, name:"GroupTag1") }
      let(:campaign1){
        create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 1',scheduled_at: Time.now, status: :draft)
      }
      let(:campaign2){
        create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account, title: 'Campaign 2',scheduled_at: Time.now, status: :draft)
      }
      before do
        create(:campaign_tag, name: 'Promotional', campaign: campaign1, group_tag_id: group_tag.id)
        create(:campaign_tag, name: 'Incentive', campaign: campaign1, group_tag_id: group_tag.id)
        create(:campaign_tag, name: 'Transcational', campaign: campaign2, group_tag_id: group_tag1.id)
      end
      it 'filter by tag names' do
        get "/api/v3/accounts/#{account.id}/campaigns", params: { tag_names: 'Promotional' }, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        response_data = response.parsed_body
        expect(response_data['campaigns'].length).to eq(1)
        expect(response_data['campaigns'].first['title']).to eq('Campaign 1')
      end

      it 'filter by tag names' do
        get "/api/v3/accounts/#{account.id}/campaigns", params: { tag_names: ["Promotional","Incentive"], filter_type: "AND" }, headers: user.create_new_auth_token, as: :json
        expect(response).to have_http_status(:ok)
        response_data = response.parsed_body
        expect(response_data['campaigns'].first['title']).to eq('Campaign 1')
      end
    end
  end
end