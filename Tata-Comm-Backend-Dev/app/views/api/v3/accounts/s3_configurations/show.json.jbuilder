json.s3_configuration do
  json.id resource.id
  json.access_key resource.decrypted_access_key
  json.secret_key resource.decrypted_secret_key
  json.region resource.region
  json.folder_path resource.folder_path
  json.account_id resource.account_id
  json.created_at resource.created_at
  json.updated_at resource.updated_at
end
