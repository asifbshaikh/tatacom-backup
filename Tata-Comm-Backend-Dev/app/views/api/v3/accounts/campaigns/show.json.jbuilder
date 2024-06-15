json.campaign do
  json.id @campaign.id
  json.title @campaign.title
  json.display_id @campaign.display_id
  json.description @campaign.description
  json.account_id @campaign.account_id
  json.sender_id @campaign.sender_id
  json.enabled @campaign.enabled
  json.campaign_status @campaign.campaign_status
  json.scheduling_type @campaign.scheduling_type
  json.campaignable_id @campaign.campaignable_id
  json.campaignable_type @campaign.campaignable_type
  json.total_order_value @campaign.total_order_value
  json.number_of_conversion_events @campaign.number_of_conversion_events
  json.number_of_unique_conversions @campaign.number_of_unique_conversions
  json.exclude_users @campaign.exclude_users
  json.select_audience @campaign.select_audience
  json.send_campaign_to_the_opted_out_users @campaign.send_campaign_to_the_opted_out_users
  json.status @campaign.status
  json.personalise_mapping_attribute @campaign.personalise_mapping_attribute
  json.status @campaign.status
  json.segment_attribute @campaign.segment_attribute
  if @campaign.segment_attributes.present?
    json.segment_filter_description SegmentFilter.find_by_id(@campaign.segment_attribute["segment_filter_id"]).try(:description)
    json.segment_data @campaign.segment_data
  end
  json.selected_contact_attribute @campaign.selected_contact_attribute
  json.inbox_id @campaign.inbox_id
  json.campaign_state @campaign.campaign_state
  if @campaign.channel.present?
    json.channel_info @campaign&.channel if @campaign&.channel.present?
    if @campaign.channel.inbox.present?
      json.inbox do
        json.id @campaign.channel.inbox.id
        json.avatar_url @campaign.channel.inbox.avatar_url
        json.channel_id @campaign.channel.inbox.channel_id
        json.name @campaign.channel.inbox.channel_id
        json.channel_type @campaign.channel.inbox.channel_type
      end
    end
  end
  json.channel_info @channel if @channel.present? && @campaign.channel.inbox.blank?
  if @channel.present? && @channel.inbox.present? && @campaign.channel.inbox.blank?
    json.inbox @channel.inbox do
      json.id @channel.inbox.id
      json.avatar_url @channel.inbox.avatar_url
      json.channel_id @channel.inbox.channel_id
      json.name @channel.channel_name
      json.channel_type @channel.inbox.channel_type
    end
  end
  json.message @campaign.message
  json.status translate("campaigns.status.#{@campaign.status}")
  json.campaign_type @campaign.campaign_type
  if @campaign.campaign_type == 'one_off'
    json.scheduled_at @campaign.scheduled_at.to_i
    json.audience @campaign.audience
  end
  json.trigger_rules @campaign.trigger_rules
  json.trigger_only_during_business_hours @campaign.trigger_only_during_business_hours
  json.created_at @campaign.created_at.to_i
  json.updated_at @campaign.updated_at.to_i
  json.campaign_analytics @campaign.get_analytics
  json.campaignable  @campaign.campaignable
  json.campaign_goals  @campaign.campaign_goals
  json.campaign_details  @campaign&.campaign_details
  json.goal_events @campaign.campaign_goals.joins(:goal_events) if @campaign.campaign_goals.present?
  json.campaign_scheduler @campaign.campaign_scheduler
  json.contact_event_filter @contact_event_filter
end
