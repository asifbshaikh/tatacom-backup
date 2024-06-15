class ChangesIndexCustomerIdContact < ActiveRecord::Migration[6.1]
  def change
    remove_index :contacts, :customer_id
    add_index :contacts, :customer_id 
  end
end
