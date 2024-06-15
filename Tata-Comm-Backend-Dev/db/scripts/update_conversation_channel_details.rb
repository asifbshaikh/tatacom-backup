Conversation.unscoped.all.each do |conversation|
  inbox = Inbox.unscoped.find_by(id: conversation.inbox_id)
  unless inbox&.channel.present?
    inbox = Inbox.find_by('inboxes.channel_type = ? AND inboxes.channel_id IS NOT NULL', inbox.channel_type)
  end
  if inbox&.channel.present?
    conversation.channel_type = inbox.channel_type
    conversation.channel_id = inbox.channel.id
    conversation.deleted_at = Time.now if inbox.deleted_at.present?
    conversation.save(validate: false)
  end
end