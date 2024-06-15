campaigns = Campaign.running_campaigns.where('inbox_id IS NOT NULL AND channel_id IS NULL')
campaigns.find_in_batches(batch_size: 1000) do |campaigns|
  campaigns.each do |campaign|
    inbox = Inbox.unscoped.find_by(id: campaign.inbox_id)
    if inbox.present? && !inbox&.channel.present?
      inbox = Inbox.unscoped.find_by('inboxes.channel_type = ? AND inboxes.channel_id IS NOT NULL', inbox.channel_type)
    end
    if inbox&.channel.present?
      campaign.inbox_id = inbox.id
      campaign.channel_type = inbox.channel_type
      campaign.channel_id = inbox.channel.id
      campaign.save(validate: false)
    else
      campaign.status = 2 if campaign.status == 'scheduled'
      campaign.status = 3
      campaign.save(validate: false)
    end
  end
end