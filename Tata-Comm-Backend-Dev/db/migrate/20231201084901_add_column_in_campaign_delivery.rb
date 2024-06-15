class AddColumnInCampaignDelivery < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_deliveries, :tiny_url, :text, default: ""
    add_column :campaign_deliveries, :clicked, :boolean, default: false
  end
end
