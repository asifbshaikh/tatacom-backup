# == Schema Information
#
# Table name: accounts
#
#  id                        :integer          not null, primary key
#  auto_resolve_duration     :integer
#  domain                    :string(100)
#  feature_flags             :integer          default(0), not null
#  limits                    :jsonb
#  locale                    :integer          default("en")
#  max_days_limit_for_events :integer
#  name                      :string           not null
#  settings_flags            :integer          default(0), not null
#  support_email             :string(100)
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#

class Account < ApplicationRecord
  # used for single column multi flags
  include FlagShihTzu
  include Reportable
  include Featurable
  prepend_mod_with('Account')

  DEFAULT_QUERY_SETTING = {
    flag_query_mode: :bit_operator,
    check_for_column: false
  }.freeze

  ACCOUNT_SETTINGS_FLAGS = {
    1 => :custom_email_domain_enabled
  }.freeze

  validates :name, presence: true
  validates :auto_resolve_duration, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 999, allow_nil: true }
  validates :name, length: { maximum: 255 }

  has_many :account_users, dependent: :destroy_async
  has_many :agent_bot_inboxes, dependent: :destroy_async
  has_many :agent_bots, dependent: :destroy_async
  has_many :api_channels, dependent: :destroy_async, class_name: '::Channel::Api'
  has_many :campaigns, dependent: :destroy_async
  has_many :canned_responses, dependent: :destroy_async
  has_many :contacts, dependent: :destroy_async
  has_many :conversations, dependent: :destroy_async
  has_many :csat_survey_responses, dependent: :destroy_async
  has_many :custom_attribute_definitions, dependent: :destroy_async
  has_many :custom_filters, dependent: :destroy_async
  has_many :data_imports, dependent: :destroy_async
  has_many :email_channels, dependent: :destroy_async, class_name: '::Channel::Email'
  has_many :facebook_pages, dependent: :destroy_async, class_name: '::Channel::FacebookPage'
  has_many :hooks, dependent: :destroy_async, class_name: 'Integrations::Hook'
  has_many :inboxes, dependent: :destroy_async
  has_many :kbase_articles, dependent: :destroy_async, class_name: '::Kbase::Article'
  has_many :kbase_categories, dependent: :destroy_async, class_name: '::Kbase::Category'
  has_many :kbase_portals, dependent: :destroy_async, class_name: '::Kbase::Portal'
  has_many :labels, dependent: :destroy_async
  has_many :line_channels, dependent: :destroy_async, class_name: '::Channel::Line'
  has_many :mentions, dependent: :destroy_async
  has_many :messages, dependent: :destroy_async
  has_many :notes, dependent: :destroy_async
  has_many :notification_settings, dependent: :destroy_async
  has_many :teams, dependent: :destroy_async
  has_many :telegram_bots, dependent: :destroy_async
  has_many :telegram_channels, dependent: :destroy_async, class_name: '::Channel::Telegram'
  has_many :viber_channels, dependent: :destroy_async, class_name: '::Channel::Viber'
  has_many :wechat_channels, dependent: :destroy_async, class_name: '::Channel::Wechat'
  has_many :kakao_channels, dependent: :destroy_async, class_name: '::Channel::Kakao'
  has_many :twilio_sms, dependent: :destroy_async, class_name: '::Channel::TwilioSms'
  has_many :tata, dependent: :destroy_async, class_name: '::Channel::Tata'
  has_many :twitter_profiles, dependent: :destroy_async, class_name: '::Channel::TwitterProfile'
  has_many :users, through: :account_users
  has_many :web_widgets, dependent: :destroy_async, class_name: '::Channel::WebWidget'
  has_many :webhooks, dependent: :destroy_async
  has_many :whatsapp_channels, dependent: :destroy_async, class_name: '::Channel::Whatsapp'
  has_many :tata_whatsapp_channels, dependent: :destroy_async, class_name: '::Channel::WhatsappTataCommunications'
  has_many :sms_channels, dependent: :destroy_async, class_name: '::Channel::Sms'
  has_many :working_hours, dependent: :destroy_async
  has_many :automation_rules, dependent: :destroy_async
  has_many :import_users, dependent: :destroy_async
  has_many :custom_segments, dependent: :destroy_async
  has_many :templates, dependent: :destroy_async
  has_many :campaign_goals, dependent: :destroy_async
  has_many :campaign_schedulers, dependent: :destroy_async
  has_many :tata_smsc, dependent: :destroy_async, class_name: '::Channel::TataSmsc'
  has_many :sms_campaigns, dependent: :destroy_async, class_name: '::Campaign::SmsCampaign'
  has_many :whatsapp_campaigns, dependent: :destroy_async, class_name: '::Campaign::WhatsappCampaign'
  has_many :segments, dependent: :destroy_async
  has_many :segment_filters, dependent: :destroy_async
  has_many :email_campaigns, dependent: :destroy_async, class_name: '::Campaign::EmailCampaign'
  has_many :campaign_details, dependent: :destroy_async, class_name: '::Campaign::CampaignDetail'
  has_many :email_templates, dependent: :destroy_async
  has_many :email_general_settings, dependent: :destroy_async
  has_many :fc_dnd_settings, dependent: :destroy
  has_many :campaign_deliveries, dependent: :delete_all
  has_many :s3_configurations, dependent: :destroy_async
  has_many :sftp_configurations, dependent: :destroy_async
  has_many :db_configurations, dependent: :destroy_async
  has_many :crm_cdp_schedule_details, dependent: :destroy_async
  has_many :data_sync_imports, dependent: :destroy_async
  has_many :contact_event_filters, dependent: :destroy_async
  has_many :devices, dependent: :destroy_async
  has_many :db_schedule_details, dependent: :destroy_async
  has_many :campaign_syncs, dependent: :destroy_async
  has_one  :account_setting, dependent: :destroy_async
  has_one :global_control_group
  has_many :report_schedulers, dependent: :destroy_async
  has_many  :notification_channels, dependent: :destroy_async
  has_many :contact_common_events, dependent: :destroy_async
  has_many :contact_device_details, dependent: :destroy
  has_many :common_events, dependent: :destroy

  has_flags ACCOUNT_SETTINGS_FLAGS.merge(column: 'settings_flags').merge(DEFAULT_QUERY_SETTING)

  enum locale: LANGUAGES_CONFIG.map { |key, val| [val[:iso_639_1_code], key] }.to_h

  before_validation :validate_limit_keys
  after_create_commit :notify_creation
  after_create :create_associated_account_setting

  def agents
    users.where(account_users: { role: :agent })
  end

  def administrators
    users.where(account_users: { role: :administrator })
  end

  def all_conversation_tags
    # returns array of tags
    conversation_ids = conversations.pluck(:id)
    ActsAsTaggableOn::Tagging.includes(:tag)
                             .where(context: 'labels',
                                    taggable_type: 'Conversation',
                                    taggable_id: conversation_ids)
                             .map { |_| _.tag.name }
  end

  def webhook_data
    {
      id: id,
      name: name
    }
  end

  def inbound_email_domain
    domain || GlobalConfig.get('MAILER_INBOUND_EMAIL_DOMAIN')['MAILER_INBOUND_EMAIL_DOMAIN'] || ENV.fetch('MAILER_INBOUND_EMAIL_DOMAIN', false)
  end

  def support_email
    super || GlobalConfig.get('MAILER_SUPPORT_EMAIL')['MAILER_SUPPORT_EMAIL'] || ENV.fetch('MAILER_SENDER_EMAIL', 'Tring <accounts@tring.com>')
  end

  def usage_limits
    {
      agents: get_limits(:agents).to_i,
      inboxes: get_limits(:inboxes).to_i
    }
  end

  private

  def create_associated_account_setting
    create_account_setting(app_id: SecureRandom.hex(12).upcase)
  end

  #enterprise/account.rb
  def get_limits(limit_name)
    self[:limits][limit_name.to_s] || TringApp.max_limit
  end

  def notify_creation
    Rails.configuration.dispatcher.dispatch(ACCOUNT_CREATED, Time.zone.now, account: self)
  end

  trigger.after(:insert).for_each(:row) do
    "execute format('create sequence IF NOT EXISTS conv_dpid_seq_%s', NEW.id);"
  end

  trigger.name('camp_dpid_before_insert').after(:insert).for_each(:row) do
    "execute format('create sequence IF NOT EXISTS camp_dpid_seq_%s', NEW.id);"
  end

  def validate_limit_keys
    # method overridden in enterprise module
  end
end
