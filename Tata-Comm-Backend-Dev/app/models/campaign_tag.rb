# == Schema Information
#
# Table name: campaign_tags
#
#  id                :bigint           not null, primary key
#  custom_attributes :jsonb
#  description       :text
#  name              :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  campaign_id       :bigint           not null
#  group_tag_id      :bigint           not null
#
# Indexes
#
#  index_campaign_tags_on_campaign_id   (campaign_id)
#  index_campaign_tags_on_group_tag_id  (group_tag_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (group_tag_id => group_tags.id)
#
class CampaignTag < ApplicationRecord
  belongs_to :campaign
  belongs_to :group_tag

  has_many :campaign_details, class_name: '::Campaign::CampaignDetail'
end
