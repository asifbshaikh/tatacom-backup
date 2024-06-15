json.pagination @pagination_values
json.result do
  json.array! @contact_events  do |contact_common_event|
    json.partial! 'api/v3/accounts/get_event_log.json.jbuilder', resource: contact_common_event
  end
end
