class CreateCampaignGoals < ActiveRecord::Migration[6.1]
  def change
    create_table :campaign_goals do |t|
      t.belongs_to :campaign, null: false, index: false
      t.belongs_to :account, null: false, index: false
      t.string :name
      t.integer :attribution_window
      t.integer :attribution_window_type # hours, days
      t.boolean :capping_enabled
      t.integer :frequency_capping_count
      t.timestamps null: false
    end
  end
end
  