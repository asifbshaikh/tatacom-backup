class AddColumnsToCampaignDeliveries < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_deliveries, :opened_at, :datetime
    add_column :campaign_deliveries, :expired_at, :datetime
    add_column :campaign_deliveries, :bounced_at, :datetime
    add_column :campaign_deliveries, :clicked_at, :datetime
    rename_column :campaign_deliveries, :submitDate, :sent_at
    rename_column :campaign_deliveries, :doneDate, :delivered_at
    rename_column :campaign_deliveries, :messageid, :message_id
    rename_column :campaign_deliveries, :err, :error_code
    remove_column :campaign_deliveries, :status, :string
    add_column :campaign_deliveries, :status, :integer
  end
end
