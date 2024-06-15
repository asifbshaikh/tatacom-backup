class ProcessQueueItemsJob
  include Sidekiq::Worker
  queue_as :high

  def perform
    Rails.logger.info "*************************** Process Queue Items"
    queue_items = ::QueueItem.where(pending: true)

    queue_items.each do |queue_item|
      content = JSON.parse(queue_item.contents)
      if content['campaign_ids'].present?
        Rails.logger.info "***************************EventTriggerCampaign Ids: #{content['campaign_ids']}"
        content['campaign_ids'].each {|campaign_id| EventTriggerSchedulerJob.perform_async(campaign_id, content['contact_id'])}
      end
      queue_item.update({pending: false})
    end

    CampaignScheduler.where(end_date: (Time.now.utc - 10.minute)..(Time.now.utc), schedule_type: EVENT_TRIGGER, status: PROCESSING).each do |campaign_scheduler|
      campaign_scheduler.mark_success! if campaign_scheduler.may_mark_success?
    end
  end
end