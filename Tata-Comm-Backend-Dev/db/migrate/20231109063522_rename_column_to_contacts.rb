class RenameColumnToContacts < ActiveRecord::Migration[6.1]
  def change
    rename_column :contacts, :local_language, :locale_language
    rename_column :contacts, :local_country, :locale_country
  end
end
