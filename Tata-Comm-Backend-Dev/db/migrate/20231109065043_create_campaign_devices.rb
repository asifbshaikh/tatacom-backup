class CreateCampaignDevices < ActiveRecord::Migration[6.1]
  def change
    create_table :campaign_devices do |t|
      t.references :campaign, foreign_key: true
      t.references :device, foreign_key: true
      t.timestamps
    end
  end
end
