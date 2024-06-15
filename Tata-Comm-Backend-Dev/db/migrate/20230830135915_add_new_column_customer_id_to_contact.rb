class AddNewColumnCustomerIdToContact < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts, :customer_id, :string, after: :id, null: true
  end
end
