class AddColumnsToImportUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :import_users, :failed_count, :integer, default: 0
    add_column :import_users, :skipped_count, :integer, default: 0
  end
end