class AddColumnsToCampaignScheduler < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_schedulers, :time_value, :integer
    add_column :campaign_schedulers, :time_multiplier, :integer
  end
end
