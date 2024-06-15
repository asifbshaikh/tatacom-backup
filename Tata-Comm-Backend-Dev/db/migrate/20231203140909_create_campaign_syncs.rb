class CreateCampaignSyncs < ActiveRecord::Migration[6.1]
  def change
    create_table :campaign_syncs do |t|
      t.integer :status, default: 0
      t.timestamp :last_run_at
      t.references :account, null: false, foreign_key: true
			t.references :campaign, null: false, foreign_key: true
      t.timestamps
    end
  end
end
