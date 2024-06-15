class FixTimeSchedulerJob
  include Sidekiq::Worker
  queue_as :default

  def perform(*args)
    campaign_scheduler_jobs = CampaignScheduler.at_specific_time_scheduler_records
    Rails.logger.info "#{campaign_scheduler_jobs.count} - Available Jobs count"
    Rails.logger.info "No Jobs found to schedule at #{Time.now}" if campaign_scheduler_jobs.count.zero?

    campaign_scheduler_jobs.each do |scheduler|
      campaign = scheduler.campaign
      campaign.campaign_scheduler.mark_process! if campaign.campaign_scheduler.may_mark_process?
      return if campaign.campaign_scheduler.event_triggered?
      channel = campaign.channel || campaign&.inbox&.channel
      if scheduler.whatsapp_campaign?
        WhatsappCampaignSchedulerJob.perform_async(scheduler&.campaign_id, channel&.provider_config, channel&.phone_number)
      elsif scheduler.sms_campaign?
        CampaignSchedulerJob.perform_async(scheduler&.campaign_id)
      elsif scheduler.email_campaign?
        EmailCampaignSchedulerJob.perform_async(scheduler&.campaign_id)
      end
    end
  end

end
