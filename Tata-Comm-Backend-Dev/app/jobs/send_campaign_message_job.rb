class SendCampaignMessageJob
  include Sidekiq::Worker
  include CommanSharedMethods
  queue_as :high

  def perform(campaign_id, contact_id, template_id, message, personalise_data, options)
    campaign = Campaign.find_by(id: campaign_id)
    contact = Contact.find_by(id: contact_id)
    return unless campaign.present? && contact.present?

    scheduler = campaign.campaign_scheduler
    campaign_channel = campaign.channel || campaign&.inbox&.channel
    channel = scheduler.whatsapp_campaign? ? campaign_channel&.provider_config : campaign_channel
    template = campaign.account.templates.find(template_id) if template_id

    if scheduler.whatsapp_campaign?
      channel_phone_number = campaign_channel&.phone_number
      template = campaign.message
      kong = channel["auth_key"] if channel
    end

    if scheduler.sms_campaign?
      response = generate_tiny_url(campaign, message)
      sms_response = ChannelSmsService.send_sms_message(channel, contact, template, response[:message], campaign)
      CampaignSchedulerService.delivery_response(campaign, sms_response, contact, response["tiny_url"])
    elsif scheduler.whatsapp_campaign?
      phone_number = fetch_phone_number(contact,campaign)
      options = { whatsapp_api_contact: contact.id, campaign_id: campaign.id, channel_phone_number: channel_phone_number, account_id: campaign.account_id }.with_indifferent_access.to_json
      WhatsappApi.send_personalise_message_template_text(kong, phone_number, template, personalise_data, options)
    elsif scheduler.email_campaign?
      api_response = CampaignScheduler.send_emails_to_users(options, contact.id)
      CampaignSchedulerService.delivery_response(campaign, api_response, contact)
    end
  rescue StandardError => e
    Rails.logger.info "SendCampaignMessageJob: #{e}"
  end

  def fetch_phone_number(contact, campaign)
    phone_number = if Contact.column_names.include?("#{campaign&.selected_contact_attribute}")
                     contact.send(campaign&.selected_contact_attribute)
                   else
                     contact.custom_attributes[campaign&.selected_contact_attribute]
                   end
  end

  def delete_cron_job(campaign)
    Sidekiq::Cron::Job.destroy("campaign-#{campaign}")
  end

end