class AddColumnToCampaignDeliveries < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_deliveries, :webhook_response_params, :text, array: true, default: []
  end
end
