# == Schema Information
#
# Table name: email_general_settings
#
#  id               :bigint           not null, primary key
#  email_address    :string           default([]), is an Array
#  user_attribute   :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :integer
#  channel_email_id :bigint           not null
#
# Indexes
#
#  index_email_general_settings_on_channel_email_id  (channel_email_id)
#
class EmailGeneralSetting < ApplicationRecord
    belongs_to :channel_email, class_name: 'Channel::Email'
    belongs_to :account
    validates  :account_id, :user_attribute, :channel_email_id, presence: true
    validates_uniqueness_of :user_attribute, scope: :channel_email_id
    validates_uniqueness_of :channel_email_id, scope: :account_id
end
