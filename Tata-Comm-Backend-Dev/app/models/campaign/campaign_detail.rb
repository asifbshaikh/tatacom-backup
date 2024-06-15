# == Schema Information
#
# Table name: campaign_details
#
#  id                     :bigint           not null, primary key
#  bcc_email_address      :string           default([]), is an Array
#  cc_email_address       :string           default([]), is an Array
#  from_email_address     :string
#  preview_text           :text
#  reply_to_email_address :string
#  sender_name            :string
#  subject                :text
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  account_id             :bigint           not null
#  campaign_id            :bigint           not null
#  channel_email_id       :integer
#
# Indexes
#
#  index_campaign_details_on_account_id              (account_id)
#  index_campaign_details_on_campaign_id             (campaign_id)
#  index_campaign_details_on_channel_email_id        (channel_email_id)
#  index_campaign_details_on_from_email_address      (from_email_address)
#  index_campaign_details_on_reply_to_email_address  (reply_to_email_address)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (campaign_id => campaigns.id)
#
class Campaign::CampaignDetail < ApplicationRecord
  self.table_name = 'campaign_details'
  belongs_to :account
  belongs_to :campaign_tag, class_name: 'CampaignTag', optional: true
  belongs_to :email_channel, class_name: 'Channel::Email', foreign_key: :channel_email_id
  belongs_to :campaign

  attr_accessor :skip_validations

  validates :subject, presence: true, unless: :skip_validations
  validates :sender_name, presence: true, unless: :skip_validations
  validates :from_email_address, presence: true, unless: :skip_validations
  validates :channel_email_id, presence: true, unless: :skip_validations
  validates :campaign_id, uniqueness: true
end
