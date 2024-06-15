class AddNewColumnToImportUser < ActiveRecord::Migration[6.1]
  def change
    add_column :import_users, :file_name, :text, after: :file_url
  end
end
