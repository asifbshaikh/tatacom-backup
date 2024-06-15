# == Schema Information
#
# Table name: sms_campaigns
#
#  id                 :bigint           not null, primary key
#  tiny_urls          :text             default([]), is an Array
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  account_id         :bigint           not null
#  campaign_tag_id    :bigint
#  template_id        :string
#  template_record_id :integer
#
# Indexes
#
#  index_sms_campaigns_on_account_id       (account_id)
#  index_sms_campaigns_on_campaign_tag_id  (campaign_tag_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (campaign_tag_id => campaign_tags.id)
#
class Campaign::SmsCampaign < ApplicationRecord
  self.table_name = 'sms_campaigns'
  belongs_to :account, optional: true
  belongs_to :campaign_tag, class_name: 'CampaignTag', optional: true
  has_many :campaigns, as: :campaignable   # Polymorphic association
  attribute :template, :string
end
