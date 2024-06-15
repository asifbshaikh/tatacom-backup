json.s3_configurations do
  json.array! @s3_configs do |s3_config|
    json.id s3_config.id
    json.access_key s3_config.decrypted_access_key
    json.secret_key s3_config.decrypted_secret_key
    json.region s3_config.region
    json.folder_path s3_config.folder_path
    json.account_id s3_config.account_id
    json.created_at s3_config.created_at
    json.updated_at s3_config.updated_at
  end
end
