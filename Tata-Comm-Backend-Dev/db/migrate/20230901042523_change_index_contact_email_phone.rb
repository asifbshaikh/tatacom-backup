class ChangeIndexContactEmailPhone < ActiveRecord::Migration[6.1]
  def change
    remove_index :contacts, name: 'uniq_email_per_account_contact'
  end
end
