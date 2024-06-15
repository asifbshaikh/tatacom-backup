class Webhooks::WhatsappEventsJob < ApplicationJob
  queue_as :default
  include CampaignSchedulable

  def perform(params = {})
    return unless params[:phone_number]

    if params[:entry].present? && params[:entry].first[:changes].first[:value][:statuses].present?
      delivery_response = params[:entry].first[:changes].first[:value][:statuses].first
      error_code = delivery_response[:errors].present? ? delivery_response[:errors].first[:code] : nil
      campaign_delivery = CampaignDelivery.find_by(message_id: delivery_response[:id])
      if campaign_delivery.blank?
        return
      else
        timestamp = Time.zone.at(delivery_response[:timestamp].to_i)
        delivery_status = delivery_response[:status]
        delivery_status = BOUNCED if delivery_status.eql? FAILED
        delivery_status = OPENED if delivery_status.eql? READ
        campaign_delivery_update(delivery_status, timestamp, campaign_delivery, error_code, params)
        create_contact_common_events(delivery_status, campaign_delivery, WHATSAPP) # To create contact events for triggered
        return
      end
    elsif params[:entry].present? && params[:entry].first[:changes].first[:value][:contacts].present?
      channel = Channel::Whatsapp.find_by(phone_number: params[:phone_number])
      return unless channel && channel&.inbox.present?

      # route to meta provider from here
      if(params[:object]=="whatsapp_business_account")
        Whatsapp::IncomingMessageServiceMeta.new(inbox: channel.inbox, params: params['whatsapp'].with_indifferent_access[:entry].first[:changes].first[:value]).perform
      else
      # TODO: pass to appropriate provider service from here
        Whatsapp::IncomingMessageService.new(inbox: channel.inbox, params: params['whatsapp'].with_indifferent_access).perform
      end
    end
  end

  def campaign_delivery_update(delivery_status, timestamp, campaign_delivery, error_code, params)
    column_to_update = CampaignDelivery::STATUS_TIMESTAMPS[delivery_status]
    webhook_response_params = campaign_delivery&.webhook_response_params << params
    update_data = { status: delivery_status, column_to_update => timestamp, error_code: error_code, webhook_response_params: webhook_response_params }
    campaign_delivery.update!(update_data)
  end
end
