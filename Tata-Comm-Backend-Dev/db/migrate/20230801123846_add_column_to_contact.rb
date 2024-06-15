class AddColumnToContact < ActiveRecord::Migration[6.1]
  def change
    change_table :contacts, bulk: false do |t|
      t.string :first_name
      t.string :gender
      t.string :local_country
      t.string :creation_source
      t.integer :source_id
      t.datetime :birth_date
      t.string :local_language
      t.string :location
      t.string :sms_subscription_status
      t.datetime :first_seen
      t.decimal :ltv
      t.datetime :last_seen
      t.integer :no_of_conversions
      t.integer :no_of_sessions
      t.string :campaign_name
      t.string :publisher_name
      t.string :install_status
      t.datetime :uninstall_time
      t.datetime :device_reinstall
      t.datetime :user_reinstall
      t.string :push_opt_in_status
      t.string :web_push_subscription_page_url
      t.string :web_push_subscription_status
      t.string :last_known_city
      t.string :last_known_country
      t.string :last_known_pincode
      t.string :last_known_state
      t.datetime :user_timezone_offset
      t.boolean :hard_bounce
      t.boolean :spam
      t.boolean :unsubscribe
      t.string :advertising_identifier
      t.string :browser_details
      t.integer :google_advertising_id
      t.boolean :mobile_user
    end
    add_reference :contacts, :import_user, foreign_key: true
  end
end
