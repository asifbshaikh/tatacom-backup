class WhatsappCampaignSchedulerJob
  include Sidekiq::Worker
  queue_as :high

  def perform(campaign_id, channel, channel_phone_number)
    campaign = Campaign.find(campaign_id)
    return unless campaign.present?
    segments_params = campaign.segment_attribute
    # check occurence for periodic
    scheduler = campaign.campaign_scheduler
    CampaignSchedulerService.periodic_scheduling_check(scheduler)
    campaign_scheduler_update(scheduler) if scheduler.present? && scheduler.occurrences.present?
    scheduler.mark_process! if scheduler.may_mark_process?

    kong = channel["auth_key"] if channel
    template_name =  campaign.message
    personalise_data = begin
      campaign.personalise_mapping_attribute
    rescue StandardError
      {}
    end
    current_time = Time.now.utc
    all_contacts = CampaignSchedulerService.fetch_contacts_based_on_segment(campaign, segments_params, WHATSAPP_CAMPAIGN_SCOPE)
    batch_count = 0
    campaign_channel = campaign&.channel || campaign&.inbox&.channel
    @fc_dnd_setting = FcDndSetting.find_by(channel_id: campaign_channel.id, channel_type: campaign_channel.class.name)

    all_contacts.find_in_batches(batch_size: BATCH_SIZE) do |contacts|
      contacts_grp_by_check = {}
      contacts_grp_by_check[:fc_dnd_passed] = contacts
      contacts_grp_by_check = FcDndCheck.filter_contact_list(contacts, campaign) if @fc_dnd_setting && contacts.present?
      contacts_grp_by_check[:fc_dnd_passed].each do |contact|
        next unless contact
        schedule_date_time = CampaignSchedulerService.schedule_at_datetime(scheduler.start_date, current_time)
        SendCampaignMessageJob.perform_at(schedule_date_time, campaign.id, contact.id, nil, nil, personalise_data, nil)
      end

      if contacts_grp_by_check[:dnd_passed].present?
        contacts_grp_by_check[:dnd_passed].each do |contact|
          next unless contact
          countries_dnd_time = @fc_dnd_setting.map_countries_dnd_time
          schedule_time_after_dnd = countries_dnd_time[contact.country_name.to_sym][:schedule_time_after_dnd]
          schedule_date_time = CampaignSchedulerService.schedule_at_datetime(schedule_time_after_dnd, current_time)
          SendCampaignMessageJob.perform_at(schedule_date_time, campaign.id, contact.id, nil, nil, personalise_data, nil)
        end
      end

      batch_count += 1
      Rails.logger.info "WhatsappCampaignSchedulerJob: Batch of #{BATCH_SIZE}, with Batch no. #{batch_count} has been processed successfully for Campaign ID: #{campaign.id}"
    end

    if scheduler.schedule_type != PERIODIC
      scheduler.mark_success! if scheduler.may_mark_success?
    elsif (scheduler.occurrences.positive? && scheduler.occurrence_count >= scheduler.occurrences) || (scheduler.end_date.present? && Time.now.utc >= scheduler.end_date)
      scheduler.mark_success! if scheduler.may_mark_success?
      delete_cron_job(scheduler&.campaign_id)
    end
  rescue StandardError => e
    scheduler&.mark_failed! if campaign.campaign_scheduler.status == "processing"
    Rails.logger.error "Whatsapp Campaign Trigger Failed at #{Time.now} with errror: #{e}"
  end

  def fetch_phone_number(contact, campaign)
    phone_number = if Contact.column_names.include?("#{campaign&.selected_contact_attribute}")
                     contact.send(campaign&.selected_contact_attribute)
                   else
                     contact.custom_attributes[campaign&.selected_contact_attribute]
                   end
  end

  def campaign_scheduler_update(campaign_scheduler)
    campaign_scheduler.occurrence_count += 1
    campaign_scheduler.save
  end

  def delete_cron_job(campaign)
    Sidekiq::Cron::Job.destroy("campaign-#{campaign}")
  end
end
