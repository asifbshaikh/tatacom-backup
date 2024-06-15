class CreateContactCommonEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :contact_common_events do |t|
      t.integer :contact_id
      t.integer :common_event_id
      t.string :app_version
      t.string :sdk_version
      t.string :platform
      t.string :utm_source
      t.string :utm_medium
      t.string :utm_campaign
      t.string :utm_id
      t.string :utm_content
      t.string :utm_term
      t.string :device_density_dpi
      t.string :device_height
      t.string :device_manufacturer
      t.string :device_model
      t.string :device_screen_dimension
      t.string :network_type
      t.string :os_version
      t.string :timestamp
      t.string :first_session
      t.string :logged_in_status
      t.integer :max_days_limit

      t.timestamps
    end
  end
end
