class RemoveIgnoreColumnImportUser < ActiveRecord::Migration[6.1]
  def change
    remove_column :import_users, :ignored_columns
  end
end
