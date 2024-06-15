class S3::GeneratePresignedUrl
  def self.generate_presigned_url(file, expires_in)
    return Rails.application.routes.url_helpers.url_for(file) if ENV.fetch('ACTIVE_STORAGE_SERVICE', 'local') == 'local'

    s3 = S3::S3Service.set_aws_client
    s3.bucket(ENV.fetch('S3_BUCKET_NAME', nil)).object(file&.key).presigned_url(:get, expires_in: expires_in)
  end
end
