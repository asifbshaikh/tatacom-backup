class Webhooks::EmailCampaignDeliveryWorker < ApplicationJob
  queue_as :default
  REPORT_API_URL = ENV.fetch('TATA_EMAIL_REPORT_API')

  include CampaignSchedulable

  def perform(params)
    account = Account.find_by(id: params[:account_id])
    account.email_channels.each do |channel|
      response = fetch_third_party_data(channel)
      update_campaign_delivery(response) if response.present?
    end
  end

  def fetch_third_party_data(channel)
    params = { startDate: (Time.zone.today - 1.day).strftime('%Y-%m-%d'), endDate: Time.zone.today.strftime('%Y-%m-%d') }
    uri = URI(REPORT_API_URL)
    uri.query = URI.encode_www_form(params)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    req = Net::HTTP::Get.new(uri, { 'Content-Type' => 'application/json', 'api-key' => channel.email_api_key })
    response = https.request(req)
    JSON.parse(response.body)
  rescue StandardError
    {}
  end

  def update_campaign_delivery(response)
    sorted_records = sorted_results(response)
    sorted_records.each do |message_id, event_records|
      campaign_delivery = CampaignDelivery.find_by(message_id: message_id)
      next if campaign_delivery.blank?

      event_records.each do |record|
        update_campaign_delivery_record(campaign_delivery, record)
      end
    end
  end

  def sorted_results(result_set)
    data = {}
    return data if result_set['events'].blank?

    message_ids = result_set['events'].map { |x| x['messageId'].to_s }.uniq
    message_ids.each do |message_id|
      data[message_id] = result_set['events'].select { |x| x['messageId'] == message_id }.sort_by { |x| Time.zone.parse(x['date']) }
    end
    data
  end

  def update_campaign_delivery_record(campaign_delivery, record)
    timestamp = Time.zone.parse(record['date'])
    webhook_event = record['event']
    error_code = CampaignDelivery::UNDELIVERED_ERRORS.key(webhook_event)
    update_data = case webhook_event
                  when 'requests', 'sent'
                    { status: SENT, sent_at: timestamp }
                  when 'delivered'
                    { status: DELIVERED, delivered_at: timestamp }
                  when 'opened'
                    { status: OPENED, opened_at: timestamp }
                  when 'softBounces'
                    { status: SOFT_BOUNCED, bounced_at: timestamp, error_code: error_code}
                  when 'hardBounces'
                    { status: HARD_BOUNCED, bounced_at: timestamp, error_code: error_code}
                  when 'undelivered', 'blocked', 'deferred', 'loadedByProxy'
                    { status: webhook_event.underscore, updated_at: timestamp, error_code: error_code }
                  else
                    {}
                  end
    return unless update_data[:status].present?

    create_contact_common_events(update_data[:status], campaign_delivery, EMAIL)
    campaign_delivery.update(update_data)
  end
end
