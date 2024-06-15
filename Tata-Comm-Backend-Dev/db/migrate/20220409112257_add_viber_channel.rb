class AddViberChannel < ActiveRecord::Migration[6.1]
  def change
    create_table :channel_viber_sms do |t|
      t.string :service_id, null: false
      t.integer :account_id, null: false
      t.timestamps
    end
  end
end
