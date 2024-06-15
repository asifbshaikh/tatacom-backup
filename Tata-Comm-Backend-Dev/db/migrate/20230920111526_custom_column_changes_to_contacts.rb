class CustomColumnChangesToContacts < ActiveRecord::Migration[6.1]
  def up
    change_column_default :contacts, :last_name, nil
    add_index :contacts, :customer_id, unique: true
  end

  def down
    change_column_default :contacts, :last_name, false
    remove_index :contacts, :customer_id
  end
end
