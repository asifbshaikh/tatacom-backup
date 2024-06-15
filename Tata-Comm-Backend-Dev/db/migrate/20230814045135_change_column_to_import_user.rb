class ChangeColumnToImportUser < ActiveRecord::Migration[6.1]
  def change
    change_column_null :import_users, :file_url, null: true
  end
end
