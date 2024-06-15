class AddNewColumnToCampaigns < ActiveRecord::Migration[6.1]
  def change
    change_table :campaigns, bulk: true do |t|
      t.boolean :exclude_users
      t.string :select_audience
      t.boolean :send_campaign_to_the_opted_out_users
      t.string :status, default: 0
    end
  end
end
