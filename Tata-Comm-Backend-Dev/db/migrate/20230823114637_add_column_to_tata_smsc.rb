class AddColumnToTataSmsc < ActiveRecord::Migration[6.1]
  def change
    add_column :tata_smscs, :sender_id, :string
    add_column :tata_smscs, :sender_type, :integer
    add_column :tata_smscs, :callback_url, :string
  end
end
