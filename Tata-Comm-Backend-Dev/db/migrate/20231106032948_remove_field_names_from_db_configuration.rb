class RemoveFieldNamesFromDbConfiguration < ActiveRecord::Migration[6.1]
  def change
    remove_column :db_configurations, :table_name, :string
    remove_column :db_configurations, :timestamp_column, :string
    add_column :db_configurations, :name, :string
  end
end
