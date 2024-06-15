events_attr = JSON.parse(File.read('./private/user_event/common_user_event_and_attr.json'))
common_event = CommonEvent.create!(name: "EMAIL_DELIVERED", displayed_name: "Email Delivered", category: "Campaign Activity")
return if common_event.blank?
events_attr.each do |event_attr|
  CommonEventAttribute.create!(name: event_attr['name'], display_name: event_attr['display_name'], category: 'Event Attributes',
                               common_event_id: common_event.id, values: event_attr['values'], data_types: event_attr['data_types'])
end