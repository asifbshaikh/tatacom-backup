class ChangeColumnsIntoDefaultInContacts < ActiveRecord::Migration[6.1]
  def change
    change_column_default :contacts, :hard_bounce, false
    change_column_default :contacts, :spam, false
    change_column_default :contacts, :unsubscribe, false
  end
end
