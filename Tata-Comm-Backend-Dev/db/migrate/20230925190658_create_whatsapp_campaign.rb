class CreateWhatsappCampaign < ActiveRecord::Migration[6.1]
  def change
    create_table :whatsapp_campaigns do |t|
      t.references :account, null: false, foreign_key: true
      t.belongs_to :campaign_tag, null: true, foreign_key: true
      
      t.timestamps
    end
  end
end