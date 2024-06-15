class AddPropertyNameToCommonEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :common_events, :property_name, :string
    add_column :common_events, :data_type, :string
    add_column :common_events, :account_id, :integer
  end
end
