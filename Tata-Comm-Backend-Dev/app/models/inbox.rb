# frozen_string_literal: true

# == Schema Information
#
# Table name: inboxes
#
#  id                            :integer          not null, primary key
#  allow_messages_after_resolved :boolean          default(TRUE)
#  archived                      :boolean          default(FALSE)
#  channel_type                  :string
#  csat_survey_enabled           :boolean          default(FALSE)
#  deleted_at                    :datetime
#  email_address                 :string
#  enable_auto_assignment        :boolean          default(TRUE)
#  enable_email_collect          :boolean          default(TRUE)
#  greeting_enabled              :boolean          default(FALSE)
#  greeting_message              :string
#  name                          :string           not null
#  out_of_office_message         :string
#  timezone                      :string           default("UTC")
#  working_hours_enabled         :boolean          default(FALSE)
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  account_id                    :integer          not null
#  channel_id                    :integer
#
# Indexes
#
#  index_inboxes_on_account_id  (account_id)
#  index_inboxes_on_deleted_at  (deleted_at)
#

class Inbox < ApplicationRecord
  include Reportable
  include Avatarable
  include OutOfOffisable
  
  acts_as_paranoid
  validates :name, presence: true, uniqueness: { scope: :account_id }
  validates :account_id, presence: true
  validates :timezone, inclusion: { in: TZInfo::Timezone.all_identifiers }

  belongs_to :account

  belongs_to :channel, polymorphic: true, dependent: :destroy, optional: true

  has_many :campaigns, dependent: :destroy_async
  has_many :contact_inboxes, dependent: :destroy_async
  has_many :contacts, through: :contact_inboxes

  has_many :inbox_members, dependent: :destroy_async
  has_many :members, through: :inbox_members, source: :user
  has_many :conversations, dependent: :destroy_async
  has_many :messages, through: :conversations

  has_one :agent_bot_inbox, dependent: :destroy_async
  has_one :agent_bot, through: :agent_bot_inbox  
  has_many :webhooks, dependent: :destroy_async
  has_many :hooks, dependent: :destroy_async, class_name: 'Integrations::Hook'

  after_destroy :delete_round_robin_agents

  scope :order_by_name, -> { order('lower(name) ASC') }
  scope :order_by_created_date, -> { order('created_at DESC') }

  scope :email, -> { where(channel_type: 'Channel::Email') }
  scope :sms, -> { where(channel_type: 'Channel::TataSmsc') }
  scope :whatsapp, -> { where(channel_type: 'Channel::Whatsapp') }
  scope :not_archived, -> {where(archived: false)}
  scope :with_channel, -> {where('inboxes.channel_id IS NOT NULL')}

  SUPPORTED_CHANNEL_TYPES = {email: 'Channel::Email', sms: 'Channel::TataSmsc', whatsapp: 'Channel::Whatsapp'}
  INBOX_TYPES =  ['Twilio SMS', 'Sms', 'Whatsapp', 'Telegram', 'sms', 'Email'].freeze

  def self.search(channel_name)
    channels = {}
    return channels if channel_name.present? && SUPPORTED_CHANNEL_TYPES.keys.exclude?(channel_name)
    inboxes_result = not_archived.order_by_name.group_by(&:channel_type)
    if channel_name.present?
      channels["tata_#{channel_name.to_s}"] = inboxes_result[SUPPORTED_CHANNEL_TYPES[channel_name]]
    else
      SUPPORTED_CHANNEL_TYPES.each do |key, value|
        channels["tata_#{key}"] = inboxes_result.present? && inboxes_result[value].present? ? inboxes_result[value] : []
      end
    end
    channels
  end

  def self.whatsapp_phone_numbers(channel_name)
    result = []
    inboxes = search(channel_name).values.flatten!
    result = inboxes.map{|x| [x.id, x.channel&.phone_number]} if inboxes.present?
    result
  end

  def add_member(user_id)
    member = inbox_members.new(user_id: user_id)
    member.save!
  end

  def remove_member(user_id)
    member = inbox_members.find_by!(user_id: user_id)
    member.try(:destroy)
  end

  def facebook?
    channel_type == 'Channel::FacebookPage'
  end

  def web_widget?
    channel_type == 'Channel::WebWidget'
  end

  def api?
    channel_type == 'Channel::Api'
  end

  def email?
    channel_type == 'Channel::Email'
  end

  def twilio?
    channel_type == 'Channel::TwilioSms'
  end

  def line?
    channel_type == 'Channel::Line'
  end

  def tata?
    channel_type == 'Channel::Tata'
  end

  def tata_sms?
    channel_type == 'Channel::TataSmsc'
  end

  def tata_whatsapp?
    channel_type == 'Channel::Whatsapp'
  end


  def twitter?
    channel_type == 'Channel::TwitterProfile'
  end

  def inbox_type
    channel.name rescue nil
  end

  def webhook_data
    {
      id: id,
      name: name
    }
  end

  def callback_webhook_url
    case channel_type
    when 'Channel::TwilioSms'
      "#{ENV['FRONTEND_URL']}/twilio/callback"
    when 'Channel::Tata'
      "#{ENV['FRONTEND_URL']}/tata/callback"
    when 'Channel::Sms'
      "#{ENV['FRONTEND_URL']}/webhooks/sms/#{channel.phone_number.delete_prefix('+')}"
    when 'Channel::Line'
      "#{ENV['FRONTEND_URL']}/webhooks/line/#{channel.line_channel_id}"
    when 'Channel::Viber'
      "#{ENV['FRONTEND_URL']}/webhooks/viber/#{channel.service_id}"
    end
  end

  private

  def delete_round_robin_agents
    ::RoundRobin::ManageService.new(inbox: self).clear_queue
  end
end
