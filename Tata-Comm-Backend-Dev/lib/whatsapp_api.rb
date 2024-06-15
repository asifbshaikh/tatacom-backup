require 'uri'
require 'net/http'
require 'json'
class WhatsappApi
  WHATSAPP_URL_BASE_LINK = ENV.fetch('WHATSAPP_URL_BASE_LINK', nil)

  def self.send_personalise_message_template_text(token, phone_number, template_name, personalise_data, options)
    options = JSON.parse(options)
    uri = URI.parse(WHATSAPP_URL_BASE_LINK)
    req = Net::HTTP::Post.new(uri)
    req.content_type = 'application/json'
    req['Authorization'] = token
    contact = set_contact(options)
    campaign = set_campaign(options)
    if campaign
      campaign_delivery = campaign.campaign_deliveries.create!(uuid: Random.uuid, account_id: campaign.account_id, contact_id: contact.id,
                                                               channel_type: campaign.channel_type, channel_id: campaign.channel_id)
    end
    from_phone_number = options['channel_phone_number']

    req.body = set_component_params(phone_number, template_name, personalise_data, contact, from_phone_number, campaign_delivery)

    req_options = {
      use_ssl: uri.scheme == 'https'
    }
    res = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(req)
    end
    delivery_response(campaign, contact, res.body, campaign_delivery) if campaign.present?
    res.body
  rescue StandardError => e
    Rails.logger.error e.message
  end

  def self.delete_inbox(channel)
    api_key = channel&.provider_config&.[]('api_key')
    phone_number = channel&.phone_number
    # Kept here since using only one time for delete.
    uri = URI("https://whatsapp-webhook.tatacommunicationsdigo.io/webhook/mapping/#{phone_number&.delete('+')}")
    req = Net::HTTP::Delete.new(uri)
    req.content_type = 'application/json'
    req['authorization'] = "Bearer #{api_key}"
    req['cache-control'] = 'no-cache'
    req_options = {
      use_ssl: uri.scheme == 'https'
    }
    Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(req)
    end
  end

  def self.set_component_params(phone_number, template_name, personalise_data, contact, from_phone_number, campaign_delivery)
    components = []
    if personalise_data.present? && personalise_data['media_attribute'].present?
      media_params = begin
        personalise_data['media_attribute']
      rescue StandardError
        {}
      end
      components << media_params
    elsif personalise_data.present? && personalise_data['flow_button'].present?
      flow_button_params = personalise_data['flow_button']
      components << flow_button_params
    end
    custom_params = personalise_data['custom_params']
    body_params = generate_component(custom_params, contact, campaign_delivery)
    components += body_params if body_params.count.positive?
    {
      'to' => phone_number,
      'from' => from_phone_number.delete('+'),
      'type' => 'template',
      'template' => {
        'name' => template_name.to_s,
        'language' => {
          'code' => 'en'
        },
        'components' => components
      }
    }.to_json
  end

  def self.generate_component(personalise_data, contact, campaign_delivery)
    type_data = []
    if personalise_data.present?
      personalise_data.each do |el|
        el = el.transform_keys(&:to_sym)
        type_data << generate_type(el, contact, campaign_delivery)
      end
    end
    type_data
  end

  def self.generate_type(arr, contact, campaign_delivery)
    if arr.key?(:type)
      type_json = {
        'type': (arr[:type]).to_s,
        'parameters': generate_type_params(arr, contact, campaign_delivery)
      }
    end
    type_json
  end

  def self.generate_type_params(arr, contact, campaign_delivery)
    if arr.key?(:parameters)
      params = []
      arr[:parameters].each_value do |el|
        text_data = (contact.read_attribute(el).presence || ' ')
        if VALID_URL_REGEXP.match?(text_data)
          tiny_url_api = TinyUrlApi.new.generate_tiny_url(text_data, nil)
          text_data = tiny_url_api['shorturl'] if tiny_url_api['statusCode'] == 200
          # considering every message will contain only one tiny url
          campaign_delivery.update(tiny_url: text_data) if campaign_delivery.present?
        end
        param_json = {
          'type': 'text',
          'text': text_data.to_s
        }
        params << param_json
      end
    end
    params
  end

  def self.delivery_response(campaign, contact, response_body, campaign_delivery)
    response_body = JSON.parse(response_body).with_indifferent_access
    return if response_body.blank?

    message_id = response_body.present? ? response_body[:id] : nil
    status = SENT

    if response_body[:error].present?
      message_id = "#{campaign&.id}-#{FAILED}-#{contact.id}-#{Time.zone.now.to_i}"
      error_code = response_body[:error][:code]
      status = SYSTEM_FAILURE
      bounced_at = Time.zone.now
    end

    campaign_delivery.update!(message_id:, status:, error_code:, sent_at: Time.zone.now, bounced_at:)
  end

  def self.set_contact(options)
    Contact.find_by(id: options['whatsapp_api_contact'], account_id: options['account_id'])
  end

  def self.set_campaign(options)
    Campaign.find_by(id: options['campaign_id'], account_id: options['account_id'])
  end
end
