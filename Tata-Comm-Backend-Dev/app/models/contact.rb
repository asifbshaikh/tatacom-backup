# == Schema Information
#
# Table name: contacts
#
#  id                             :integer          not null, primary key
#  additional_attributes          :jsonb
#  address                        :string
#  advertising_identifier         :string
#  birth_date                     :date
#  browser_details                :string
#  campaign_name                  :string
#  city                           :string
#  country                        :string
#  creation_source                :string
#  custom_attributes              :jsonb
#  device_reinstall               :datetime
#  email                          :string
#  first_name                     :string
#  first_seen                     :datetime
#  gender                         :string
#  hard_bounce                    :boolean          default(FALSE)
#  identifier                     :string
#  install_status                 :string
#  interaction_count              :integer
#  last_activity_at               :datetime
#  last_interaction_at            :datetime
#  last_known_city                :string
#  last_known_country             :string
#  last_known_pincode             :string
#  last_known_state               :string
#  last_name                      :string
#  last_seen                      :datetime
#  locale_country                 :string
#  locale_language                :string
#  location                       :string
#  ltv                            :integer
#  middle_name                    :string
#  mobile_user                    :boolean
#  name                           :string
#  no_of_conversions              :integer
#  no_of_sessions                 :integer
#  phone_number                   :string
#  publisher_name                 :string
#  pubsub_token                   :string
#  push_opt_in_status             :string
#  sms_subscription_status        :string
#  spam                           :boolean          default(FALSE)
#  uninstall_time                 :datetime
#  unsubscribe                    :boolean          default(FALSE)
#  user_reinstall                 :datetime
#  user_timezone_offset           :string
#  web_push_subscription_page_url :string
#  web_push_subscription_status   :string
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  account_id                     :integer          not null
#  customer_id                    :string
#  data_sync_import_id            :integer
#  google_advertising_id          :integer
#  import_user_id                 :bigint
#  source_id                      :integer          default([]), is an Array
#
# Indexes
#
#  index_contacts_on_account_id                   (account_id)
#  index_contacts_on_birth_date                   (birth_date)
#  index_contacts_on_browser_details              (browser_details)
#  index_contacts_on_customer_id                  (customer_id)
#  index_contacts_on_email                        (email)
#  index_contacts_on_first_name                   (first_name)
#  index_contacts_on_first_seen                   (first_seen)
#  index_contacts_on_gender                       (gender)
#  index_contacts_on_google_advertising_id        (google_advertising_id)
#  index_contacts_on_id                           (id)
#  index_contacts_on_import_user_id               (import_user_id)
#  index_contacts_on_last_name                    (last_name)
#  index_contacts_on_last_seen                    (last_seen)
#  index_contacts_on_locale_country               (locale_country)
#  index_contacts_on_ltv                          (ltv)
#  index_contacts_on_name                         (name)
#  index_contacts_on_phone_number_and_account_id  (phone_number,account_id)
#  index_contacts_on_pubsub_token                 (pubsub_token) UNIQUE
#  index_contacts_on_source_id                    (source_id)
#  uniq_identifier_per_account_contact            (identifier,account_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (import_user_id => import_users.id)
#

class Contact < ApplicationRecord
  # TODO: remove the pubsub_token attribute from this model in future.
  include Avatarable
  include AvailabilityStatusable
  include Labelable

  validates :account_id, presence: true
  validates :email, allow_blank: true,
                    format: { with: /\A[\w+\-.]+@[a-z\d\-]+(?:\.[a-z\d\-]+)*\.[a-z]+\z/, message: 'should be a valid email address' }
  validates :identifier, allow_blank: true, uniqueness: { scope: [:account_id] }
  validates :customer_id, allow_blank: true, uniqueness: { scope: [:account_id] }
  validates :phone_number,
            allow_blank: true,
            format: { with: /\A(\+\d{10,15}|[1-9]\d{11})\z/, message: 'should be in e164 format' }

  validates :name, length: { maximum: 255 }
  validates :no_of_sessions, :no_of_conversions, :interaction_count, :ltv, numericality: { greater_than_or_equal_to: 0, allow_blank: true }

  validate :ensure_email_and_phone_unique_combination
  validate :validate_email_and_phone_presence
  validates :email, uniqueness: { scope: [:phone_number, :account_id], message: :taken }

  belongs_to :account
  belongs_to :import_user, optional: true
  belongs_to :data_sync_import, optional: true

  has_many :conversations, dependent: :destroy_async
  has_many :contact_inboxes, dependent: :destroy_async
  has_many :csat_survey_responses, dependent: :destroy_async
  has_many :inboxes, through: :contact_inboxes
  has_many :messages, as: :sender, dependent: :destroy_async
  has_many :notes, dependent: :destroy_async
  has_many :contact_common_events, dependent: :destroy_async
  has_many :common_events, through: :contact_common_events
  has_many :custom_attrs, dependent: :destroy_async, class_name: 'CustomAttribute'
  has_many :campaign_deliveries, dependent: :delete_all
  has_many :devices, dependent: :destroy_async
  has_many :contact_device_details, dependent: :destroy_async

  before_validation :prepare_contact_attributes
  after_create_commit :dispatch_create_event, :ip_lookup
  after_update_commit :dispatch_update_event
  after_destroy_commit :dispatch_destroy_event
  before_update :update_custom_attrs

  scope :order_on_last_activity_at, lambda { |direction|
    order(
      Arel::Nodes::SqlLiteral.new(
        sanitize_sql_for_order("\"contacts\".\"last_activity_at\" #{direction}
          NULLS LAST")
      )
    )
  }
  scope :order_on_company_name, lambda { |direction|
    order(
      Arel::Nodes::SqlLiteral.new(
        sanitize_sql_for_order(
          "\"contacts\".\"additional_attributes\"->>'company_name' #{direction}
          NULLS LAST"
        )
      )
    )
  }
  scope :order_on_city, lambda { |direction|
    order(
      Arel::Nodes::SqlLiteral.new(
        sanitize_sql_for_order(
          "\"contacts\".\"city\" #{direction}
          NULLS LAST"
        )
      )
    )
  }
  scope :order_on_country_name, lambda { |direction|
    order(
      Arel::Nodes::SqlLiteral.new(
        sanitize_sql_for_order(
          "\"contacts\".\"country\" #{direction}
          NULLS LAST"
        )
      )
    )
  }

  scope :order_on_name, lambda { |direction|
    order(
      Arel::Nodes::SqlLiteral.new(
        sanitize_sql_for_order(
          "CASE
           WHEN \"contacts\".\"name\" ~~* '^+\d*' THEN 'z'
           WHEN \"contacts\".\"name\"  ~~*  '^\b*' THEN 'z'
           ELSE LOWER(\"contacts\".\"name\")
           END #{direction}"
        )
      )
    )
  }

  scope :join_cce_ce, -> { joins(contact_common_events: :common_event) }

  scope :order_by_desc, -> { order(created_at: :desc) }

  scope :with_phone_number, -> { where.not(phone_number: nil) }

  scope :with_emails, -> { where.not(email: nil) }

  scope :with_contact_ids, ->(contact_ids) { where(id: contact_ids) }

  def self.export_segment_contacts(contact_ids, file_headers)
    if file_headers['custom_columns'].present?
      set_file_headers = file_headers['contact_columns'].map { |item| "contacts.#{item}" } + ['value']
      Contact.includes(:custom_attrs).where('contacts.id in (?) OR custom_attributes.name in (?)', contact_ids,
                                            file_headers['custom_columns']).pluck(set_file_headers.join(','))
    else
      return where(id: contact_ids).pluck(file_headers['contact_columns'].join(',')).map{|key| [key]} if file_headers['contact_columns'].size == ONE
      where(id: contact_ids).pluck(file_headers['contact_columns'].join(','))
    end
  end

  def get_source_id(inbox_id)
    contact_inboxes.find_by!(inbox_id: inbox_id).source_id
  end

  def push_event_data
    {
      additional_attributes: additional_attributes,
      custom_attributes: custom_attributes,
      email: email,
      id: id,
      identifier: identifier,
      name: name,
      phone_number: phone_number,
      pubsub_token: pubsub_token,
      thumbnail: avatar_url,
      type: 'contact'
    }
  end

  def webhook_data
    {
      id: id,
      name: name,
      avatar: avatar_url,
      type: 'contact',
      account: account.webhook_data
    }
  end

  def self.resolved_contacts
    where.not(email: [nil, '']).or(
      Current.account.contacts.where.not(phone_number: [nil, ''])
    ).or(Current.account.contacts.where.not(identifier: [nil, '']))
  end

  def simulate_interaction
    update(last_interaction_at: Time.zone.now, interaction_count: interaction_count + 1)
  end

  def best_time_to_send
    last_interaction = last_interaction_at || created_at
    last_interaction + 2.hours
  end

  def timezone
    if user_timezone_offset.present?
      ActiveSupport::TimeZone.new(user_timezone_offset).presence
    elsif country.present?
      ActiveSupport::TimeZone.country_zones(country).first
    elsif last_known_country.present?
      ActiveSupport::TimeZone.country_zones(last_known_country).first
    else
      country_code = TelephoneNumber.parse(phone_number).country&.country_id
      ActiveSupport::TimeZone.country_zones(country_code).first
    end
  rescue StandardError => e
    ActiveSupport::TimeZone.new(UTC)
  end

  def country_name
    country.presence || last_known_country.presence || TelephoneNumber.parse(phone_number).country&.country_id
  end

  def bio
    additional_attributes.fetch("description", nil)
  end

  def company_name
    additional_attributes.fetch("company_name", nil)
  end

  def social_profiles
    additional_attributes.fetch("social_profiles", {})
  end

  CONTACT_SOCIAL_PROFILES.each do |method_name|
    define_method method_name do
      social_profiles.fetch(method_name, '')
    end
  end

  private

  def ip_lookup
    return unless account.feature_enabled?('ip_lookup')

    ContactIpLookupJob.perform_later(self)
  end

  def prepare_contact_attributes
    prepare_email_attribute
    prepare_jsonb_attributes
  end

  def prepare_email_attribute
    # So that the db unique constraint won't throw error when email is ''
    self.email = email.present? ? email.downcase : nil
  end

  def prepare_jsonb_attributes
    self.additional_attributes = {} if additional_attributes.blank?
    self.custom_attributes = {} if custom_attributes.blank?
  end

  def dispatch_create_event
    Rails.configuration.dispatcher.dispatch(CONTACT_CREATED, Time.zone.now, contact: self)
  end

  def dispatch_update_event
    Rails.configuration.dispatcher.dispatch(CONTACT_UPDATED, Time.zone.now, contact: self)
  end

  def dispatch_destroy_event
    Rails.configuration.dispatcher.dispatch(CONTACT_DELETED, Time.zone.now, contact: self)
  end

  def ensure_email_and_phone_unique_combination
    if (email.present? && phone_number.present? && import_user.present? && import_user.user_type == 'anonymous') || (email.present? && phone_number.present? && import_user.blank? && data_sync_import.blank?)
      existing_contact =  Contact.where("account_id = ? AND LOWER(email) = ? AND phone_number = ? AND customer_id IS NULL AND id != ?",
                          account_id, email.downcase, phone_number, id).first
      errors.add(:email, 'A contact with the same email and phone number already exists') if existing_contact
    elsif customer_id.present? && import_user.present? &&  import_user.user_type == 'registered'
      existing_contact = Contact.where("account_id = ? AND customer_id = ? AND id !=?", account_id, customer_id, id).first
      errors.add(:email, 'A contact with the same customer id already exists') if existing_contact
    end
  end

  def validate_email_and_phone_presence
    if import_user.present? && import_user&.user_type == 'anonymous'
      errors.add(:email, 'Either email or phone number must be present for anonymous users') if email.blank? && phone_number.blank?
    elsif import_user.present? && import_user&.user_type == 'registered'

      errors.add(:customer_id, 'Customer id must be present for registered users') if customer_id.blank?
    end
  end

  # TODO: for all campaign we can resue this method for fetch users
  def self.fetch_contacts_to_send_campaigns(segment_id, emails)
    segment = Current.account.segments.find_by(id: segment_id)
    if segment
      if segment.segment_filter.present?
        ids = segment&.segment_filter&.segment_user_ids&.pluck(:user_ids)&.flatten
        Contact.with_contact_ids(ids).with_emails
      elsif segment.segment_type == 'File' && segment.segment_filter.blank?
        Current.account.contacts.where('source_id &&  ARRAY[?]::integer[]', [segment.id])
      end
    elsif emails
      Current.account.contacts.where(email: emails)
    end
  end

  def sync_custom_attributes
    custom_attributes.each do |key, value|
      custom_attr = custom_attrs.find_or_initialize_by(name: key)
      if custom_attr.value != value
        custom_attr.displayed_name = key.humanize
        custom_attr.source = ['internal']
        custom_attr.value = value
        custom_attr.account_id = account_id
        custom_attr.save
      end
    end
    custom_attrs.where.not(name: custom_attributes.keys).destroy_all
  end

  def update_custom_attrs
    if changes.has_key?('custom_attributes')
      send(:sync_custom_attributes)
    end
  end
end
