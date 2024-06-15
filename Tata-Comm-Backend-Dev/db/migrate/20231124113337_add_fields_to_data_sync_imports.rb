class AddFieldsToDataSyncImports < ActiveRecord::Migration[6.1]
  def change
    remove_column :data_sync_imports, :status, :string
    add_column :data_sync_imports, :status, :integer
    add_column :data_sync_imports, :file_key, :string
    add_column :data_sync_imports, :failed_error, :string
    add_column :data_sync_imports, :segment_name, :string
  end
end
