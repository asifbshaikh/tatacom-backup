class SchedulerJob
  include Sidekiq::Worker
  queue_as :default

  def perform(*args)
    campaign_scheduler_jobs = CampaignScheduler.periodic_scheduler_records
    Rails.logger.info "#{campaign_scheduler_jobs.count} - Available Jobs count"
    Rails.logger.info "No Jobs found to schedule at #{Time.now}" if campaign_scheduler_jobs.count.zero?

    campaign_scheduler_jobs.each do |scheduler|
      case scheduler&.send_campaign_time
      when CampaignScheduler::FIXED_TIME
        fixed_time_schedule(scheduler)
      when CampaignScheduler::IN_USER_TIME_ZONE
        send_user_time_zone_schedule(scheduler)
      when CampaignScheduler::USER_BEST_TIME_ZONE
        best_time_for_user(scheduler)
      end
    end
  end

  def fixed_time_schedule(scheduler)
    #To fetch campaign for adding condition on worker's call
    campaign = scheduler.campaign
    channel = fetch_channel(scheduler, campaign)
    personalise_mapping_attribute = campaign&.personalise_mapping_attribute
    segments_params = campaign&.segment_attribute
    cron_expression = scheduler.cron_expression
    base_url = scheduler.base_url
    job = Sidekiq::Cron::Job.find("campaign-#{scheduler.campaign_id}")
    unless job.present?
      if scheduler.whatsapp_campaign?
        WhatsappCampaignSchedulerJob.perform_async(scheduler&.campaign_id, channel&.provider_config, channel&.phone_number)
        Sidekiq::Cron::Job.create(name: "campaign-#{scheduler&.campaign_id}", cron: "#{cron_expression}", class: 'WhatsappCampaignSchedulerJob', args: [scheduler&.campaign_id, channel&.provider_config, channel&.phone_number])
      elsif scheduler.sms_campaign?
        CampaignSchedulerJob.perform_async(scheduler&.campaign_id)
        Sidekiq::Cron::Job.create(name: "campaign-#{scheduler&.campaign_id}", cron: "#{cron_expression}", class: 'CampaignSchedulerJob', args: [scheduler&.campaign_id])
      elsif scheduler.email_campaign?
        EmailCampaignSchedulerJob.perform_async(scheduler&.campaign_id)
        Sidekiq::Cron::Job.create(name: "campaign-#{scheduler&.campaign_id}", cron: "#{cron_expression}", class: 'EmailCampaignSchedulerJob', args: [scheduler&.campaign_id])
      end
    end
  end

  def send_user_time_zone_schedule(scheduler)
    fixed_time_schedule(scheduler) if scheduler.send_if_user_timezone_expired?
  end

  def best_time_for_user(scheduler)
    fixed_time_schedule(scheduler) if scheduler.on_best_time?
    fixed_time_schedule(scheduler) if scheduler.alternate_timezone.present? && scheduler.alternate_timezone.eql?("at_start_time")
  end

  def fetch_channel(scheduler, campaign)
    channel = campaign.channel || campaign&.inbox&.channel
  end

end