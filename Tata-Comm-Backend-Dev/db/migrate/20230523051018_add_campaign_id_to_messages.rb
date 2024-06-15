class AddCampaignIdToMessages < ActiveRecord::Migration[6.1]
  def change
    add_column :messages, :campaign_id, :integer, default: nil, null: true
  end
end
