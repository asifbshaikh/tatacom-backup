class S3::S3Service
  def self.set_aws_client
    Aws::S3::Resource.new(
      region: ENV.fetch('AWS_REGION', nil),
      access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
      secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
    )
  end

  def self.upload_file_to_s3(report, aws_s3, file_path, account_name)
    complete_path = File.join("contacts_report/#{account_name}", report.file_name + "_#{report.id}.csv")
    obj = aws_s3.bucket(ENV.fetch('S3_BUCKET_NAME', nil)).object(complete_path)
    obj.upload_file(file_path, 'content_type': 'application/octet-stream')
    [obj.key, obj.presigned_url(:get)]
  end

  def self.db_import_file_upload(db_schedule, aws_s3, file_path)
    complete_path = "crm_cdp/#{db_schedule.account.name}/db/#{db_schedule.source_id}/#{db_schedule.import_type}/#{db_schedule.import_name}_#{Time.zone.today}.csv"
    obj = aws_s3.bucket(ENV.fetch('S3_BUCKET_NAME', nil)).object(complete_path)
    obj.upload_file(file_path, 'content_type': 'application/octet-stream')
    obj.key
  end

  def self.fetch_aws_object(object_key)
    Aws::S3::Object.new(ENV.fetch('S3_BUCKET_NAME', nil), object_key)
  end
end
