module Api::V3::Accounts::CampaignsHelper

  def utc_to_local(timestamp, time_format, campaign)
    time_zone = campaign&.campaign_scheduler&.campaign_time_zone.present? ? campaign&.campaign_scheduler&.campaign_time_zone : DEFAULT_TIMEZONE
    time_zone = ActiveSupport::TimeZone.new(time_zone)
    time_zone.utc_to_local(Time.zone.at(timestamp.to_i)).strftime(TIME_FORMAT) if time_zone.present? && timestamp.present?
  end

  def campaign_attributes(serial_number, campaign)
    campaign_status = campaign.status.eql?(PROCESSING) ? ACTIVE : campaign.status.titleize
    scheduling_type = campaign.scheduling_type.titleize if campaign.scheduling_type.present?
    [
      serial_number,
      campaign.title,
      utc_to_local(campaign.created_at, TIME_FORMAT, campaign),
      utc_to_local(campaign.updated_at, TIME_FORMAT, campaign),
      campaign.campaign_type,
      scheduling_type,
      utc_to_local(campaign.campaign_scheduler&.start_date, TIME_FORMAT, campaign),
      campaign_status
    ]
  end
end
