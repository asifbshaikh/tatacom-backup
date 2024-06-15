class Segmentation::ExportContactsWorker < SidekiqBase
  queue_as :high

  def perform(segment_filter_id, segment_id, file_headers, report_id, account_name)
    report = ContactReport.find(report_id)
    report.update(status: 1) # updating report status to in_process

    contact_ids = fetch_contact_ids(segment_filter_id, segment_id)
    file_headers = JSON.parse(file_headers.gsub('=>', ':')) if file_headers.present?
    contacts_data = Contact.export_segment_contacts(contact_ids, file_headers)
    new_file_headers = file_headers.values.flatten.map { |item| item == 'customer_id' ? 'Customer ID' : item.split('_').map(&:capitalize).join(' ') }
    csv_data = [new_file_headers] + contacts_data

    file_path = create_csv_file(report, csv_data, account_name)
    aws_s3 = S3::S3Service.set_aws_client
    key, file_presigned_url = S3::S3Service.upload_file_to_s3(report, aws_s3, file_path, account_name)

    FileUtils.rm(file_path) # remove the generated file from local
    report.update(status: 2, s3_file_url: file_presigned_url, object_key: key) # update report status to finished
    user = report.user
    ExportContactsMailer.send_exported_contacts_file_email(user.email, user.name, file_presigned_url).deliver_now
  rescue StandardError => e
    report.update(status: 3)
    Rails.logger.error(e.message)
  end

  private

  def create_csv_file(report, csv_data, account_name)
    dir = Rails.public_path.join("contacts_report/#{account_name}").to_s
    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    file_path = "#{dir}/#{report.file_name}.csv"
    File.write(file_path, csv_data.map(&:to_csv).join) # writing the generated file to local
    file_path
  end

  def fetch_contact_ids(segment_filter_id, segment_id)
    if segment_filter_id.present?
      segment_filter = SegmentFilter.find(segment_filter_id)
      segment_filter.segment_user_ids.pluck(:user_ids).flatten
    else
      Contact.where('source_id &&  ARRAY[?]::integer[]', [segment_id]).pluck(:id)
    end
  end
end
