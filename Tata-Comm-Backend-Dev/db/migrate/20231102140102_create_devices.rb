class CreateDevices < ActiveRecord::Migration[6.1]
  def change
    create_table :devices do |t|
      t.string :event_name
      t.string :advertising_identifier
      t.string :vendor_identifier
      t.string :os_version
      t.string :device_timezone
      t.string :name
      t.string :device_model
      t.string :platform
      t.jsonb :user_attributes, default: []
      t.references :contact, null: false, foreign_key: true, index: true
      t.references :account, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
