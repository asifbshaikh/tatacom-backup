class AddNewColumnToContact < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts, :last_name, :string, after: :first_name, default: false
  end
end
