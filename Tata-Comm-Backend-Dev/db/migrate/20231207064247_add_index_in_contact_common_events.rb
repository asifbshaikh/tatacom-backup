class AddIndexInContactCommonEvents < ActiveRecord::Migration[6.1]
  def change
    # Contact Common Events
    add_index :contact_common_events, :common_event_id
    add_index :contact_common_events, :campaign_id
    add_index :contact_common_events, :campaign_channel
    add_index :contact_common_events, :contact_id
    add_index :contact_common_events, :campaign_type
    add_index :contact_common_events, :campaign_name
    add_index :contact_common_events, :created_at

    # Common Events
    add_index :common_events, :name
    add_index :common_events, :account_id
    add_index :common_events, :data_type

    #Contacts
    add_index :contacts, :first_name
    add_index :contacts, :gender
    add_index :contacts, :locale_country
    add_index :contacts, :birth_date
    add_index :contacts, :last_seen
    add_index :contacts, :ltv
    add_index :contacts, :first_seen
    add_index :contacts, :last_name
    add_index :contacts, :google_advertising_id
    add_index :contacts, :browser_details
  end
end