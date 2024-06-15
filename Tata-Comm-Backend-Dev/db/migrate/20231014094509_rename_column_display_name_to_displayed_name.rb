class RenameColumnDisplayNameToDisplayedName < ActiveRecord::Migration[6.1]
  def change
    rename_column :custom_attributes, :display_name, :displayed_name
    rename_column :custom_attribute_configurations, :display_name, :displayed_name
  end
end
