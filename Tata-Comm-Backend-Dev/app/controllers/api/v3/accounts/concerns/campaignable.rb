module Api::V3::Accounts::Concerns::Campaignable
  extend ActiveSupport::Concern
  include BasicTokenEncryptor
  include Api::V3::Accounts::Concerns::SegmentFilterQuery

  def update_draft_campaign_info
    if !params[:id].present?
      seg_attr = segments_params.to_h if params[:segment].present?
      @campaign = @campaignable.campaigns.build(campaign_params.merge(account_id: Current.account.id, segment_attribute: seg_attr, channel_type: CHANNEL_MAPPING["#{campaign_params[:channel_type]}"]))
      if @campaign.save && @campaignable
        @campaign_scheduler = create_campaign_scheduler if params[:campaign_scheduler].present?
        @campaign_details = create_campaign_details if params[:campaign_detail].present?
        @contact_event_filter = set_contact_event_filters(@campaign.id) if params[:included_filters].present?
        return @campaign, @campaignable, @campaign_scheduler, @campaign_details, @contact_event_filter
      else
        return render json: { errors: @campaign.errors.full_messages + @campaignable.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  def create_campaign_scheduler
    if campaign_scheduler_params.present?
      start_date = campaign_scheduler_params[:start_date].present? ? Time.zone.at(campaign_scheduler_params[:start_date]) : Time.zone.now
      end_date = Time.zone.at(campaign_scheduler_params[:end_date]) if campaign_scheduler_params[:end_date].present?
      merged_params = campaign_scheduler_params.merge(campaign_id: @campaign.id, campaign_type: @campaign.campaignable_type, start_date: start_date, end_date: end_date)
      scheduler = Current.account.campaign_schedulers.new(merged_params)
      scheduler.save!(validate:false)
      scheduler
    end
  end

  def create_campaign_details
    campaign_details = Current.account.campaign_details.new(campaign_details_params.merge(campaign_id: @campaign.id)) if campaign_details_params.present?
    campaign_details.skip_validations = true
    campaign_details.save!(validate:false)
    campaign_details
  end

  def campaign_update(campaign_id)
    @campaign = Current.account.campaigns.find_by(id: campaign_id)
    @campaignable, campaignable_params = find_campaignable_by_type(campaign_id)
    @campaign_scheduler = Current.account.campaign_schedulers.find_by(campaign_id: campaign_id)
    @campaign_details = Current.account.campaign_details.find_by(campaign_id: campaign_id)
    seg_attr = segments_params.to_h if params[:segment].present?
    @campaign.update!(campaign_params.merge(segment_attribute: seg_attr, channel_type: @campaign.channel_type))
    @campaignable.update!(campaignable_params)
    @contact_event_filter = set_contact_event_filters(@campaign.id) if params[:included_filters].present?

    if params[:campaign_scheduler].present? && @campaign_scheduler.present?
      start_date = Time.zone.at(campaign_scheduler_params[:start_date]) if campaign_scheduler_params[:start_date].present?
      end_date = Time.zone.at(campaign_scheduler_params[:end_date]) if campaign_scheduler_params[:end_date].present?
      campaign_time_zone = campaign_scheduler_params[:campaign_time_zone].split(' ')[1] if campaign_scheduler_params[:campaign_time_zone].present?
      @campaign_scheduler.update!(campaign_scheduler_params.merge(start_date: start_date, end_date: end_date, campaign_time_zone: campaign_time_zone))
    elsif params[:campaign_scheduler].present?
      @campaign_scheduler = create_campaign_scheduler
    end
    if params[:campaign_detail].present? && @campaign_details.present?
      @campaign_details.skip_validations = true
      @campaign_details.update!(campaign_details_params)
    elsif params[:campaign_detail].present?
      @campaign_details = create_campaign_details if params[:campaign_detail].present?
    end
    return @campaign, @campaignable, @campaign_scheduler, @campaign_details, @contact_event_filter
  end

  def find_campaignable_by_type(campaign_id)
    case @campaign.campaignable_type
    when 'Campaign::WhatsappCampaign'
      [Current.account.whatsapp_campaigns.find_by(id: @campaign.campaignable_id), whatsapp_campaign_params]
    when 'Campaign::EmailCampaign'
      [Current.account.email_campaigns.find_by(id: @campaign.campaignable_id), email_campaign_params]
    when 'Campaign::SmsCampaign'
      [Current.account.sms_campaigns.find_by(id: @campaign.campaignable_id), sms_campaign_params]
    end
  end

  def set_contact_event_filters(campaign_id)
    data = generate_raw_sql
    event_attr = set_contact_event_attr(data, campaign_id)
    contact_event_filter = Current.account.contact_event_filters.find_by(campaign_id: campaign_id)
    if contact_event_filter.present?
      contact_event_filter.update(event_attr)
    else
      contact_event_filter = Current.account.contact_event_filters.create(event_attr)
    end
    contact_event_filter
  end

  def set_filter_hash
    { included_filters: params[:included_filters] }
  end

  def set_contact_event_attr(data, campaign_id)
    {description: data[:query_sentence], sql_query: data[:raw_sql], filter_hash: set_filter_hash, executed_at: DateTime.now, account_id: Current.account.id, campaign_id: campaign_id, filter_type: USER_BEHAVIOR}
  end

end
