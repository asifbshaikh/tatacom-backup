class Api::V3::Accounts::WebhooksController < Api::V1::Accounts::BaseController
  skip_before_action :authenticate_user!, only: [:whatsapp, :sms]

  include CampaignSchedulable

  def whatsapp
    phone_number = params[:entry].first[:changes].first[:value][:metadata][:display_phone_number]
    whatsapp_params = params.dup
    params.merge!({"phone_number": "+#{phone_number}","whatsapp": whatsapp_params }.with_indifferent_access)
    Webhooks::WhatsappEventsJob.perform_later(params.to_unsafe_hash)
    head :ok
  end

  def sms
    campaign_delivery = CampaignDelivery.find_by(message_id: params[:id])
    if campaign_delivery.present?
      error_code = params[:err]
      status_code = params[:statusCode]
      status = params[:status].downcase
      status = BOUNCED if [UNKNOWN, REJECTED, UNDELIVERED].include?(status)
      timestamp = status.eql?(SENT) ? params[:submitDate] : params[:doneDate]
      column_to_update = CampaignDelivery::STATUS_TIMESTAMPS[status]
      column_to_update = :updated_at unless column_to_update.present?
      update_data = { status: status, error_code: error_code, statusCode: status_code, column_to_update => timestamp }
      update_data.merge!(delivered_at: nil) if status.eql?(BOUNCED)
      campaign_delivery.update!(update_data)
      create_contact_common_events(status, campaign_delivery, SMS) # To create contact events for triggered campaign
    end
    render json: { response: campaign_delivery }
  rescue StandardError => e
    render json: { error: e.message }.to_json, status: :unprocessable_entity
  end

end
