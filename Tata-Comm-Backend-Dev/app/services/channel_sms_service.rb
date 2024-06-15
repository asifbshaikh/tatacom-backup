class ChannelSmsService

  def self.send_sms_message(channel, contact, template = nil, message = nil, campaign = nil)
    webhook = webhook_url(channel.account_id)
    phone_number = fetch_phone_number(contact, campaign)
    message ||= template&.message
    uri = URI.parse(TATA_SMS_BASE_URL)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = uri.is_a?(URI::HTTPS)
    req = Net::HTTP::Post.new(uri.path, {
                                'Content-Type' => 'application/json',
                                'Authorization' => "#{channel&.decrypt_auth_token}"
                              })
    req.body = data_body(template, message, phone_number, channel.sender_id, webhook)
    smsc_request = https.request(req)

    Rails.logger.info("***SMS API Response************#{smsc_request.inspect}**********************")

    JSON.parse(smsc_request.body)
  rescue StandardError => e
    Rails.logger.info "ChannelSmsService:  #{e.message}"
  end

  def self.data_body(template, message, phone_number, sender_id, webhook)
    to_send = {
      "from": "#{sender_id}",
      "to": "#{phone_number}",
      "msg": "#{message}",
      "dlr": {
          "mask": 1,
          "url": webhook
      },
      "tlv": {
        "PE_ID": "#{template.pe_id}",
        "TEMPLATE_ID": "#{template.template_id}",
        "TELEMARKETER_ID": "#{template.telemarketer_id}"
      }
    }
    return to_send.to_json
  end

  def self.fetch_phone_number(contact, campaign)
    contact_attribute = campaign&.selected_contact_attribute || PHONE_NUMBER
    phone_number = if Contact.column_names.include?("#{contact_attribute}")
                     contact.send(contact_attribute)
                   else
                     contact.custom_attributes[contact_attribute]
                   end
  end

  def self.webhook_url(account_id)
    "#{API_BASE_URL}/#{account_id}/webhooks/sms"
  end
end
