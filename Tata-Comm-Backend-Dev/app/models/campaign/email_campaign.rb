# == Schema Information
#
# Table name: email_campaigns
#
#  id                                :bigint           not null, primary key
#  campaign_content_type             :integer          default("promotional"), not null
#  user_attribute_with_email_address :string
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  account_id                        :bigint           not null
#  campaign_tag_id                   :bigint
#  email_template_id                 :integer
#
# Indexes
#
#  index_email_campaigns_on_account_id             (account_id)
#  index_email_campaigns_on_campaign_content_type  (campaign_content_type)
#  index_email_campaigns_on_campaign_tag_id        (campaign_tag_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (campaign_tag_id => campaign_tags.id)
#
class Campaign::EmailCampaign < ApplicationRecord
  self.table_name = 'email_campaigns'

  attr_accessor :channel_id #for email channel

  belongs_to :account
  belongs_to :campaign_tag, class_name: 'CampaignTag', optional: true
  has_many :campaigns, as: :campaignable   # Polymorphic association

  attribute :template, :string

  enum campaign_content_type: { promotional: 0, transactional: 1 }

end
