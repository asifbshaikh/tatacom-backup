class CreateAccountSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :account_settings do |t|
      t.integer :account_id
      t.string :app_id
      t.timestamps
    end

    if ActiveRecord::Base.connection.column_exists?(:account_users, :app_id)
      remove_column :account_users, :app_id
    end
  end
end
