  json.id @notification_channel.id
  json.account_id @notification_channel.account_id
  json.channel_name @notification_channel.channel_name
  json.configuration @notification_channel.configuration
  json.platform @notification_channel.platform

  json.notification_channel_secrete_files  @notification_channel_secrete_files do |secrete_file|
    json.file_extension secrete_file.file_extension
    json.file_name secrete_file.file_name
    json.secret_file_password secrete_file.secret_file_password
  end
  json.default_icon_file @default_icon_file
