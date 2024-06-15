class Segmentation::FilterQueryEmailWorker
  include Sidekiq::Worker
  sidekiq_options queue: :mailers, retry: 3
  queue_as :high

  def perform(email_ids, sf_id)
    loop do
      segment_filter = SegmentFilter.find(sf_id)
      unless segment_filter.status == STATUS_DRAFT
        send_emails(email_ids, segment_filter) if email_ids.present?
        break
      end
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def send_emails(email_ids, segment_filter)
    email_ids.each do |email_id|
      FilterQueryMailer.query_filter_rerun_success_email(email_id, segment_filter).deliver_now
    end
  end
end
