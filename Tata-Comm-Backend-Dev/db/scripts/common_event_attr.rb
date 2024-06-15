# must run common_event.rb script file before running this file
event_attrs = JSON.parse(File.read('./private/user_event/event_attr.json'))
CommonEventAttribute.destroy_all
event_attrs.each do |event_attr|
  event_id = CommonEvent.find_by(name: event_attr['event_name'])&.id
  return if event_id.blank?

  CommonEventAttribute.create!(name: event_attr['name'], display_name: event_attr['display_name'], category: 'Event Attributes',
                               common_event_id: event_id, values: event_attr['values'], data_types: event_attr['data_types'])
end
