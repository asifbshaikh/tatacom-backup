class AddNewFieldsToContacts < ActiveRecord::Migration[6.1]
  def up
    add_column :contacts, :middle_name, :string
    add_column :contacts, :city, :string
    add_column :contacts, :address, :string
    add_column :contacts, :country, :string
  end

  def down
    remove_column :contacts, :middle_name
    remove_column :contacts, :city
    remove_column :contacts, :address
    remove_column :contacts, :country
  end
end
