class AddIgnoredColumnToImportUser < ActiveRecord::Migration[6.1]
  def change
    add_column :import_users, :ignored_columns, :jsonb, after: :skipped_col, default: []
  end
end