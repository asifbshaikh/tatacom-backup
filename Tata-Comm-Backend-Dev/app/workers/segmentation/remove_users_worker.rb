require 'benchmark'

class Segmentation::RemoveUsersWorker < SidekiqBase
  queue_as :high

  Benchmark.bmbm do |obj|
    obj.report('RemoveUserWorker runtime') do
      def perform(import_file_segment_id, account_id)
        account = Account.find(account_id)
        @import_file_segment = ImportFileSegment.find(import_file_segment_id)
        segment = @import_file_segment.segment
        import_user = account.import_users.find_by(custom_segment_id: segment.id)
        return if @import_file_segment.completed? || @import_file_segment.failed?

        invalid_records = []

        @removed_users = 0
        # updating processing status
        @import_file_segment.processing!

        # Iterate through the CSV data to identify and store duplicates
        file = @import_file_segment&.import_file
        file_url = S3::GeneratePresignedUrl.generate_presigned_url(file, 7200) # expires in 2 hours
        sleep(3)

        csv = URI.parse(file_url).open { |f| CSV.parse(f, headers: true) }
        csv.each_slice(BATCH_SIZE) do |batch|
          contacts = Segmentation::Support::CommonLib.search_contacts(batch, account, import_user, segment.id)
          @removed_users += contacts.size
          updated_contacts = contacts.each { |obj| obj.source_id -= [segment.id] }
          updated_contacts.map(&:save)
        end
        @import_file_segment.update(total_users: csv.size, removed_users: @removed_users, status: :completed)
        invalid_csv_data = invalid_records_csv(invalid_records)
        Segmentation::Support::CommonLib.sent_emails(@import_file_segment, invalid_csv_data)
      rescue StandardError => e
        @import_file_segment.update(total_users: 0, invalid_users: 0, status: :failed)
        Segmentation::Support::CommonLib.sent_emails(@import_file_segment, "ERROR => #{e.message}")
        Rails.logger.error(e.message)
      end
    end
  end

  private

  def invalid_records_csv(records)
    CSV.generate(headers: true) do |csv|
      csv << records.map(&:keys).flatten
      records.each do |row|
        csv << row.values
      end
    end
  end
end
