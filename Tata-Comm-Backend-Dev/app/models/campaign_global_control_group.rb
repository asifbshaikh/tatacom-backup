# == Schema Information
#
# Table name: campaign_global_control_groups
#
#  id                      :bigint           not null, primary key
#  active                  :boolean          default(TRUE)
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  campaign_id             :bigint           not null
#  global_control_group_id :bigint
#
# Indexes
#
#  index_campaign_global_control_groups_on_campaign_id              (campaign_id)
#  index_campaign_global_control_groups_on_global_control_group_id  (global_control_group_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (global_control_group_id => global_control_groups.id)
#
class CampaignGlobalControlGroup < ApplicationRecord
  belongs_to :campaign
  belongs_to :global_control_group, optional: true
end
