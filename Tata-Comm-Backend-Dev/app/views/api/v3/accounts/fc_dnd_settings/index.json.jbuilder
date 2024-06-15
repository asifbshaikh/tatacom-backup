json.fc_dnd_settings @fc_dnd_settings do |setting|
  json.id setting.id
  json.account_id setting.account_id
  json.inbox_id setting.inbox_id
  json.fc_enabled setting.fc_enabled
  json.dnd_enabled setting.dnd_enabled
  json.channel_type setting.inbox&.channel_type
  json.max_message setting.max_message
  json.no_of_days setting.no_of_days
  json.refresh_timezone setting.refresh_timezone
  json.allow_in_dnd_period setting.allow_in_dnd_period
  json.save_and_send_criteria setting.save_and_send_criteria
  json.message_queue setting.message_queue
  json.control_queue @setting.control_queue
  json.control_queue_gap setting.control_queue_gap

  json.fc_dnd_setting_countries setting.fc_dnd_setting_countries
end
