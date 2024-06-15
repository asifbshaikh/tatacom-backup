class AddNewColumnsInDevice < ActiveRecord::Migration[6.1]
  def change
    add_column :devices, :model_name, :string
    add_column :devices, :model, :string
    add_column :devices, :device_token, :string
    add_column :devices, :model_version, :string
    add_column :devices, :api_level, :integer
    add_column :devices, :product_name, :string
    add_column :devices, :manufacturer, :string
    add_column :devices, :android_id, :string
    add_column :devices, :gaid, :string
    add_column :devices, :gaid_tracking_status, :string
    add_column :devices, :carrier, :string
    add_column :devices, :device_density, :string
    add_column :devices, :device_width, :string
    add_column :devices, :device_height, :string
    add_column :devices, :network_type, :string
    rename_column :devices, :model_name, :device_model_name
    rename_column :devices, :vendor_identifier, :vender_identifier
    remove_column_if_exists :devices, :event_name, :string
    remove_column_if_exists :devices, :user_attributes, :jsonb
  end

  def remove_column_if_exists(table_name, column_name, type)
    if column_exists?(table_name, column_name)
      remove_column(table_name, column_name, type)
    end
  end
end
