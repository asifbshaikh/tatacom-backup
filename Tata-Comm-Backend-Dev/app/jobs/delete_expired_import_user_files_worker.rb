class DeleteExpiredImportUserFilesWorker
    include Sidekiq::Worker
  def perform
    thirty_days_ago = 30.days.ago
    expired_attachments = ActiveStorage::Attachment.where("created_at <= ?", thirty_days_ago)
                                                  .where(record_type: 'ImportUser')
    expired_attachments.each do |attachment|
      if attachment.blob[:filename].start_with?("failed_scenarios_")
        # delete the attachment
        attachment.purge
      end
    end
  end
end