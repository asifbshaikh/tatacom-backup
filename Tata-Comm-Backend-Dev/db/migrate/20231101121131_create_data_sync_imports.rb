class CreateDataSyncImports < ActiveRecord::Migration[6.1]
  def change
    create_table :data_sync_imports do |t|
      t.references :account
      t.references :crm_cdp_schedule_detail
      t.string :folder_path
      t.string :name
      t.integer :processed_count
      t.string :status
      t.integer :synced_count
      t.string :uuid

      t.timestamps
    end
  end
end
