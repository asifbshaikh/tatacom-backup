class CreateContactDeviceDetails < ActiveRecord::Migration[6.1]
  def change
    create_table :contact_device_details do |t|
      t.belongs_to :contact
      t.belongs_to :device
      t.string :unique_user_id
      t.string :push_opt_in_status_ios
      t.string :user_push_preference
      t.string :tcl_engage_push_opted_out
      t.jsonb :properties  
      t.jsonb :location
      t.timestamps
    end
  end
end