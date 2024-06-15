# == Schema Information
#
# Table name: channel_email
#
#  id                             :bigint           not null, primary key
#  bounces_and_complaint_tracking :string
#  channel_name                   :string
#  deleted_at                     :datetime
#  email                          :string
#  email_api_key                  :string
#  email_api_url                  :string
#  forward_to_email               :string           not null
#  imap_address                   :string           default("")
#  imap_email                     :string           default("")
#  imap_enable_ssl                :boolean          default(TRUE)
#  imap_enabled                   :boolean          default(FALSE)
#  imap_inbox_synced_at           :datetime
#  imap_password                  :string           default("")
#  imap_port                      :integer          default(0)
#  maximum_send_rate              :integer
#  smtp_address                   :string           default("")
#  smtp_auth_enable               :boolean          default(FALSE)
#  smtp_authentication            :string           default("login")
#  smtp_domain                    :string           default("")
#  smtp_email                     :string           default("")
#  smtp_enable_ssl_tls            :boolean          default(FALSE)
#  smtp_enable_starttls_auto      :boolean          default(TRUE)
#  smtp_enabled                   :boolean          default(FALSE)
#  smtp_openssl_verify_mode       :string           default("none")
#  smtp_password                  :string           default("")
#  smtp_port                      :integer          default(0)
#  smtp_protocol                  :string           default("none")
#  unsubscribe_setting            :string           default("none")
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  account_id                     :integer          not null
#
# Indexes
#
#  index_channel_email_on_deleted_at        (deleted_at)
#  index_channel_email_on_email             (email) UNIQUE
#  index_channel_email_on_forward_to_email  (forward_to_email) UNIQUE
#

class Channel::Email < ApplicationRecord
  include Channelable

  self.table_name = 'channel_email'
  EDITABLE_ATTRS = [:email, :imap_enabled, :imap_email, :imap_password, :imap_address, :imap_port, :imap_enable_ssl, :imap_inbox_synced_at,
                    :smtp_enabled, :smtp_email, :smtp_password, :smtp_address, :smtp_port, :smtp_domain, :smtp_enable_starttls_auto,
                    :smtp_enable_ssl_tls, :smtp_openssl_verify_mode, :smtp_protocol, :smtp_auth_enable, :smtp_email, :smtp_password, :maximum_send_rate, :unsubscribe_setting, :bounces_and_complaint_tracking, :email_api_url, :email_api_key].freeze

  acts_as_paranoid
  validates :email, :allow_nil => true, uniqueness: true
  validates :forward_to_email, uniqueness: true
  validates_uniqueness_of :smtp_email, :allow_blank => true
  has_one :email_general_setting
  before_validation :ensure_forward_to_email, on: :create
  before_destroy :check_running_campaigns
  #TODO: Adding validations as per new implementation of channel emails with new fields
  validates :email_api_url, :email_api_key, presence: true
  validates :channel_name, uniqueness: { scope: [:account_id] }

  HUMANIZED_ATTRIBUTES = {
    :smtp_email => SMTP_EMAIL
  }

  def self.human_attribute_name(attr, options={})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  def name
    'Email'
  end

  private

  def ensure_forward_to_email
    self.forward_to_email ||= "#{SecureRandom.hex}@#{account.inbound_email_domain}"
  end

end
