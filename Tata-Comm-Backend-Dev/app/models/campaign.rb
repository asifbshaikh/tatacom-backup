# == Schema Information
#
# Table name: campaigns
#
#  id                                   :bigint           not null, primary key
#  audience                             :jsonb
#  campaign_state                       :integer
#  campaign_status                      :integer          default(0), not null
#  campaign_type                        :integer          default("ongoing"), not null
#  campaignable_type                    :string
#  channel_type                         :string
#  description                          :text
#  enabled                              :boolean          default(TRUE)
#  exclude_users                        :boolean
#  message                              :text
#  number_of_conversion_events          :integer
#  number_of_unique_conversions         :integer
#  personalise_mapping_attribute        :jsonb
#  scheduled_at                         :datetime
#  scheduling_type                      :integer
#  segment_attribute                    :jsonb
#  select_audience                      :string
#  selected_contact_attribute           :string
#  send_campaign_to_the_opted_out_users :boolean
#  status                               :integer          default("draft")
#  template_customized                  :boolean
#  title                                :string
#  total_order_value                    :decimal(, )
#  trigger_only_during_business_hours   :boolean          default(FALSE)
#  trigger_rules                        :jsonb
#  created_at                           :datetime         not null
#  updated_at                           :datetime         not null
#  account_id                           :bigint           not null
#  campaignable_id                      :bigint
#  channel_id                           :integer
#  display_id                           :integer          not null
#  inbox_id                             :bigint
#  sender_id                            :integer
#
# Indexes
#
#  index_campaigns_on_account_id                             (account_id)
#  index_campaigns_on_campaign_status                        (campaign_status)
#  index_campaigns_on_campaign_type                          (campaign_type)
#  index_campaigns_on_campaignable_id_and_campaignable_type  (campaignable_id,campaignable_type)
#  index_campaigns_on_inbox_id                               (inbox_id)
#  index_campaigns_on_scheduled_at                           (scheduled_at)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id) ON DELETE => cascade
#  fk_rails_...  (inbox_id => inboxes.id) ON DELETE => cascade
#
require 'uri'
class Campaign < ApplicationRecord

  validates :title, presence: true, uniqueness: { scope: :account_id }
  validate :message, if: :sms_campaign?
  validate :validate_campaign_inbox
  validate :validate_url
  #validate :prevent_completed_campaign_from_update, on: :update
  belongs_to :account, optional: true
  belongs_to :inbox, optional: true
  belongs_to :channel, optional: true
  belongs_to :sender, class_name: 'User', optional: true
  belongs_to :campaignable, polymorphic: true, optional: true
  belongs_to :channel, optional: true, polymorphic: true

  enum campaign_type: { ongoing: 0, one_off: 1}
  # TODO : enabled attribute is unneccessary . lets move that to the campaign status with additional statuses like draft, disabled etc.
  enum scheduling_type: { one_time: 0, periodic: 1, event_trigger: 2, location_trigger: 3, api_trigger: 4, device_trigger: 5 }
  enum campaign_state: { select_channel: 0, campaign_type: 1, target_audience: 2, content_configuration: 3, schedule_and_goal: 4 }

  has_many :conversations, dependent: :nullify, autosave: true
  has_many :campaign_tags, dependent: :destroy_async
  has_many :group_tags, through: :campaign_tags
  has_many :campaign_goals
  has_many :campaign_deliveries, dependent: :destroy_async
  has_many :campaign_details, dependent: :destroy_async, class_name: '::Campaign::CampaignDetail'
  has_many :campaign_devices, dependent: :destroy_async
  has_many :devices, through: :campaign_devices
  has_one :campaign_scheduler, dependent: :destroy
  has_one :campaign_sync, dependent: :destroy_async
  has_one :contact_event_filter, dependent: :destroy
  has_one :campaign_global_control_group, dependent: :destroy_async
  has_one :global_control_group, through: :campaign_global_control_group
  has_many :contacts, through: :account
  accepts_nested_attributes_for :campaign_global_control_group

  before_validation :ensure_correct_campaign_attributes
  before_validation :set_global_control_group_id, on: :create

  after_commit :set_display_id, unless: :display_id?

  attribute :total_order_value, :decimal, default: 0
  attribute :number_of_conversion_events, :integer, default: 0
  attribute :number_of_unique_conversions, :integer, default: 0

  MAX_CONTACT_COUNT = 5
  SUPPORTED_CAMPAIGNS_TYPES = {email: EMAIL_CAMPAIGN, sms: SMS_CAMPAIGN, whatsapp: WHATSAPP_CAMPAIGN}

  scope :active,-> { where(status: :processing) }
  scope :drafted,-> { where(status: :draft) }
  scope :scheduled,-> { where(status: :scheduled) }
  scope :ordered_by_created_at,-> { order('campaigns.created_at DESC') }
  scope :ran_yesterday,-> {
    yesterday = Date.yesterday
    joins(:campaign_scheduler).where('campaign_schedulers.start_date >= ? AND campaign_schedulers.start_date < ?', yesterday.beginning_of_day, yesterday.end_of_day)
  }

  scope :running_campaigns,-> { where(status: [:scheduled, :processing, :paused]) }
  scope :running_whatsapp_campaigns, -> {where(status: [:scheduled, :processing, :paused], channel_type: "Channel::Whatsapp")}
  scope :running_email_campaigns, -> {where(status: [:scheduled, :processing, :paused], channel_type: "Channel::Email")}
  scope :running_tatasmsc_campaigns, -> {where(status: [:scheduled, :processing, :paused], channel_type: "Channel::TataSmsc")}

  scope :with_search_filters,-> (params){
    campaigns = all
    campaigns = apply_filters(campaigns, params)
    campaigns
  }

  scope :with_campaign_tag, ->(tag_names) {
    joins(:campaign_tags).where(campaign_tags: {name: tag_names})
  }

  enum status: { draft: 0, scheduled: 1, processing: 2, completed: 3, failed: 4, cancelled: 5, paused: 6, initiated: 7 }

  include AASM
  aasm column: "status" do
    state :draft, initial: true
    state :scheduled
    state :processing
    state :completed
    state :failed
    state :cancelled
    state :paused

    event :schedule do
      transitions from: [:draft, :scheduled, :paused], to: :scheduled
    end

    event :process do
      transitions from: [:paused,:scheduled], to: :processing
    end

    event :complete do
      transitions from: :processing, to: :completed
    end

    event :pause do
      transitions from: :scheduled, to: :paused
    end

    event :cancel do
      transitions from: [:scheduled, :paused],  to: :cancelled
    end

    event :mark_fail do
      transitions from: :processing, to: :failed
    end

    after_all_transitions :log_status_change
  end

  def self.metrics
    {
      all_count: Current.account.campaigns.count,
      active_count: Current.account.campaigns.active.count,
      draft_count: Current.account.campaigns.draft.count,
      ran_yesterday_count: Current.account.campaigns.ran_yesterday.count,
      scheduled_count: Current.account.campaigns.scheduled.count
    }
  end

  def self.search(params)
    campaigns = case params[:query]&.to_sym
                when :active
                  Current.account.campaigns.includes(:channel).active
                when :draft
                  Current.account.campaigns.includes(:channel).drafted
                when :scheduled
                  Current.account.campaigns.includes(:channel).scheduled
                when :ran_yesterday
                  Current.account.campaigns.includes(:channel).ran_yesterday
                else
                  Current.account.campaigns.includes(:channel)
                end
    campaigns = filter_by_campaign_name(campaigns, params[:campaign_name]) if params[:campaign_name].present?
    campaigns = filter_by_date_range(campaigns, params[:start_date], params[:end_date]) if params[:start_date].present? && params[:end_date].present?
    campaigns = filter_by_campaign_types(campaigns, params[:campaign_types]) if params[:campaign_types].present?
    campaigns = filter_by_channel_types(campaigns, params[:channel_types]) if params[:channel_types].present?
    campaigns = filter_by_delivery_types(campaigns, params[:delivery_types]) if params[:delivery_types].present?
    campaigns = filter_by_status(campaigns, params[:status]) if params[:status].present?
    campaigns = filter_by_created_by(campaigns, params[:created_by]) if params[:created_by].present?
    campaigns = filter_by_tags(campaigns, params[:tag_names], params[:filter_type]) if params[:tag_names].present?
    campaigns = filter_by_platform(campaigns, params[:platform]) if params[:platform].present?
    campaigns = campaigns.ordered_by_created_at
    campaigns
  end

  def self.filter_by_campaign_name(campaigns, campaign_name)
    campaigns.where('title ILIKE ?', "%#{campaign_name}%")
  end

  def self.filter_by_date_range(campaigns, start_date, end_date)
    campaigns.where('campaigns.created_at >= ? AND campaigns.created_at <= ?', start_date.to_date.beginning_of_day, end_date.to_date.end_of_day)
  end

  def self.filter_by_campaign_types(campaigns, campaign_types)
    campaign_types = campaign_types.split(',')
    campaigns.where(campaignable_type: campaign_types)
  end

  def self.filter_by_channel_types(campaigns, channel_types)
    channel_type_suffixes = channel_types.split(',').map{ |x| Campaign::SUPPORTED_CAMPAIGNS_TYPES[x.to_sym] }
    campaigns = campaigns.where(campaignable_type: channel_type_suffixes.compact)
  end

  def self.filter_by_delivery_types(campaigns, delivery_types)
    delivery_types = delivery_types.split(',')
    campaigns = campaigns.where(scheduling_type: delivery_types)
  end

  def self.filter_by_status(campaigns, status)
    campaign_types = status.split(',')
    campaigns = campaigns.where(status: campaign_types)
  end

  def self.filter_by_created_by(campaigns, created_by)
    created_by = created_by.split(',')
    campaigns.joins(account: :users).where(users: { email: created_by })
  end

  def self.filter_by_platform(campaigns, platform)
    platform = platform.split(',')
    campaigns.joins(:devices).where('devices.platform IN (?)', platform)
  end

  def trigger!
    return unless one_off?
    return if completed?
    Twilio::OneoffSmsCampaignService.new(campaign: self).perform if channel.inbox.inbox_type == 'Twilio SMS'
    Sms::OneoffSmsCampaignService.new(campaign: self).perform if channel.inbox.inbox_type == 'Sms'
    Tata::OneoffSmsCampaignService.new(campaign: self).perform if channel.inbox.inbox_type == 'sms'
    Whatsapp::OneoffSmsCampaignService.new(campaign: self).perform if channel.inbox.inbox_type == 'Whatsapp'
  end

  def self.filter_by_tags(campaigns, tag_names, filter_type)
    tag_names = tag_names.split(',')
    if filter_type.eql? AND
      with_campaign_tag(tag_names)
      .group("campaigns.id")
      .having("COUNT(campaign_tags.id) =?", tag_names.count)
    else
      with_campaign_tag(tag_names)
    end
  end

  # def calculate_metrics
  #   self.total_campaign_revenue = total_order_value
  #   self.average_order_value = total_order_value/number_of_conversion_events if number_of_conversion_events.positive?
  #   self.average_revenue_per_user = total_order_value/number_of_unique_conversions if number_of_unique_conversions.positive?
  # end

  #added  dummy data, should be taken care while implementing A/B testing and when fields are available
  def get_analytics
    tiny_url_report = get_tiny_url_report
    delivery_status = fetch_delivery_status_analytics
    if delivery_status['sent'].present? and delivery_status['sent'].positive?
      delivery_rate = delivery_status['delivered'].to_f / delivery_status['sent'].to_f * 100
    end

    analytics_data = {}
    delivery_status.each do |status, count|
      analytics_data.merge!({"#{status}": {"value": count, "percentage": false, "label": status.capitalize}})
    end

    click_count = tiny_url_report.first["clicks"] if tiny_url_report.present?
    analytics_data.merge!({
      "conversion_events": {"value": nil, "percentage": false, "label": "Conversion Events"},
      "conversions": {"value": nil, "percentage": true, "label": "Conversions"},
      "delivery_rate": {"value": delivery_rate, "percentage": true, "label": "Delivery Rate"},
      "clicks": {"value": click_count, "percentage": false, "label": "Clicks"}
    })

    delivery_errors = self.campaign_deliveries.group(:error_code).count
    error_code_mapping(analytics_data, delivery_errors)
    {
      "campaign_id": self.id,
      "name": self.title,
      "campaign_tiny_url_report_status": self.campaign_sync&.status,
      "campaign_tiny_url_report_last_run_time": self.campaign_sync&.last_run_at,
      "tiny_url_report": tiny_url_report,
      "delivery_status": delivery_status,
      "ab_comparison": analytics_data
    }
  end

  def fetch_delivery_status_analytics
    {
      'delivered': campaign_deliveries.delivered_count,
      'opened': campaign_deliveries.opened_count,
      'bounced': campaign_deliveries.bounced_count,
      'sent': campaign_deliveries.count
    }.with_indifferent_access
  end

  def reachable_user_using_segment(campaign)
    segment_attribute = campaign.segment_attribute
    if segment_attribute['segment_filter_id'].present?
      SegmentFilter.find(segment_attribute['segment_filter_id'])&.total_reachable_users
    else
      Segment.find(segment_attribute['segment_id'])&.segment_filter&.total_reachable_users
    end
  end

  def error_code_mapping(analytics_data, delivery_errors)
    CampaignDelivery::UNDELIVERED_ERRORS.each do |error_code, msg|
      value = if analytics_data[msg].present? && analytics_data[msg]['value'].present?
                analytics_data[msg]['value'] + delivery_errors[error_code.to_s].to_i
              else
                delivery_errors[error_code.to_s].to_i
              end
      analytics_data[msg] = { 'value' => value.to_i, 'percentage' => false, 'label' => msg.to_s.tr('_', ' ').split.map(&:capitalize).join(' ') }
    end
  end

  def trigger_click_count_report
    TinyUrlClickReportJob.perform_async(self.id)
  end

  def get_tiny_url_report
    report_array = []
    array = []
    if self.campaignable_type == "Campaign::SmsCampaign"
      self.campaignable.tiny_urls.each do |url|
        report = generate_report(url)
        report_array << report
      end
      clicked_by_campaign_deliveries = campaign_deliveries.where(clicked: true).count
      array_sum = report_array.sum
      count = {
        "clicks": array_sum + clicked_by_campaign_deliveries
      }
      array << count
    elsif self.campaignable_type == "Campaign::WhatsappCampaign"
      count = {
        "clicks": self.campaign_deliveries.where(clicked: true).count
      }
      array << count
    end
  end

  def generate_report(url)
    report = TinyUrlApi.new.shorturl_tracking_report(url)
    clicks = report["link"]["clicks"].to_i if report["statusCode"] == 200
  end

  def campaign_type
    case campaignable_type
    when SMS_CAMPAIGN
      SMS
    when EMAIL_CAMPAIGN
      EMAIL
    when WHATSAPP_CAMPAIGN
      WHATSAPP
    else
      "Not Supported"
    end
  end

  def segment_attributes
    segment_attribute
  end


  def segment_data
    data = segment_attributes
    if segment_attribute.present? && segment_attribute.keys.include?('segment_filter_id')
      data = SegmentFilter.find(segment_attributes['segment_filter_id'])
      data = {id: data.id, filter_hash: data.filter_hash}
    end
    data
  end

  def resume!
    if paused?
      if campaign_scheduler&.start_date > Time.now.utc
        schedule!
      else
        cancel!
      end
    end
  end

  def contacts
    @contact_ids = super.ids
    @contact_ids = send("fetch_#{global_control_group&.control_group}_users") if campaign_global_control_group&.active || (campaign_global_control_group.nil? && global_control_group&.apply_global)
    Contact.where(id: @contact_ids)
  end

  def email_campaign?
    campain_scheduler&.campaign_type == EMAIL_CAMPAIGN
  end

  def sms_campaign?
    campaignable_type == "Campaign::SmsCampaign"
  end

  private

  def fetch_random_allocation_users
    restricted_contact_size = (@contact_ids.count*(global_control_group.random_allocation_percentage))/100
    restricted_contact_ids = Contact.where(id: @contact_ids.sample(restricted_contact_size)).pluck(:id)
    @contact_ids - restricted_contact_ids
  end

  def fetch_upload_user_list_users
    restricted_customer_ids = global_control_group.user_list_csv_file.map {|file_row| file_row['customerId'].to_s }
    restricted_contact_ids = Contact.where(customer_id: restricted_customer_ids).pluck(:id)
    @contact_ids - restricted_contact_ids
  end

  def set_global_control_group_id
    if account.global_control_group.present?
      self.campaign_global_control_group ||= build_campaign_global_control_group
      self.campaign_global_control_group.global_control_group_id = account.global_control_group&.id
    end
  end

  def set_display_id
    reload
  end

  def validate_campaign_inbox
    return unless channel
    errors.add :inbox, 'Unsupported channel type' if (channel.present? && ['Website', 'Twilio SMS', 'Sms', 'Whatsapp', 'Telegram', 'sms', 'TataSmsc', 'Email'].exclude?(channel_type.demodulize))
  end

  # TO-DO we clean up with better validations when campaigns evolve into more inboxes
  def ensure_correct_campaign_attributes
    return if channel.blank?
    if Inbox::SUPPORTED_CHANNEL_TYPES.values.include?(channel_type) #have added email in array
      self.campaign_type = 'one_off'
      self.scheduled_at ||= Time.now.utc
    else
      self.campaign_type = 'ongoing'
      self.scheduled_at = nil
    end
  end

  def validate_url
    return unless trigger_rules['url']

    errors.add(:url, 'invalid') if (channel.inbox.present? && channel.inbox.inbox_type == 'Website' && !url_valid?(trigger_rules['url']))
  end

  def url_valid?(url)
    url = begin
      URI.parse(url)
    rescue StandardError
      false
    end
    url.is_a?(URI::HTTP) || url.is_a?(URI::HTTPS)
  end

  def prevent_completed_campaign_from_update
    errors.add :status, 'The campaign is already completed' if !campaign_status_changed?
  end

  # creating db triggers
  trigger.before(:insert).for_each(:row) do
    "NEW.display_id := nextval('camp_dpid_seq_' || NEW.account_id);"
  end

  def log_status_change
    Rails.logger.info("In Campaign: Changing Campaign ID: #{self.id} status from #{aasm.from_state} to #{aasm.to_state}")
  end

end
