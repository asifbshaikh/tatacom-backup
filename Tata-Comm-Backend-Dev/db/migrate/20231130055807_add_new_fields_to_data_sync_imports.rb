class AddNewFieldsToDataSyncImports < ActiveRecord::Migration[6.1]
  def change
    add_column :data_sync_imports, :total_rows, :integer
    add_column :data_sync_imports, :custom_segment, :string
    add_column :data_sync_imports, :custom_segment_id, :integer
    add_column :data_sync_imports, :processed_rows, :integer
    add_column :contacts, :data_sync_import_id, :integer
  end
end
