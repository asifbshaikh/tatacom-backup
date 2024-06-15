class EmailCampaignSchedulerJob
  include Sidekiq::Worker
  queue_as :high

  def perform(campaign_id)
    campaign = Campaign.find(campaign_id)
    return unless campaign.present?
    segments_params = campaign.segment_attribute
    channel = campaign.channel || campaign&.inbox&.channel
    scheduler = campaign.campaign_scheduler
    CampaignSchedulerService.periodic_scheduling_check(scheduler)
    campaign_scheduler_update(scheduler) if scheduler.present? && scheduler.occurrences.present?
    scheduler.mark_process! if scheduler.may_mark_process?

    sender_details = Campaign::CampaignDetail.find_by(campaign_id: campaign_id)
    template_id = campaign.campaignable.email_template_id
    email_template = EmailTemplate.find_by_id(template_id)
    options = {subject: sender_details.subject, channel: channel.id, sender_name: sender_details.sender_name, from_email_address: sender_details.from_email_address, reply_to_email_address: sender_details.reply_to_email_address, htmlContent: email_template&.body, selected_contact_attribute: campaign&.selected_contact_attribute, account_id: campaign.account_id}.with_indifferent_access.to_json
    current_time = Time.now.utc
    all_contacts = CampaignSchedulerService.fetch_contacts_based_on_segment(campaign, segments_params, EMAIL_CAMPAIGN_SCOPE)
    batch_count = 0
    @fc_dnd_setting = FcDndSetting.find_by(channel_id: channel.id, channel_type: channel.class.name)
    transactional_campaign = campaign.campaignable.campaign_content_type == "transactional"
    all_contacts.find_in_batches(batch_size: BATCH_SIZE) do |contacts|
      contacts_grp_by_check = {}
      contacts_grp_by_check[:fc_dnd_passed] = contacts
      contacts_grp_by_check = FcDndCheck.filter_contact_list(contacts, campaign) if !transactional_campaign && @fc_dnd_setting && contacts.present?
      contacts_grp_by_check[:fc_dnd_passed].each do |contact|
        next unless contact
        schedule_date_time = CampaignSchedulerService.schedule_at_datetime(scheduler.start_date, current_time)
        SendCampaignMessageJob.perform_at(schedule_date_time, campaign.id, contact.id, nil, nil, nil, options)
      end

      if contacts_grp_by_check[:dnd_passed].present?
        contacts_grp_by_check[:dnd_passed].each do |contact|
          next unless contact
          countries_dnd_time = @fc_dnd_setting.map_countries_dnd_time
          schedule_time_after_dnd = countries_dnd_time[contact.country_name.to_sym][:schedule_time_after_dnd]
          schedule_date_time = CampaignSchedulerService.schedule_at_datetime(schedule_time_after_dnd, current_time)
          SendCampaignMessageJob.perform_at(schedule_date_time, campaign.id, contact.id, nil, nil, nil, options)
        end
      end

      batch_count += 1
      Rails.logger.info "EmailCampaignSchedulerJob: Batch of #{BATCH_SIZE}, with Batch no. #{batch_count} has been processed successfully for Campaign ID: #{campaign.id}"
    end

    if scheduler.schedule_type != PERIODIC
      scheduler.mark_success! if scheduler.may_mark_success?
    elsif (scheduler.occurrences.positive? && scheduler.occurrence_count >= scheduler.occurrences) || (scheduler.end_date.present? &&  Time.now.utc >= scheduler.end_date)
      scheduler.mark_success! if scheduler.may_mark_success?
      delete_cron_job(scheduler&.campaign_id)
    end
  rescue StandardError => e
    scheduler&.mark_failed! if scheduler.status == PROCESSING
    Rails.logger.info "EmailCampaignSchedulerJob #{e}"
  end

  def campaign_scheduler_update(campaign_scheduler)
    campaign_scheduler.occurrence_count += 1
    campaign_scheduler.save
  end

  def delete_cron_job(campaign)
    Sidekiq::Cron::Job.destroy("campaign-#{campaign}")
  end

end