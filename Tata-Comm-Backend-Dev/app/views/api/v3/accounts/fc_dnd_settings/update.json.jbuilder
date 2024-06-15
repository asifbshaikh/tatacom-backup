json.message "FC DND Setting updated successfully"
json.fc_dnd_setting do
  json.id @setting.id
  json.account_id @setting.account_id
  json.inbox_id @setting.channel.inbox&.id
  json.fc_enabled @setting.fc_enabled
  json.dnd_enabled @setting.dnd_enabled
  json.channel_id @setting.channel_id
  json.channel_type @setting.channel_type
  json.max_message @setting.max_message
  json.no_of_days @setting.no_of_days
  json.refresh_timezone @setting.refresh_timezone
  json.allow_in_dnd_period @setting.allow_in_dnd_period
  json.save_and_send_criteria @setting.save_and_send_criteria
  json.message_queue @setting.message_queue
  json.control_queue @setting.control_queue
  json.control_queue_gap @setting.control_queue_gap

  if @setting.fc_dnd_setting_countries.present?
    json.fc_dnd_setting_countries @setting.fc_dnd_setting_countries do |country|
      json.country_code country.country_code
      json.week_days country.week_days
      json.start_time			country.start_time
      json.end_time   		country.end_time
      json.dnd_timezone country.dnd_timezone
      json.phone_code country.phone_code
    end
  end
end