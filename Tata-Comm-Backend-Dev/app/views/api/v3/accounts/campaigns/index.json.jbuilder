json.metrics @metrics
json.pagination @pagination_values
json.campaigns @campaigns do |resource|
  json.id resource.id
  json.title resource.title
  json.description resource.description
  json.account_id resource.account_id
  json.scheduling_type resource.scheduling_type&.titleize
  if resource.channel.present?
    json.inbox do
      json.id resource.channel&.inbox&.id
      json.avatar_url resource.channel&.inbox&.avatar_url
      json.channel_id resource&.channel_id
      json.name resource.channel&.inbox&.name
      json.channel_type resource&.channel_type
    end
  end
  json.message resource.message
  json.status translate("campaigns.status.#{resource&.status}")
  json.campaign_type resource.campaign_type
  if resource.campaign_type == 'one_off'
    json.scheduled_at resource.scheduled_at.to_i
    json.audience resource.audience
  end
  json.trigger_rules resource.trigger_rules
  json.trigger_only_during_business_hours resource.trigger_only_during_business_hours
  json.channel_id resource.channel_id
  json.channel_type resource.channel_type
  json.created_at resource.created_at.to_i
  json.updated_at resource.updated_at.to_i
end
