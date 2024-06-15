class CreateCampaignGlobalControlGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :campaign_global_control_groups do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :global_control_group, null: false, foreign_key: true
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
