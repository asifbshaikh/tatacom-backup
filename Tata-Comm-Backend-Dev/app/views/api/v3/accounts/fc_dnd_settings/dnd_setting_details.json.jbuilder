if @dnd_setting.present?
  json.id @dnd_setting.id
  json.dnd_flag @dnd_setting.dnd_flag
  json.sender_id @dnd_setting.sender_id
  json.channel_type @dnd_setting.channel_type
  json.dnd_message @dnd_setting.dnd_message
  json.save_and_send_criteria @dnd_setting.save_and_send_criteria
  json.message_queue @dnd_setting.message_queue
  json.control_queue @dnd_setting.control_queue
  json.sms_gap_min @dnd_setting.sms_gap_min

  json.country_dnd_settings do
    if @dnd_setting.country_dnd_settings.present?
      json.array! @dnd_setting.country_dnd_settings do |country|
        json.country_name country.country_name
        json.week_days country.week_days
        json.start_time			country.start_time
        json.end_time   		country.end_time
        json.dnd_timezone country.dnd_timezone
      end
    else
      country_dnd_settings = ['India']
      json.array! country_dnd_settings do |country|
        json.country_name 'India'
        json.week_days ["Monday", "Tuesday"]
        json.start_time			Time.now
        json.end_time   		Time.now + 1.hour
        json.dnd_timezone Time.now.zone
      end
    end
  end
end
