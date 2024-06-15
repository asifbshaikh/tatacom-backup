return json.message "No event logged" unless resource.present? 

json.contact_id resource.contact_id
json.unique_user_id resource.unique_user_id
json.event_time resource.created_at.strftime('%d %b %Y, %I:%M %p')
json.event_name resource.common_event.name
json.event_attributes do
  json.app_version resource.app_version
  json.sdk_version resource.sdk_version
  json.platform resource.platform
  json.created_at resource.created_at.strftime('%d %b %Y, %I:%M %p')
  json.category resource.common_event.category
  json.source resource.common_event.source
  json.logged_in_status resource&.contact_device_detail&.logged_in_status
end
