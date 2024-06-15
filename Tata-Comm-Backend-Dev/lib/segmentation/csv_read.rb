class Segmentation::CsvRead
  def initialize(segment_id, edit_type, file, emails)
    @segment = Segment.find(segment_id)
    @edit_type = edit_type
    @file = file
    @emails = emails
  end

  def execute_action
    hashh = {}
    final_batch_size = 0

    File.open(@file) do |file|
      headers = file.first
      file.each_slice(BATCH_SIZE) do |lines|
        CSV.parse(lines.join, headers: headers) do |row|
          hashh[row.to_h.keys.first] = hashh[row.to_h.keys.first].present? ? hashh[row.to_h.keys.first] + row.to_h.values : row.to_h.values
        end

        final_batch_size += lines.size
        email_trigger = (csv_total_rows == final_batch_size)
        search_query(hashh, email_trigger)
      end
    end
    { message: "#{csv_total_rows} records is being uploading we will notify when it will done!" }
  rescue StandardError => e
    Rails.logger.error(e.message)
    { message: e.message }
  end

  def search_query(hashh, email_trigger)
    case @edit_type
    when 'add_users'
      Segmentation::AddUsersWorker.perform_async(@segment.id, hashh.to_json, email_trigger, @emails)
    when 'remove_users'
      Segmentation::RemoveUsersWorker.perform_async(@segment.id, hashh.to_json, email_trigger, @emails.to_json)
    end
  end

  def csv_total_rows
    (CSV.read(@file).length - 1)
  end
end
