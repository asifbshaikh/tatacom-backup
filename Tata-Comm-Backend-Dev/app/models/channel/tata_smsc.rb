# == Schema Information
#
# Table name: tata_smscs
#
#  id           :bigint           not null, primary key
#  auth_token   :text
#  callback_url :string
#  channel_name :string
#  deleted_at   :datetime
#  medium       :string
#  sender_type  :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  account_id   :integer          not null
#  sender_id    :string
#
# Indexes
#
#  index_tata_smscs_on_deleted_at  (deleted_at)
#
class Channel::TataSmsc < ApplicationRecord

  EDITABLE_ATTRS = [:auth_token, :medium, :sender_id, :sender_type, :callback_url].freeze

  include Channelable
  include BasicTokenEncryptor

  self.table_name = 'tata_smscs'

  acts_as_paranoid
  validates :auth_token, presence: true
  validates :sender_id, presence: true
  validates :sender_id, uniqueness: { scope: [:account_id], case_sensitive: false, conditions: -> {
    joins(:inbox).where(inbox: {archived: false}) }
  }
  validate :check_auth_token, on: :update
  validates :channel_name, uniqueness: { scope: [:account_id] }
  before_destroy :check_running_campaigns

  enum medium: { tata: 'tata' }
  enum sender_type: { promotional: 0, transactional: 1 }

  before_update :encrypt_auth_token

  CHANNEL = "tata_smsc"
  def encrypt_auth_token
    self.auth_token = encrypt_token(auth_token) if  auth_token_changed?
  end

  def decrypt_auth_token
    decrypt_token(auth_token) rescue auth_token
  end


  def name
    'TataSmsc'
  end

  private

  def check_auth_token
    errors.add(:base, "Api Key is invalid") unless validate_and_decode_auth_token(auth_token)
  end

end
