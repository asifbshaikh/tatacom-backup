class AddTypeColumnToDataSyncImports < ActiveRecord::Migration[6.1]
  def change
    add_column :data_sync_imports, :import_type, :string
  end
end
