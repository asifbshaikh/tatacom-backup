module Api::V3::Accounts::Concerns::ChannelEmailSchedulerService
  extend ActiveSupport::Concern
  include BasicTokenEncryptor

  #For campaign creation flow
  def send_emails_to_users(options, contact)
    options = JSON.parse(options)
    call_email_connector(options, contact)
  rescue StandardError => e
    Rails.logger.info "EMAILJOBFailed #{e}"
  end

  #This method used for test-campaign
  def send_emails(options)
    options = JSON.parse(options)
    options["contact_ids"].each do |contact|
      call_email_connector(options, contact)
    end
  rescue StandardError => e
    Rails.logger.info "EMAILJOBFailed #{e}"
  end

  def call_email_connector(options, contact)
    set_channel(options)
    uri = URI.parse(@channel.email_api_url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true

    req = Net::HTTP::Post.new(uri.path, {
                                'Content-Type' => 'application/json',
                                'api-key' => @channel.email_api_key
                              })
    req.body = test_email_campaign_body(options, contact)
    response = https.request(req)
    JSON.parse(response.body)
  #TODO: Commenting rescue part as it is returning true so not able to fetch messageid for creating campaign_delivery record for email
  #   Rails.logger.info "Checking Email services #{email_request}"
  # rescue StandardError => e
  #   Rails.logger.info "EMAILJOBFailed #{e}"
  end

  def test_email_campaign_body(options, contact)
    set_contact(options, contact)
    email = fetch_contact_using_user_attributes(options["selected_contact_attribute"])
    to_send =  {
      "sender": {
        "name": options["sender_name"],
        "email": options["from_email_address"]
      },
      "to": [
        {
          "email": email, #contact.email,
          "name": @contact.name
        }
      ],
      "subject": options["subject"],
      "htmlContent": options["htmlContent"]
    }
    return to_send.to_json
  end

  def fetch_contact_using_user_attributes(selected_contact_attribute)
    if Contact.column_names.include?("#{selected_contact_attribute}")
      contact_attribute = @contact.send(selected_contact_attribute)
    else
      contact_attribute = @contact.custom_attributes[selected_contact_attribute]
    end
  end

  def set_channel(options)
    @channel = Channel::Email.find_by(id: options["channel"], account_id: options["account_id"])
  end

  def set_contact(options, contact)
    @contact = Contact.find_by(id: contact, account_id: options["account_id"])
  end
end
