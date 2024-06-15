module FcDndCheck
  extend ActiveSupport::Concern

  def self.within_connector_limit?(campaign, contact)
    true
    # delivered_msg = 0
    # if fc_dnd_setting.save_and_send_criteria.eql?("send_across")
    #   delivered_msg =
    # end
    # delivered_msg.to_i >= 1
  end

  def self.within_dnd_period?(contact, campaign, countries_dnd_settings)
    return false if contact.country_name.nil? || countries_dnd_settings.keys.exclude?(contact.country_name.to_sym)
    time_zone = contact.timezone
    schedule_time = Time.now.in_time_zone(time_zone)
    schedule_day = schedule_time.strftime("%A")
    schedule_period = schedule_time.strftime("%H.%M").to_f
    dnd_start_time = countries_dnd_settings[contact.country_name.to_sym][:start_time].in_time_zone(time_zone).strftime("%H.%M").to_f
    dnd_end_time = countries_dnd_settings[contact.country_name.to_sym][:end_time].in_time_zone(time_zone).strftime("%H.%M").to_f
    week_days = countries_dnd_settings[contact.country_name.to_sym][:week_days]

    week_days.include?(schedule_day) && ((dnd_start_time..dnd_end_time).cover?(schedule_period))
  end

  def self.filter_contact_list(contacts, campaign)
    campaign_channel = campaign&.channel || campaign&.inbox&.channel
    fc_dnd_setting = FcDndSetting.find_by(channel_id: campaign_channel.id, channel_type: campaign_channel.class.name)
    fc_dnd_contacts = {:fc_dnd_passed => [], :fc_failed => [], :dnd_failed => [], :dnd_passed => []}
    fc_dnd_contacts[:fc_dnd_passed] = contacts
    return fc_dnd_contacts unless (fc_dnd_setting.fc_enabled? || fc_dnd_setting.dnd_enabled?)

    if fc_dnd_setting.fc_enabled?
      fc_dnd_contacts[:fc_dnd_passed] = []
      contacts.each do |contact|
        if FcDndCheck.within_fc_limit?(fc_dnd_setting, contact)
          fc_dnd_contacts[:fc_dnd_passed] << contact
        else
          fc_dnd_contacts[:fc_failed] << contact
          FcDndCheck.fail_delivery_response(contact, campaign, FC_REJECTION_CODE)
        end
      end
    end
    if fc_dnd_setting&.dnd_enabled? && fc_dnd_setting&.fc_dnd_setting_countries.present?
      countries_dnd_settings = fc_dnd_setting.map_countries_dnd_time
      contacts = fc_dnd_contacts[:fc_dnd_passed]
      fc_dnd_contacts[:fc_dnd_passed] = []
      contacts.each do |contact|
        if FcDndCheck.within_dnd_period?(contact, campaign, countries_dnd_settings)
          unless fc_dnd_setting&.allow_in_dnd_period?
            fc_dnd_contacts[:dnd_failed] << contact
            FcDndCheck.fail_delivery_response(contact, campaign, DND_REJECTION_CODE)
          else
            if within_connector_limit?(campaign, contact)
              fc_dnd_contacts[:dnd_passed] << contact
            else
              # WIP
            end
          end
        else
          fc_dnd_contacts[:fc_dnd_passed] << contact
        end
      end
    end
    fc_dnd_contacts
  end

  # Check if total messages in given days are more than LIMIT
  def self.within_fc_limit?(fc_setting, contact)
    limit = fc_setting.max_message
    no_of_days = fc_setting.no_of_days.to_i - 1
    current_time = Time.now.utc
    current_time = current_time.in_time_zone(contact.timezone) if fc_setting.user_timezone?
    number_of_messages_in_days = contact.campaign_deliveries.where('channel_id = ? and channel_type = ? and sent_at BETWEEN ? and ?', fc_setting.channel_id, fc_setting.channel_type, (current_time - no_of_days.to_i.days).beginning_of_day, current_time.end_of_day).count
  
    number_of_messages_in_days < limit
  end

  def self.fail_delivery_response(contact, campaign, err_code)
    CampaignDelivery.create(contact_id: contact.id, campaign_id: campaign.id, account_id: campaign.account.id, error_code: err_code, status: BOUNCED, bounced_at: Time.now)
  end
end