class CampaignSchedulerService

  extend FcDndCheck
  extend CampaignSchedulable

  def self.schedule_campaign(campaign, scheduler_params)
    campaign_scope = case campaign.campaignable_type
    when SMS_CAMPAIGN
      SMS_CAMPAIGN_SCOPE
    when EMAIL_CAMPAIGN
      EMAIL_CAMPAIGN_SCOPE
    when WHATSAPP_CAMPAIGN
      WHATSAPP_CAMPAIGN_SCOPE
    end
    scheduler = CampaignScheduler.find_by(campaign_id: campaign.id)
    unless scheduler
      scheduler_params = time_zone_consideration(scheduler_params)
      scheduler = Current.account.campaign_schedulers.new(scheduler_params.merge!(campaign_id: campaign.id, campaign_type: campaign.campaignable_type))
    end
    if scheduler.save
      campaign.schedule! ## Change the campaign status to SCHEDULED
      run_campaign_based_on_schedule_type(campaign.id, campaign_scope)
    end
  end

  def self.run_campaign_based_on_schedule_type(campaign_id, campaign_scope)
    campaign = Campaign.find_by(id: campaign_id)
    case campaign.campaign_scheduler.schedule_type
    when AS_SOON_AS_POSSIBLE
      as_soon_as_possible_scheduling(campaign)
    when PERIODIC
      periodic_scheduling(campaign, campaign.campaign_scheduler)
    end
  end

  def self.as_soon_as_possible_scheduling(campaign)
    channel = campaign.channel || campaign&.inbox&.channel
    if channel.is_a?(Channel::TataSmsc)
      CampaignSchedulerJob.perform_async(campaign.id)
    elsif channel.is_a?(Channel::Whatsapp)
      WhatsappCampaignSchedulerJob.perform_async(campaign.id, channel&.provider_config, channel.phone_number)
    elsif channel.is_a?(Channel::Email)
      EmailCampaignSchedulerJob.perform_async(campaign.id)
    end
  end

  def self.periodic_scheduling(campaign, campaign_scheduler)
    channel = campaign.channel || campaign&.inbox&.channel
    if [Channel::TataSmsc, Channel::Whatsapp, Channel::Email].include?(channel.class)
      cron_expression = get_cron_expression(campaign_scheduler, campaign_scheduler.start_date)
      campaign_scheduler.update(cron_expression: cron_expression)
    end
  end

  def self.event_trigger_scheduling(campaign)
    EventTriggerSchedulerJob.perform_async(campaign.id)
  end

  def self.time_zone_consideration(scheduler_params)
    start_date = scheduler_params[:start_date].present? ? Time.zone.at(scheduler_params[:start_date]) : Time.zone.now
    end_date = Time.zone.at(scheduler_params[:end_date]) if scheduler_params[:end_date].present?
    scheduler_params.merge!(start_date: start_date, end_date: end_date)
  end

  def self.get_cron_expression(campaign_scheduler, schedule_time)
    repeat_on = campaign_scheduler.repeat_every.to_i
    min = schedule_time.min
    hour = schedule_time.hour
    cron_expression = nil
    if campaign_scheduler.scheduling_frequency == DAILY
      cron_expression = "#{min} #{hour} */#{repeat_on} * *"
    else
      cron_expression = generate_cron_expression_monthly_and_weekly(schedule_time, campaign_scheduler.repeat_on_day_of_week, campaign_scheduler.repeat_on_day_of_month, campaign_scheduler.repeat_every.to_i, campaign_scheduler.scheduling_frequency)
    end
    cron_expression
  end

  def self.generate_cron_expression_monthly_and_weekly(send_time, repeat_on_day_of_week, repeat_on_day_of_month, repeat_interval, scheduling_frequency)
    month = send_time.month
    min = send_time.min
    hour = send_time.hour
    cron_expression = nil
    if repeat_on_day_of_week.present?
      if scheduling_frequency == MONTHLY
        cron_expression = "#{min} #{hour} * */#{repeat_interval.to_i} *"
      else
        days_of_week = Date::DAYNAMES.map(&:downcase)
        week_days = repeat_on_day_of_week.map { |day| days_of_week.index(day.downcase) }.compact.join(",")
        cron_expression = "#{min} #{hour}  */#{repeat_interval.to_i * 7} * #{week_days}"
      end
    else
      cron_expression = "#{min} #{hour} */#{repeat_on_day_of_month.join(',')} */#{repeat_interval.to_i} *"
    end
    cron_expression
  end

  # to get contacts filtered on the basis of segment or query.
  def self.fetch_contacts_based_on_segment(campaign, segments_params, scope_name)
    if segments_params['segment_id'].present?
      segment = Segment.find(segments_params['segment_id'])
      return campaign.contacts.where(source_id: [segments_params['segment_id']]).send(scope_name) if segment.segment_type == FILE
      campaign.contacts.where(id: segment.segment_contact_ids).send(scope_name)
    else
      segment_filter = SegmentFilter.find(segments_params['segment_filter_id'])
      campaign.contacts.where(id: segment_filter.filter_contact_ids).send(scope_name)
    end
  end

  #To update the last_run_at column for segment
  def self.update_segment_data(segments_params)
    segment = Segment.find_by(id: segments_params['segment_id'])
    segment.touch(last_run_at: Time.now) if segment.present?
  end

  def self.delivery_response(campaign, response, contact, tiny_url = nil)
    message_id =  case campaign.campaignable_type
                  when EMAIL_CAMPAIGN
                    message_id = response["messageId"] ? response["messageId"] : nil
                  when SMS_CAMPAIGN, WHATSAPP_CAMPAIGN
                    message_id = response['id'] ? response['id'] : nil
                  end
    campaign_delivery = campaign.campaign_deliveries.create!(uuid: Random.uuid(), account_id: campaign.account_id, contact_id: contact.id, message_id: message_id, channel_type: campaign.channel_type, channel_id: campaign.channel_id, status: SENT, sent_at: Time.now, tiny_url: tiny_url)
    create_contact_common_events(SENT, campaign_delivery, SMS) if campaign.sms_campaign?
  rescue StandardError => e
    Rails.logger.info "Error in campaign Delivery: #{e}"
  end

  def self.schedule_at_datetime(start_time, start_date)
    hour = start_time.strftime("%H").to_i
    min = start_time.strftime("%M").to_i
    year = start_date.strftime("%Y").to_i
    month = start_date.strftime("%m").to_i
    date = start_date.strftime("%d").to_i
    schedule_date_time = DateTime.new(year, month, date, hour, min)
  end

  def self.periodic_scheduling_check(scheduler)
    if scheduler.repeat_every.present? && scheduler.updated_at >= scheduler.start_date
      return unless ((scheduler.scheduling_frequency == DAILY && (scheduler.updated_at.to_date == Time.now.utc.to_date - scheduler.repeat_every.day)) || (scheduler.repeat_on_day_of_week.present? && (scheduler.updated_at.to_date == Time.now.utc.to_date - scheduler.repeat_every.week)) || (scheduler.repeat_on_day_of_month.present? && (scheduler.updated_at.to_date == Time.now.utc.to_date - scheduler.repeat_every.month)))
    end
  end

end
