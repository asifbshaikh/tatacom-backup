class AddAccountIdToContactCommonEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :contact_common_events, :account_id, :integer
    add_column :contact_common_events, :unique_user_id, :string
    add_column :contact_device_details, :logged_in_status, :boolean
    add_column :devices, :unique_user_id, :string
    change_column_null :devices, :contact_id, true
    add_column :contact_device_details, :account_id, :integer
  end
end
