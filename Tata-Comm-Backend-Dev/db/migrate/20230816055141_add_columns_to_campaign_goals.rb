class AddColumnsToCampaignGoals < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_goals, :attribute_name, :string
    add_column :campaign_goals, :attribute_value, :string
  end
end
