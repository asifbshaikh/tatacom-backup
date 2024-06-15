class EventTriggerSchedulerJob
  include Sidekiq::Worker
  include CampaignSchedulable
  queue_as :high

  def perform(campaign_id, contact_id)
    @campaign = Campaign.find(campaign_id)
    @contact_id = contact_id
    if @campaign
      start_date = @campaign.campaign_scheduler.start_date
      end_date = @campaign.campaign_scheduler.end_date
      if start_date <= Time.now.utc
        campaign_processing
      else
        Rails.logger.info "***************************EventTriggerCampaign Id: #{campaign_id}, has been expired!"
      end
    end
  rescue StandardError => e
    Rails.logger.info "EventTriggerSchedulerJob #{e}"
    @campaign.campaign_scheduler&.mark_failed! if @campaign && (@campaign.status != FAILED && @campaign.campaign_scheduler.status != FAILED)
  end

end