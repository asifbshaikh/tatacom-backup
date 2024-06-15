class CreateCampaignTags < ActiveRecord::Migration[6.1]
  def change
    create_table :campaign_tags do |t|
      t.string :name, null: false
      t.text :description
      t.jsonb :custom_attributes, default: '{}'
      t.references :campaign, null: false, foreign_key: true
      t.references :group_tag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
