class RenameDraftStatusToCampaignStateFromCampaigns < ActiveRecord::Migration[6.1]
  def change
    rename_column :campaigns, :draft_status, :campaign_state
  end
end
