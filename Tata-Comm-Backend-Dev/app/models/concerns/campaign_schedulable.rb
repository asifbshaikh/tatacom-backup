module CampaignSchedulable
  extend ActiveSupport::Concern
  include Api::V3::Accounts::Concerns::PersonaliseMessage

  WEBHOOK_COMMON_EVENTS = {
    "#{WHATSAPP}": {
      "#{SENT}": WHATSAPP_SENT,
      "#{OPENED}": WHATSAPP_READ,
      "#{DELIVERED}": WHATSAPP_DELIVERED,
      "#{CLICKED}": WHATSAPP_CLICKED,
      "#{BOUNCED}": WHATSAPP_DELIVERY_FAILED
    },
    "#{SMS}": {
      "#{SENT}": SMS_SENT,
      "#{DELIVERED}": SMS_DELIVERED
    },
    "#{EMAIL}": {
      "#{BOUNCED}": EMAIL_BOUNCED, # Need to check
      "#{CLICKED}": EMAIL_CLICKED, # Need to check
      "#{COMPLAINED}": EMAIL_COMPLAINED, # Need to check
      "#{DROPPED}": EMAIL_DROPPED, # Need to check
      "#{OPENED}": EMAIL_OPENED,
      "#{SENT}": EMAIL_SENT,
      "#{SOFT_BOUNCED}": EMAIL_SOFT_BOUNCED,
      "#{UNSUBSCRIBE}": EMAIL_UNSUBSCRIBE, # Need to check
      "#{UNSUBSCRIBE_DROP}": EMAIL_UNSUBSCRIBE_DROP, # Need to check
      "#{VIEWED_IN_BROWSER}": EMAIL_VIEWED_IN_BROWSER, # Need to check
      "#{DELIVERED}": EMAIL_DELIVERED
    }
  }.with_indifferent_access.freeze

  def campaign_processing
    set_segment_params
    return if @campaign.completed? || @campaign.failed? || @campaign.cancelled?

    set_channel_for_processing
    set_campaign_duration
    email_campaign_processing if @campaign.campaignable_type == EMAIL_CAMPAIGN
    sms_campaign_processing if @campaign.campaignable_type == SMS_CAMPAIGN
    whatsapp_campaign_processing if @campaign.campaignable_type == WHATSAPP_CAMPAIGN
    CampaignSchedulerService.update_segment_data(@segments_params)
  end

  def email_campaign_processing
    sender_details = Campaign::CampaignDetail.find_by(campaign_id: @campaign.id)
    template_id = @campaign.campaignable.email_template_id
    email_template = EmailTemplate.find(template_id)
    contacts = get_event_filter_contacts(EMAIL_CAMPAIGN_SCOPE)
    options = { subject: sender_details.subject, channel: @channel.id, sender_name: sender_details.sender_name,
                from_email_address: sender_details.from_email_address, reply_to_email_address: sender_details.reply_to_email_address,
                htmlContent: email_template&.body, selected_contact_attribute: @campaign&.selected_contact_attribute, campaign_id: @campaign.id, account_id: @campaign.account_id }.with_indifferent_access.to_json
    if contacts.present?
      contact = contacts.find(@contact_id)
      if contact
        ContactEventTriggerJob.perform_at(@duration, options, contact.id)
      end
    else
      Rails.logger.info "***************************EventTriggerCampaign Id: #{@campaign.id}, contacts not found on trigger condition"
    end
  end

  def sms_campaign_processing
    contacts = get_event_filter_contacts(SMS_CAMPAIGN_SCOPE)
    is_template_customized = @campaign.template_customized
    if contacts.present?
      contact = contacts.find(@contact_id)
      options = {is_template_customized: is_template_customized, custom_message: fetch_custom_message(contact), account_id: @campaign.account.id, campaign_id: @campaign.id}.with_indifferent_access.to_json
      if contact
        ContactEventTriggerJob.perform_at(@duration, options, contact.id)
      end
    else
      Rails.logger.info "***************************EventTriggerCampaign Id: #{@campaign.id}, contacts not found on trigger condition"
    end
  end

  def fetch_custom_message(contact)
    custom_message = @campaign.message
    personalise_mapping_attribute = @campaign&.personalise_mapping_attribute
    if personalise_mapping_attribute.present?
      personalise_mapping_attribute = JSON.parse(personalise_mapping_attribute) if personalise_mapping_attribute.is_a?(String)
      custom_message = personlise_custom_messages(custom_message, contact,
                                                  personalise_mapping_attribute)
    end
    custom_message
  end

  def whatsapp_campaign_processing
    kong = @channel['provider_config']['auth_key'] if @channel
    template_name =  @campaign.message
    personalise_data = begin
      @campaign.personalise_mapping_attribute
    rescue StandardError
      {}
    end
    contacts = get_event_filter_contacts(WHATSAPP_CAMPAIGN_SCOPE)
    if contacts.present?
      contact = contacts.find(@contact_id)
      options = { whatsapp_api_contact: contact, campaign_id: @campaign.id, channel_phone_number: @channel.phone_number, kong: kong, template_name: template_name, personalise_data: personalise_data, account_id: @campaign.account_id}.with_indifferent_access.to_json
      if contact
        ContactEventTriggerJob.perform_at(@duration, options, contact.id)
      end
    else
      Rails.logger.info "***************************EventTriggerCampaign Id: #{@campaign.id}, contacts not found on trigger condition"
    end
  end

  def get_event_filter_contacts(scope_name)
    contacts = CampaignSchedulerService.fetch_contacts_based_on_segment(@campaign, @segments_params, scope_name)
    if @campaign.contact_event_filter.present?
      sc_ids = contacts.pluck(:id)
      raw_sql = @campaign.contact_event_filter.sql_query
      ec_ids = Segment.get_contact_ids(raw_sql)
      contact_ids = sc_ids & ec_ids # To get the common ids from both the arrays
      contacts = @campaign.contacts.where(id: contact_ids)
    end
    contacts
  end

  def create_contact_common_events(delivery_status, campaign_delivery, channel)
    common_event = set_common_event(delivery_status, channel)
    campaign = campaign_delivery.campaign
    message_id = campaign_delivery.message_id.present? ? campaign_delivery.message_id : campaign_delivery.uuid
    ContactCommonEvent.create(common_event_id: common_event.id, contact_id: campaign_delivery.contact_id, campaign_id: campaign.id, campaign_type: campaign.scheduling_type, campaign_name: campaign.title, campaign_channel: channel, message_id: message_id) if common_event.present?
  end

  def set_common_event(delivery_status, channel)
    delivery_status = WEBHOOK_COMMON_EVENTS[channel][delivery_status]
    CommonEvent.find_by(name: delivery_status)
  end

  private

  def set_segment_params
    @segments_params = @campaign.segment_attributes
  end

  def set_channel_for_processing
    @channel = @campaign.channel || @campaign.inbox&.channel
  end

  def set_campaign_duration
    @duration = (@campaign.campaign_scheduler.time_value * @campaign.campaign_scheduler.time_multiplier)
  end

end
