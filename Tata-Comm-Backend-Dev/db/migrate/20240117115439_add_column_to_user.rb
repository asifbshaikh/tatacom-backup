class AddColumnToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :password_changed_at, :datetime
    add_index :users, :password_changed_at
  end
end
