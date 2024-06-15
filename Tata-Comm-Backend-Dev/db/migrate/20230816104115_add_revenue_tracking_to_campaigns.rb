class AddRevenueTrackingToCampaigns < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :total_order_value, :decimal
    add_column :campaigns, :number_of_conversion_events, :integer
    add_column :campaigns, :number_of_unique_conversions, :integer
  end
end
