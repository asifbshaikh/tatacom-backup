class CreateSmsCampaigns < ActiveRecord::Migration[6.1]
  def change
    create_table :sms_campaigns do |t|
      t.references :account, null: false, foreign_key: true
      t.belongs_to :campaign_tag, null: true, foreign_key: true
      t.integer :template_id,  null: true
      t.integer :template_record_id, null: true
      t.timestamps
    end
  end
end