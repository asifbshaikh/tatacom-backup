# == Schema Information
#
# Table name: campaign_devices
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#  device_id   :bigint
#
# Indexes
#
#  index_campaign_devices_on_campaign_id  (campaign_id)
#  index_campaign_devices_on_device_id    (device_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (device_id => devices.id)
#
class CampaignDevice < ApplicationRecord
  belongs_to :campaign
  belongs_to :device
end
