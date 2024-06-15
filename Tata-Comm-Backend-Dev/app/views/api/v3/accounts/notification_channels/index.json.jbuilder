json.array! @notification_channels do |notification_channel|
  json.id notification_channel.id
  json.account_id notification_channel.account_id
  json.channel_name notification_channel.channel_name
  json.configuration notification_channel.configuration
  json.platform notification_channel.platform
  json.default_icon_file @default_icon_file


  json.notification_channel_secrete_files notification_channel.notification_channel_secrete_files do |secrete_file|
    json.id secrete_file.id
    json.device secrete_file.device
    json.file_extension secrete_file.file_extension
    json.file_name secrete_file.file_name
    json.file_type secrete_file.file_type
  end
end