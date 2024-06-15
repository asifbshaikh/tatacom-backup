class AddRequiredIndexToContacts < ActiveRecord::Migration[6.1]
  def change
    remove_index :contacts, name: 'index_contacts_on_id_and_name_and_email_and_source_id',
                                                                                 if_exists: true
    add_index :contacts, :id
    add_index :contacts, :name
    add_index :contacts, :email
    add_index :contacts, :source_id
  end
end
