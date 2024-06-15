class ContactEventTriggerJob
  include Sidekiq::Worker
  include CampaignSchedulable
  include CommanSharedMethods

  queue_as :high

  def perform(hash_options, contact)
    options = JSON.parse(hash_options)
    contact = Contact.find_by(id: contact, account_id: options['account_id'])
    campaign = Campaign.find(options['campaign_id'])
    channel = campaign.channel || campaign&.inbox&.channel
    if campaign.campaignable_type == EMAIL_CAMPAIGN
      api_response = CampaignScheduler.send_emails_to_users(options.to_json, contact)
      CampaignSchedulerService.delivery_response(campaign, api_response, contact)
    elsif campaign.campaignable_type == SMS_CAMPAIGN
      template = Template.find(campaign.campaignable.template_record_id)
      response = generate_tiny_url(campaign, options['custom_message'])
      api_response = ChannelSmsService.send_sms_message(channel, contact, template, response["message"], campaign)
      CampaignSchedulerService.delivery_response(campaign, api_response, contact, response["tiny_url"])
    elsif campaign.campaignable_type == WHATSAPP_CAMPAIGN
      options["whatsapp_api_contact"] = contact.id
      WhatsappApi.send_personalise_message_template_text(options['kong'], contact&.phone_number, options['template_name'], options['personalise_data'], options.to_json)
    end
  rescue StandardError => e
    Rails.logger.info "ContactEventTriggerJob #{e}"
  end

end