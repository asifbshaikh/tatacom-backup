# == Schema Information
#
# Table name: campaign_syncs
#
#  id          :bigint           not null, primary key
#  last_run_at :datetime
#  status      :integer          default("pending")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  account_id  :bigint           not null
#  campaign_id :bigint           not null
#
# Indexes
#
#  index_campaign_syncs_on_account_id   (account_id)
#  index_campaign_syncs_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (campaign_id => campaigns.id)
#
class CampaignSync < ApplicationRecord
    belongs_to :campaign
    belongs_to :account

    enum status: { pending: 0, processing: 1, done: 2}
end
