# == Schema Information
#
# Table name: channel_tata_sms
#
#  id           :bigint           not null, primary key
#  phone_number :string           not null
#  ss_key       :string           not null
#  token        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  account_id   :integer          not null
#  app_id       :string           not null
#

class Channel::Tata < ApplicationRecord
  include Channelable

  self.table_name = 'channel_tata_sms'

  validates :app_id, presence: true
  validates :ss_key, presence: true
  validates :token, presence: true
  validates :phone_number, uniqueness: { scope: :account_id }, presence: true

  enum medium: { sms: 0, whatsapp: 1 }

  def name
    medium || 'sms'
  end

  def has_24_hour_messaging_window?
    medium == 'whatsapp'
  end
end
