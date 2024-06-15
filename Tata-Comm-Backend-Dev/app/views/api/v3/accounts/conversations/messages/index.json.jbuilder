json.meta do
  json.labels @conversation.label_list
  json.additional_attributes @conversation.additional_attributes
  json.contact @conversation.contact.push_event_data
  json.assignee @conversation.assignee.push_event_data if @conversation.assignee.present?
  json.agent_last_seen_at @conversation.agent_last_seen_at
  json.assignee_last_seen_at @conversation.assignee_last_seen_at
  json.is_conversation_channel_disabled @conversation.inbox.channel_id != @conversation.channel_id
end

json.payload do
  json.array! @messages do |message|
    json.partial! 'api/v1/models/message', message: message
  end
end
