require 'benchmark'

class Segmentation::ReplaceUsersWorker < SidekiqBase
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
        @added_users = 0
        @removed_users = 0
        # updating processing status
        @import_file_segment.processing!
        existing_contacts = account.contacts.where('source_id &&  ARRAY[?]::integer[] AND creation_source = ?', [segment.id], segment.name)
        @removed_users = existing_contacts.size
        updated_contacts = existing_contacts.each { |obj| obj.source_id -= [segment.id] }
        updated_contacts.map(&:save) if existing_contacts.present?

        # Iterate through the CSV data to identify and store duplicates
        file = @import_file_segment&.import_file
        file_url = S3::GeneratePresignedUrl.generate_presigned_url(file, 7200) # expires in 2 hours
        sleep(3)

        csv = URI.parse(file_url).open { |f| CSV.parse(f, headers: true) }
        csv.each_slice(BATCH_SIZE) do |batch|
          batch.each do |row|
            contact_attribute = row.to_h.transform_keys { |key| key.parameterize(separator: '_') }
            contact = Segmentation::Support::CommonLib.find_contact(contact_attribute, account, import_user)
            if contact.present?
              contact_source_id = contact.source_id.is_a?(Array) ? contact.source_id << segment.id : contact.source_id.to_a << segment.id
              contact.update(source_id: contact_source_id, creation_source: segment.name)
              @added_users += 1
            else
              contact = account.contacts.new(contact_attribute.merge!(source_id: [segment.id], creation_source: segment.name,
                                                                      account_id: segment.account_id, 'phone_number' => "+#{contact_attribute['phone_number']}"))
              if contact.save
                @added_users += 1
              else
                invalid_records << row.to_h.merge(error_message: contact.errors.full_messages.to_sentence)
              end
            end
          rescue StandardError => e
            invalid_records << row.to_h.merge(error_message: e.message)
          end
        end
        @import_file_segment.update(total_users: csv.size, added_users: @added_users, invalid_users: invalid_records.size, removed_users: @removed_users,
                                   status: :completed)

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
