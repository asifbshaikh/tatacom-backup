class AddTataChannel < ActiveRecord::Migration[6.1]
  def change
    create_table :channel_tata_sms do |t|
      t.string :ss_key, null: false
      t.string :phone_number, null: false
      t.string :app_id, null: false
      t.integer :account_id, null: false
      t.timestamps
    end
  end
end
