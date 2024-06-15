class CreateImportFileSegments < ActiveRecord::Migration[6.1]
  def change
    create_table :import_file_segments do |t|
      t.references :segment, null: false, foreign_key: true
      t.references :account_user, null: false, foreign_key: true
      t.integer :status, :default => 0
      t.integer :total_users, :default => 0
      t.integer :added_users, :default => 0
      t.integer :removed_users, :default => 0
      t.integer :invalid_users, :default => 0
      t.string :failed_file_url
      t.string :s3_object_id
      t.string :event_type

      t.timestamps
    end
  end
end
