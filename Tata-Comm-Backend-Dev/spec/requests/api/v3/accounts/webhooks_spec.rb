require 'rails_helper'

RSpec.describe "Api::V3::Accounts::Webhooks", type: :request do
  describe 'POST #whatsapp' do
    let!(:account) { create(:account) }
    let!(:whatsapp_channel) { create(:channel_whatsapp,account:account) }
    let!(:whatsapp_inbox) { create(:inbox, channel: whatsapp_channel) }
    let!(:whatsapp_campaign) { create(:whatsapp_campaign) }
    let!(:campaign) { create(:campaign, campaignable: whatsapp_campaign, inbox: whatsapp_inbox, account: account) }
    let!(:contact) { create(:contact, account: account) }

    context 'when params [entity] not present' do
      let(:invalid_attributes) {{"object"=>"whatsapp_business_account", "entry"=>[], "account_id"=>"3", "webhook"=>{}}}
      it 'return message params is blank' do
        post "/api/v3/accounts/#{account.id}/webhooks/whatsapp", params: invalid_attributes, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['error']).to eq("params is blank")
      end
    end

    context 'when params [entity] present but delivery record not found' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "@@$$abcxyz123321") }
      let(:valid_attributes) {
        {
        "object"=>"whatsapp_business_account", "entry"=>[{"id"=>"107761138906040", "changes"=>[{"value"=>{"messaging_product"=>"whatsapp", 
        "metadata"=>{"display_phone_number"=>"918177861650", "phone_number_id"=>"116628944860336"}, 
        "statuses"=>[{"id"=>"wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==", "status"=>"sent", "timestamp"=>"1700115150", 
        "recipient_id"=>"919819806647", "conversation"=>{"id"=>"d6267507b5723255e6c5e8b2a3864ab3", 
        "expiration_timestamp"=>"1700201580", "origin"=>{"type"=>"marketing"}}, "pricing"=>{"billable"=>true, "pricing_model"=>"CBP", 
        "category"=>"marketing"}}]}, "field"=>"messages"}]}], "account_id"=>"3", "webhook"=>{}
        }
      }
      it 'return message Campaign Delivery record not found' do
        post "/api/v3/accounts/#{account.id}/webhooks/whatsapp", params: valid_attributes, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['error']).to eq("Campaign Delivery record not found")
      end
    end

    context 'when params [entity] present & delivery record also presnt but status comming as blank' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==") }
      let(:valid_attributes) {
        {
        "object"=>"whatsapp_business_account", "entry"=>[{"id"=>"107761138906040", "changes"=>[{"value"=>{"messaging_product"=>"whatsapp", 
        "metadata"=>{"display_phone_number"=>"918177861650", "phone_number_id"=>"116628944860336"}, 
        "statuses"=>[{"id"=>"wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==", "status"=>"unknown", "timestamp"=>"1700115150", 
        "recipient_id"=>"919819806647", "conversation"=>{"id"=>"d6267507b5723255e6c5e8b2a3864ab3", 
        "expiration_timestamp"=>"1700201580", "origin"=>{"type"=>"marketing"}}, "pricing"=>{"billable"=>true, "pricing_model"=>"CBP", 
        "category"=>"marketing"}}]}, "field"=>"messages"}]}], "account_id"=>"3", "webhook"=>{}
        }
      }
      it 'return error message' do
        post "/api/v3/accounts/#{account.id}/webhooks/whatsapp", params: valid_attributes, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when delivery record present and status come as blank to sent' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==") }
      let(:valid_attributes) {
        {
        "object"=>"whatsapp_business_account", "entry"=>[{"id"=>"107761138906040", "changes"=>[{"value"=>{"messaging_product"=>"whatsapp", 
        "metadata"=>{"display_phone_number"=>"918177861650", "phone_number_id"=>"116628944860336"}, 
        "statuses"=>[{"id"=>"wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==", "status"=>"sent", "timestamp"=>"1700115150", 
        "recipient_id"=>"919819806647", "conversation"=>{"id"=>"d6267507b5723255e6c5e8b2a3864ab3", 
        "expiration_timestamp"=>"1700201580", "origin"=>{"type"=>"marketing"}}, "pricing"=>{"billable"=>true, "pricing_model"=>"CBP", 
        "category"=>"marketing"}}]}, "field"=>"messages"}]}], "account_id"=>"3", "webhook"=>{}
        }
      }
      it 'Update Campaign Delivery status sent' do
        post "/api/v3/accounts/#{account.id}/webhooks/whatsapp", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('sent')
        expect(campaign_delivery.sent_at).to eq(Time.zone.at("1700115150".to_i))
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as sent to delivered' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==") }
      let(:valid_attributes) {
        {
        "object"=>"whatsapp_business_account", "entry"=>[{"id"=>"107761138906040", "changes"=>[{"value"=>{"messaging_product"=>"whatsapp", 
        "metadata"=>{"display_phone_number"=>"918177861650", "phone_number_id"=>"116628944860336"}, 
        "statuses"=>[{"id"=>"wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==", "status"=>"delivered", "timestamp"=>"1700115150", 
        "recipient_id"=>"919819806647", "conversation"=>{"id"=>"d6267507b5723255e6c5e8b2a3864ab3", 
        "expiration_timestamp"=>"1700201580", "origin"=>{"type"=>"marketing"}}, "pricing"=>{"billable"=>true, "pricing_model"=>"CBP", 
        "category"=>"marketing"}}]}, "field"=>"messages"}]}], "account_id"=>"3", "webhook"=>{}
        }
      }
      it 'Update Campaign Delivery status sent-->delivered' do
        post "/api/v3/accounts/#{account.id}/webhooks/whatsapp", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('delivered')
        expect(campaign_delivery.delivered_at).to eq(Time.zone.at("1700115150".to_i))
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as delivered to read' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==") }
      let(:valid_attributes) {
        {
        "object"=>"whatsapp_business_account", "entry"=>[{"id"=>"107761138906040", "changes"=>[{"value"=>{"messaging_product"=>"whatsapp", 
        "metadata"=>{"display_phone_number"=>"918177861650", "phone_number_id"=>"116628944860336"}, 
        "statuses"=>[{"id"=>"wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==", "status"=>"read", "timestamp"=>"1700115150", 
        "recipient_id"=>"919819806647", "conversation"=>{"id"=>"d6267507b5723255e6c5e8b2a3864ab3", 
        "expiration_timestamp"=>"1700201580", "origin"=>{"type"=>"marketing"}}, "pricing"=>{"billable"=>true, "pricing_model"=>"CBP", 
        "category"=>"marketing"}}]}, "field"=>"messages"}]}], "account_id"=>"3", "webhook"=>{}
        }
      }
      it 'Update Campaign Delivery status delivered-->opened' do
        post "/api/v3/accounts/#{account.id}/webhooks/whatsapp", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('opened')
        expect(campaign_delivery.opened_at).to eq(Time.zone.at("1700115150".to_i))
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as failed' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==") }
      let(:valid_attributes) {
        {
        "object"=>"whatsapp_business_account", "entry"=>[{"id"=>"107761138906040", "changes"=>[{"value"=>{"messaging_product"=>"whatsapp", 
        "metadata"=>{"display_phone_number"=>"918177861650", "phone_number_id"=>"116628944860336"}, 
        "statuses"=>[{"id"=>"wamid.HBgMOTE5ODE5ODA2NjQ3FQIAERgSQ0YyN0ExMTE4RkQ4QzRFMjQ1AA==", "status"=>"failed", "timestamp"=>"1700115150", 
        "recipient_id"=>"919819806647", "conversation"=>{"id"=>"d6267507b5723255e6c5e8b2a3864ab3", 
        "expiration_timestamp"=>"1700201580", "origin"=>{"type"=>"marketing"}}, "pricing"=>{"billable"=>true, "pricing_model"=>"CBP", 
        "category"=>"marketing"}}]}, "field"=>"messages"}]}], "account_id"=>"3", "webhook"=>{}
        }
      }
      it 'Update Campaign Delivery status failed' do
        post "/api/v3/accounts/#{account.id}/webhooks/whatsapp", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('bounced')
        expect(campaign_delivery.bounced_at).to eq(Time.zone.at("1700115150".to_i))
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'POST #sms' do
    let!(:account) { create(:account) }
    let!(:sms_channel) { create(:channel_sms, account: account) }
    let!(:sms_inbox) { create(:inbox, channel: sms_channel, account: account) }
    let!(:campaign_sms_campaign) { create(:campaign_sms_campaign) }
    let!(:campaign) { create(:campaign, campaignable: campaign_sms_campaign, inbox: sms_inbox, account: account) }
    let!(:contact) { create(:contact, account: account) }

    context 'when campaign delivery record not found with ID' do
      let(:invalid_attributes) {{"id":"xyzabc","statusCode":12,"status":"BOUNCED",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'return response is null' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: invalid_attributes, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as blank to sent' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "xyzabc") }
      let(:valid_attributes) {{"id":"xyzabc","statusCode":12,"status":"SENT",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'Update Campaign Delivery status sent' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('sent')
        expect(campaign_delivery.sent_at).to eq("2023-11-21 20:22:10.842000000 +0000")
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as sent to delivered' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact,message_id: "xyzabc",sent_at: Time.now.utc, status:"sent") }
      let(:valid_attributes) {{"id":"xyzabc","statusCode":12,"status":"DELIVERED",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'Update Campaign Delivery status delivered' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('delivered')
        expect(campaign_delivery.delivered_at).to eq("2023-11-23 09:44:10.842000000 +0000")
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as sent to unknown' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact, message_id: "xyzabc", sent_at: Time.now.utc, status:"sent") }
      let(:valid_attributes) {{"id":"xyzabc","statusCode":12,"status":"UNKNOWN",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'Update Campaign Delivery status bounced' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('bounced')
        expect(campaign_delivery.bounced_at).to eq("2023-11-23 09:44:10.842000000 +0000")
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as sent to undelivered' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact, message_id: "xyzabc", sent_at: Time.now.utc, status:"sent") }
      let(:valid_attributes) {{"id":"xyzabc","statusCode":12,"status":"UNDELIVERED",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'Update Campaign Delivery status bounced' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('bounced')
        expect(campaign_delivery.bounced_at).to eq("2023-11-23 09:44:10.842000000 +0000")
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as sent to expired' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact: contact, message_id: "xyzabc", sent_at: Time.now.utc, status:"sent") }
      let(:valid_attributes) {{"id":"xyzabc","statusCode":12,"status":"EXPIRED",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'Update Campaign Delivery status expired' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('expired')
        expect(campaign_delivery.expired_at).to eq("2023-11-23 09:44:10.842000000 +0000")
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when delivery record present and status come as sent to rejected' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact:contact, message_id: "xyzabc", sent_at: Time.now.utc, status:"sent") }
      let(:valid_attributes) {{"id":"xyzabc","statusCode":12,"status":"REJECTED",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'Update Campaign Delivery status bounced' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: valid_attributes, as: :json
        campaign_delivery.reload
        expect(campaign_delivery.status).to eq('bounced')
        expect(campaign_delivery.bounced_at).to eq("2023-11-23 09:44:10.842000000 +0000")
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when campaign delivery record not found with ID' do
      let!(:campaign_delivery) { create(:campaign_delivery,campaign: campaign, account: account, contact: contact, message_id: "xyzabc", sent_at: Time.now.utc, status:"sent") }
      let(:invalid_attributes) {{"id":"xyzabc","statusCode":12,"status":"ABCD",
        "submitDate":"2023-11-21T09:22:10.842X","doneDate":"2023-11-23T09:44:10.842Z",
        "err":0,"account_id":3 }}
      it 'return message Validation failed: Status is invalid' do
        post "/api/v3/accounts/#{account.id}/webhooks/sms", params: invalid_attributes, as: :json
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['error']).to eq("Validation failed: Status is invalid")
      end
    end
  end
end