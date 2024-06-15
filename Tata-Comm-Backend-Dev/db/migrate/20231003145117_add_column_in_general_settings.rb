class AddColumnInGeneralSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :email_general_settings, :account_id, :integer
  end
end
